# Deployment Checklist

## Pre-Deployment Checks

### Environment Variables
- [ ] Cloudflare Pages Environment Variables
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET`
  - [ ] `OPENAI_API_KEY`
  - [ ] `FIREBASE_API_KEY`
  - [ ] `FIREBASE_AUTH_DOMAIN`
  - [ ] `FIREBASE_PROJECT_ID`
  - [ ] `FIREBASE_STORAGE_BUCKET`
  - [ ] `FIREBASE_MESSAGING_SENDER_ID`
  - [ ] `FIREBASE_APP_ID`

- [ ] Firebase Functions Environment Variables
  ```bash
  firebase functions:config:set \
    stripe.secret_key="YOUR_STRIPE_SECRET_KEY" \
    stripe.webhook_secret="YOUR_STRIPE_WEBHOOK_SECRET" \
    openai.api_key="YOUR_OPENAI_API_KEY"
  ```

### API Services
- [ ] Enable required Firebase APIs
  - [ ] `cloudfunctions.googleapis.com`
  - [ ] `cloudbuild.googleapis.com`
  - [ ] `artifactregistry.googleapis.com`
  - [ ] `firebaseextensions.googleapis.com`

### Dependencies
- [ ] Frontend dependencies up to date (`npm install`)
- [ ] Functions dependencies up to date (`cd functions && npm install`)
- [ ] Check for security vulnerabilities (`npm audit`)

## Deployment Steps

### 1. Frontend Deployment (Cloudflare Pages)
- [ ] Push changes to GitHub repository
- [ ] Verify Cloudflare Pages build settings
  - [ ] Build command: `npm run build`
  - [ ] Build output directory: `dist`
  - [ ] Node.js version: 20.x
- [ ] Monitor build progress in Cloudflare Dashboard
- [ ] Verify deployment at production URL

### 2. Backend Deployment (Firebase Functions)
```bash
# Deploy all functions
firebase deploy --only functions

# Or deploy specific functions
firebase deploy --only functions:createUser,functions:stripeWebhook,functions:translateText
```

### 3. Post-Deployment Verification

#### Frontend
- [ ] Test authentication flows
  - [ ] Sign up
  - [ ] Sign in
  - [ ] Password reset
  - [ ] OAuth providers
- [ ] Test subscription flows
  - [ ] Free trial
  - [ ] Premium subscription
  - [ ] Payment processing
- [ ] Test core features
  - [ ] Text enhancement
  - [ ] Translation
  - [ ] Custom language addition
  - [ ] CSV export

#### Backend
- [ ] Verify function endpoints
  - [ ] `createUser`
  - [ ] `stripeWebhook`
  - [ ] `translateText`
- [ ] Test Stripe integration
  - [ ] Webhook functionality
  - [ ] Subscription management
  - [ ] Payment processing
- [ ] Test OpenAI integration
  - [ ] Translation accuracy
  - [ ] API rate limits
  - [ ] Error handling

#### Security
- [ ] Verify Firestore rules
- [ ] Check API access restrictions
- [ ] Validate environment variable security
- [ ] Test CORS settings

## Monitoring & Maintenance

### Error Tracking
- [ ] Set up error monitoring
- [ ] Configure alert thresholds
- [ ] Verify error reporting

### Performance Monitoring
- [ ] Enable Firebase Performance Monitoring
- [ ] Set up Cloudflare Analytics
- [ ] Configure custom metrics

### Cleanup
- [ ] Clean up build images
  ```bash
  # Clean up or manually delete at:
  # https://console.cloud.google.com/gcr/images/reachmix/us/gcf
  ```
- [ ] Archive old deployments
- [ ] Review and clean logs

## Documentation
- [ ] Update API documentation
- [ ] Document new features
- [ ] Update troubleshooting guides
- [ ] Record deployment version and date

## Emergency Procedures
- [ ] Document rollback procedures
- [ ] List emergency contacts
- [ ] Prepare incident response plan

---

## Quick Deploy Commands

```bash
# Frontend (Automatic via GitHub push)
git push origin main

# Backend
cd functions
npm install
npm run build
firebase deploy --only functions

# Environment Variables
firebase functions:config:set stripe.secret_key="xxx" stripe.webhook_secret="xxx" openai.api_key="xxx"

# View current config
firebase functions:config:get

# Logs
firebase functions:log
```

## Important URLs

- Frontend: [https://app-store-translate.pages.dev](https://app-store-translate.pages.dev)
- Cloudflare Dashboard: [https://dash.cloudflare.com](https://dash.cloudflare.com)
- Firebase Console: [https://console.firebase.google.com/project/reachmix](https://console.firebase.google.com/project/reachmix)
- Stripe Dashboard: [https://dashboard.stripe.com](https://dashboard.stripe.com)
- OpenAI Dashboard: [https://platform.openai.com/dashboard](https://platform.openai.com/dashboard)

## Version Information

- Node.js: v20.x
- Firebase Functions: v5.1.0
- Firebase Admin: v11.11.1
- OpenAI API: v4.28.0
- Stripe API: v14.17.0 