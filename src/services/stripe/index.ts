import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

// API base URL
const API_BASE_URL = import.meta.env.VITE_DEV_MODE ? 'http://localhost:3000' : import.meta.env.VITE_APP_URL;

export class StripeService {
  // Create a checkout session for subscription
  static async createCheckoutSession(priceId: string): Promise<string> {
    try {
      console.log('Creating checkout session with priceId:', priceId);
      
      const response = await fetch(`${API_BASE_URL}/api/stripe/create-checkout-session`, {
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
      const response = await fetch(`${API_BASE_URL}/api/stripe/subscription-status`);

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
      const response = await fetch(`${API_BASE_URL}/api/stripe/create-portal-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error redirecting to customer portal:', error);
      throw error;
    }
  }

  // Submit cancellation feedback
  static async submitCancellationFeedback(reason: string, feedback: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stripe/cancellation-feedback`, {
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