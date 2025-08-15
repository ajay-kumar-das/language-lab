import express from 'express';
import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { DashboardStatsService } from '../services/DashboardStatsService';
import redisService from '../services/redis.service';

const router = express.Router();
const dashboardService = new DashboardStatsService(prisma);

// Middleware to get user from auth (simplified for now)
const authMiddleware = async (req: Request, res: Response, next: express.NextFunction) => {
  // For now, get the first user from the database for testing
  // TODO: Implement proper JWT authentication
  try {
    const user = await prisma.user.findFirst({
      select: { id: true, email: true }
    });
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'No users found in database'
      });
    }
    
    req.user = { id: user.id, email: user.email };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Authentication error'
    });
  }
};

// Cache middleware
const userCache = (ttl: number = 300) => {
  return async (req: Request, res: Response, next: express.NextFunction) => {
    if (!redisService.isHealthy()) {
      return next();
    }

    const userId = req.user?.id;
    if (!userId) {
      return next();
    }

    const cacheKey = `dashboard:${req.path}:${userId}`;
    
    try {
      const cached = await redisService.get(cacheKey);
      if (cached) {
        return res.json({
          status: 'success',
          data: cached,
          cached: true,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Cache retrieval error:', error);
    }

    // Store original res.json to intercept response
    const originalJson = res.json;
    res.json = function(data: any) {
      // Cache successful responses
      if (data.status === 'success' && data.data) {
        redisService.set(cacheKey, data.data, { ttl }).catch(console.error);
      }
      return originalJson.call(this, data);
    };

    next();
  };
};

// Get dashboard statistics
router.get('/stats', authMiddleware, userCache(300), async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'User authentication required'
      });
    }

    const stats = await dashboardService.getDashboardStats(userId);
    
    res.json({
      status: 'success',
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve dashboard statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get recent activities
router.get('/activities', authMiddleware, userCache(180), async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'User authentication required'
      });
    }

    const limit = parseInt(req.query.limit as string) || 10;
    const activities = await dashboardService.getRecentActivities(userId, limit);
    
    res.json({
      status: 'success',
      data: activities,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Recent activities error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve recent activities',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update learning streak
router.post('/streak', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'User authentication required'
      });
    }

    const currentStreak = await dashboardService.updateStreak(userId);
    
    // Invalidate cache
    const cacheKeys = [`dashboard:/stats:${userId}`, `dashboard:/activities:${userId}`];
    for (const key of cacheKeys) {
      try {
        await redisService.del(key);
      } catch (error) {
        console.error('Cache invalidation error:', error);
      }
    }
    
    res.json({
      status: 'success',
      data: { currentStreak },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Update streak error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update learning streak',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get progress data
router.get('/progress', authMiddleware, userCache(600), async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'User authentication required'
      });
    }

    const days = parseInt(req.query.days as string) || 30;
    const progress = await dashboardService.getProgressData(userId, days);
    
    res.json({
      status: 'success',
      data: progress,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Progress data error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve progress data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get user goals
router.get('/goals', authMiddleware, userCache(3600), async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'User authentication required'
      });
    }

    const goals = await dashboardService.getUserGoals(userId);
    
    res.json({
      status: 'success',
      data: goals,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('User goals error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve user goals',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update user goals
router.put('/goals', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'User authentication required'
      });
    }

    const goals = await dashboardService.updateUserGoals(userId, req.body);
    
    // Invalidate cache
    const cacheKeys = [`dashboard:/goals:${userId}`, `dashboard:/stats:${userId}`];
    for (const key of cacheKeys) {
      try {
        await redisService.del(key);
      } catch (error) {
        console.error('Cache invalidation error:', error);
      }
    }
    
    res.json({
      status: 'success',
      data: goals,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Update goals error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update user goals',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;