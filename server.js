import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const stripe = Stripe(process.env.VITE_STRIPE_SECRET_KEY);

// CORS middleware configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Allow all localhost origins with ports 5173-5179
    if (/^http:\/\/localhost:(517[3-9])$/.test(origin)) {
      return callback(null, true);
    }
    
    // Allow the production URL
    if (origin === process.env.VITE_APP_URL) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'stripe-signature'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Parse JSON bodies
app.use(bodyParser.json());

// Create checkout session endpoint
app.post('/api/stripe/create-checkout-session', async (req, res) => {
  try {
    const { priceId } = req.body;
    console.log('Creating checkout session for priceId:', priceId);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.VITE_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_APP_URL}/pricing`,
    });

    console.log('Checkout session created:', session.id);
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook endpoint
app.post('/api/stripe/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.VITE_STRIPE_WEBHOOK_SECRET;

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        // Handle successful checkout
        console.log('Checkout completed:', session);
        break;
      case 'customer.subscription.updated':
        const subscription = event.data.object;
        // Handle subscription update
        console.log('Subscription updated:', subscription);
        break;
      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        // Handle subscription deletion
        console.log('Subscription deleted:', deletedSubscription);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Create portal session endpoint
app.post('/api/stripe/create-portal-session', async (req, res) => {
  try {
    const { customerId } = req.body;
    
    if (!customerId) {
      return res.status(400).json({ message: 'Customer ID is required' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.VITE_APP_URL}/settings`
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Store cancellation feedback
app.post('/api/stripe/cancellation-feedback', async (req, res) => {
  try {
    const { reason, feedback } = req.body;
    const userId = req.user?.id; // You'll need to add user authentication

    if (!reason) {
      return res.status(400).json({ message: 'Reason is required' });
    }

    // Store feedback in your database
    // This is where you'll integrate with your database
    console.log('Cancellation feedback:', { userId, reason, feedback });

    res.json({ message: 'Feedback received' });
  } catch (error) {
    console.error('Error storing cancellation feedback:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;

// Add error handling for server start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port or kill the process using this port.`);
    process.exit(1);
  } else {
    console.error('Server error:', error);
    process.exit(1);
  }
}); 