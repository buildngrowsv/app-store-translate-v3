import { loadStripe } from '@stripe/stripe-js';
import { auth, db, functions } from '../../services/firebase';
import { getDoc, doc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

// Firebase Functions base URL
const FUNCTIONS_BASE_URL = 'https://us-central1-reachmix.cloudfunctions.net';

// Stripe API endpoints
const STRIPE_ENDPOINTS = {
  createCheckoutSession: `${FUNCTIONS_BASE_URL}/createCheckoutSession`,
  createPortalSession: `${FUNCTIONS_BASE_URL}/createPortalSession`,
  subscriptionStatus: `${FUNCTIONS_BASE_URL}/subscriptionStatus`,
  cancellationFeedback: `${FUNCTIONS_BASE_URL}/cancellationFeedback`
};

export class StripeService {
  // Create a checkout session for subscription
  static async createCheckoutSession(priceId: string): Promise<string> {
    try {
      console.log('Creating checkout session with priceId:', priceId);
      
      const response = await fetch(`${FUNCTIONS_BASE_URL}${STRIPE_ENDPOINTS.createCheckoutSession}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Checkout session created:', data);
      return data.sessionId;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  // Redirect to Stripe Checkout
  static async redirectToCheckout(priceId: string): Promise<void> {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe not initialized');

      console.log('Redirecting to checkout with priceId:', priceId);
      const sessionId = await this.createCheckoutSession(priceId);
      console.log('Got session ID:', sessionId);

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Stripe redirect error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      throw error;
    }
  }

  // Get subscription status
  static async getSubscriptionStatus(): Promise<string> {
    try {
      const response = await fetch(`${FUNCTIONS_BASE_URL}${STRIPE_ENDPOINTS.subscriptionStatus}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const { status } = await response.json();
      return status;
    } catch (error) {
      console.error('Error getting subscription status:', error);
      throw error;
    }
  }

  // Handle subscription webhook
  static async handleSubscriptionWebhook(event: any): Promise<void> {
    // Implementation will be added in the webhook handler
  }

  // Create and redirect to customer portal
  static async redirectToCustomerPortal(): Promise<void> {
    try {
      // Get current user's customer ID from Firebase
      const user = auth.currentUser;
      if (!user) {
        console.error('No authenticated user found');
        throw new Error('Please sign in to manage your subscription');
      }
      
      console.log('Getting user document for:', user.uid);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        console.error('User document not found for:', user.uid);
        throw new Error('User profile not found. Please try signing out and back in');
      }
      
      const userData = userDoc.data();
      console.log('User data retrieved:', { email: userData?.email, hasStripeId: !!userData?.stripeCustomerId });
      
      let customerId = userData?.stripeCustomerId;
      
      // If no customer ID exists, create one
      if (!customerId) {
        console.log('No Stripe customer ID found, creating one...');
        try {
          const createStripeCustomer = httpsCallable(functions, 'createStripeCustomer');
          const result = await createStripeCustomer();
          
          if (!result.data || !(result.data as any).customerId) {
            console.error('Invalid response from createStripeCustomer:', result);
            throw new Error('Failed to create customer profile. Please contact support');
          }
          
          customerId = (result.data as any).customerId;
          console.log('Successfully created Stripe customer:', customerId);
        } catch (error) {
          console.error('Error creating Stripe customer:', error);
          if (error instanceof Error) {
            throw new Error(`Failed to create customer profile: ${error.message}`);
          }
          throw new Error('Failed to create customer profile. Please try again later');
        }
      }

      console.log('Creating portal session for customer:', customerId);
      
      // Use Firebase Functions directly instead of REST API
      const createPortalSession = httpsCallable(functions, 'createPortalSession');
      const result = await createPortalSession({ customerId });
      
      if (!result.data || !(result.data as any).url) {
        console.error('Invalid response from createPortalSession:', result);
        throw new Error('Failed to create portal session. Please try again later');
      }
      
      const { url } = result.data as { url: string };
      console.log('Redirecting to portal URL');
      window.location.href = url;
    } catch (error) {
      console.error('Error in redirectToCustomerPortal:', error);
      throw error;
    }
  }

  // Submit cancellation feedback
  static async submitCancellationFeedback(reason: string, feedback: string): Promise<void> {
    try {
      const response = await fetch(`${FUNCTIONS_BASE_URL}${STRIPE_ENDPOINTS.cancellationFeedback}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason, feedback })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error submitting cancellation feedback:', error);
      throw error;
    }
  }
} 