import { Project } from '../../../types';
import { generatePrompts } from '../../../services/openai/prompts';

export const onRequestPost = async ({ request, env }) => {
  try {
    // Parse request body
    const project = await request.json() as Project;

    // Validate request
    if (!project || !project.type) {
      return new Response(JSON.stringify({ error: 'Invalid project data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const messages = project.type === 'enhance' ? [
      { role: 'system', content: generatePrompts.enhance.system },
      { 
        role: 'user', 
        content: generatePrompts.enhance.user({
          appName: project.name,
          description: project.description,
          keywords: project.keywords,
        })
      }
    ] : [
      { role: 'system', content: generatePrompts.translate.system(project.languages[0]) },
      { 
        role: 'user', 
        content: generatePrompts.translate.user({
          title: project.name,
          description: project.description,
          targetLanguage: project.languages[0],
        })
      }
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
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
      throw new Error(`OpenAI API failed: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const parsedContent = JSON.parse(data.choices[0].message.content);

    // Format response based on project type
    const results = project.type === 'enhance' ? {
      status: 'completed',
      data: parsedContent,
    } : {
      status: 'completed',
      data: { 
        translations: [{
          language: project.languages[0],
          ...parsedContent,
        }]
      },
    };

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing project:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 
 