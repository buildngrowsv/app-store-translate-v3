interface ProjectData {
  type: 'enhance' | 'translate';
  name: string;
  description: string;
  keywords: string;
  language: string;
}

export function generatePrompts(project: ProjectData) {
  if (project.type === 'enhance') {
    const systemPrompt = `You are an expert app store optimization specialist. Your task is to generate compelling app store content that maximizes conversion rates and visibility.

Follow these guidelines:
1. Create content that stands out and drives downloads
2. Use persuasive marketing language that resonates with users
3. Incorporate provided keywords naturally for ASO
4. Follow app store best practices for formatting and length
5. Focus on unique value propositions and benefits
6. Use active voice and engaging tone
7. Include social proof and trust signals
8. End with clear calls-to-action

Respond with a JSON object containing arrays of 'titles' (5) and 'descriptions' (5).`;

    const userPrompt = `Generate 5 optimized variations of app store titles and descriptions for this app:

App Name: ${project.name}
Current Description: ${project.description}
Target Keywords: ${project.keywords}

Requirements:
- Each title should be unique and compelling (max 50 characters)
- Each description should take a different angle (max 4000 characters)
- Naturally incorporate the provided keywords
- Focus on benefits and value proposition
- Use emotional triggers and persuasive language
- Include social proof where relevant
- End with clear calls-to-action

Response Format:
{
  "titles": ["title1", "title2", "title3", "title4", "title5"],
  "descriptions": ["desc1", "desc2", "desc3", "desc4", "desc5"]
}`;

    return { systemPrompt, userPrompt };
  } else {
    const systemPrompt = `You are an expert in ${project.language} localization for app store listings. Your task is to translate and culturally adapt app store content.
    
Follow these guidelines:
1. Maintain the marketing impact in the target language
2. Adapt content for cultural relevance
3. Preserve keywords' search intent
4. Follow app store best practices for the target market
5. Keep the emotional resonance of the original
6. Ensure natural language flow
7. Adapt calls-to-action for the target culture

Respond with a JSON object containing arrays of 'titles' (5) and 'descriptions' (5) in ${project.language}.`;

    const userPrompt = `Translate and culturally adapt these app store listings to ${project.language}:

App Name: ${project.name}
Current Description: ${project.description}
Target Keywords: ${project.keywords}

Requirements:
- Provide 5 title variations that work well in ${project.language}
- Create 5 description variations that resonate with ${project.language} speakers
- Maintain the core message and benefits
- Adapt for local market preferences
- Ensure cultural appropriateness
- Keep the persuasive marketing tone
- Adapt calls-to-action for the target culture

Response Format:
{
  "titles": ["title1", "title2", "title3", "title4", "title5"],
  "descriptions": ["desc1", "desc2", "desc3", "desc4", "desc5"]
}`;

    return { systemPrompt, userPrompt };
  }
}