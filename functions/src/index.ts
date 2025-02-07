/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';
import { OpenAI } from 'openai';
import { UserRecord } from 'firebase-admin/auth';
import * as cors from 'cors';

interface TranslationRequest {
  text: string;
  targetLanguage: string;
}

interface CallableRequest<T> {
  data: T;
  auth?: {
    uid: string;
    token: admin.auth.DecodedIdToken;
  };
}

// Initialize CORS middleware
const corsHandler = cors({
  origin: true, // Allow all origins for now - you can restrict this to specific domains
  credentials: true,
});

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Stripe
const stripe = new Stripe(functions.config().stripe.secret_key, {
  apiVersion: '2023-10-16',
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: functions.config().openai.api_key,
});

// Authentication Functions
export const createUser = functions.auth.user().onCreate(async (user: UserRecord) => {
  try {
    // Create a Stripe customer
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        firebaseUID: user.uid
      }
    });

    // Create a user document in Firestore when a new user signs up
    const userDoc = {
      email: user.email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      stripeCustomerId: customer.id,
      subscription: {
        status: 'inactive',
        plan: null,
      },
    };

    await admin.firestore().collection('users').doc(user.uid).set(userDoc);
    
    console.log(`Created user ${user.uid} with Stripe customer ID ${customer.id}`);
  } catch (error) {
    console.error('Error in createUser function:', error);
    throw error;
  }
});

// Function to create Stripe customer for existing user
export const createStripeCustomer = functions.https.onCall(async (data, context) => {
  // CORS is automatically handled for callable functions
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  try {
    const userId = context.auth.uid;
    console.log('Creating Stripe customer for user:', userId);
    
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      console.error('User document not found:', userId);
      throw new functions.https.HttpsError('not-found', 'User document not found');
    }

    const userData = userDoc.data();
    
    // Check if user already has a Stripe customer ID
    if (userData?.stripeCustomerId) {
      console.log('User already has Stripe customer ID:', userData.stripeCustomerId);
      return { customerId: userData.stripeCustomerId };
    }

    // Create new Stripe customer
    const customer = await stripe.customers.create({
      email: context.auth.token.email || undefined,
      metadata: {
        firebaseUID: userId
      }
    });

    console.log('Created new Stripe customer:', customer.id);

    // Update user document with Stripe customer ID
    await admin.firestore().collection('users').doc(userId).update({
      stripeCustomerId: customer.id
    });

    console.log(`Created Stripe customer for existing user ${userId}: ${customer.id}`);
    return { customerId: customer.id };
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create Stripe customer');
  }
});

// Stripe Webhook Handler
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  // Wrap the request handler in CORS middleware
  return corsHandler(req, res, async () => {
    const sig = req.headers['stripe-signature'];
    
    try {
      const event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig || '',
        functions.config().stripe.webhook_secret
      );

      console.log('Processing webhook event:', event.type);

      let subscription: Stripe.Subscription;
      let session: Stripe.Checkout.Session;

      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          subscription = event.data.object as Stripe.Subscription;
          await handleSubscriptionChange(subscription);
          break;
        
        case 'customer.subscription.deleted':
          subscription = event.data.object as Stripe.Subscription;
          await handleSubscriptionDeletion(subscription);
          break;

        case 'checkout.session.completed':
          session = event.data.object as Stripe.Checkout.Session;
          await handleCheckoutSessionCompleted(session);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Stripe webhook error:', error);
      if (error instanceof Error) {
        res.status(400).send(`Webhook Error: ${error.message}`);
      } else {
        res.status(400).send('Webhook Error: Unknown error occurred');
      }
    }
  });
});

// OpenAI Translation Function
export const translateText = functions.https.onCall(async (request: CallableRequest<TranslationRequest>) => {
  // Verify authentication
  if (!request.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  try {
    const { text, targetLanguage } = request.data;
    
    if (!text || !targetLanguage) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with text and targetLanguage.'
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the following text to ${targetLanguage}. Maintain the tone and style of the original text.`
        },
        {
          role: "user",
          content: text
        }
      ]
    });

    return {
      translatedText: completion.choices[0].message.content,
      model: completion.model,
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new functions.https.HttpsError('internal', 'Translation failed');
  }
});

// Helper Functions
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const customerId = session.customer as string;
  const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
  const userId = customer.metadata?.firebaseUID;

  if (!userId) {
    console.error('No Firebase UID found in customer metadata');
    return;
  }

  // Update user's subscription status
  await admin.firestore().collection('users').doc(userId).update({
    'subscription.status': 'active',
    'subscription.plan': session.metadata?.priceId || null,
    'subscription.current_period_end': Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
  });
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
  const userId = customer.metadata?.firebaseUID;

  if (!userId) {
    console.error('No Firebase UID found in customer metadata');
    return;
  }

  await admin.firestore().collection('users').doc(userId).update({
    'subscription.status': subscription.status,
    'subscription.plan': subscription.items.data[0].price.id,
    'subscription.current_period_end': subscription.current_period_end,
  });
}

async function handleSubscriptionDeletion(subscription: Stripe.Subscription) {
  const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
  const userId = customer.metadata?.firebaseUID;

  if (!userId) {
    console.error('No Firebase UID found in customer metadata');
    return;
  }

  await admin.firestore().collection('users').doc(userId).update({
    'subscription.status': 'inactive',
    'subscription.plan': null,
    'subscription.current_period_end': null,
  });
}

// Create portal session
export const createPortalSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  try {
    const { customerId } = data;
    if (!customerId) {
      throw new functions.https.HttpsError('invalid-argument', 'Customer ID is required');
    }

    // Create a billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.VITE_APP_URL || 'https://app-store-translate.pages.dev'}/settings`
    });

    return { url: session.url };
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw new functions.https.HttpsError(
      'internal',
      error instanceof Error ? error.message : 'Failed to create portal session'
    );
  }
});
