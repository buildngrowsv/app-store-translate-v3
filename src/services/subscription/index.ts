import { FirebaseService } from '../firebase';

interface SubscriptionLimits {
  maxProjects: number;
  maxLanguages: number;
  features: readonly string[];
}

type SubscriptionPlan = {
  maxProjects: number;
  maxLanguages: number;
  features: readonly string[];
};

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  trial: {
    maxProjects: 3,
    maxLanguages: 3,
    features: ['basic_aso', 'basic_translation']
  },
  starter: {
    maxProjects: 10,
    maxLanguages: 10,
    features: ['basic_aso', 'basic_translation', 'advanced_aso']
  },
  pro: {
    maxProjects: 25,
    maxLanguages: 25,
    features: ['basic_aso', 'basic_translation', 'advanced_aso', 'priority_support']
  },
  enterprise: {
    maxProjects: Infinity,
    maxLanguages: Infinity,
    features: ['basic_aso', 'basic_translation', 'advanced_aso', 'priority_support', 'custom_integration']
  }
} as const;

export class SubscriptionService {
  static getLimits(status: 'trial' | 'active' | 'inactive', plan?: string): SubscriptionLimits {
    if (status === 'inactive') {
      return SUBSCRIPTION_PLANS.trial;
    }
    
    if (status === 'active' && plan) {
      return SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS] || SUBSCRIPTION_PLANS.trial;
    }

    return SUBSCRIPTION_PLANS.trial;
  }

  static async canCreateProject(userId: string, currentProjectCount: number): Promise<{ allowed: boolean; reason?: string }> {
    try {
      const userData = await FirebaseService.getUserData(userId);
      if (!userData) {
        return { allowed: false, reason: 'User data not found' };
      }

      const limits = this.getLimits(userData.subscription.status, userData.subscription.plan);
      
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
      const userData = await FirebaseService.getUserData(userId);
      if (!userData) {
        return { allowed: false, reason: 'User data not found' };
      }

      const limits = this.getLimits(userData.subscription.status, userData.subscription.plan);
      
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
      const userData = await FirebaseService.getUserData(userId);
      if (!userData) return false;

      const limits = this.getLimits(userData.subscription.status, userData.subscription.plan);
      return limits.features.includes(feature);
    } catch (error) {
      console.error('Error checking feature access:', error);
      return false;
    }
  }

  static async getUsage(userId: string): Promise<{
    projects: { used: number; total: number };
    languages: { used: number; total: number };
  }> {
    try {
      const userData = await FirebaseService.getUserData(userId);
      if (!userData) throw new Error('User data not found');

      const limits = this.getLimits(userData.subscription.status, userData.subscription.plan);
      
      return {
        projects: {
          used: userData.projects?.length || 0,
          total: limits.maxProjects
        },
        languages: {
          used: 0, // This would need to be calculated based on actual usage
          total: limits.maxLanguages
        }
      };
    } catch (error) {
      console.error('Error getting usage stats:', error);
      throw error;
    }
  }
} 