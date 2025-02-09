import { loadStripe } from '@stripe/stripe-js';
import { auth, db, functions } from '../../services/firebase';
import { getDoc, doc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { StripeCache } from '../cache/stripeCache';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

// Get cache instance
const stripeCache = StripeCache.getInstance();

// Firebase Functions base URL
const FUNCTIONS_BASE_URL = 'https://us-central1-reachmix.cloudfunctions.net';

// Stripe API endpoints
const STRIPE_ENDPOINTS = {
  createCheckoutSession: `${FUNCTIONS_BASE_URL}/createCheckoutSession`,
  createPortalSession: `${FUNCTIONS_BASE_URL}/createPortalSession`,
  subscriptionStatus: `${FUNCTIONS_BASE_URL}/subscriptionStatus`,
  cancellationFeedback: `${FUNCTIONS_BASE_URL}/cancellationFeedback`
};

interface CheckoutSession {
  sessionId: string;
  url: string;
}

interface PortalSession {
  url: string;
}

export class StripeService {
  // Create a checkout session for subscription
  static async createCheckoutSession(priceId: string): Promise<CheckoutSession> {
    try {
      // Check cache first
      const cachedUrl = stripeCache.getCheckoutSession(priceId);
      if (cachedUrl) {
        console.log('Using cached checkout session for price:', priceId);
        return { sessionId: '', url: cachedUrl };
      }

      console.log('Creating checkout session with priceId:', priceId);
      
      const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession');
      const result = await createCheckoutSession({ priceId });
      
      if (!result.data || !(result.data as any).sessionId) {
        console.error('Invalid response from createCheckoutSession:', result);
        throw new Error('Failed to create checkout session. Please try again later');
      }

      const { sessionId, url } = result.data as CheckoutSession;
      console.log('Got session ID:', sessionId);

      // Cache the URL
      if (url) {
        stripeCache.cacheCheckoutSession(priceId, url);
      }

      return { sessionId, url };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  // Redirect to Stripe Checkout
  static async redirectToCheckout(priceId: string): Promise<void> {
    try {
      // Check cache first
      const cachedUrl = stripeCache.getCheckoutSession(priceId);
      if (cachedUrl) {
        window.location.href = cachedUrl;
        return;
      }

      // If no cached URL, create a new session
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe not initialized');

      console.log('Creating checkout session for price:', priceId);
      
      const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession');
      const result = await createCheckoutSession({ priceId });
      
      if (!result.data || !(result.data as any).sessionId) {
        console.error('Invalid response from createCheckoutSession:', result);
        throw new Error('Failed to create checkout session. Please try again later');
      }

      const { sessionId, url } = result.data as CheckoutSession;
      console.log('Got session ID:', sessionId);

      // Cache the URL for future use
      if (url) {
        stripeCache.cacheCheckoutSession(priceId, url);
        window.location.href = url;
      } else {
        // Fall back to Stripe's redirect if no URL provided
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error('Stripe redirect error:', error);
          throw error;
        }
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
  static async createPortalSession(): Promise<PortalSession> {
    try {
      // Check cache first
      const cachedUrl = stripeCache.getPortalSession();
      if (cachedUrl) {
        console.log('Using cached portal session');
        return { url: cachedUrl };
      }

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
      
      // Use Firebase Functions directly
      const createPortalSession = httpsCallable(functions, 'createPortalSession');
      const result = await createPortalSession({ customerId });
      
      if (!result.data || !(result.data as any).url) {
        console.error('Invalid response from createPortalSession:', result);
        throw new Error('Failed to create portal session. Please try again later');
      }
      
      const { url } = result.data as PortalSession;
      console.log('Got portal URL');

      // Cache the URL
      stripeCache.cachePortalSession(url);

      return { url };
    } catch (error) {
      console.error('Error in createPortalSession:', error);
      throw error;
    }
  }

  // Submit cancellation feedback
  static async submitCancellationFeedback(reason: string, feedback: string): Promise<void> {
    try {
      const submitFeedback = httpsCallable(functions, 'handleCancellationFeedback');
      await submitFeedback({ reason, feedback });
    } catch (error) {
      console.error('Error submitting cancellation feedback:', error);
      throw error;
    }
  }

  // Prefetch all necessary Stripe sessions
  static async prefetchSessions(priceIds: string[]): Promise<void> {
    try {
      // Clear expired sessions first
      stripeCache.clearExpiredSessions();

      // Create portal session if not cached
      const cachedPortalUrl = stripeCache.getPortalSession();
      if (!cachedPortalUrl) {
        await this.createPortalSession().catch(error => {
          console.error('Error prefetching portal session:', error);
        });
      }

      // Create checkout sessions for each price ID if not cached
      await Promise.all(priceIds.map(async priceId => {
        const cachedUrl = stripeCache.getCheckoutSession(priceId);
        if (!cachedUrl) {
          try {
            await this.createCheckoutSession(priceId);
          } catch (error) {
            console.error(`Error prefetching checkout session for ${priceId}:`, error);
          }
        }
      }));
    } catch (error) {
      console.error('Error prefetching Stripe sessions:', error);
    }
  }

  // Clear cache on logout
  static clearCache(): void {
    stripeCache.clearCache();
  }
} 