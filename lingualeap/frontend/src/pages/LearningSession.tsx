import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import VocabularyCard from '../components/VocabularyCard';

interface Phrase {
  id: string;
  textNativeLanguage: string;
  textTargetLanguage: string;
  phoneticTranscription?: string;
  imageUrl?: string;
  usageContext?: string;
  usageExample?: string;
  type: 'word' | 'sentence';
  nativeLanguageCode: string;
  targetLanguageCode: string;
}

const LearningSession: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get learning parameters from navigation state
  const { nativeLanguage, targetLanguage, topic, type } = location.state || {};

  const getLanguageName = (code: string) => {
    const languageNames: { [key: string]: string } = {
      'es': 'Spanish', 'fr': 'French', 'de': 'German', 'it': 'Italian', 'pt': 'Portuguese',
      'ja': 'Japanese', 'ko': 'Korean', 'zh': 'Chinese', 'en': 'English', 'hi': 'Hindi',
      'bn': 'Bengali', 'te': 'Telugu', 'mr': 'Marathi', 'ta': 'Tamil', 'gu': 'Gujarati',
      'kn': 'Kannada', 'ml': 'Malayalam', 'pa': 'Punjabi'
    };
    return languageNames[code] || code;
  };

  useEffect(() => {
    if (!targetLanguage || !topic || !type) {
      navigate('/learn');
      return;
    }
    
    generateVocabulary();
  }, [targetLanguage, topic, type]);

  const generateVocabulary = async () => {
    setIsLoading(true);
    try {
      // Simple mock data that works
      const mockPhrases: Phrase[] = [
        {
          id: '1',
          textNativeLanguage: 'Hello',
          textTargetLanguage: 'Bonjour',
          phoneticTranscription: '/bon.ˈʒuʁ/',
          usageContext: 'Greetings',
          usageExample: 'Bonjour! Comment ça va?',
          type: type as 'word' | 'sentence',
          nativeLanguageCode: nativeLanguage,
          targetLanguageCode: targetLanguage,
          imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200&h=200&fit=crop'
        },
        {
          id: '2',
          textNativeLanguage: 'Thank you',
          textTargetLanguage: 'Merci',
          phoneticTranscription: '/mer.ˈsi/',
          usageContext: 'Greetings',
          usageExample: 'Merci beaucoup!',
          type: type as 'word' | 'sentence',
          nativeLanguageCode: nativeLanguage,
          targetLanguageCode: targetLanguage,
        },
        {
          id: '3',
          textNativeLanguage: 'Good morning',
          textTargetLanguage: 'Bon matin',
          phoneticTranscription: '/bon ma.ˈtɛ̃/',
          usageContext: 'Greetings',
          usageExample: 'Bon matin! Ça va bien?',
          type: type as 'word' | 'sentence',
          nativeLanguageCode: nativeLanguage,
          targetLanguageCode: targetLanguage,
        }
      ];

      setPhrases(mockPhrases);
    } catch (error) {
      console.error('Error generating vocabulary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < phrases.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Session complete - return to learn page with completion message
      navigate('/learn', { 
        state: { 
          completed: true, 
          wordsLearned: phrases.length,
          topic: topic,
          language: getLanguageName(targetLanguage)
        }
      });
    }
  };

  const handleSpeak = (text: string, language: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language based on the language code
      const languageMap: { [key: string]: string } = {
        'fr': 'fr-FR',
        'es': 'es-ES',
        'de': 'de-DE',
        'it': 'it-IT',
        'pt': 'pt-PT',
        'ja': 'ja-JP',
        'ko': 'ko-KR',
        'zh': 'zh-CN',
        'hi': 'hi-IN',
        'bn': 'bn-IN',
        'te': 'te-IN',
        'mr': 'mr-IN',
        'ta': 'ta-IN',
        'gu': 'gu-IN',
        'kn': 'kn-IN',
        'ml': 'ml-IN',
        'pa': 'pa-IN',
        'en': 'en-US'
      };

      utterance.lang = languageMap[language] || 'en-US';
      utterance.rate = 0.8; // Slightly slower for learning
      utterance.pitch = 1.0;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing your lesson...</p>
        </div>
      </div>
    );
  }

  if (phrases.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No vocabulary available for this topic.</p>
          <button
            onClick={() => navigate('/learn')}
            className="btn-primary"
          >
            Choose Different Topic
          </button>
        </div>
      </div>
    );
  }

  const currentPhrase = phrases[currentIndex];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/learn')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          
          <h1 className="text-2xl font-bold text-gray-900">
            {getLanguageName(targetLanguage)} - {topic}
          </h1>
          
          <button
            onClick={generateVocabulary}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{type === 'word' ? 'Word' : 'Sentence'} {currentIndex + 1} of {phrases.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / phrases.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Vocabulary Card */}
      <VocabularyCard
        id={currentPhrase.id}
        nativeText={currentPhrase.textNativeLanguage}
        targetText={currentPhrase.textTargetLanguage}
        phonetic={currentPhrase.phoneticTranscription}
        imageUrl={currentPhrase.imageUrl}
        usageContext={currentPhrase.usageContext}
        usageExample={currentPhrase.usageExample}
        type={currentPhrase.type}
        nativeLanguage={currentPhrase.nativeLanguageCode}
        targetLanguage={currentPhrase.targetLanguageCode}
        onNext={handleNext}
        onSpeak={handleSpeak}
      />
    </div>
  );
};

export default LearningSession;