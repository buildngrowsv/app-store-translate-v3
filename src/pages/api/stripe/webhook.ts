import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia'
});

const webhookSecret = import.meta.env.VITE_STRIPE_WEBHOOK_SECRET;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret || ''
    );

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        // Update user's subscription status
        await handleSubscriptionCreated(session);
        break;

      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription;
        // Handle subscription updates
        await handleSubscriptionUpdated(subscription);
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        // Handle subscription cancellation
        await handleSubscriptionDeleted(deletedSubscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(400).json({ message: 'Webhook error' });
  }
}

async function handleSubscriptionCreated(session: Stripe.Checkout.Session) {
  // Get user from session metadata
  const userId = session.metadata?.userId;
  if (!userId) return;

  // Update user's subscription status in your database
  // This is where you'll integrate with your user management system
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // Handle subscription updates (e.g., plan changes, payment issues)
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  // Update subscription status in your database
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // Handle subscription cancellation
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  // Update subscription status in your database
} 