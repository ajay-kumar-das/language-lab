import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Flame, Brain, Trophy, Target, BookOpen, TrendingUp } from 'lucide-react';
import { useUser } from './UserContext';

export function Dashboard() {
  const { user } = useUser();

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl">Welcome back, {user.name}!</h1>
        <p className="text-muted-foreground">Ready to continue your language learning journey?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Daily Streak</CardTitle>
            <Flame className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{user.dailyStreak} days</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Words Learned</CardTitle>
            <Brain className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{user.wordsLearned}</div>
            <p className="text-xs text-muted-foreground">Vocabulary growing!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">XP Points</CardTitle>
            <Trophy className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{user.xpPoints.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Experience gained</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Courses Completed</CardTitle>
            <BookOpen className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{user.completedCourses.length}</div>
            <p className="text-xs text-muted-foreground">Achievements unlocked</p>
          </CardContent>
        </Card>
      </div>

      {user.totalEarned > 0 && (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <TrendingUp className="h-5 w-5" />
              Course Completion Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-700 dark:text-green-300">${user.totalEarned.toFixed(2)}</div>
            <p className="text-sm text-green-600 dark:text-green-400">
              Total earned from completing courses
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Today's Goal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Continue building your vocabulary with 10 new words today!
          </p>
          <Link to="/learn">
            <Button className="w-full touch-target">Start Learning</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}