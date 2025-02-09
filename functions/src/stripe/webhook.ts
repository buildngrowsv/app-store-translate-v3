/*
* File: webhook.ts
* Description: Stripe webhook handler
* Details: Handles Stripe webhook events and updates user subscription status
* - Processes checkout.session.completed events
* - Updates user subscription status in Firestore
* - Handles subscription lifecycle events
* Date: 2024-03-20
*/

import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

const stripe = new Stripe(functions.config().stripe.secret_key, {
  apiVersion: '2023-10-16'
});

export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = functions.config().stripe.webhook_secret;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig as string,
      endpointSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeletion(subscription);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Webhook processing failed');
  }
});

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const { client_reference_id: userId, subscription: subscriptionId } = session;

  if (!userId || !subscriptionId) {
    console.error('Missing userId or subscriptionId in session:', session);
    return;
  }

  // Get subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
  const priceId = subscription.items.data[0].price.id;

  // Update user document
  const userRef = admin.firestore().collection('users').doc(userId);
  await userRef.update({
    'subscription.status': 'active',
    'subscription.plan': priceId,
    'subscription.stripeSubscriptionId': subscriptionId,
    'subscription.currentPeriodEnd': new Date(subscription.current_period_end * 1000),
    'subscription.cancelAtPeriodEnd': subscription.cancel_at_period_end,
    stripeCustomerId: session.customer
  });
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  // Find user with this subscription ID
  const usersRef = admin.firestore().collection('users');
  const snapshot = await usersRef
    .where('subscription.stripeSubscriptionId', '==', subscription.id)
    .get();

  if (snapshot.empty) {
    console.error('No user found with subscription:', subscription.id);
    return;
  }

  const userDoc = snapshot.docs[0];
  const priceId = subscription.items.data[0].price.id;

  await userDoc.ref.update({
    'subscription.status': subscription.status,
    'subscription.plan': priceId,
    'subscription.currentPeriodEnd': new Date(subscription.current_period_end * 1000),
    'subscription.cancelAtPeriodEnd': subscription.cancel_at_period_end
  });
}

async function handleSubscriptionDeletion(subscription: Stripe.Subscription) {
  // Find user with this subscription ID
  const usersRef = admin.firestore().collection('users');
  const snapshot = await usersRef
    .where('subscription.stripeSubscriptionId', '==', subscription.id)
    .get();

  if (snapshot.empty) {
    console.error('No user found with subscription:', subscription.id);
    return;
  }

  const userDoc = snapshot.docs[0];

  await userDoc.ref.update({
    'subscription.status': 'inactive',
    'subscription.plan': null,
    'subscription.stripeSubscriptionId': null,
    'subscription.currentPeriodEnd': null,
    'subscription.cancelAtPeriodEnd': false
  });
} 