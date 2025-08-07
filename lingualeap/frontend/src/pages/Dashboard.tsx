import React from 'react';
import { Zap, Target, Trophy } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">Ready to leap into a new language adventure?</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Daily Streak</p>
              <p className="text-2xl font-bold text-gray-900">5 Days</p>
              <p className="text-xs text-gray-500">Keep it up to unlock rewards!</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Zap className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Words Learned</p>
              <p className="text-2xl font-bold text-gray-900">128</p>
              <p className="text-xs text-gray-500">+12 this week</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">XP Points</p>
              <p className="text-2xl font-bold text-gray-900">1,500 XP</p>
              <p className="text-xs text-gray-500">Level 3: Explorer</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Trophy className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Today's Goal */}
      <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">Today's Goal</h3>
            <p className="text-blue-100">Learn 10 new phrases about ordering food.</p>
          </div>
          <button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors duration-200">
            Start Learning
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Practice</h3>
          <p className="text-gray-600 mb-4">Review words you've learned recently</p>
          <button className="btn-secondary w-full">Review Vocabulary</button>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Speaking Challenge</h3>
          <p className="text-gray-600 mb-4">Practice pronunciation with our AI tutor</p>
          <button className="btn-primary w-full">Start Speaking</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;