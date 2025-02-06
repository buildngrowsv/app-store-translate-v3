import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia'
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { customerId } = req.body;
    
    if (!customerId) {
      return res.status(400).json({ message: 'Customer ID is required' });
    }

    // Create a billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${import.meta.env.VITE_APP_URL}/settings`,
      configuration: {
        features: {
          subscription_cancel: {
            enabled: true,
            mode: 'at_period_end',
            proration_behavior: 'none'
          },
          subscription_pause: {
            enabled: true
          }
        }
      }
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return res.status(500).json({ message: 'Error creating portal session' });
  }
} 