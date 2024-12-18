import { getEnvVar } from '../utils/env';

interface Config {
  openai: {
    apiKey?: string;
    model: string;
  };
  app: {
    name: string;
    maxLanguages: number;
  };
}

const config: Config = {
  openai: {
    apiKey: getEnvVar('VITE_OPENAI_API_KEY'),
    model: 'gpt-4',
  },
  app: {
    name: 'ReachMix',
    maxLanguages: 3,
  },
};

export const getConfig = () => config;