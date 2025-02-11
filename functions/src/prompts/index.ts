export const generatePrompts = {
  enhance: {
    system: "You are an expert in app store optimization and copywriting.",
    user: ({ appName, description, keywords }: { appName: string; description: string; keywords?: string }) => `
      Enhance the following app description for the App Store:
      App Name: ${appName}
      Description: ${description}
      ${keywords ? `Target Keywords: ${keywords}` : ''}
    `
  },
  translate: {
    system: (language: string) => `You are a professional translator specializing in ${language} app store content.`,
    user: ({ title, description, targetLanguage }: { title: string; description: string; targetLanguage: string }) => `
      Translate the following app content to ${targetLanguage}:
      Title: ${title}
      Description: ${description}
    `
  }
};

export function validateResponse(response: any): boolean {
  return response?.choices?.[0]?.message?.content != null;
} 