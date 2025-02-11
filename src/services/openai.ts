/*
* File: src/services/openai.ts
* Description: OpenAI service for client-side operations
* Details: Provides interface to Firebase Functions for OpenAI operations
* - Project content generation
* - Text translation
* - Error handling and rate limiting
* Date: 2024-03-20
*/

import { Project } from '../types';
import type { ProjectResults } from './openai/types';
import { getFunctions, httpsCallable } from 'firebase/functions';

export class OpenAIService {
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

  async translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      const translateFn = httpsCallable(this.functions, 'translateText');
      const result = await translateFn({ text, targetLanguage });
      return (result.data as { translatedText: string }).translatedText;
    } catch (error: any) {
      console.error('Failed to translate text:', error);
      throw new Error(error.message || 'Failed to translate text');
    }
  }
}

// Export a singleton instance
export const openaiService = new OpenAIService();
export type { ProjectResults };