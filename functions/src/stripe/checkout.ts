/*
* File: checkout.ts
* Description: Stripe checkout session creation
* Details: Creates checkout sessions for subscription purchases
* - Includes user ID for webhook processing
* - Sets up subscription metadata
* - Handles success/cancel URLs
* Date: 2024-03-20
*/

import * as functions from 'firebase-functions/v1';
import Stripe from 'stripe';
import * as admin from 'firebase-admin';

const stripe = new Stripe(functions.config().stripe.secret_key, {
  apiVersion: '2023-08-16'
});

const DOMAIN = functions.config().app.domain;

export const createCheckoutSession = functions.https.onCall(async (data, context) => {
  // Authentication check
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be logged in to create a checkout session'
    );
  }

  const { priceId } = data;
  if (!priceId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Price ID is required'
    );
  }

  try {
    // Get or create customer
    const userId = context.auth.uid;
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    let stripeCustomerId = userDoc.data()?.stripeCustomerId;

    if (!stripeCustomerId) {
      // Create new customer
      const customer = await stripe.customers.create({
        email: context.auth.token.email,
        metadata: {
          userId: userId, // Important for webhook processing
        },
      });
      stripeCustomerId = customer.id;
      
      // Store customer ID
      await admin.firestore().collection('users').doc(userId).update({
        stripeCustomerId: customer.id
      });
    }

    // Create checkout session with customer ID
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${DOMAIN}/settings?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${DOMAIN}/settings`,
      metadata: {
        userId: context.auth.uid,
      },
      subscription_data: {
        metadata: {
          userId: context.auth.uid,
        },
      },
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to create checkout session'
    );
  }
}); 