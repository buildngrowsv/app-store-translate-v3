import * as functions from 'firebase-functions/v1';
import { OpenAI } from 'openai';
import { generatePrompts, validateResponse } from '../prompts';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: functions.config().openai.api_key,
});

interface ProjectData {
  name: string;
  description: string;
  keywords?: string;
  type: 'enhance' | 'translate';
  languages?: string[];
}

type OpenAIMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type OpenAIResponse = {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
};

interface ProjectResults {
  status: 'completed' | 'error';
  data?: any;
  error?: string;
}

export const generateASOContent = functions.https.onCall(async (data: ProjectData, context) => {
  // Authentication check
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  try {
    // Input validation
    if (!data.name || !data.description) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Name and description are required.'
      );
    }

    if (data.type === 'translate' && (!data.languages || data.languages.length === 0)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Languages are required for translation projects.'
      );
    }

    // Process based on project type
    if (data.type === 'enhance') {
      const messages: OpenAIMessage[] = [
        { role: 'system', content: generatePrompts.enhance.system },
        { 
          role: 'user', 
          content: generatePrompts.enhance.user({
            appName: data.name,
            description: data.description,
            keywords: data.keywords,
          })
        }
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      });

      if (!validateResponse(completion)) {
        throw new functions.https.HttpsError(
          'internal',
          'Invalid response format from OpenAI'
        );
      }

      const results = JSON.parse(completion.choices[0].message.content);
      
      return {
        status: 'completed',
        data: results,
      };

    } else {
      // Translation project
      const translations = [];

      for (const language of data.languages!) {
        const messages: OpenAIMessage[] = [
          { role: 'system', content: generatePrompts.translate.system(language) },
          { 
            role: 'user', 
            content: generatePrompts.translate.user({
              title: data.name,
              description: data.description,
              targetLanguage: language,
            })
          }
        ];

        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages,
          temperature: 0.7,
          max_tokens: 2000,
        });

        if (!validateResponse(completion)) {
          throw new functions.https.HttpsError(
            'internal',
            `Invalid response format from OpenAI for language: ${language}`
          );
        }

        const result = JSON.parse(completion.choices[0].message.content);
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
    console.error('Error in generateASOContent:', error);
    
    // Handle rate limits
    if (error instanceof Error && error.message.includes('429')) {
      throw new functions.https.HttpsError(
        'resource-exhausted',
        'OpenAI rate limit exceeded. Please try again later.'
      );
    }

    throw new functions.https.HttpsError(
      'internal',
      error instanceof Error ? error.message : 'An unexpected error occurred'
    );
  }
}); 