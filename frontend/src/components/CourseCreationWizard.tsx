import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Globe,
  BookOpen,
  Target,
  Heart,
  Briefcase,
  Plane,
  GraduationCap,
  Users,
  Clock,
  Loader2,
  Star,
  Play
} from 'lucide-react';
import { toast } from 'sonner';

// Types and interfaces
interface WizardData {
  step: number;
  language: {
    target: string;
    native: string;
  };
  goals: {
    primary: string;
    secondary: string[];
  };
  motivation: {
    description: string;
    timeCommitment: {
      daily: number;
      weekly: number;
    };
    proficiencyLevel: string;
  };
  preferences: {
    learningStyle: string[];
    scenarios: string[];
    interests: string[];
  };
  generatedCourse?: any;
}

const STEPS = [
  { id: 1, title: 'Language', description: 'Select your languages' },
  { id: 2, title: 'Goals', description: 'Define your objectives' },
  { id: 3, title: 'Motivation', description: 'Tell us more about you' },
  { id: 4, title: 'Generation', description: 'AI creates your course' },
  { id: 5, title: 'Review', description: 'Customize your course' }
];

const LANGUAGES = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸', learners: '2.8M+' },
  { code: 'fr', name: 'French', flag: '🇫🇷', learners: '2.1M+' },
  { code: 'de', name: 'German', flag: '🇩🇪', learners: '1.5M+' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', learners: '1.2M+' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', learners: '950K+' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', learners: '1.8M+' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', learners: '800K+' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', learners: '1.3M+' }
];

const LEARNING_GOALS = [
  {
    id: 'TRAVEL',
    title: 'Travel & Tourism',
    description: 'Communicate confidently while traveling',
    icon: Plane,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'BUSINESS',
    title: 'Business & Professional',
    description: 'Excel in international business',
    icon: Briefcase,
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'ACADEMIC',
    title: 'Academic Study',
    description: 'Succeed in educational settings',
    icon: GraduationCap,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'PERSONAL_GROWTH',
    title: 'Personal Enrichment',
    description: 'Expand your cultural horizons',
    icon: Heart,
    color: 'from-pink-500 to-rose-500'
  }
];

export function CourseCreationWizard({ onClose, onComplete }: { 
  onClose: () => void; 
  onComplete: (course: any) => void; 
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [wizardData, setWizardData] = useState<WizardData>({
    step: 1,
    language: { target: '', native: 'en' },
    goals: { primary: '', secondary: [] },
    motivation: {
      description: '',
      timeCommitment: { daily: 30, weekly: 210 },
      proficiencyLevel: 'BEGINNER'
    },
    preferences: {
      learningStyle: [],
      scenarios: [],
      interests: []
    }
  });

  const updateWizardData = (updates: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates, step: currentStep }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleLanguageSelect = (targetLang: string) => {
    updateWizardData({
      language: { ...wizardData.language, target: targetLang }
    });
  };

  const handleGoalSelect = (goalId: string) => {
    updateWizardData({
      goals: { ...wizardData.goals, primary: goalId }
    });
  };

  const startCourseGeneration = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    // Simulate API call
    setTimeout(() => {
      setGenerationProgress(100);
      updateWizardData({ 
        generatedCourse: {
          id: 'course_' + Date.now(),
          title: 'Personalized ' + LANGUAGES.find(l => l.code === wizardData.language.target)?.name + ' Course',
          description: 'A customized course for ' + wizardData.goals.primary.toLowerCase() + ' purposes',
          modules: [
            { title: 'Foundation Basics', lessons: 12, duration: '2 weeks' },
            { title: 'Practical Conversations', lessons: 15, duration: '3 weeks' }
          ],
          estimatedDuration: '5 weeks',
          totalLessons: 27
        }
      });
      setIsGenerating(false);
      nextStep();
      clearInterval(interval);
    }, 2000);
  };

  const handleComplete = () => {
    if (wizardData.generatedCourse) {
      onComplete(wizardData.generatedCourse);
      toast.success('Course created successfully!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Create Your Course</h1>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>
        </div>
        
        <div className="p-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Globe className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Choose Your Language</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {LANGUAGES.map((language) => (
                  <Card 
                    key={language.code}
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => handleLanguageSelect(language.code)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3">{language.flag}</div>
                      <h4 className="font-semibold text-lg">{language.name}</h4>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Target className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Learning Goal</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {LEARNING_GOALS.map((goal) => {
                  const IconComponent = goal.icon;
                  return (
                    <Card 
                      key={goal.id}
                      className="cursor-pointer transition-all hover:scale-105"
                      onClick={() => handleGoalSelect(goal.id)}
                    >
                      <CardContent className="p-6">
                        <IconComponent className="h-12 w-12 text-blue-500 mb-4" />
                        <h4 className="font-semibold text-lg mb-2">{goal.title}</h4>
                        <p className="text-gray-600">{goal.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Heart className="h-16 w-16 text-pink-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold">Tell Us About You</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="motivation">What motivates you?</Label>
                  <Textarea
                    id="motivation"
                    placeholder="Tell us about your goals..."
                    value={wizardData.motivation.description}
                    onChange={(e) => updateWizardData({
                      motivation: { ...wizardData.motivation, description: e.target.value }
                    })}
                    className="min-h-32"
                  />
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 4 && (
            <div className="text-center space-y-8">
              <Sparkles className="h-16 w-16 text-purple-500 mx-auto animate-pulse" />
              <h3 className="text-xl font-semibold">Creating Your Course</h3>
              <Progress value={generationProgress} className="h-3 max-w-md mx-auto" />
              {!isGenerating && generationProgress === 0 && (
                <Button onClick={startCourseGeneration} size="lg">
                  Generate My Course
                </Button>
              )}
            </div>
          )}
          
          {currentStep === 5 && wizardData.generatedCourse && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Star className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold">Course Ready!</h3>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>{wizardData.generatedCourse.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{wizardData.generatedCourse.description}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t p-6">
          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
              Previous
            </Button>
            {currentStep < 4 && (
              <Button onClick={nextStep}>Next</Button>
            )}
            {currentStep === 4 && generationProgress === 100 && (
              <Button onClick={nextStep}>Review Course</Button>
            )}
            {currentStep === 5 && (
              <Button onClick={handleComplete}>Create Course</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
