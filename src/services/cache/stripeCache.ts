/*
* File: stripeCache.ts
* Description: Cache service for Stripe sessions
* Details: Handles caching and expiration of Stripe session URLs
* - Caches portal and checkout session URLs in localStorage
* - Respects different expiration times
* - Provides type-safe access to cached data
* Date: 2024-03-20
*/

interface CachedSession {
  url: string;
  expiresAt: number;
}

interface StripeCacheData {
  portalSession?: CachedSession;
  checkoutSessions?: Record<string, CachedSession>;
}

const CACHE_KEY = 'stripe_sessions_cache';

export class StripeCache {
  private static instance: StripeCache;
  private cache: StripeCacheData;

  // Portal sessions expire after 30 minutes
  private static PORTAL_SESSION_EXPIRY = 30 * 60 * 1000; // 30 minutes in ms
  // Checkout sessions expire after 24 hours
  private static CHECKOUT_SESSION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in ms

  private constructor() {
    // Load cache from localStorage
    try {
      const savedCache = localStorage.getItem(CACHE_KEY);
      this.cache = savedCache ? JSON.parse(savedCache) : {};
      // Clear expired sessions on load
      this.clearExpiredSessions();
    } catch (error) {
      console.error('Error loading stripe cache:', error);
      this.cache = {};
    }
  }

  static getInstance(): StripeCache {
    if (!StripeCache.instance) {
      StripeCache.instance = new StripeCache();
    }
    return StripeCache.instance;
  }

  // Save cache to localStorage
  private saveCache(): void {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(this.cache));
    } catch (error) {
      console.error('Error saving stripe cache:', error);
    }
  }

  // Cache a portal session URL
  cachePortalSession(url: string): void {
    this.cache.portalSession = {
      url,
      expiresAt: Date.now() + StripeCache.PORTAL_SESSION_EXPIRY
    };
    this.saveCache();
  }

  // Cache a checkout session URL
  cacheCheckoutSession(priceId: string, url: string): void {
    if (!this.cache.checkoutSessions) {
      this.cache.checkoutSessions = {};
    }
    this.cache.checkoutSessions[priceId] = {
      url,
      expiresAt: Date.now() + StripeCache.CHECKOUT_SESSION_EXPIRY
    };
    this.saveCache();
  }

  // Get portal session URL if not expired
  getPortalSession(): string | null {
    const session = this.cache.portalSession;
    if (session && Date.now() < session.expiresAt) {
      return session.url;
    }
    // Clear expired session
    if (session) {
      delete this.cache.portalSession;
      this.saveCache();
    }
    return null;
  }

  // Get checkout session URL if not expired
  getCheckoutSession(priceId: string): string | null {
    const session = this.cache.checkoutSessions?.[priceId];
    if (session && Date.now() < session.expiresAt) {
      return session.url;
    }
    // Clear expired session
    if (session) {
      delete this.cache.checkoutSessions?.[priceId];
      this.saveCache();
    }
    return null;
  }

  // Clear all cached sessions
  clearCache(): void {
    this.cache = {};
    localStorage.removeItem(CACHE_KEY);
  }

  // Clear expired sessions
  clearExpiredSessions(): void {
    const now = Date.now();
    let hasChanges = false;

    // Clear expired portal session
    if (this.cache.portalSession && now >= this.cache.portalSession.expiresAt) {
      delete this.cache.portalSession;
      hasChanges = true;
    }

    // Clear expired checkout sessions
    if (this.cache.checkoutSessions) {
      Object.entries(this.cache.checkoutSessions).forEach(([priceId, session]) => {
        if (now >= session.expiresAt) {
          delete this.cache.checkoutSessions![priceId];
          hasChanges = true;
        }
      });
    }

    // Save if any changes were made
    if (hasChanges) {
      this.saveCache();
    }
  }
} 