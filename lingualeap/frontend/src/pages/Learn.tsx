import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, ChevronDown, User } from 'lucide-react';

const Learn: React.FC = () => {
  const navigate = useNavigate();
  const [learningType, setLearningType] = useState<'words' | 'sentences'>('words');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [nativeLanguage, setNativeLanguage] = useState('en');

  const languages = [
    { name: 'Spanish', code: 'es' },
    { name: 'French', code: 'fr' },
    { name: 'German', code: 'de' },
    { name: 'Italian', code: 'it' },
    { name: 'Portuguese', code: 'pt' },
    { name: 'Japanese', code: 'ja' },
    { name: 'Korean', code: 'ko' },
    { name: 'Chinese', code: 'zh' },
    { name: 'English', code: 'en' },
    { name: 'Hindi', code: 'hi' },
    { name: 'Bengali', code: 'bn' },
    { name: 'Telugu', code: 'te' },
    { name: 'Marathi', code: 'mr' },
    { name: 'Tamil', code: 'ta' },
    { name: 'Gujarati', code: 'gu' },
    { name: 'Kannada', code: 'kn' },
    { name: 'Malayalam', code: 'ml' },
    { name: 'Punjabi', code: 'pa' }
  ];

  const topics = {
    words: ['Greetings', 'Food & Drink', 'Travel', 'Family', 'Colors', 'Numbers', 'Animals', 'Weather', 'Shopping', 'Body Parts'],
    sentences: ['Ordering Food', 'Asking Directions', 'Hotel Check-in', 'Shopping', 'Meeting People', 'Emergency', 'Business', 'Daily Conversations']
  };

  const handleStartLearning = () => {
    if (!nativeLanguage || !selectedLanguage || !selectedTopic) {
      return;
    }

    navigate('/learning-session', {
      state: {
        nativeLanguage,
        targetLanguage: selectedLanguage,
        topic: selectedTopic,
        type: learningType
      }
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Learn Vocabulary</h1>
        <p className="text-gray-600">Build your foundation with words and sentences.</p>
      </div>

      {/* Learning Path Selection */}
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Globe className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Learning Path</h2>
            <p className="text-gray-600">Select a language and topic to begin your journey</p>
          </div>

          {/* Learning Type Selection */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-3 block">Learning Type</label>
            <div className="flex space-x-4">
              <button
                onClick={() => setLearningType('words')}
                className={`flex-1 p-4 rounded-lg border-2 transition-colors duration-200 ${
                  learningType === 'words'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="font-medium mb-1">Words</div>
                  <div className="text-sm text-gray-500">Individual vocabulary</div>
                </div>
              </button>
              <button
                onClick={() => setLearningType('sentences')}
                className={`flex-1 p-4 rounded-lg border-2 transition-colors duration-200 ${
                  learningType === 'sentences'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="font-medium mb-1">Sentences</div>
                  <div className="text-sm text-gray-500">Full phrases & context</div>
                </div>
              </button>
            </div>
          </div>

          {/* Native Language Selection */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Your Native Language</span>
              </div>
            </label>
            <div className="relative">
              <select
                value={nativeLanguage}
                onChange={(e) => setNativeLanguage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value="">Choose your native language</option>
                {languages.map((lang) => (
                  <option key={`native-${lang.code}`} value={lang.code}>{lang.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Target Language Selection */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-3 block">Language to Learn</label>
            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value="">Choose a language to learn</option>
                {languages.map((lang) => (
                  <option key={`target-${lang.code}`} value={lang.code}>{lang.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Topic Selection */}
          <div className="mb-8">
            <label className="text-sm font-medium text-gray-700 mb-3 block">Topic</label>
            <div className="relative">
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value="">Choose a topic</option>
                {topics[learningType].map((topic) => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartLearning}
            disabled={!nativeLanguage || !selectedLanguage || !selectedTopic}
            className={`w-full py-4 px-6 font-medium rounded-lg transition-colors duration-200 ${
              nativeLanguage && selectedLanguage && selectedTopic
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Start Learning {learningType === 'words' ? 'Words' : 'Sentences'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Learn;