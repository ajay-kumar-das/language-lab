import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Sparkles, 
  RefreshCcw, 
  Target,
  TrendingUp,
  BookOpen,
  MessageSquare,
  GraduationCap,
  Award,
  Calendar,
  Clock,
  Globe,
  Star,
  Users,
  ArrowRight,
  Trophy,
  Flame,
  Brain,
  Zap,
  ChevronRight
} from 'lucide-react';
import { useAuthContext } from './AuthProvider';
import { useLanguage } from './LanguageProvider';

export function Dashboard() {
  const { user, isLoading } = useAuthContext();
  const { t } = useLanguage();
  
  // Get user display name from real backend data
  const userDisplayName = user ? 
    `${user.firstName} ${user.lastName}`.trim() || user.username || user.email.split('@')[0] : 
    'User';
  
  // Mock data for dashboard stats
  const userStats = {
    currentStreak: 0,
    wordsLearned: 0,
    lessonsCompleted: 0,
    totalXP: 0,
    dailyGoal: 10,
    weeklyProgress: 0
  };

  const recentActivities = [
    {
      id: 1,
      type: 'lesson',
      title: 'Spanish Basics - Greetings',
      progress: 85,
      timeAgo: '2 hours ago',
      color: 'gradient-success'
    },
    {
      id: 2,
      type: 'practice',
      title: 'Restaurant Conversation',
      progress: 60,
      timeAgo: '1 day ago',
      color: 'gradient-blue'
    }
  ];

  const quickActions = [
    {
      id: 'learn',
      title: t('continue_learning') || 'Continue Learning',
      description: t('pick_up_where_left_off') || 'Pick up where you left off',
      icon: <BookOpen className="h-6 w-6" />,
      color: 'gradient-blue',
      route: '/learn'
    },
    {
      id: 'practice',
      title: t('practice_speaking') || 'Practice Speaking',
      description: t('improve_conversation_skills') || 'Improve your conversation skills',
      icon: <MessageSquare className="h-6 w-6" />,
      color: 'gradient-teal',
      route: '/practice'
    },
    {
      id: 'courses',
      title: t('browse_courses') || 'Browse Courses',
      description: t('explore_learning_paths') || 'Explore structured learning paths',
      icon: <GraduationCap className="h-6 w-6" />,
      color: 'gradient-orange',
      route: '/courses'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center page-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--color-primary)' }}></div>
          <h2 className="text-lg font-semibold text-primary">{t('loading_dashboard') || 'Loading Dashboard...'}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 page-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <div className="gradient-dashboard p-2 rounded-xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            {t('welcome_back_name', { name: userDisplayName }) || `Welcome back, ${userDisplayName}!`}
          </h1>
          <p className="text-secondary mt-2">{t('continue_journey') || 'Continue your language learning journey'}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm">{t('words_learned') || 'Words Learned'}</p>
                <p className="text-2xl font-bold text-primary">{userStats.wordsLearned}</p>
              </div>
              <div className="achievement-icon">
                <BookOpen className="h-6 w-6 achievement-icon-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm">{t('lessons_completed') || 'Lessons Completed'}</p>
                <p className="text-2xl font-bold text-primary">{userStats.lessonsCompleted}</p>
              </div>
              <div className="achievement-icon">
                <GraduationCap className="h-6 w-6 achievement-icon-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm">{t('current_streak') || 'Current Streak'}</p>
                <p className="text-2xl font-bold text-primary">{userStats.currentStreak}</p>
              </div>
              <div className="achievement-icon">
                <Flame className="h-6 w-6 achievement-icon-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm">{t('total_xp') || 'Total XP'}</p>
                <p className="text-2xl font-bold text-primary">{userStats.totalXP}</p>
              </div>
              <div className="achievement-icon">
                <Award className="h-6 w-6 achievement-icon-purple" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Goal Card */}
      <Card className="card">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            {t('todays_goal') || "Today's Goal"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-secondary">{t('learn_words_goal', { count: userStats.dailyGoal }) || `Learn ${userStats.dailyGoal} new words`}</span>
            <span className="text-sm text-secondary">{userStats.wordsLearned}/{userStats.dailyGoal}</span>
          </div>
          <Progress value={(userStats.wordsLearned / userStats.dailyGoal) * 100} className="h-2" />
          <Link to="/learn">
            <Button className="w-full gradient-learning hover:opacity-90">
              <Sparkles className="h-4 w-4 mr-2" />
              {t('start_learning') || 'Start Learning'}
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <Link key={action.id} to={action.route}>
            <Card className="card hover:card-elevated transition-all duration-300 hover:scale-105 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${action.color} p-3 rounded-xl text-primary`}>
                    {action.icon}
                  </div>
                  <ChevronRight className="h-5 w-5 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">{action.title}</h3>
                <p className="text-secondary text-sm">{action.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="card">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            {t('recent_activity') || 'Recent Activity'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 content-background opacity-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="achievement-icon">
                    {activity.type === 'lesson' ? (
                      <BookOpen className="h-4 w-4 achievement-icon-primary" />
                    ) : (
                      <MessageSquare className="h-4 w-4 achievement-icon-success" />
                    )}
                  </div>
                  <div>
                    <p className="text-primary font-medium">{activity.title}</p>
                    <p className="text-secondary text-sm">{activity.timeAgo}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-primary font-semibold">{activity.progress}%</p>
                  <Progress value={activity.progress} className="h-1 w-16" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted mx-auto mb-3" />
              <p className="text-secondary">{t('no_recent_activity') || 'No recent activity'}</p>
              <p className="text-muted text-sm">{t('start_learning_to_see_progress') || 'Start learning to see your progress here'}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
