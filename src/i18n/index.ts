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

export const translations = {
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