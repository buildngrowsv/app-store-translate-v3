import { Project } from '../types';
import type { ProjectResults } from './openai/types';
import { getFunctions, httpsCallable } from 'firebase/functions';

class OpenAIService {
  private readonly functions = getFunctions();

  async processProject(project: Project): Promise<ProjectResults> {
    console.log('Processing project:', project);

    try {
      const generateContent = httpsCallable(this.functions, 'generateASOContent');
      
      const result = await generateContent({
        name: project.name,
        description: project.description,
        keywords: project.keywords,
        type: project.type,
        languages: project.languages,
      });

      console.log('Firebase Function result:', result.data);
      return result.data as ProjectResults;
    } catch (error: any) {
      console.error('Failed to process project:', error);
      return {
        status: 'error',
        error: error.message || 'An unexpected error occurred',
      };
    }
  }
}

// Export a singleton instance
export const openaiService = new OpenAIService();
export type { ProjectResults };