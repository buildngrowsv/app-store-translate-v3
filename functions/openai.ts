import { generatePrompts } from './prompts';

// Define environment interface
interface Env {
  OPENAI_API_KEY: string;
  ENVIRONMENT: string;
}

// Define request interface
interface ProjectRequest {
  type: 'enhance' | 'translate';
  name: string;
  description: string;
  keywords: string;
  language: string;
}

// Define OpenAI response interface
interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// Main worker handler
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const project = await request.json() as ProjectRequest;

      if (!project.type || !project.name || !project.description) {
        return new Response('Missing required fields', { status: 400 });
      }

      // Process keywords
      const keywordList = project.keywords.split(',').map(k => k.trim()).filter(k => k);

      // Generate prompts based on project type
      const { systemPrompt, userPrompt } = generatePrompts(project);

      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI API error: ${error}`);
      }

      const data = await response.json() as OpenAIResponse;
      const content = JSON.parse(data.choices[0].message.content);

      // Return the response with CORS headers
      return new Response(JSON.stringify({
        status: 'completed',
        data: {
          title: content.titles[0],
          subtitle: content.titles[1],
          description: content.descriptions[0],
          keywords: keywordList
        }
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({ 
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        }), 
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  }
}; 