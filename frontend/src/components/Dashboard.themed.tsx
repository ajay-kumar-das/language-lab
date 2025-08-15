import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Sparkles, Calendar, Clock, Target } from 'lucide-react';
import { useUser } from './UserContext';
import { useTheme } from '../contexts/ThemeContext';

export function Dashboard() {
  const { user } = useUser();
  const { theme } = useTheme(); // Using centralized theme
  
  // Calculate progress for today's goal (0/10 words learned today)
  const todayWordsGoal = 10;
  const todayWordsLearned = 0;
  const progressPercentage = Math.round((todayWordsLearned / todayWordsGoal) * 100);

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background }}>
      {/* Header Section with Theme Gradient */}
      <div 
        className="text-white px-6 py-8 md:px-8 md:py-12"
        style={{
          background: theme.colors.gradients.primary,
          position: 'relative',
        }}
      >
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-6 w-6 text-yellow-300" />
            <h1 
              className="text-2xl md:text-4xl font-bold"
              style={{ color: theme.colors.primaryForeground }}
            >
              Welcome back, {user.name}!
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
