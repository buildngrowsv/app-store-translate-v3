/**
 * File: languages.ts
 * Description: Comprehensive language configuration for the translation app
 * Details: Contains language metadata including ISO codes, native names, RTL support, and language families
 * Date: 2024-02-07
 */

export interface Language {
  code: string;          // ISO 639-1 code
  name: string;          // English name
  nativeName: string;    // Name in the language itself
  isRTL: boolean;        // Right-to-left script
  family: string;        // Language family
  popularity: number;    // Global ranking (1 being most popular)
}

export const languages: Language[] = [
  // Most popular languages first
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    isRTL: false,
    family: 'Indo-European',
    popularity: 1
  },
  {
    code: 'zh',
    name: 'Chinese (Mandarin)',
    nativeName: '中文',
    isRTL: false,
    family: 'Sino-Tibetan',
    popularity: 2
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    isRTL: false,
    family: 'Indo-European',
    popularity: 3
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    isRTL: true,
    family: 'Afroasiatic',
    popularity: 4
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    isRTL: false,
    family: 'Indo-European',
    popularity: 5
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    isRTL: false,
    family: 'Indo-European',
    popularity: 6
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    isRTL: false,
    family: 'Japonic',
    popularity: 7
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    isRTL: false,
    family: 'Indo-European',
    popularity: 8
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    isRTL: false,
    family: 'Indo-European',
    popularity: 9
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    isRTL: false,
    family: 'Koreanic',
    popularity: 10
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    isRTL: false,
    family: 'Indo-European',
    popularity: 11
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    isRTL: false,
    family: 'Indo-European',
    popularity: 12
  },
  {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    isRTL: false,
    family: 'Turkic',
    popularity: 13
  },
  {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    isRTL: false,
    family: 'Austroasiatic',
    popularity: 14
  },
  {
    code: 'th',
    name: 'Thai',
    nativeName: 'ไทย',
    isRTL: false,
    family: 'Kra-Dai',
    popularity: 15
  },
  {
    code: 'fa',
    name: 'Persian (Farsi)',
    nativeName: 'فارسی',
    isRTL: true,
    family: 'Indo-European',
    popularity: 16
  },
  {
    code: 'pl',
    name: 'Polish',
    nativeName: 'Polski',
    isRTL: false,
    family: 'Indo-European',
    popularity: 17
  },
  {
    code: 'uk',
    name: 'Ukrainian',
    nativeName: 'Українська',
    isRTL: false,
    family: 'Indo-European',
    popularity: 18
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    isRTL: true,
    family: 'Indo-European',
    popularity: 19
  },
  {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    isRTL: false,
    family: 'Indo-European',
    popularity: 20
  }
];

// Helper functions for language operations
export const getLanguageByCode = (code: string): Language | undefined => 
  languages.find(lang => lang.code === code);

export const getLanguageByName = (name: string): Language | undefined =>
  languages.find(lang => lang.name === name);

export const getRTLLanguages = (): Language[] =>
  languages.filter(lang => lang.isRTL);

export const getLanguagesByFamily = (family: string): Language[] =>
  languages.filter(lang => lang.family === family);

export const sortLanguagesByPopularity = (): Language[] =>
  [...languages].sort((a, b) => a.popularity - b.popularity);

// Get all unique language families
export const getLanguageFamilies = (): string[] =>
  Array.from(new Set(languages.map(lang => lang.family)));