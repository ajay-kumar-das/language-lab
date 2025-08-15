import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Brain, 
  Star, 
  Zap, 
  CheckCircle, 
  Globe, 
  BookOpen,
  ArrowRight,
  Trophy,
  Sparkles,
  Target,
  Clock,
  Users
} from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { SUPPORTED_LANGUAGES } from '../constants/languages';

export function Learn() {
  const { t } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'vocabulary' | 'sentences'>('vocabulary');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const vocabularyTopics = [
    {
      id: "basic-greetings-vocab",
      title: "Basic Greetings",
      level: "Beginner",
      progress: 85,
      description: "Learn essential greeting words and polite expressions",
      duration: "15 min",
      words: 20,
      difficulty: "Easy",
      color: "from-green-500 to-emerald-600",
      icon: <Users className="h-6 w-6 text-primary" />
    },
    {
      id: "food-dining-vocab",
      title: "Food & Dining",
      level: "Beginner",
      progress: 60,
      description: "Master restaurant vocabulary and food-related terms",
      duration: "25 min",
      words: 35,
      difficulty: "Easy",
      color: "from-orange-500 to-red-600",
      icon: <Target className="h-6 w-6 text-primary" />
    },
    {
      id: "travel-vocab",
      title: "Travel & Transportation",
      level: "Intermediate",
      progress: 40,
      description: "Travel vocabulary and transportation terms",
      duration: "30 min",
      words: 45,
      difficulty: "Medium",
      color: "from-blue-500 to-cyan-600",
      icon: <Globe className="h-6 w-6 text-primary" />
    },
    {
      id: "family-vocab",
      title: "Family & Relationships",
      level: "Beginner",
      progress: 0,
      description: "Family member names and relationship terms",
      duration: "20 min",
      words: 30,
      difficulty: "Easy",
      color: "from-pink-500 to-rose-600",
      icon: <Star className="h-6 w-6 text-primary" />
    }
  ];

  const sentenceTopics = [
    {
      id: "conversation-basics",
      title: "Basic Conversations",
      level: "Beginner", 
      progress: 70,
      description: "Practice everyday conversation sentences",
      duration: "20 min",
      sentences: 15,
      difficulty: "Easy",
      color: "gradient-learning",
      icon: <Users className="h-6 w-6 text-primary" />
    },
    {
      id: "restaurant-sentences",
      title: "Restaurant Dialogues",
      level: "Intermediate",
      progress: 45,
      description: "Order food and communicate in restaurants",
      duration: "25 min", 
      sentences: 20,
      difficulty: "Medium",
      color: "from-amber-500 to-orange-600",
      icon: <Target className="h-6 w-6 text-primary" />
    },
    {
      id: "travel-phrases",
      title: "Travel Phrases",
      level: "Intermediate",
      progress: 30,
      description: "Essential sentences for travel situations",
      duration: "30 min",
      sentences: 25,
      difficulty: "Medium", 
      color: "from-emerald-500 to-teal-600",
      icon: <Globe className="h-6 w-6 text-primary" />
    },
    {
      id: "business-communication",
      title: "Business Communication",
      level: "Advanced",
      progress: 0,
      description: "Professional sentences and business phrases",
      duration: "35 min",
      sentences: 30,
      difficulty: "Hard",
      color: "from-violet-500 to-purple-600", 
      icon: <Trophy className="h-6 w-6 text-primary" />
    }
  ];

  const categories = [
    {
      id: 'vocabulary',
      title: 'Vocabulary Learning',
      description: 'Learn individual words and their meanings',
      icon: <BookOpen className="h-6 w-6" />,
      color: 'from-blue-500 to-purple-600',
      topics: vocabularyTopics
    },
    {
      id: 'sentences', 
      title: 'Sentence Practice',
      description: 'Practice complete sentences and conversations',
      icon: <Users className="h-6 w-6" />,
      color: 'from-green-500 to-teal-600',
      topics: sentenceTopics
    }
  ];

  const handleStartLearning = (topicId: string) => {
    if (!selectedLanguage) {
      alert(t('please_select_language') || 'Please select a language first!');
      return;
    }
    console.log(`Starting learning: ${selectedLanguage} - ${activeTab} - ${topicId}`);
    // Navigate to learning session
  };

  const currentTopics = activeTab === 'vocabulary' ? vocabularyTopics : sentenceTopics;

  return (
    <div className="p-6 space-y-6 page-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <div className="gradient-learning p-2 rounded-xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
            {t('learn')} Language
          </h1>
          <p className="text-secondary mt-2">{t('choose_language_master') || 'Choose your language and master vocabulary or sentences'}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 border border-purple-400 bg-transparent backdrop-blur-sm rounded-full px-3 py-2">
            <Globe className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">{t('interactive') || 'Interactive'}</span>
          </div>
          <div className="flex items-center gap-2 border border-blue-400 bg-transparent backdrop-blur-sm rounded-full px-3 py-2">
            <Star className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">{t('visual_learning') || 'Visual Learning'}</span>
          </div>
          <div className="flex items-center gap-2 border border-green-400 bg-transparent backdrop-blur-sm rounded-full px-3 py-2">
            <Brain className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium text-green-300">{t('ai_powered') || 'AI-Powered'}</span>
          </div>
          <div className="flex items-center gap-2 border border-orange-400 bg-transparent backdrop-blur-sm rounded-full px-3 py-2">
            <Zap className="h-4 w-4 text-orange-400" />
            <span className="text-sm font-medium text-orange-300">{t('adaptive') || 'Adaptive'}</span>
          </div>
        </div>
      </div>

      {/* Language Selection */}
      <Card className="card">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-400" />
            {t('choose_learning_language') || 'Choose Your Learning Language'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full px-4 py-3 content-background border rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" style={{ borderColor: 'var(--color-border-primary)' }}
          >
            <option value="">{t('select_language_to_learn') || 'Select a language to learn...'}</option>
            {SUPPORTED_LANGUAGES.map((language) => (
              <option key={language.code} value={language.name}>
                {language.flag} {language.nativeName}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <div className="flex space-x-1 content-background p-1 rounded-xl" style={{ border: '1px solid var(--color-border-primary)' }}>
        <button
          onClick={() => setActiveTab('vocabulary')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'vocabulary'
              ? 'gradient-learning text-primary shadow-lg'
              : 'text-secondary hover:text-primary hover:content-background'
          }`}
        >
          <BookOpen className="h-5 w-5" />
          {t('vocabulary_learning') || 'Vocabulary Learning'}
        </button>
        <button
          onClick={() => setActiveTab('sentences')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'sentences'
              ? 'gradient-learning text-primary shadow-lg'
              : 'text-secondary hover:text-primary hover:content-background'
          }`}
        >
          <Users className="h-5 w-5" />
          {t('sentence_practice') || 'Sentence Practice'}
        </button>
      </div>

      {/* Learning Topics Grid */}
      {selectedLanguage ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentTopics.map((topic) => (
            <Card 
              key={topic.id} 
              className="card hover:card-elevated transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => setSelectedTopic(topic.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className={`bg-gradient-to-r ${topic.color} p-3 rounded-xl`}>
                    {topic.icon}
                  </div>
                  <Badge variant="outline" className="text-secondary" style={{ borderColor: 'var(--color-border-primary)' }}>
                    {topic.level}
                  </Badge>
                </div>
                <CardTitle className="text-primary text-lg">{topic.title}</CardTitle>
                <p className="text-secondary text-sm">{topic.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress */}
                {topic.progress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary">Progress</span>
                      <span className="text-primary">{topic.progress}%</span>
                    </div>
                    <Progress value={topic.progress} className="h-2" />
                  </div>
                )}

                {/* Topic Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-secondary">
                    <Clock className="h-4 w-4" />
                    {topic.duration}
                  </div>
                  <div className="flex items-center gap-2 text-secondary">
                    <BookOpen className="h-4 w-4" />
                    {activeTab === 'vocabulary' ? `${topic.words} words` : `${topic.sentences} sentences`}
                  </div>
                  <div className="flex items-center gap-2 text-secondary">
                    <Target className="h-4 w-4" />
                    {topic.difficulty}
                  </div>
                  <div className="flex items-center gap-2 text-secondary">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    4.8
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  className={`w-full bg-gradient-to-r ${topic.color} hover:opacity-90 transition-opacity`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartLearning(topic.id);
                  }}
                >
                  {topic.progress > 0 ? (
                    <>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      {t('continue_learning') || 'Continue Learning'}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      {t('start_learning') || 'Start Learning'}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Globe className="h-16 w-16 text-muted mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-secondary mb-2">{t('select_language_to_begin') || 'Select a Language to Begin'}</h3>
          <p className="text-muted">{t('choose_target_language') || 'Choose your target language from the dropdown above to start learning'}</p>
        </div>
      )}
    </div>
  );
}
