import React, { useState } from 'react';
import { ChevronDown, User, Globe } from 'lucide-react';

interface ProfileSetupProps {
  onComplete: (nativeLanguage: string) => void;
  currentNativeLanguage?: string;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete, currentNativeLanguage }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(currentNativeLanguage || '');

  const languages = [
    { name: 'English', code: 'en' },
    { name: 'Hindi', code: 'hi' },
    { name: 'Bengali', code: 'bn' },
    { name: 'Telugu', code: 'te' },
    { name: 'Marathi', code: 'mr' },
    { name: 'Tamil', code: 'ta' },
    { name: 'Gujarati', code: 'gu' },
    { name: 'Kannada', code: 'kn' },
    { name: 'Malayalam', code: 'ml' },
    { name: 'Punjabi', code: 'pa' },
    { name: 'Spanish', code: 'es' },
    { name: 'French', code: 'fr' },
    { name: 'German', code: 'de' },
    { name: 'Italian', code: 'it' },
    { name: 'Portuguese', code: 'pt' },
    { name: 'Japanese', code: 'ja' },
    { name: 'Korean', code: 'ko' },
    { name: 'Chinese', code: 'zh' }
  ];

  const handleSubmit = () => {
    if (selectedLanguage) {
      onComplete(selectedLanguage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
          <p className="text-gray-600">
            Please select your native language to get personalized translations
          </p>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>Your Native Language</span>
            </div>
          </label>
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="">Choose your native language</option>
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedLanguage}
          className={`w-full py-3 px-4 font-medium rounded-lg transition-colors duration-200 ${
            selectedLanguage
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {currentNativeLanguage ? 'Update Language' : 'Complete Setup'}
        </button>
      </div>
    </div>
  );
};

export default ProfileSetup;