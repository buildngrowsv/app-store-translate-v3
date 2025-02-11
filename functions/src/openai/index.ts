/*
* File: functions/src/openai/index.ts
* Description: OpenAI service functions
* Details: Consolidates all OpenAI-related functions
* - Translation function
* - ASO content generation
* - Rate limiting and error handling
* Date: 2024-03-20
*/

import * as functions from 'firebase-functions/v1';
import { OpenAI } from 'openai';
import { openaiLimiter } from '../middleware/rateLimit';
import { generateASOContent } from './aso';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: functions.config().openai.api_key,
});

// Export ASO content generation function
export { generateASOContent };

// Translation function
export const translateText = functions.https.onCall(async (data: { text: string; targetLanguage: string }, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be logged in to use translation'
    );
  }

  // Apply rate limiting
  await openaiLimiter.translation(context);

  try {
    const { text, targetLanguage } = data;

    if (!text || !targetLanguage) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Text and target language are required'
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the following text to ${targetLanguage}. Maintain the tone and style of the original text.`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return {
      translatedText: completion.choices[0].message.content,
      model: completion.model,
    };
  } catch (error) {
    console.error('OpenAI translation error:', error);
    
    // Handle rate limits
    if (error instanceof Error && error.message.includes('429')) {
      throw new functions.https.HttpsError(
        'resource-exhausted',
        'OpenAI rate limit exceeded. Please try again later.'
      );
    }

    throw new functions.https.HttpsError(
      'internal',
      error instanceof Error ? error.message : 'Translation failed'
    );
  }
}); 