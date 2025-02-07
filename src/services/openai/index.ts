import { Project } from '../../types';

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

export class OpenAIService {
  private readonly API_URL: string;

  constructor() {
    // Use the Cloudflare Worker URL
    this.API_URL = 'https://reachmix-openai.buildngrowsv.workers.dev';
  }

  async processProject(project: Project): Promise<ProjectResults> {
    try {
      console.log('Processing project with Worker:', project);

      // Prepare project data for the worker
      const requestData = {
        type: project.type,
        name: project.name,
        description: project.description,
        keywords: project.keywords,
        language: project.type === 'translate' ? project.languages[0] : 'english'
      };

      console.log('Sending request to Worker:', requestData);
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Worker error:', error);
        throw new Error(error.error || 'Failed to process project');
      }

      const result = await response.json();
      console.log('Worker response:', result);
      
      return result;
    } catch (error: any) {
      console.error('Error processing project:', error);
      return {
        status: 'error',
        error: error.message || 'An unexpected error occurred',
      };
    }
  }
}

// Export singleton instance
export const openaiService = new OpenAIService();