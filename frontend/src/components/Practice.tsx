import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  MessageSquare, 
  Mic, 
  Bot, 
  Globe, 
  BarChart3, 
  Sparkles,
  Star,
  Brain,
  Zap,
  Target,
  Clock,
  Users,
  ArrowRight,
  Trophy,
  Play,
  Volume2
} from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { SUPPORTED_LANGUAGES } from '../constants/languages';

export function Practice() {
  const { t } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'conversation' | 'pronunciation'>('conversation');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const conversationTopics = [
    {
      id: "restaurant-conversation",
      title: "Restaurant Conversation",
      level: "Beginner",
      progress: 75,
      description: "Practice ordering food and dining conversations",
      duration: "10 min",
      scenarios: 8,
      difficulty: "Easy",
      color: "gradient-orange",
      icon: <Target className="h-6 w-6 text-primary" />
    },
    {
      id: "job-interview",
      title: "Job Interview",
      level: "Intermediate", 
      progress: 40,
      description: "Master professional interview conversations",
      duration: "15 min",
      scenarios: 12,
      difficulty: "Medium",
      color: "gradient-blue",
      icon: <Users className="h-6 w-6 text-primary" />
    },
    {
      id: "travel-tourism",
      title: "Travel & Tourism",
      level: "Beginner",
      progress: 90,
      description: "Essential travel conversations and phrases",
      duration: "12 min", 
      scenarios: 10,
      difficulty: "Easy",
      color: "gradient-teal",
      icon: <Globe className="h-6 w-6 text-primary" />
    },
    {
      id: "business-meeting",
      title: "Business Meeting",
      level: "Advanced",
      progress: 0,
      description: "Professional business communication skills",
      duration: "20 min",
      scenarios: 15,
      difficulty: "Hard", 
      color: "gradient-purple",
      icon: <Trophy className="h-6 w-6 text-primary" />
    }
  ];

  const pronunciationTopics = [
    {
      id: "phonetic-basics",
      title: "Phonetic Basics",
      level: "Beginner",
      progress: 85,
      description: "Master fundamental sounds and pronunciation",
      duration: "8 min",
      scenarios: 20,
      difficulty: "Easy",
      color: "gradient-practice",
      icon: <Volume2 className="h-6 w-6 text-primary" />
    },
    {
      id: "accent-training",
      title: "Accent Training", 
      level: "Intermediate",
      progress: 55,
      description: "Improve your accent and intonation patterns",
      duration: "15 min",
      scenarios: 25,
      difficulty: "Medium",
      color: "gradient-error",
      icon: <Mic className="h-6 w-6 text-primary" />
    },
    {
      id: "word-stress",
      title: "Word Stress Patterns",
      level: "Intermediate",
      progress: 30,
      description: "Learn proper word stress and rhythm",
      duration: "12 min",
      scenarios: 18,
      difficulty: "Medium",
      color: "gradient-warning",
      icon: <Star className="h-6 w-6 text-primary" />
    },
    {
      id: "advanced-pronunciation",
      title: "Advanced Pronunciation",
      level: "Advanced",
      progress: 0,
      description: "Perfect your pronunciation with advanced techniques",
      duration: "18 min", 
      scenarios: 30,
      difficulty: "Hard",
      color: "gradient-success",
      icon: <Brain className="h-6 w-6 text-primary" />
    }
  ];

  const handleStartPractice = (topicId: string) => {
    if (!selectedLanguage) {
      alert(t('please_select_language') || 'Please select a language first!');
      return;
    }
    console.log(`Starting practice: ${selectedLanguage} - ${activeTab} - ${topicId}`);
    // Navigate to practice session
  };

  const currentTopics = activeTab === 'conversation' ? conversationTopics : pronunciationTopics;

  return (
    <div className="p-6 space-y-6 page-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <div className="gradient-practice p-2 rounded-xl">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            {t('practice')} Speaking
          </h1>
          <p className="text-secondary mt-2">{t('master_conversations_ai') || 'Master conversations and pronunciation with AI-powered practice'}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 border border-purple-400 bg-transparent backdrop-blur-sm rounded-full px-3 py-2">
            <Mic className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">{t('voice_recognition') || 'Voice Recognition'}</span>
          </div>
          <div className="flex items-center gap-2 border border-blue-400 bg-transparent backdrop-blur-sm rounded-full px-3 py-2">
            <Bot className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">{t('ai_feedback') || 'AI Feedback'}</span>
          </div>
          <div className="flex items-center gap-2 border border-green-400 bg-transparent backdrop-blur-sm rounded-full px-3 py-2">
            <BarChart3 className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium text-green-300">{t('realtime_analysis') || 'Real-time Analysis'}</span>
          </div>
          <div className="flex items-center gap-2 border border-orange-400 bg-transparent backdrop-blur-sm rounded-full px-3 py-2">
            <Zap className="h-4 w-4 text-orange-400" />
            <span className="text-sm font-medium text-orange-300">{t('instant_feedback') || 'Instant Feedback'}</span>
          </div>
        </div>
      </div>

      {/* Language Selection */}
      <Card className="card">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-400" />
            {t('choose_practice_language') || 'Choose Your Practice Language'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full px-4 py-3 content-background border rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" style={{ borderColor: 'var(--color-border-primary)' }}
          >
            <option value="">{t('select_language_to_practice') || 'Select a language to practice...'}</option>
            {SUPPORTED_LANGUAGES.map((language) => (
              <option key={language.code} value={language.name}>
                {language.flag} {language.nativeName}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Practice Tabs */}
      <div className="flex space-x-1 content-background p-1 rounded-xl" style={{ border: '1px solid var(--color-border-primary)' }}>
        <button
          onClick={() => setActiveTab('conversation')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'conversation'
              ? 'gradient-practice text-primary shadow-lg'
              : 'text-secondary hover:text-primary hover:content-background'
          }`}
        >
          <MessageSquare className="h-5 w-5" />
          {t('conversation_practice') || 'Conversation Practice'}
        </button>
        <button
          onClick={() => setActiveTab('pronunciation')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'pronunciation'
              ? 'gradient-practice text-primary shadow-lg'
              : 'text-secondary hover:text-primary hover:content-background'
          }`}
        >
          <Volume2 className="h-5 w-5" />
          {t('pronunciation_practice') || 'Pronunciation Practice'}
        </button>
      </div>

      {/* Practice Topics Grid */}
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
                  <div className={`${topic.color} p-3 rounded-xl`}>
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
                    <Play className="h-4 w-4" />
                    {topic.scenarios} scenarios
                  </div>
                  <div className="flex items-center gap-2 text-secondary">
                    <Target className="h-4 w-4" />
                    {topic.difficulty}
                  </div>
                  <div className="flex items-center gap-2 text-secondary">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    4.9
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  className={`w-full ${topic.color} hover:opacity-90 transition-opacity`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartPractice(topic.id);
                  }}
                >
                  {topic.progress > 0 ? (
                    <>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      {t('continue_practice') || 'Continue Practice'}
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      {t('start_practice') || 'Start Practice'}
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
          <p className="text-muted">{t('choose_target_language_practice') || 'Choose your target language from the dropdown above to start practicing'}</p>
        </div>
      )}
    </div>
  );
}
