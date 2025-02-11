/*
* File: src/types/index.ts
* Description: Type definitions for the application
* Details: Contains all shared type definitions
* - Project types
* - Results types
* - API response types
* Date: 2024-03-20
*/

// Project Types
export interface Project {
  id: string;
  name: string;
  description: string;
  keywords?: string;
  type: 'enhance' | 'translate';
  languages?: string[];
  lastUpdated: string;
  createdAt: string;
  userId: string;
  results?: ProjectResults;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
  keywords?: string;
  type?: 'enhance' | 'translate';
  languages?: string[];
  results?: ProjectResults;
}

// Results Types
export interface ProjectResults {
  status: 'pending' | 'completed' | 'error';
  data?: EnhancedContent | TranslationResults;
  error?: string | null;
}

export interface EnhancedContent {
  title: string;
  subtitle: string;
  description: string;
  keywords: string[];
}

export interface Translation {
  language: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface TranslationResults {
  translations: Translation[];
}

export interface User {
  email: string;
  projects: string[];
  subscription?: {
    status: 'trial' | 'active' | 'inactive';
    plan?: string;
    trialEnd?: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
  };
}