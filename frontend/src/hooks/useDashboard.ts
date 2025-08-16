import { useState, useEffect, useCallback } from 'react';
import { dashboardService, DashboardStats, RecentActivity, ProgressData, UserGoals } from '../services/dashboardService';

interface UseDashboardResult {
  stats: DashboardStats | null;
  activities: RecentActivity[];
  progressData: ProgressData[];
  goals: UserGoals | null;
  loading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
  refreshActivities: () => Promise<void>;
  updateStreak: () => Promise<void>;
  updateGoals: (goals: Partial<UserGoals>) => Promise<void>;
}

export const useDashboard = (): UseDashboardResult => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [goals, setGoals] = useState<UserGoals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshStats = useCallback(async () => {
    try {
      setError(null);
      const dashboardStats = await dashboardService.getDashboardStats();
      setStats(dashboardStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard stats');
      console.error('Dashboard stats error:', err);
    }
  }, []);

  const refreshActivities = useCallback(async () => {
    try {
      setError(null);
      const recentActivities = await dashboardService.getRecentActivities(10);
      setActivities(recentActivities);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recent activities');
      console.error('Recent activities error:', err);
    }
  }, []);

  const loadProgressData = useCallback(async () => {
    try {
      const progress = await dashboardService.getProgressData(30);
      setProgressData(progress);
    } catch (err) {
      console.error('Progress data error:', err);
      // Don't set error for progress data as it's not critical
    }
  }, []);

  const loadGoals = useCallback(async () => {
    try {
      const userGoals = await dashboardService.getUserGoals();
      setGoals(userGoals);
    } catch (err) {
      console.error('Goals error:', err);
      // Set default goals if loading fails
      setGoals({
        dailyGoal: 10,
        weeklyGoal: 70,
        monthlyGoal: 300
      });
    }
  }, []);

  const updateStreak = useCallback(async () => {
    try {
      setError(null);
      const newStreak = await dashboardService.updateStreak();
      
      // Update the current stats with the new streak
      if (stats) {
        setStats({
          ...stats,
          learning: {
            ...stats.learning,
            currentStreak: newStreak
          }
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update streak');
      console.error('Update streak error:', err);
    }
  }, [stats]);

  const updateGoals = useCallback(async (newGoals: Partial<UserGoals>) => {
    try {
      setError(null);
      const updatedGoals = await dashboardService.updateUserGoals(newGoals);
      setGoals(updatedGoals);
      
      // Refresh stats to get updated progress
      await refreshStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update goals');
      console.error('Update goals error:', err);
    }
  }, [refreshStats]);

  // Initial data loading
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Load critical data first
        await Promise.all([
          refreshStats(),
          refreshActivities(),
          loadGoals()
        ]);
        
        // Load progress data in background
        loadProgressData();
      } catch (err) {
        console.error('Dashboard initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [refreshStats, refreshActivities, loadGoals, loadProgressData]);

  // Auto-refresh stats every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshStats();
      refreshActivities();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [refreshStats, refreshActivities]);

  return {
    stats,
    activities,
    progressData,
    goals,
    loading,
    error,
    refreshStats,
    refreshActivities,
    updateStreak,
    updateGoals
  };
};

// Hook for just dashboard stats (lighter weight)
export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshStats = useCallback(async () => {
    try {
      setError(null);
      const dashboardStats = await dashboardService.getDashboardStats();
      setStats(dashboardStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard stats');
      console.error('Dashboard stats error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  return {
    stats,
    loading,
    error,
    refreshStats
  };
};