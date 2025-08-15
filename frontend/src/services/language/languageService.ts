import { SUPPORTED_LANGUAGES } from '../types/api.types';

export class LanguageService {
  private static instance: LanguageService;

  public static getInstance(): LanguageService {
    if (!LanguageService.instance) {
      LanguageService.instance = new LanguageService();
    }
    return LanguageService.instance;
  }

  /**
   * Get all supported languages
   */
  getSupportedLanguages() {
    return SUPPORTED_LANGUAGES;
  }

  /**
   * Get language by code
   */
  getLanguageByCode(code: string) {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
  }

  /**
   * Get available target languages (excluding native language)
   */
  getAvailableTargetLanguages(nativeLanguageCode?: string) {
    if (!nativeLanguageCode) return SUPPORTED_LANGUAGES;
    return SUPPORTED_LANGUAGES.filter(lang => lang.code !== nativeLanguageCode);
  }
}

export const languageService = LanguageService.getInstance();
