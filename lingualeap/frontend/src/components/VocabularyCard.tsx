import React, { useState } from 'react';
import { Volume2, RotateCcw, Eye, EyeOff } from 'lucide-react';

interface VocabularyCardProps {
  id: string;
  nativeText: string;
  targetText: string;
  phonetic?: string;
  imageUrl?: string;
  usageContext?: string;
  usageExample?: string;
  type: 'word' | 'sentence';
  nativeLanguage: string;
  targetLanguage: string;
  onNext: () => void;
  onSpeak: (text: string, language: string) => void;
}

const VocabularyCard: React.FC<VocabularyCardProps> = ({
  nativeText,
  targetText,
  phonetic,
  imageUrl,
  usageContext,
  usageExample,
  type,
  nativeLanguage,
  targetLanguage,
  onNext,
  onSpeak
}) => {
  const [showTranslation, setShowTranslation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = async (text: string, language: string) => {
    setIsPlaying(true);
    onSpeak(text, language);
    // Reset playing state after a short delay
    setTimeout(() => setIsPlaying(false), 1000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {usageContext || 'Vocabulary'} • {type}
          </span>
        </div>
        <button
          onClick={() => setShowTranslation(!showTranslation)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          {showTranslation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span className="text-sm">{showTranslation ? 'Hide Translation' : 'Show Translation'}</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="card">
        {/* Context for sentences */}
        {type === 'sentence' && usageContext && (
          <div className="text-center mb-6">
            <p className="text-gray-600 font-medium mb-4">{usageContext}</p>
            {imageUrl && (
              <div className="w-32 h-32 mx-auto mb-4">
                <img 
                  src={imageUrl} 
                  alt="Context illustration"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        )}

        {/* Target Language Text */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {targetText}
          </h2>
          <p className="text-gray-500 text-sm mb-4">{targetLanguage}</p>
          
          {phonetic && (
            <p className="text-gray-600 text-lg mb-4 font-mono">
              {phonetic}
            </p>
          )}

          {/* Audio Button */}
          <button
            onClick={() => handleSpeak(targetText, targetLanguage)}
            disabled={isPlaying}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isPlaying 
                ? 'bg-blue-100 text-blue-600 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Volume2 className={`h-5 w-5 ${isPlaying ? 'animate-pulse' : ''}`} />
            <span>{isPlaying ? 'Playing...' : 'Listen'}</span>
          </button>
        </div>

        {/* Translation */}
        {showTranslation && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6 border-l-4 border-blue-500">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {nativeText}
            </h3>
            <button
              onClick={() => handleSpeak(nativeText, nativeLanguage)}
              className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
            >
              <Volume2 className="h-4 w-4" />
              <span>Listen</span>
            </button>
          </div>
        )}

        {/* Usage Example */}
        {usageExample && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-700 mb-2">
              {type === 'word' ? 'Usage Example:' : 'When to use:'}
            </h4>
            <p className="text-gray-600 italic">{usageExample}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className="flex-1 btn-secondary flex items-center justify-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Review</span>
          </button>
          <button
            onClick={onNext}
            className="flex-1 btn-primary"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default VocabularyCard;