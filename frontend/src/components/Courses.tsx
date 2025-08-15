import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  GraduationCap, 
  Clock, 
  Users, 
  Star, 
  TrendingUp, 
  BookOpen,
  ArrowRight,
  Trophy,
  Sparkles,
  Target,
  Plus
} from 'lucide-react';
import { useLanguage } from './LanguageProvider';

export function Courses() {
  const { t } = useLanguage();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const courses = [
    {
      id: "spanish-beginner",
      title: "Spanish for Beginners",
      level: "Beginner",
      progress: 65,
      description: "Start your Spanish journey with fundamental vocabulary and phrases",
      duration: "4 weeks",
      lessons: 24,
      students: 1200,
      rating: 4.8,
      color: "gradient-success"
    },
    {
      id: "french-intermediate",
      title: "Conversational French",
      level: "Intermediate",
      progress: 32,
      description: "Build confidence in French conversations and grammar",
      duration: "6 weeks",
      lessons: 36,
      students: 850,
      rating: 4.7,
      color: "gradient-blue"
    },
    {
      id: "german-advanced",
      title: "German Business Language",
      level: "Advanced",
      progress: 0,
      description: "Master professional German for business environments",
      duration: "8 weeks",
      lessons: 48,
      students: 420,
      rating: 4.9,
      color: "gradient-purple"
    }
  ];

  return (
    <div className="p-6 space-y-6 page-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <div className="gradient-primary p-2 rounded-xl">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            {t('courses')}
          </h1>
          <p className="text-secondary mt-2">{t('explore_comprehensive_courses')}</p>
        </div>
        <Button className="gradient-primary hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          {t('create_course')}
        </Button>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card 
            key={course.id} 
            className="card hover:card-elevated transition-all duration-300 hover:scale-105 cursor-pointer"
            onClick={() => setSelectedCourse(course.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className={`${course.color} p-3 rounded-xl`}>
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <Badge variant="outline" className="border text-secondary">
                  {course.level}
                </Badge>
              </div>
              <CardTitle className="text-primary text-lg">{course.title}</CardTitle>
              <p className="text-secondary text-sm">{course.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Progress */}
              {course.progress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">Progress</span>
                    <span className="text-primary">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              )}

              {/* Course Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-secondary">
                  <Clock className="h-4 w-4" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-2 text-secondary">
                  <Target className="h-4 w-4" />
                  {course.lessons} lessons
                </div>
                <div className="flex items-center gap-2 text-secondary">
                  <Users className="h-4 w-4" />
                  {course.students} students
                </div>
                <div className="flex items-center gap-2 text-secondary">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  {course.rating}
                </div>
              </div>

              {/* Action Button */}
              <Button 
                className={`w-full ${course.color} hover:opacity-90 transition-opacity text-white`}
              >
                {course.progress > 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    {t('continue_learning')}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {t('start_course')}
                  </>
                )}
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievement Section */}
      <Card className="card">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="gradient-warning p-3 rounded-xl">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary">Course Achievements</h3>
              <p className="text-secondary">Track your learning milestones and celebrate your progress</p>
            </div>
            <Button variant="outline" className="ml-auto gradient-warning text-white hover:opacity-90">
              View All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}