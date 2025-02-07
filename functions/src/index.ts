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
  // Create a user document in Firestore when a new user signs up
  const userDoc = {
    email: user.email,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    subscription: {
      status: 'inactive',
      plan: null,
    },
  };

  await admin.firestore().collection('users').doc(user.uid).set(userDoc);
});

// Stripe Webhook Handler
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig || '',
      functions.config().stripe.webhook_secret
    );

    let subscription: Stripe.Subscription;

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
