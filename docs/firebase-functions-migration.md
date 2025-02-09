# Firebase Functions Migration Plan - Updated

## Overview
Moving all backend operations from client-side and Cloudflare Workers to Firebase Functions for better security and maintainability.

## Current Status (Updated March 2024)

### Completed ✅
1. Basic Firebase Functions setup
2. Stripe Integration:
   - Webhook handler
   - Customer creation
   - Checkout session function
   - Portal session function
   - Subscription management
   - Subscription webhooks
   - Customer portal
3. OpenAI Integration:
   - Basic translation function
   - ASO content generation function
   - Prompt templates moved to backend
   - Client-side OpenAI service updated
4. Authentication:
   - User creation flow
   - Stripe customer linking

### In Progress 🚧
1. Project Management Functions:
   - Create project function (partially implemented)
   - Update project function (partially implemented)
   - Delete project function (needs implementation)
   - Get project results function (needs implementation)

2. Security & Performance:
   - Rate limiting implementation
   - Caching system
   - Error logging enhancement
   - Monitoring setup

3. Client Updates:
   - Remove OpenAI API key from client
   - Update remaining API endpoints

4. API Route Migration:
   - Migrate remaining API routes to Firebase Functions
   - Update client services to use Firebase Functions
   - Remove old API routes

### API Routes to Migrate 🔄
1. Authentication Routes:
   - [ ] `/api/auth/signup` -> Firebase Auth
   - [ ] `/api/auth/signin` -> Firebase Auth
   - [ ] `/api/auth/signout` -> Firebase Auth

2. Project Routes:
   - [✅] `/api/projects/create` -> `createProject` function
   - [✅] `/api/projects/update` -> `updateProject` function
   - [✅] `/api/projects/delete` -> `deleteProject` function
   - [✅] `/api/projects/results` -> `getProjectResults` function

3. Subscription Routes:
   - [✅] `/api/stripe/create-checkout-session` -> `createCheckoutSession` function
   - [✅] `/api/stripe/create-portal-session` -> `createPortalSession` function
   - [✅] `/api/stripe/webhook` -> `stripeWebhook` function
   - [✅] `/api/stripe/cancellation-feedback` -> `handleCancellationFeedback` function

4. OpenAI Routes:
   - [✅] `/api/openai/translate` -> `translateText` function
   - [✅] `/api/openai/generate` -> `generateASOContent` function

### Service Updates Required
1. AuthService:
   - [ ] Update to use Firebase Auth
   - [ ] Remove in-memory storage
   - [ ] Add error handling

2. ProjectService:
   - [✅] Update to use Firebase Functions
   - [✅] Add proper error handling
   - [✅] Remove direct Firestore access

3. SubscriptionService:
   - [✅] Update to use Firebase Functions
   - [✅] Add subscription limits
   - [✅] Add feature checks

## Remaining Tasks

### 1. Project Management Functions
- [ ] Complete CRUD operations for projects:
  ```typescript
  // Create project function
  export const createProject = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
    }

    const projectData = {
      ...data,
      userId: context.auth.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'pending'
    };

    try {
      const projectRef = await admin.firestore().collection('projects').add(projectData);
      return { id: projectRef.id, ...projectData };
    } catch (error) {
      throw new functions.https.HttpsError('internal', 'Project creation failed');
    }
  });

  // Delete project function
  export const deleteProject = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
    }

    try {
      const projectRef = admin.firestore().collection('projects').doc(data.projectId);
      const project = await projectRef.get();

      if (!project.exists) {
        throw new functions.https.HttpsError('not-found', 'Project not found');
      }

      if (project.data()?.userId !== context.auth.uid) {
        throw new functions.https.HttpsError('permission-denied', 'Not authorized');
      }

      await projectRef.delete();
      return { success: true };
    } catch (error) {
      throw new functions.https.HttpsError('internal', 'Project deletion failed');
    }
  });
  ```

### 2. Security Enhancements
- [ ] Implement rate limiting:
  ```typescript
  // Add rate limiting middleware
  const rateLimit = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  };
  ```

- [ ] Add request validation middleware
- [ ] Enhance error logging with structured logging
- [ ] Set up monitoring alerts for:
  - Function execution errors
  - Rate limit breaches
  - API timeouts
  - Authentication failures

### 3. Performance Optimization
- [ ] Implement caching for OpenAI responses:
  ```typescript
  // Add caching layer
  const cache = new Map();
  const CACHE_TTL = 60 * 60 * 1000; // 1 hour

  const getCachedResponse = (key: string) => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
    return null;
  };
  ```

### 4. Client Updates
- [ ] Update project service to use new Firebase Functions:
  ```typescript
  // src/services/project.ts
  class ProjectService {
    private functions = getFunctions();

    async createProject(data: ProjectData): Promise<Project> {
      const createProjectFn = httpsCallable(this.functions, 'createProject');
      return createProjectFn(data);
    }

    async deleteProject(projectId: string): Promise<void> {
      const deleteProjectFn = httpsCallable(this.functions, 'deleteProject');
      return deleteProjectFn({ projectId });
    }
  }
  ```

### 5. Testing & Deployment
- [ ] Write integration tests for all functions
- [ ] Set up CI/CD pipeline
- [ ] Create staging environment
- [ ] Plan gradual rollout

## Environment Configuration
```bash
# Required Environment Variables (Already Configured ✅)
FIREBASE_PROJECT_ID=reachmix
STRIPE_SECRET_KEY=sk_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
OPENAI_API_KEY=sk-xxx

# New Environment Variables to Add
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=900000
CACHE_TTL=3600000
MONITORING_WEBHOOK_URL=https://xxx
```

## Next Steps (Priority Order)
1. Complete project management functions
   - Implement CRUD operations
   - Add validation and error handling
   - Test with Firestore rules

2. Migrate remaining API routes
   - Move API routes to Firebase Functions
   - Update client services
   - Remove old API routes

3. Implement security measures
   - Add rate limiting
   - Set up monitoring
   - Enhance error logging

4. Add performance optimizations
   - Implement caching
   - Add request batching
   - Optimize database queries

5. Testing and deployment
   - Write integration tests
   - Set up staging
   - Plan rollout strategy

## Notes
- ✅ OpenAI API key removed from client-side environment variables
- ✅ Stripe integration completed and tested
- ✅ Basic Firebase Functions setup complete
- 🚧 Project management functions in progress
- 🚧 Security enhancements pending
- Keep backup of Cloudflare Workers until migration is complete
- Test thoroughly in development environment
- Keep documentation updated 