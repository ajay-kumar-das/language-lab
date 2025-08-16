import { apiClient } from './api/apiClient';

export interface DashboardStats {
  user: {
    id: string;
    name: string;
    email: string;
    nativeLanguage: string;
    level: string;
  };
  learning: {
    currentStreak: number;
    wordsLearned: number;
    lessonsCompleted: number;
    totalXP: number;
    totalLearningTime: number;
    weeklyProgress: number;
  };
  goals: {
    dailyGoal: number;
    dailyProgress: number;
    weeklyGoal: number;
    weeklyProgress: number;
  };
  achievements: {
    totalBadges: number;
    recentBadges: any[];
    nextMilestone: string;
  };
}

export interface RecentActivity {
  id: string;
  type: 'vocabulary' | 'conversation' | 'pronunciation' | 'lesson';
  title: string;
  progress: number;
  completedAt: Date;
  xpEarned: number;
  timeSpent: number;
}

export interface ProgressData {
  date: string;
  xp: number;
  timeSpent: number;
  sessions: number;
}

export interface UserGoals {
  dailyGoal: number;
  weeklyGoal: number;
  monthlyGoal: number;
  preferences?: any;
}

class DashboardService {
  private readonly baseUrl = '/api/v1/dashboard';

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/stats`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw new Error('Failed to load dashboard statistics');
    }
  }

  async getRecentActivities(limit: number = 10): Promise<RecentActivity[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/activities`, {
        params: { limit }
      });
      return response.data.data.map((activity: any) => ({
        ...activity,
        completedAt: new Date(activity.completedAt)
      }));
    } catch (error) {
      console.error('Failed to fetch recent activities:', error);
      throw new Error('Failed to load recent activities');
    }
  }

  async updateStreak(): Promise<number> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/streak`);
      return response.data.data.currentStreak;
    } catch (error) {
      console.error('Failed to update streak:', error);
      throw new Error('Failed to update learning streak');
    }
  }

  async getProgressData(days: number = 30): Promise<ProgressData[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/progress`, {
        params: { days }
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch progress data:', error);
      throw new Error('Failed to load progress data');
    }
  }

  async getUserGoals(): Promise<UserGoals> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/goals`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch user goals:', error);
      throw new Error('Failed to load user goals');
    }
  }

  async updateUserGoals(goals: Partial<UserGoals>): Promise<UserGoals> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/goals`, goals);
      return response.data.data;
    } catch (error) {
      console.error('Failed to update user goals:', error);
      throw new Error('Failed to update user goals');
    }
  }

  // Helper method to format time spent (in minutes)
  formatTimeSpent(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }

  // Helper method to calculate streak emoji
  getStreakEmoji(streak: number): string {
    if (streak >= 30) return '🔥';
    if (streak >= 14) return '⚡';
    if (streak >= 7) return '💪';
    if (streak >= 3) return '🌟';
    if (streak >= 1) return '✨';
    return '🎯';
  }

  // Helper method to get XP milestone progress
  getXPMilestoneProgress(totalXP: number): { current: number; next: number; progress: number; title: string } {
    const milestones = [
      { xp: 100, title: "First Steps" },
      { xp: 500, title: "Getting Started" },
      { xp: 1000, title: "Learning Momentum" },
      { xp: 2500, title: "Dedicated Learner" },
      { xp: 5000, title: "Language Explorer" },
      { xp: 10000, title: "Fluency Seeker" },
      { xp: 25000, title: "Language Master" }
    ];

    let currentMilestone = { xp: 0, title: "Beginner" };
    let nextMilestone = milestones[0];

    for (let i = 0; i < milestones.length; i++) {
      if (totalXP >= milestones[i].xp) {
        currentMilestone = milestones[i];
        nextMilestone = milestones[i + 1] || milestones[i];
      } else {
        nextMilestone = milestones[i];
        break;
      }
    }

    const progress = nextMilestone.xp > currentMilestone.xp 
      ? ((totalXP - currentMilestone.xp) / (nextMilestone.xp - currentMilestone.xp)) * 100
      : 100;

    return {
      current: currentMilestone.xp,
      next: nextMilestone.xp,
      progress: Math.min(progress, 100),
      title: totalXP >= nextMilestone.xp ? nextMilestone.title : currentMilestone.title
    };
  }
}

export const dashboardService = new DashboardService();