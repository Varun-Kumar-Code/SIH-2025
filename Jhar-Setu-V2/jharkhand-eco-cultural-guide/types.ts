
export enum MessageAuthor {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export interface Message {
  author: MessageAuthor;
  content: string;
}

export interface RagDocument {
  id: string;
  type: 'site' | 'culture' | 'artisan';
  title: string;
  content: string;
  keywords: string[];
}

export const supportedLanguages = {
  'en-US': 'English',
  'hi-IN': 'हिन्दी', // Hindi
  'te-IN': 'తెలుగు', // Telugu
  'ta-IN': 'தமிழ்', // Tamil
  'bn-IN': 'বাংলা', // Bengali
  'mr-IN': 'मराठी', // Marathi
} as const;

export type LanguageCode = keyof typeof supportedLanguages;
export type LanguageName = typeof supportedLanguages[LanguageCode];
