export interface Project {
  id: string;
  name: string;
  description: string;
  keywords: string;
  type: 'enhance' | 'translate';
  languages: string[];
  lastUpdated: string;
  results?: {
    status: 'in-progress' | 'completed';
    data?: any;
  };
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

export interface User {
  email: string;
  projects: Project[];
}