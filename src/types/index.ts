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

export interface User {
  email: string;
  projects: Project[];
}