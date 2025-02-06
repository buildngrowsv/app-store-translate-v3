import { Project } from '../types';
import { generatePrompts, validateResponse } from './openai/prompts';
import type { ProjectResults } from './openai/types';

class OpenAIService {
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!this.apiKey) {
      throw new Error('OpenAI API key is required. Please set VITE_OPENAI_API_KEY in .env');
    }
  }

  private async callOpenAI(messages: any[]) {
    console.log('Making OpenAI API call with messages:', JSON.stringify(messages, null, 2));

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages,
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('OpenAI API error:', error);
        throw new Error(`OpenAI API failed: ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('OpenAI API response:', JSON.stringify(data, null, 2));

      if (!validateResponse(data)) {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response format from OpenAI');
      }

      const parsedContent = JSON.parse(data.choices[0].message.content);
      console.log('Parsed content:', parsedContent);
      return parsedContent;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }

  async processProject(project: Project): Promise<ProjectResults> {
    console.log('Processing project:', project);

    try {
      if (project.type === 'enhance') {
        const messages = [
          { role: 'system', content: generatePrompts.enhance.system },
          { 
            role: 'user', 
            content: generatePrompts.enhance.user({
              appName: project.name,
              description: project.description,
              keywords: project.keywords,
            })
          }
        ];

        const results = await this.callOpenAI(messages);
        console.log('Enhancement results:', results);

        return {
          status: 'completed',
          data: results,
        };
      } else {
        console.log('Processing translations for languages:', project.languages);
        const translations = [];

        for (const language of project.languages) {
          console.log(`Processing translation for ${language}`);
          const messages = [
            { role: 'system', content: generatePrompts.translate.system(language) },
            { 
              role: 'user', 
              content: generatePrompts.translate.user({
                title: project.name,
                description: project.description,
                targetLanguage: language,
              })
            }
          ];

          const result = await this.callOpenAI(messages);
          console.log(`Translation result for ${language}:`, result);

          translations.push({
            language,
            ...result,
          });
        }

        return {
          status: 'completed',
          data: { translations },
        };
      }
    } catch (error) {
      console.error('Failed to process project:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const openaiService = new OpenAIService();
export type { ProjectResults };