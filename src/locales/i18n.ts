import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import zh from './zh.json';

export const LANGUAGES = [
  { code: 'en', label: 'EN', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'zh', label: '中文', nativeLabel: '中文', flag: '🇨🇳' },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]['code'];

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
