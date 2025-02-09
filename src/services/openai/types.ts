export interface GenerateDescriptionParams {
  appName: string;
  description: string;
  keywords?: string;
}

export interface TranslateContentParams {
  title: string;
  description: string;
  targetLanguage: string;
}

export interface GeneratedContent {
  titles: string[];
  descriptions: string[];
}

export interface TranslatedContent {
  title: string;
  description: string;
}

export interface ProjectResults {
  status: 'completed' | 'error';
  data?: GeneratedContent | { translations: (TranslatedContent & { language: string })[] };
  error?: string;
}