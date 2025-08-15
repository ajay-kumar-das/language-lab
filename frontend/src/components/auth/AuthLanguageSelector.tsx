import React from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useAuthLanguage } from './AuthLanguageProvider';
import { APP_INTERFACE_LANGUAGES, getLanguageDisplayName } from '../../constants/languages';

export function AuthLanguageSelector() {
  const { currentLanguage, setLanguage, t } = useAuthLanguage();

  return (
    <div className="absolute top-4 right-4">
      <div className="relative">
        <select
          value={currentLanguage}
          onChange={(e) => setLanguage(e.target.value)}
          className="appearance-none bg-gray-700/80 backdrop-blur-sm border border-gray-600 rounded-lg px-3 py-2 pr-8 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors cursor-pointer"
          aria-label={t('language_selector')}
        >
          {APP_INTERFACE_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.name} className="bg-gray-700">
              {getLanguageDisplayName(lang)}
            </option>
          ))}
        </select>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
}