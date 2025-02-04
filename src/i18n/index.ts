import { en } from './translations/en';
import { zh } from './translations/zh';
import { es } from './translations/es';
import { ar } from './translations/ar';
import { pt } from './translations/pt';
import { fr } from './translations/fr';
import { de } from './translations/de';
import { it } from './translations/it';
import { nl } from './translations/nl';
import { pl } from './translations/pl';
import { hi } from './translations/hi';
import { bn } from './translations/bn';
import { ta } from './translations/ta';
import { ja } from './translations/ja';
import { ko } from './translations/ko';

// Translation type definitions
interface TranslationStat {
  value: string;
  label: string;
}

interface TranslationTestimonial {
  content: string;
  author: string;
  role: string;
}

interface TranslationHero {
  title: string;
  subtitle: string;
  startTrial: string;
  login: string;
}

interface TranslationFeatures {
  aiTitle: string;
  aiDesc: string;
  asoTitle: string;
  asoDesc: string;
  globalTitle: string;
  globalDesc: string;
}

interface TranslationComparison {
  title: string;
  before: {
    title: string;
    content: string;
  };
  after: {
    title: string;
    content: string;
  };
}

interface TranslationPricing {
  title: string;
  starter: {
    title: string;
    price: string;
    description: string;
    features: string[];
  };
  growth: {
    title: string;
    price: string;
    description: string;
    features: string[];
  };
  enterprise: {
    title: string;
    price: string;
    description: string;
    features: string[];
  };
}

export interface Translation {
  home: {
    hero: TranslationHero;
    features: TranslationFeatures;
    stats: {
      items: TranslationStat[];
    };
    testimonials: {
      title: string;
      items: TranslationTestimonial[];
    };
    comparison: TranslationComparison;
    pricing: TranslationPricing;
  };
}

export const translations: Record<Language, Translation> = {
  english: en,
  chinese: zh,
  spanish: es,
  arabic: ar,
  portuguese: pt,
  french: fr,
  german: de,
  italian: it,
  dutch: nl,
  polish: pl,
  hindi: hi,
  bengali: bn,
  tamil: ta,
  japanese: ja,
  korean: ko,
};

export type Language = keyof typeof translations;

export const languageMap = {
  english: 'English',
  french: 'Français',
  german: 'Deutsch',
  spanish: 'Español',
  italian: 'Italiano',
  dutch: 'Nederlands',
  polish: 'Polski',
  portuguese: 'Português',
  arabic: 'العربية',
  chinese: '中文',
  hindi: 'हिन्दी',
  bengali: 'বাংলা',
  tamil: 'தமிழ்',
  japanese: '日本語',
  korean: '한국어',
} as const;

export const useTranslation = (lang: Language = 'english') => {
  return translations[lang];
};