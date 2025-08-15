import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient, UserLevel, LearningMotivation } from "@prisma/client";
import { authMiddleware, TokenManager } from "../middleware/auth";
import { userCache, invalidateCache, statsCache } from "../middleware/cache.middleware";
import redisService from "../services/redis.service";

const router = express.Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authMiddleware);

// Update user profile (with cache invalidation)
router.put("/profile", 
  invalidateCache((req) => [
    `user:profile:${req.user?.userId}`,
    `user:${req.user?.userId}:*`,
    `session:${req.user?.userId}:*`
  ]),
  async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { firstName, lastName, displayName, bio, nativeLanguage, appLanguage } = req.body;

      if (!firstName || !lastName) {
        return res.status(400).json({
          status: "error",
          message: "First name and last name are required"
        });
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          firstName,
          lastName,
          displayName: displayName || null,
          bio: bio || null,
          nativeLanguage: nativeLanguage || undefined,
          appLanguage: appLanguage || undefined
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          displayName: true,
          bio: true,
          email: true,
          nativeLanguage: true,
          appLanguage: true
        }
      });

      res.status(200).json({
        status: "success",
        message: "Profile updated successfully",
        data: { user: updatedUser }
      });

    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error while updating profile"
      });
    }
  }
);

// Update language settings (with cache invalidation)
router.put("/language-settings",
  invalidateCache((req) => [
    `user:${req.user?.userId}:*`,
    `vocab:*:${req.body.targetLanguage}`,
    `vocab:*:user:${req.user?.userId}`
  ]),
  async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { nativeLanguage, targetLanguage, currentLevel } = req.body;

      if (!nativeLanguage || !targetLanguage) {
        return res.status(400).json({
          status: "error",
          message: "Native language and target language are required"
        });
      }

      // Validate user level if provided
      const validLevels = Object.values(UserLevel);
      if (currentLevel && !validLevels.includes(currentLevel)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid user level"
        });
      }

      const updateData: any = {
        nativeLanguage,
        targetLanguage
      };

      if (currentLevel) {
        updateData.currentLevel = currentLevel;
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          nativeLanguage: true,
          targetLanguage: true,
          currentLevel: true
        }
      });

      res.status(200).json({
        status: "success",
        message: "Language settings updated successfully",
        data: { user: updatedUser }
      });

    } catch (error) {
      console.error("Update language settings error:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error while updating language settings"
      });
    }
  }
);

// Get user goals (cached)
router.get("/goals", userCache(900), async (req, res) => {
  try {
    const userId = req.user?.userId;

    const userGoals = await prisma.userGoals.findUnique({
      where: { userId }
    });

    res.status(200).json({
      status: "success",
      data: { goals: userGoals }
    });

  } catch (error) {
    console.error("Get goals error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error while fetching goals"
    });
  }
});

// Create/Update user goals (with cache invalidation)
router.post("/goals",
  invalidateCache((req) => [
    `user:${req.user?.userId}:*`,
    `stats:${req.user?.userId}:*`
  ]),
  async (req, res) => {
    try {
      const userId = req.user?.userId;
      const {
        primaryMotivation,
        specificScenarios,
        learningStylePreferences,
        timeCommitmentDaily,
        timeCommitmentWeekly,
        culturalInterests,
        businessContext,
        travelDestinations,
        learningGoalsShortTerm,
        learningGoalsLongTerm
      } = req.body;

      if (!primaryMotivation) {
        return res.status(400).json({
          status: "error",
          message: "Primary motivation is required"
        });
      }

      // Validate motivation
      const validMotivations = Object.values(LearningMotivation);
      if (!validMotivations.includes(primaryMotivation)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid learning motivation"
        });
      }

      // Check if goals already exist
      const existingGoals = await prisma.userGoals.findUnique({
        where: { userId }
      });

      const goalData = {
        userId: userId!,
        primaryMotivation,
        specificScenarios: specificScenarios || null,
        learningStylePreferences: learningStylePreferences || {},
        timeCommitmentDaily: timeCommitmentDaily || null,
        timeCommitmentWeekly: timeCommitmentWeekly || null,
        culturalInterests: culturalInterests || null,
        businessContext: businessContext || null,
        travelDestinations: travelDestinations || null,
        learningGoalsShortTerm: learningGoalsShortTerm || null,
        learningGoalsLongTerm: learningGoalsLongTerm || null
      };

      let userGoals;
      if (existingGoals) {
        userGoals = await prisma.userGoals.update({
          where: { userId },
          data: goalData
        });
      } else {
        userGoals = await prisma.userGoals.create({
          data: goalData
        });
      }

      res.status(200).json({
        status: "success",
        message: "Goals saved successfully",
        data: { goals: userGoals }
      });

    } catch (error) {
      console.error("Save goals error:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error while saving goals"
      });
    }
  }
);

// Get user statistics (cached)
router.get("/stats", statsCache(300), async (req, res) => {
  try {
    const userId = req.user?.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        xpPoints: true,
        dailyStreak: true,
        maxStreak: true,
        totalLearningTime: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }

    // Get additional statistics
    const [totalSessions, totalAttempts, averageScore] = await Promise.all([
      prisma.learningSession.count({ where: { userId } }),
      prisma.speakingAttempt.count({ where: { userId } }),
      prisma.speakingAttempt.aggregate({
        where: { userId, overallScore: { not: null } },
        _avg: { overallScore: true }
      })
    ]);

    res.status(200).json({
      status: "success",
      data: {
        stats: {
          ...user,
          totalSessions,
          totalAttempts,
          averageScore: averageScore._avg.overallScore || 0
        }
      }
    });

  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error while fetching statistics"
    });
  }
});

// Get user progress (cached)
router.get("/progress", userCache(600), async (req, res) => {
  try {
    const userId = req.user?.userId;

    const userProgress = await prisma.userProgress.findMany({
      where: { userId }
    });

    res.status(200).json({
      status: "success",
      data: { progress: userProgress }
    });

  } catch (error) {
    console.error("Get progress error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error while fetching progress"
    });
  }
});

// Update user XP (with cache invalidation)
router.put("/xp",
  invalidateCache((req) => [
    `user:${req.user?.userId}:*`,
    `stats:${req.user?.userId}:*`
  ]),
  async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { xpPoints, dailyStreak } = req.body;

      if (typeof xpPoints !== "number" || xpPoints < 0) {
        return res.status(400).json({
          status: "error",
          message: "Valid XP points value is required"
        });
      }

      const updateData: any = { xpPoints };

      if (typeof dailyStreak === "number" && dailyStreak >= 0) {
        updateData.dailyStreak = dailyStreak;
        
        // Update max streak if needed
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { maxStreak: true }
        });

        if (user && dailyStreak > user.maxStreak) {
          updateData.maxStreak = dailyStreak;
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          xpPoints: true,
          dailyStreak: true,
          maxStreak: true
        }
      });

      res.status(200).json({
        status: "success",
        message: "XP updated successfully",
        data: { user: updatedUser }
      });

    } catch (error) {
      console.error("Update XP error:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error while updating XP"
      });
    }
  }
);

// Delete user account (with comprehensive cache cleanup)
router.delete("/account",
  invalidateCache((req) => [
    `user:${req.user?.userId}:*`,
    `stats:${req.user?.userId}:*`,
    `session:${req.user?.userId}:*`,
    `vocab:*:user:${req.user?.userId}`
  ]),
  async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({
          status: "error",
          message: "Password is required to delete account"
        });
      }

      // Get current user
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found"
        });
      }

      // Verify password (only for users with passwords)
      if (!user.password) {
        return res.status(401).json({
          status: "error",
          message: "This account uses Google login. Please use Google Sign-In."
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password!);

      if (!isPasswordValid) {
        return res.status(401).json({
          status: "error",
          message: "Password is incorrect"
        });
      }

      // Clean up user sessions and cache before deletion
      if (redisService.isHealthy()) {
        await TokenManager.invalidateUserSessions(userId!);
        await redisService.invalidateUserCache(userId!);
      }

      // Delete user (cascading deletes will handle related records)
      await prisma.user.delete({
        where: { id: userId }
      });

      res.status(200).json({
        status: "success",
        message: "Account deleted successfully"
      });

    } catch (error) {
      console.error("Delete account error:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error while deleting account"
      });
    }
  }
);

export default router;
