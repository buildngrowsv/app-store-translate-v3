// Prompts for generating app store content
export const generatePrompts = {
  enhance: {
    system: `You are an expert app store optimization specialist. Your task is to generate compelling app store content that maximizes conversion rates and visibility.

Follow these guidelines:
1. Create content that stands out and drives downloads
2. Use persuasive marketing language that resonates with users
3. Incorporate provided keywords naturally for ASO
4. Follow app store best practices for formatting and length
5. Focus on unique value propositions and benefits
6. Use active voice and engaging tone
7. Include social proof and trust signals
8. End with clear calls-to-action

Respond with a JSON object containing arrays of 'titles' (5) and 'descriptions' (5).`,

    user: ({ appName, description, keywords }: { appName: string; description: string; keywords?: string }) => 
`Generate 5 optimized variations of app store titles and descriptions for this app:

App Name: ${appName}
Current Description: ${description}
Target Keywords: ${keywords || 'N/A'}

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
}`
  },

  translate: {
    system: (language: string) => 
`You are an expert translator specializing in app store content and ${language} localization. Your task is to translate the provided content while maintaining marketing effectiveness.

Follow these guidelines:
1. Maintain the marketing impact and persuasive elements
2. Ensure technical accuracy and proper terminology
3. Adapt cultural references for the target market
4. Keep a consistent tone and style
5. Ensure the translation flows naturally in ${language}
6. Preserve SEO value and keywords
7. Adapt calls-to-action for the target market

Respond with a JSON object containing the translated 'title' and 'description'.`,

    user: ({ title, description, targetLanguage }: { title: string; description: string; targetLanguage: string }) => 
`Translate the following app store content into ${targetLanguage}:

Original Title: ${title}
Original Description: ${description}

Requirements:
- Maintain marketing impact and persuasiveness
- Ensure technical accuracy
- Adapt cultural references appropriately
- Keep consistent tone and style
- Make it sound natural in ${targetLanguage}
- Title must be under 50 characters
- Description must be under 4000 characters

Response Format:
{
  "title": "translated title",
  "description": "translated description"
}`
  }
};

export const validateResponse = (response: any): boolean => {
  if (!response?.choices?.[0]?.message?.content) return false;
  
  try {
    const content = JSON.parse(response.choices[0].message.content);
    
    // Validate enhance response
    if ('titles' in content) {
      return Array.isArray(content.titles) && 
             Array.isArray(content.descriptions) &&
             content.titles.length === 5 &&
             content.descriptions.length === 5;
    }
    
    // Validate translate response
    if ('title' in content) {
      return typeof content.title === 'string' &&
             typeof content.description === 'string';
    }

    return false;
  } catch (error) {
    console.error('Response validation error:', error);
    return false;
  }
};