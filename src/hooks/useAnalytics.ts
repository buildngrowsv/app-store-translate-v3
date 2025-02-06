import { analytics } from '../services/firebase';
import { logEvent } from 'firebase/analytics';

export function useAnalytics() {
  const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
    try {
      logEvent(analytics, eventName, eventParams);
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  // Core user journey events
  const trackPageView = (pageName: string) => {
    trackEvent('page_view', { page_name: pageName });
  };

  const trackSignUp = () => {
    trackEvent('sign_up');
  };

  const trackLogin = () => {
    trackEvent('login');
  };

  // Subscription and payment events
  const trackSubscription = (planName: string, price: number) => {
    trackEvent('begin_checkout', {
      items: [{
        name: planName,
        price: price,
        currency: 'USD'
      }]
    });
  };

  const trackSubscriptionSuccess = (planName: string, price: number) => {
    trackEvent('purchase', {
      items: [{
        name: planName,
        price: price,
        currency: 'USD'
      }]
    });
  };

  // Core feature usage events
  const trackProjectCreation = (projectType: 'enhancement' | 'translation') => {
    trackEvent('create_project', {
      project_type: projectType
    });
  };

  const trackLanguageSelection = (languages: string[]) => {
    trackEvent('select_languages', {
      language_count: languages.length,
      languages: languages
    });
  };

  const trackContentGeneration = (projectType: string, languageCount: number, success: boolean) => {
    trackEvent('generate_content', {
      project_type: projectType,
      language_count: languageCount,
      success: success,
      timestamp: new Date().toISOString()
    });
  };

  // User engagement events
  const trackResultCopy = (contentType: 'title' | 'description', language: string) => {
    trackEvent('copy_result', {
      content_type: contentType,
      language: language
    });
  };

  const trackResultSave = (projectId: string) => {
    trackEvent('save_result', {
      project_id: projectId
    });
  };

  // Error tracking
  const trackError = (errorType: string, errorMessage: string, componentName: string) => {
    trackEvent('error_occurred', {
      error_type: errorType,
      error_message: errorMessage,
      component: componentName,
      timestamp: new Date().toISOString()
    });
  };

  // Feature discovery
  const trackFeatureEngagement = (featureName: string, action: 'view' | 'click' | 'complete') => {
    trackEvent('feature_engagement', {
      feature: featureName,
      action: action,
      timestamp: new Date().toISOString()
    });
  };

  // Translation completion tracking
  const trackTranslationComplete = (params: {
    sourceLanguage: string;
    targetLanguages: string[];
    characterCount: number;
    processingTimeMs: number;
    projectId: string;
    success: boolean;
    errorType?: string;
  }) => {
    trackEvent('translation_complete', {
      ...params,
      target_language_count: params.targetLanguages.length,
      timestamp: new Date().toISOString(),
      avg_time_per_language: params.processingTimeMs / params.targetLanguages.length
    });
  };

  // ASO enhancement completion tracking
  const trackASOComplete = (params: {
    language: string;
    originalLength: number;
    enhancedLength: number;
    keywordsUsed: string[];
    projectId: string;
    success: boolean;
    errorType?: string;
    improvementAreas: string[];
  }) => {
    trackEvent('aso_enhancement_complete', {
      ...params,
      keyword_count: params.keywordsUsed.length,
      length_difference: params.enhancedLength - params.originalLength,
      timestamp: new Date().toISOString()
    });
  };

  // Track individual content improvements
  const trackContentImprovement = (params: {
    type: 'title' | 'description' | 'keywords';
    language: string;
    originalLength: number;
    improvedLength: number;
    projectId: string;
    success: boolean;
    improvementType: 'translation' | 'enhancement';
  }) => {
    trackEvent('content_improvement', {
      ...params,
      length_difference: params.improvedLength - params.originalLength,
      timestamp: new Date().toISOString()
    });
  };

  // Track user satisfaction
  const trackCompletionFeedback = (params: {
    projectId: string;
    projectType: 'translation' | 'enhancement';
    rating: number;
    usedResult: boolean;
    feedbackText?: string;
  }) => {
    trackEvent('completion_feedback', {
      ...params,
      timestamp: new Date().toISOString()
    });
  };

  return {
    // Core user journey
    trackPageView,
    trackSignUp,
    trackLogin,
    
    // Subscription
    trackSubscription,
    trackSubscriptionSuccess,
    
    // Core features
    trackProjectCreation,
    trackLanguageSelection,
    trackContentGeneration,
    
    // Completion tracking
    trackTranslationComplete,
    trackASOComplete,
    trackContentImprovement,
    trackCompletionFeedback,
    
    // Engagement
    trackResultCopy,
    trackResultSave,
    
    // Utility
    trackError,
    trackFeatureEngagement,
    
    // Generic
    trackEvent
  };
} 