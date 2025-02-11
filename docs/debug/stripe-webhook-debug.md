# Stripe Webhook Debugging Log

## Issue
Stripe webhook events are not being processed correctly. Events are being sent but returning 403 and 404 errors.

## Date
2024-03-20

## Current Status
- Webhook endpoint is deployed at: `https://us-central1-reachmix.cloudfunctions.net/stripeWebhook`
- Events are being sent by Stripe CLI
- Local testing still showing connection issues
- Production requests still failing with 403 errors

## Investigation Steps
1. Fixed package dependency sync issues ✅
   - Ran `npm install` in functions directory
   - Package-lock.json now in sync

2. Standardized port configuration ✅
   - Updated firebase.json to use port 5002 consistently
   - Started emulator on port 5002
   - Updated webhook listener to use correct port

3. Verified webhook implementation
   - CORS configuration is present and correctly configured
   - Webhook secret verification is implemented
   - Event type filtering is in place
   - Error handling is implemented

4. Tested webhook events
   - Triggered test events:
     - customer.subscription.created
     - customer.subscription.updated
     - customer.subscription.deleted
     - checkout.session.completed
   - Events still not being processed correctly

## Current Issues
1. Local Environment
   - Emulator not receiving webhook events
   - Connection refused errors persist
   - Possible issue with function initialization

2. Production Environment
   - 403 errors indicate authentication issues
   - Webhook secret may not be properly configured
   - Possible CORS or security settings issue

## Next Steps
1. Debug Local Environment
   - Add more detailed logging in webhook function
   - Verify emulator is running correctly
   - Test with curl to isolate Stripe CLI issues

2. Review Security Configuration
   - Double-check webhook secret in Stripe Dashboard
   - Verify Firebase function permissions
   - Review CORS and security settings

3. Implement Better Error Handling
   - Add detailed error logging
   - Implement retry mechanism
   - Add monitoring for failed events

4. Update Function Configuration
   - Review memory allocation
   - Check timeout settings
   - Verify Node.js version compatibility

## Related Files
- functions/src/stripe/webhook.ts
- functions/src/stripe/sync.ts
- functions/package.json
- firebase.json

## Updates
- [2024-03-20] Initial investigation
- [2024-03-20] Fixed package dependency issues
- [2024-03-20] Standardized port configuration
- [2024-03-20] Verified webhook implementation
- [2024-03-20] Tested webhook events - still seeing issues 

# Stripe Webhook Debug Checklist

## Date: 2024-03-20

## Current Status
✅ = Implemented
⚠️ = Partially implemented/Needs review
❌ = Not implemented

### Webhook Handler
- ✅ Raw body handling configured
- ✅ CORS handling implemented
- ✅ Signature verification
- ✅ Event type filtering
- ✅ Comprehensive error logging
- ✅ Event handlers exported
- ⚠️ Event type checking (could be more type-safe)
- ✅ Database transaction handling
- ✅ Error recovery mechanisms

### Event Handlers
- ✅ Checkout session completed handler
- ✅ Subscription change handler
- ✅ Subscription deletion handler
- ✅ Data sync with Firestore
- ⚠️ Type safety for event objects

### Local Development
- ❌ Stripe CLI setup
- ❌ Local webhook forwarding
- ❌ Test event triggers
- ❌ Event delivery verification

## Current Issues
1. Connection Issues:
   ```
   Failed to POST: Post "http://localhost:5002/reachmix/us-central1/stripeWebhook": dial tcp [::1]:5002: connect: connection refused
   ```
   Possible causes:
   - Firebase emulator not running
   - Wrong port configuration
   - Firewall blocking connection
   - Incorrect webhook URL

2. Type Safety Improvements Needed:
   ```typescript
   // Current:
   if (!SUBSCRIPTION_EVENTS.includes(event.type as any))
   
   // Should be:
   if (!isSubscriptionEvent(event.type))
   ```

## Action Items

### 1. Fix Connection Issues
- [ ] Verify Firebase emulator configuration
  ```json
  // firebase.json
  {
    "functions": {
      "source": "functions",
      "emulators": {
        "functions": {
          "port": 5002
        }
      }
    }
  }
  ```
- [ ] Check firewall settings
- [ ] Verify function deployment
- [ ] Test with Stripe CLI

### 2. Improve Type Safety
- [ ] Add type guard for subscription events:
  ```typescript
  type SubscriptionEvent = typeof SUBSCRIPTION_EVENTS[number];
  
  function isSubscriptionEvent(type: string): type is SubscriptionEvent {
    return SUBSCRIPTION_EVENTS.includes(type as SubscriptionEvent);
  }
  ```
- [ ] Add stricter types for event objects
- [ ] Add return type annotations for handlers

### 3. Set Up Local Development
```bash
# 1. Install Stripe CLI
brew install stripe/stripe-cli/stripe

# 2. Login to Stripe
stripe login

# 3. Start Firebase emulator
npm run serve

# 4. In a new terminal, start webhook forwarding
stripe listen --forward-to localhost:5002/reachmix/us-central1/stripeWebhook

# 5. In another terminal, trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted
```

## Testing Checklist
- [ ] Verify emulator starts correctly
- [ ] Confirm webhook endpoint is accessible
- [ ] Test signature verification
- [ ] Test each subscription event type
- [ ] Verify database updates
- [ ] Check error handling
- [ ] Validate CORS handling

## Progress Log

### 2024-03-20
1. Reviewed current implementation
2. Found existing webhook handler is well-structured
3. Identified connection issues as main problem
4. Documented type safety improvements needed
5. Created local development setup guide
6. Checked Firebase configuration:
   - ✅ Port 5002 correctly configured in firebase.json
   - ✅ Functions source directory set correctly
   - ✅ Emulator UI enabled
   - ✅ Added Firestore emulator configuration
   - ✅ Added Auth emulator configuration
   - ✅ Set specific ports for all emulators
7. Verified environment variables:
   - ✅ Stripe webhook secret configured
   - ✅ Stripe secret key configured
   - ✅ App domain configured
   - ✅ Other API keys present
8. Fixed TypeScript errors:
   - ✅ Rate limit type assignability issue
   - ✅ Context.auth undefined error
   - ✅ Unused webhook handler functions
   - ✅ Added proper event handler types
   - ✅ Improved type safety in webhook processing
9. Fixed dependency and configuration issues:
   - ✅ Updated OpenAI initialization with fallback
   - ✅ Updated Firebase Functions SDK
   - ✅ Exported config for local development
10. Encountered new requirement:
    - ❌ Java installation needed for Firestore emulator

## Current Issues

### 1. Java Installation Required
```
Error: Process `java -version` has exited with code 1. Please make sure Java is installed and on your system PATH.
```

Fix:
```bash
# On macOS with Homebrew
brew install java

# Add to PATH
echo 'export PATH="/usr/local/opt/openjdk/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verify installation
java -version
```

### 2. Development Environment Setup
1. Required Software:
   - Node.js
   - npm
   - Java (for Firestore emulator)
   - Firebase CLI
   - Stripe CLI

2. Environment Variables:
   ```bash
   # Firebase config
   firebase functions:config:get > .runtimeconfig.json

   # Local environment
   export OPENAI_API_KEY=your_api_key
   ```

3. Dependencies:
   ```bash
   npm install --save firebase-functions@latest firebase-admin@latest
   ```

## Next Actions
1. Install Java:
   ```bash
   brew install java
   sudo ln -sfn /usr/local/opt/openjdk/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk.jdk
   ```

2. Start emulators:
   ```bash
   firebase emulators:start --only functions,auth,firestore
   ```

3. Test webhook flow:
   ```bash
   # Terminal 2
   stripe listen --forward-to localhost:5002/reachmix/us-central1/stripeWebhook

   # Terminal 3
   stripe trigger checkout.session.completed
   ```

### Testing Progress
- [✓] Environment variables configured
- [✓] TypeScript errors fixed
- [✓] OpenAI initialization fixed
- [✓] Firebase Functions SDK updated
- [❌] Java installation required
- [ ] Emulators started successfully
- [ ] Webhook endpoint accessible
- [ ] Stripe CLI connected
- [ ] Test events processed
- [ ] Database updates verified

## Development Setup Guide

### Prerequisites
1. Node.js and npm
2. Java Development Kit (JDK)
3. Firebase CLI
4. Stripe CLI

### Installation Steps
```bash
# 1. Install Java
brew install java
sudo ln -sfn /usr/local/opt/openjdk/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk.jdk

# 2. Install Firebase CLI
npm install -g firebase-tools

# 3. Install Stripe CLI
brew install stripe/stripe-cli/stripe

# 4. Install project dependencies
cd functions
npm install

# 5. Set up environment
firebase functions:config:get > .runtimeconfig.json
```

### Running the Development Environment
```bash
# Terminal 1: Start emulators
firebase emulators:start --only functions,auth,firestore

# Terminal 2: Forward webhooks
stripe listen --forward-to localhost:5002/reachmix/us-central1/stripeWebhook

# Terminal 3: Test webhooks
stripe trigger checkout.session.completed
```

## Updated Notes
- Java is required for Firestore emulator
- Need to document development setup process
- Consider Docker setup for consistent environment
- Add configuration validation
- Add health check endpoints
- Consider CI/CD pipeline setup

## Next Steps
1. Install Java and verify installation
2. Start emulators with all required services
3. Test webhook flow
4. Document complete setup process
5. Consider containerization 

## Latest Update: 2024-03-20

### Test Results
✅ = Success
⚠️ = Partial Success/Needs Review
❌ = Failed

#### Local Environment Setup
- ✅ Stripe CLI installed and configured
- ✅ Firebase emulators running (Functions, Auth, Firestore)
- ✅ Webhook forwarding established
- ✅ Test events triggered successfully

#### Event Testing
1. checkout.session.completed
   - Event triggered successfully
   - Webhook received and processed
   - Database updates confirmed

2. customer.subscription.updated
   - Event triggered successfully
   - Webhook received and processed
   - Subscription status updated in Firestore

3. customer.subscription.deleted
   - Event triggered successfully
   - Webhook received and processed
   - Subscription status marked as inactive

### Remaining Tasks
1. Monitor webhook reliability
2. Add error rate monitoring
3. Implement retry mechanism for failed events
4. Add webhook event logging to Firestore
5. Set up alerts for failed webhooks

### Next Steps
1. Set up production webhook endpoint
2. Configure production environment variables
3. Add monitoring and alerting
4. Document webhook handling process 

# Production Setup

## Date: 2024-03-20

### 1. Function Deployment
✅ Successfully deployed Firebase Functions
- Endpoint URL: `https://us-central1-reachmix.cloudfunctions.net/stripeWebhook`
- Node.js runtime: 18 (Note: will be deprecated on 2025-04-30)
- All functions deployed successfully

### 2. Stripe Webhook Configuration
To set up in Stripe Dashboard:
1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter endpoint URL: `https://us-central1-reachmix.cloudfunctions.net/stripeWebhook`
4. Select events to listen to:
   - checkout.session.completed
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
5. Set API version to 2023-08-16
6. Save and copy the webhook signing secret

### 3. Environment Configuration
```bash
# Set webhook secret in Firebase
firebase functions:config:set stripe.webhook_secret="whsec_your_webhook_signing_secret"

# Redeploy functions to apply new config
firebase deploy --only functions
```

### 4. Security Checklist
- [ ] Webhook secret configured in Firebase
- [ ] CORS settings updated for production
- [ ] Function IAM roles verified
- [ ] Rate limiting configured
- [ ] Error monitoring set up
- [ ] Logging enabled

### 5. Monitoring Setup
1. Set up Firebase Monitoring
   - Enable error reporting
   - Configure log retention
   - Set up alerts for errors

2. Set up Stripe Monitoring
   - Enable webhook monitoring
   - Set up failed webhook alerts
   - Configure retry settings

### 6. Testing Production
1. Test Events:
   ```bash
   # Using Stripe CLI
   stripe trigger checkout.session.completed --api-key sk_test_...
   stripe trigger customer.subscription.updated --api-key sk_test_...
   stripe trigger customer.subscription.deleted --api-key sk_test_...
   ```

2. Verify:
   - [ ] Events received by endpoint
   - [ ] Signature verification passing
   - [ ] Database updates successful
   - [ ] Error handling working
   - [ ] Monitoring capturing events

### 7. Rollout Plan
1. Phase 1: Test Environment
   - Deploy to test environment
   - Run full test suite
   - Monitor for 24 hours

2. Phase 2: Production Migration
   - Update DNS if needed
   - Deploy to production
   - Verify webhook reception
   - Monitor closely for 48 hours

3. Phase 3: Old Endpoint Deprecation
   - Identify old webhook endpoints
   - Monitor traffic distribution
   - Plan deprecation timeline
   - Communicate with stakeholders

### 8. Backup and Recovery
1. Backup Procedures
   - Document current configuration
   - Export Stripe webhook settings
   - Backup Firebase configuration

2. Recovery Procedures
   - Steps to restore webhook endpoint
   - Process for rotating webhook secret
   - Procedure for handling missed events

### 9. Documentation
1. Update System Documentation
   - Webhook handling process
   - Event types and processing
   - Error handling procedures
   - Monitoring and alerts

2. Update Operations Documentation
   - Deployment procedures
   - Monitoring guidelines
   - Incident response
   - Backup and recovery

### Next Steps
1. Complete Stripe Dashboard configuration
2. Set up monitoring and alerts
3. Perform production testing
4. Document deployment process 