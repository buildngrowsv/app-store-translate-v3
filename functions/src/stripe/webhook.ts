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
import cors from 'cors';
import { syncStripeDataToFirestore } from './sync';

const stripe = new Stripe(functions.config().stripe.secret_key, {
  apiVersion: '2023-08-16'
});

// Initialize CORS middleware
const corsHandler = cors({
  origin: true, // Allow all origins for webhook
  methods: ['POST'], // Only allow POST method
  allowedHeaders: ['stripe-signature', 'content-type'], // Required headers
});

// Events we want to track for subscription updates
const SUBSCRIPTION_EVENTS = [
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'customer.subscription.paused',
  'customer.subscription.resumed',
  'customer.subscription.pending_update_applied',
  'customer.subscription.pending_update_expired',
  'customer.subscription.trial_will_end',
  'invoice.paid',
  'invoice.payment_failed',
  'invoice.payment_action_required',
  'invoice.upcoming',
  'invoice.marked_uncollectible',
  'invoice.payment_succeeded',
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  'payment_intent.canceled',
] as const;

// Event handler type
type EventHandler<T> = (data: T) => Promise<void>;

// Event handlers map
const eventHandlers: Record<string, EventHandler<any>> = {
  'checkout.session.completed': handleCheckoutSessionCompleted,
  'customer.subscription.updated': handleSubscriptionChange,
  'customer.subscription.deleted': handleSubscriptionDeletion
};

export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  console.log('Webhook request received', {
    method: req.method,
    headers: req.headers,
    path: req.path,
    body: typeof req.body === 'string' ? 'string' : 'parsed'
  });

  // Handle CORS
  await new Promise((resolve) => corsHandler(req, res, resolve));
  console.log('CORS check passed');
  
  const sig = req.headers['stripe-signature'];
  const endpointSecret = functions.config().stripe.webhook_secret;

  console.log('Validating webhook signature', {
    hasSignature: !!sig,
    hasSecret: !!endpointSecret,
    signatureHeader: sig
  });

  if (!sig || !endpointSecret) {
    console.error('Missing stripe signature or endpoint secret', {
      hasSignature: !!sig,
      hasSecret: !!endpointSecret
    });
    res.status(400).send('Webhook Error: Missing required headers');
    return;
  }

  let event: Stripe.Event | undefined;

  try {
    console.log('Constructing event from webhook payload');
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      endpointSecret
    );
    
    console.log('Successfully constructed event', {
      eventType: event.type,
      eventId: event.id,
      timestamp: new Date().toISOString(),
      apiVersion: event.api_version,
      data: event.data.object
    });

    // Only process events we care about
    if (!SUBSCRIPTION_EVENTS.includes(event.type as any)) {
      console.log(`Ignoring untracked event type: ${event.type}`);
      res.json({ received: true, status: 'ignored' });
      return;
    }

    // Get customerId from event
    const { customer: customerId } = event.data.object as {
      customer?: string;
    };

    if (typeof customerId !== 'string') {
      console.error(`No customer ID found in event: ${event.type}`, {
        eventType: event.type,
        eventId: event.id,
        object: event.data.object
      });
      throw new Error(`No customer ID found in event: ${event.type}`);
    }

    // Handle the event using appropriate handler
    const handler = eventHandlers[event.type];
    if (handler) {
      await handler(event.data.object);
    }

    console.log('Syncing Stripe data to Firestore', {
      customerId,
      eventType: event.type,
      eventId: event.id
    });

    // Sync Stripe data to Firestore
    await syncStripeDataToFirestore(customerId);

    console.log('Successfully processed webhook event', {
      eventType: event.type,
      eventId: event.id,
      customerId
    });

    res.json({ 
      received: true,
      status: 'processed',
      type: event.type,
      id: event.id
    });
  } catch (error) {
    console.error('Webhook error:', error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      eventType: event?.type,
      eventId: event?.id,
      name: error.name
    } : error);
    
    res.status(400).json({
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        type: 'webhook_error'
      }
    });
  }
});

// Event handlers
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