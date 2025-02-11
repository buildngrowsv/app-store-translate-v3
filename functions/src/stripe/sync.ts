import * as admin from 'firebase-admin';
import Stripe from 'stripe';
import * as functions from 'firebase-functions/v1';

const stripe = new Stripe(functions.config().stripe.secret_key, {
  apiVersion: '2023-08-16'
});

export async function syncStripeDataToFirestore(customerId: string) {
  try {
    // Fetch latest subscription data from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    // Get user document by customerId
    const usersSnapshot = await admin.firestore()
      .collection('users')
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.error(`No user found for Stripe customer: ${customerId}`);
      return null;
    }

    const userDoc = usersSnapshot.docs[0];

    if (subscriptions.data.length === 0) {
      const subData = {
        subscription: {
          status: 'inactive',
          plan: null,
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false,
          stripeSubscriptionId: null,
          paymentMethod: null
        }
      };
      
      await userDoc.ref.update(subData);
      return subData;
    }

    // Get the latest subscription
    const subscription = subscriptions.data[0];

    // Store complete subscription state
    const subData = {
      subscription: {
        status: subscription.status,
        plan: subscription.items.data[0].price.id,
        currentPeriodEnd: admin.firestore.Timestamp.fromMillis(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        stripeSubscriptionId: subscription.id,
        paymentMethod: subscription.default_payment_method && 
          typeof subscription.default_payment_method !== 'string'
          ? {
              brand: subscription.default_payment_method.card?.brand ?? null,
              last4: subscription.default_payment_method.card?.last4 ?? null,
            }
          : null
      }
    };

    // Update user document
    await userDoc.ref.update(subData);
    return subData;
  } catch (error) {
    console.error('Error syncing Stripe data:', error);
    throw error;
  }
} 