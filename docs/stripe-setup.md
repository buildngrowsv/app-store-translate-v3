# Stripe Webhook Setup

## Overview
This document outlines the steps to configure Stripe webhooks for handling subscription events.

## Steps

### 1. Deploy Firebase Functions
```bash
firebase deploy --only functions
```

### 2. Get Webhook Endpoint
After deployment, get your webhook endpoint URL:
```
https://us-central1-[YOUR_PROJECT_ID].cloudfunctions.net/stripeWebhook
```

### 3. Configure Webhook in Stripe Dashboard
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your Firebase Function URL
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

### 4. Get Webhook Secret
1. After creating the webhook, Stripe will show you the signing secret
2. Copy this secret and add it to Firebase config:
```bash
firebase functions:config:set stripe.webhook_secret="whsec_your_webhook_secret_here"
```
3. Redeploy functions:
```bash
firebase deploy --only functions
```

## Testing the Integration

### Payment Flow
1. User initiates subscription purchase
2. User completes payment on Stripe Checkout page
3. Stripe redirects to settings page with `session_id`
4. Settings page refreshes user data
5. Webhook receives `checkout.session.completed` event
6. Database updates subscription status
7. UI updates to show active subscription

### Webhook Events
The webhook handles these events:
- `checkout.session.completed`: Initial subscription setup
- `customer.subscription.updated`: Plan changes
- `customer.subscription.deleted`: Subscription cancellations

### Testing Webhooks Locally
1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Run:
```bash
stripe listen --forward-to localhost:5001/[YOUR_PROJECT_ID]/us-central1/stripeWebhook
```

## Troubleshooting

### Common Issues
1. Webhook not receiving events
   - Check webhook endpoint URL
   - Verify webhook secret is correctly set
   - Check Firebase Function logs

2. Subscription not updating
   - Check webhook event logs in Stripe Dashboard
   - Verify database write permissions
   - Check Firebase Function logs

3. UI not updating
   - Verify client-side data refresh logic
   - Check subscription status in database
   - Verify real-time listeners are working 