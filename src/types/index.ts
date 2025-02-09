export interface Project {
  id: string;
  name: string;
  description: string;
  keywords: string;
  type: 'enhance' | 'translate';
  languages: string[];
  lastUpdated: string;
  createdAt: string;
  userId: string;
  results?: ProjectResults;
}

export interface ProjectResults {
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  data?: {
    title: string;
    subtitle: string;
    description: string;
    keywords: string[];
  };
  error?: string;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
  keywords?: string;
  languages?: string[];
  results?: ProjectResults;
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