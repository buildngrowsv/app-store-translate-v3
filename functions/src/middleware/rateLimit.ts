/*
* File: functions/src/middleware/rateLimit.ts
* Description: Rate limiting middleware for Firebase Functions
* Details: Implements rate limiting using Redis or Firestore
* - Different limits for authenticated vs unauthenticated requests
* - Different limits for different function types
* - Sliding window rate limiting
* Date: 2024-03-20
*/

import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number;  // Maximum requests allowed in the window
  errorMessage?: string;  // Custom error message
}

// Define the structure of our limits
interface AuthLimits {
  signup: RateLimitConfig;
  signin: RateLimitConfig;
  passwordReset: RateLimitConfig;
}

interface ApiLimits {
  authenticated: RateLimitConfig;
  unauthenticated: RateLimitConfig;
}

interface OpenAILimits {
  translation: RateLimitConfig;
  generation: RateLimitConfig;
}

interface LimitConfig {
  auth: AuthLimits;
  api: ApiLimits;
  openai: OpenAILimits;
}

// Define the limits with proper typing
const DEFAULT_LIMITS: LimitConfig = {
  auth: {
    signup: { windowMs: 60 * 60 * 1000, maxRequests: 5, errorMessage: 'Too many signup attempts' },
    signin: { windowMs: 15 * 60 * 1000, maxRequests: 10, errorMessage: 'Too many signin attempts' },
    passwordReset: { windowMs: 60 * 60 * 1000, maxRequests: 3, errorMessage: 'Too many password reset attempts' }
  },
  api: {
    authenticated: { windowMs: 60 * 1000, maxRequests: 100, errorMessage: 'Rate limit exceeded' },
    unauthenticated: { windowMs: 60 * 1000, maxRequests: 20, errorMessage: 'Rate limit exceeded' }
  },
  openai: {
    translation: { windowMs: 60 * 1000, maxRequests: 10, errorMessage: 'Translation rate limit exceeded' },
    generation: { windowMs: 60 * 1000, maxRequests: 5, errorMessage: 'Generation rate limit exceeded' }
  }
};

export class RateLimiter {
  private db = admin.firestore();

  constructor(private config: RateLimitConfig) {}

  private getKey(identifier: string, type: string): string {
    return `ratelimit:${type}:${identifier}`;
  }

  async isRateLimited(identifier: string, type: string): Promise<boolean> {
    const key = this.getKey(identifier, type);
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    try {
      // Get the rate limit document
      const rateLimitRef = this.db.collection('rate_limits').doc(key);
      
      // Run in transaction to ensure atomic updates
      const limited = await this.db.runTransaction(async (transaction) => {
        const doc = await transaction.get(rateLimitRef);
        const data = doc.data();

        if (!data) {
          // First request
          transaction.set(rateLimitRef, {
            requests: [{
              timestamp: now
            }],
            lastReset: now
          });
          return false;
        }

        // Filter out old requests
        const requests = data.requests.filter((r: { timestamp: number }) => 
          r.timestamp > windowStart
        );

        // Check if limit exceeded
        if (requests.length >= this.config.maxRequests) {
          return true;
        }

        // Add new request
        requests.push({ timestamp: now });
        
        // Update document
        transaction.update(rateLimitRef, {
          requests,
          lastReset: data.lastReset
        });

        return false;
      });

      return limited;
    } catch (error) {
      console.error('Rate limiting error:', error);
      // In case of error, allow the request
      return false;
    }
  }
}

// Type-safe function to get config
function getConfig<T extends keyof LimitConfig, S extends keyof LimitConfig[T]>(
  type: T,
  subType: S
): RateLimitConfig {
  // We know this is safe because our DEFAULT_LIMITS matches the LimitConfig type
  // and all values in it conform to RateLimitConfig
  return DEFAULT_LIMITS[type][subType] as RateLimitConfig;
}

// Update createRateLimiter function with proper typing
export function createRateLimiter<T extends keyof LimitConfig, S extends keyof LimitConfig[T]>(
  type: T,
  subType: S
) {
  const config = getConfig(type, subType);
  const limiter = new RateLimiter(config);

  return async (context: functions.https.CallableContext | null): Promise<void> => {
    const identifier = context?.auth?.uid || context?.rawRequest?.ip || 'anonymous';
    const key = `${String(type)}:${String(subType)}`;
    
    if (await limiter.isRateLimited(identifier, key)) {
      throw new functions.https.HttpsError(
        'resource-exhausted',
        config.errorMessage || 'Too many requests, please try again later'
      );
    }
  };
}

// Export configured limiters
export const authLimiter = {
  signup: createRateLimiter('auth', 'signup'),
  signin: createRateLimiter('auth', 'signin'),
  passwordReset: createRateLimiter('auth', 'passwordReset')
} as const;

export const apiLimiter = {
  authenticated: createRateLimiter('api', 'authenticated'),
  unauthenticated: createRateLimiter('api', 'unauthenticated')
} as const;

export const openaiLimiter = {
  translation: createRateLimiter('openai', 'translation'),
  generation: createRateLimiter('openai', 'generation')
} as const; 