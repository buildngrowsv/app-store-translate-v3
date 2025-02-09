/*
* File: functions/src/services/subscription.ts
* Description: Subscription service for Firebase Functions
* Details: Handles subscription limits and plan features
* - Project limits
* - Language limits
* - Feature access
* Date: 2024-03-20
*/

import * as admin from 'firebase-admin';

interface SubscriptionLimits {
  maxProjects: number;
  maxLanguages: number;
  features: string[];
}

const SUBSCRIPTION_PLANS: Record<string, SubscriptionLimits> = {
  trial: {
    maxProjects: 3,
    maxLanguages: 3,
    features: ['basic_aso', 'basic_translation']
  },
  starter: {
    maxProjects: 10,
    maxLanguages: 10,
    features: ['basic_aso', 'basic_translation', 'custom_keywords']
  },
  pro: {
    maxProjects: 25,
    maxLanguages: 25,
    features: ['advanced_aso', 'advanced_translation', 'custom_keywords', 'priority_support']
  },
  enterprise: {
    maxProjects: 999999,
    maxLanguages: 999999,
    features: ['all']
  }
};

export class SubscriptionService {
  static getLimits(status: 'trial' | 'active' | 'inactive', plan?: string): SubscriptionLimits {
    if (status === 'inactive') {
      return SUBSCRIPTION_PLANS.trial;
    }
    
    if (status === 'active' && plan) {
      return SUBSCRIPTION_PLANS[plan] || SUBSCRIPTION_PLANS.trial;
    }

    return SUBSCRIPTION_PLANS.trial;
  }

  static async canCreateProject(userId: string, currentProjectCount: number): Promise<{ allowed: boolean; reason?: string }> {
    try {
      const userDoc = await admin.firestore().collection('users').doc(userId).get();
      if (!userDoc.exists) {
        return { allowed: false, reason: 'User data not found' };
      }

      const userData = userDoc.data();
      const limits = this.getLimits(
        userData?.subscription?.status || 'trial',
        userData?.subscription?.plan
      );
      
      if (currentProjectCount >= limits.maxProjects) {
        return {
          allowed: false,
          reason: `You have reached the maximum number of projects (${limits.maxProjects}) for your plan. Please upgrade to create more projects.`
        };
      }

      return { allowed: true };
    } catch (error) {
      console.error('Error checking project creation permission:', error);
      return { allowed: false, reason: 'Failed to verify subscription status' };
    }
  }

  static async canSelectLanguages(userId: string, languageCount: number): Promise<{ allowed: boolean; reason?: string }> {
    try {
      const userDoc = await admin.firestore().collection('users').doc(userId).get();
      if (!userDoc.exists) {
        return { allowed: false, reason: 'User data not found' };
      }

      const userData = userDoc.data();
      const limits = this.getLimits(
        userData?.subscription?.status || 'trial',
        userData?.subscription?.plan
      );
      
      if (languageCount > limits.maxLanguages) {
        return {
          allowed: false,
          reason: `You can select up to ${limits.maxLanguages} languages on your current plan. Please upgrade to select more languages.`
        };
      }

      return { allowed: true };
    } catch (error) {
      console.error('Error checking language selection permission:', error);
      return { allowed: false, reason: 'Failed to verify subscription status' };
    }
  }

  static async hasFeature(userId: string, feature: string): Promise<boolean> {
    try {
      const userDoc = await admin.firestore().collection('users').doc(userId).get();
      if (!userDoc.exists) return false;

      const userData = userDoc.data();
      const limits = this.getLimits(
        userData?.subscription?.status || 'trial',
        userData?.subscription?.plan
      );

      return limits.features.includes('all') || limits.features.includes(feature);
    } catch (error) {
      console.error('Error checking feature access:', error);
      return false;
    }
  }
} 