import { PrismaClient } from '@prisma/client';

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
}

export class DashboardStatsService {
  constructor(private prisma: PrismaClient) {}

  async getDashboardStats(userId: string): Promise<DashboardStats> {
    // Get user info
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        nativeLanguage: true,
        currentLevel: true,
        xpPoints: true,
        dailyStreak: true,
        totalLearningTime: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get vocabulary mastery count
    const wordsLearned = await this.prisma.vocabularyMastery.count({
      where: { 
        userId,
        isLearned: true
      }
    });

    // Get completed learning sessions count
    const lessonsCompleted = await this.prisma.learningSession.count({
      where: { 
        userId,
        endedAt: { not: null }
      }
    });

    // Calculate weekly progress (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyXP = await this.prisma.learningSession.aggregate({
      where: {
        userId,
        sessionDate: {
          gte: weekAgo
        }
      },
      _sum: {
        xpEarned: true
      }
    });

    // Calculate daily progress (today)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const dailyXP = await this.prisma.learningSession.aggregate({
      where: {
        userId,
        sessionDate: {
          gte: startOfDay
        }
      },
      _sum: {
        xpEarned: true
      }
    });

    // Mock goals for now - these should come from user preferences
    const dailyGoal = 50; // XP
    const weeklyGoal = 350; // XP

    return {
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`.trim() || 'User',
        email: user.email,
        nativeLanguage: user.nativeLanguage || 'en',
        level: user.currentLevel?.toLowerCase() || 'beginner'
      },
      learning: {
        currentStreak: user.dailyStreak || 0,
        wordsLearned,
        lessonsCompleted,
        totalXP: user.xpPoints || 0,
        totalLearningTime: user.totalLearningTime || 0,
        weeklyProgress: weeklyXP._sum.xpEarned || 0
      },
      goals: {
        dailyGoal,
        dailyProgress: dailyXP._sum.xpEarned || 0,
        weeklyGoal,
        weeklyProgress: weeklyXP._sum.xpEarned || 0
      },
      achievements: {
        totalBadges: 0, // TODO: Implement badges system
        recentBadges: [],
        nextMilestone: this.getNextMilestone(user.xpPoints || 0)
      }
    };
  }

  async getRecentActivities(userId: string, limit: number = 10): Promise<RecentActivity[]> {
    const activities = await this.prisma.learningSession.findMany({
      where: { userId },
      orderBy: { sessionDate: 'desc' },
      take: limit,
      select: {
        id: true,
        sessionType: true,
        topicCovered: true,
        sessionDate: true,
        xpEarned: true,
        timeSpent: true,
        completionRate: true,
        endedAt: true
      }
    });

    return activities.map(activity => ({
      id: activity.id,
      type: this.mapSessionTypeToActivityType(activity.sessionType),
      title: activity.topicCovered || `${activity.sessionType} Session`,
      progress: Math.round((activity.completionRate || 0) * 100),
      completedAt: activity.sessionDate,
      xpEarned: activity.xpEarned || 0,
      timeSpent: activity.timeSpent || 0
    }));
  }

  async updateStreak(userId: string): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { dailyStreak: true, lastActive: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActivity = user.lastActive ? new Date(user.lastActive) : null;
    lastActivity?.setHours(0, 0, 0, 0);

    let newStreak = user.dailyStreak || 0;

    if (!lastActivity || lastActivity.getTime() < today.getTime()) {
      // First activity today or missed days
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastActivity && lastActivity.getTime() === yesterday.getTime()) {
        // Consecutive day
        newStreak += 1;
      } else {
        // New streak starts
        newStreak = 1;
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          dailyStreak: newStreak,
          lastActive: new Date()
        }
      });
    }

    return newStreak;
  }

  async getProgressData(userId: string, days: number = 30): Promise<ProgressData[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const activities = await this.prisma.learningSession.findMany({
      where: {
        userId,
        sessionDate: {
          gte: startDate
        }
      },
      select: {
        sessionDate: true,
        xpEarned: true,
        timeSpent: true
      }
    });

    // Group by date
    const progressByDate = new Map<string, ProgressData>();

    activities.forEach(activity => {
      const date = activity.sessionDate.toISOString().split('T')[0];
      const existing = progressByDate.get(date);

      if (existing) {
        existing.xp += activity.xpEarned || 0;
        existing.timeSpent += activity.timeSpent || 0;
        existing.sessions += 1;
      } else {
        progressByDate.set(date, {
          date,
          xp: activity.xpEarned || 0,
          timeSpent: activity.timeSpent || 0,
          sessions: 1
        });
      }
    });

    return Array.from(progressByDate.values()).sort((a, b) => a.date.localeCompare(b.date));
  }

  async getUserGoals(userId: string): Promise<UserGoals> {
    // For now, return default goals
    // In the future, this should come from user preferences
    return {
      dailyGoal: 50,
      weeklyGoal: 350,
      monthlyGoal: 1500
    };
  }

  async updateUserGoals(userId: string, goals: Partial<UserGoals>): Promise<UserGoals> {
    // For now, just return the updated goals
    // In the future, this should update user preferences in the database
    const currentGoals = await this.getUserGoals(userId);
    
    return {
      ...currentGoals,
      ...goals
    };
  }

  private mapSessionTypeToActivityType(sessionType: string): 'vocabulary' | 'conversation' | 'pronunciation' | 'lesson' {
    switch (sessionType) {
      case 'VOCABULARY':
        return 'vocabulary';
      case 'CONVERSATION':
        return 'conversation';
      case 'PRONUNCIATION':
        return 'pronunciation';
      default:
        return 'lesson';
    }
  }

  private getNextMilestone(totalXP: number): string {
    const milestones = [
      { xp: 100, title: "First Steps" },
      { xp: 500, title: "Getting Started" },
      { xp: 1000, title: "Learning Momentum" },
      { xp: 2500, title: "Dedicated Learner" },
      { xp: 5000, title: "Language Explorer" },
      { xp: 10000, title: "Fluency Seeker" },
      { xp: 25000, title: "Language Master" }
    ];

    for (const milestone of milestones) {
      if (totalXP < milestone.xp) {
        return milestone.title;
      }
    }

    return "Language Master";
  }
}