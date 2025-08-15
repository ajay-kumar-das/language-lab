import express from "express";
import { PrismaClient, SessionType } from "@prisma/client";
import { authMiddleware } from "../middleware/auth";
import { vocabularyCache, searchCache, userCache, invalidateCache, statsCache } from "../middleware/cache.middleware";
import redisService from "../services/redis.service";

const router = express.Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authMiddleware);

// Get vocabulary phrases with filtering and pagination (cached)
router.get("/phrases", vocabularyCache(3600), async (req, res) => {
  try {
    const userId = req.user?.userId;
    const {
      page = "1",
      limit = "20",
      nativeLanguage,
      targetLanguage,
      topic,
      difficultyLevel,
      masteryFilter // "learned", "unlearned", "review"
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {
      isActive: true
    };

    if (nativeLanguage) where.nativeLanguageCode = nativeLanguage;
    if (targetLanguage) where.targetLanguageCode = targetLanguage;
    if (topic) where.topic = topic;
    if (difficultyLevel) where.difficultyLevel = parseInt(difficultyLevel as string);

    // Handle mastery filtering
    if (masteryFilter && userId) {
      if (masteryFilter === "learned") {
        where.vocabularyMastery = {
          some: {
            userId,
            isLearned: true
          }
        };
      } else if (masteryFilter === "unlearned") {
        where.vocabularyMastery = {
          none: {
            userId
          }
        };
      } else if (masteryFilter === "review") {
        where.vocabularyMastery = {
          some: {
            userId,
            nextReview: {
              lte: new Date()
            }
          }
        };
      }
    }

    const [phrases, total] = await Promise.all([
      prisma.phrase.findMany({
        where,
        include: {
          vocabularyMastery: userId ? {
            where: { userId }
          } : false
        },
        skip: offset,
        take: limitNum,
        orderBy: [
          { frequency: "desc" },
          { difficultyLevel: "asc" }
        ]
      }),
      prisma.phrase.count({ where })
    ]);

    res.status(200).json({
      status: "success",
      data: {
        phrases,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          hasMore: offset + limitNum < total
        }
      }
    });

  } catch (error) {
    console.error("Get phrases error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error while fetching phrases"
    });
  }
});

// Get specific phrase details (cached)
router.get("/phrases/:id", vocabularyCache(1800), async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const phrase = await prisma.phrase.findUnique({
      where: { id },
      include: {
        vocabularyMastery: userId ? {
          where: { userId }
        } : false,
        speakingAttempts: userId ? {
          where: { userId },
          orderBy: { attemptDate: "desc" },
          take: 5
        } : false
      }
    });

    if (!phrase) {
      return res.status(404).json({
        status: "error",
        message: "Phrase not found"
      });
    }

    res.status(200).json({
      status: "success",
      data: { phrase }
    });

  } catch (error) {
    console.error("Get phrase error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error while fetching phrase"
    });
  }
});

// Get user vocabulary mastery progress (cached)
router.get("/mastery", userCache(300), async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { targetLanguage, learningPhase } = req.query;

    const where: any = { userId };
    if (targetLanguage) {
      where.phrase = {
        targetLanguageCode: targetLanguage
      };
    }
    if (learningPhase) {
      where.learningPhase = learningPhase;
    }

    const masteryData = await prisma.vocabularyMastery.findMany({
      where,
      include: {
        phrase: {
          select: {
            id: true,
            textNativeLanguage: true,
            textTargetLanguage: true,
            topic: true,
            difficultyLevel: true,
            phoneticTranscription: true,
            audioUrl: true,
            imageUrl: true
          }
        }
      },
      orderBy: [
        { nextReview: "asc" },
        { lastEncountered: "desc" }
      ]
    });

    // Calculate statistics
    const stats = {
      totalWords: masteryData.length,
      learnedWords: masteryData.filter(m => m.isLearned).length,
      averageMastery: masteryData.length > 0 
        ? masteryData.reduce((sum, m) => sum + m.masteryLevel, 0) / masteryData.length 
        : 0,
      wordsForReview: masteryData.filter(m => m.nextReview <= new Date()).length
    };

    res.status(200).json({
      status: "success",
      data: {
        mastery: masteryData,
        statistics: stats
      }
    });

  } catch (error) {
    console.error("Get mastery error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error while fetching mastery data"
    });
  }
});

// Get phrases due for review (cached)
router.get("/review", userCache(60), async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { limit = "10", targetLanguage } = req.query;
    const limitNum = parseInt(limit as string);

    const where: any = {
      userId,
      nextReview: {
        lte: new Date()
      }
    };

    if (targetLanguage) {
      where.phrase = {
        targetLanguageCode: targetLanguage
      };
    }

    const reviewItems = await prisma.vocabularyMastery.findMany({
      where,
      include: {
        phrase: true
      },
      orderBy: [
        { nextReview: "asc" },
        { masteryLevel: "asc" }
      ],
      take: limitNum
    });

    res.status(200).json({
      status: "success",
      data: {
        reviewItems,
        count: reviewItems.length
      }
    });

  } catch (error) {
    console.error("Get review items error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error while fetching review items"
    });
  }
});

// Search phrases (cached)
router.get("/search", searchCache(600), async (req, res) => {
  try {
    const { 
      query, 
      targetLanguage, 
      nativeLanguage, 
      limit = "20" 
    } = req.query;

    if (!query) {
      return res.status(400).json({
        status: "error",
        message: "Search query is required"
      });
    }

    const limitNum = parseInt(limit as string);

    const where: any = {
      isActive: true,
      OR: [
        { textNativeLanguage: { contains: query as string, mode: "insensitive" } },
        { textTargetLanguage: { contains: query as string, mode: "insensitive" } },
        { topic: { contains: query as string, mode: "insensitive" } },
        { usageContext: { contains: query as string, mode: "insensitive" } }
      ]
    };

    if (targetLanguage) where.targetLanguageCode = targetLanguage;
    if (nativeLanguage) where.nativeLanguageCode = nativeLanguage;

    const phrases = await prisma.phrase.findMany({
      where,
      take: limitNum,
      orderBy: { frequency: "desc" }
    });

    res.status(200).json({
      status: "success",
      data: { 
        phrases,
        count: phrases.length 
      }
    });

  } catch (error) {
    console.error("Search phrases error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error while searching phrases"
    });
  }
});

// Get available vocabulary topics (cached)
router.get("/topics", vocabularyCache(7200), async (req, res) => {
  try {
    const { targetLanguage } = req.query;
    
    const where: any = { isActive: true };
    if (targetLanguage) {
      where.targetLanguageCode = targetLanguage;
    }

    const topics = await prisma.phrase.groupBy({
      by: ["topic"],
      where,
      _count: {
        topic: true
      },
      orderBy: {
        _count: {
          topic: "desc"
        }
      }
    });

    res.status(200).json({
      status: "success",
      data: { topics }
    });

  } catch (error) {
    console.error("Get topics error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error while fetching topics"
    });
  }
});

// Helper functions for spaced repetition algorithm
function calculateMasteryLevel(currentLevel: number, correct: boolean, difficulty: number): number {
  const adjustment = correct ? 0.1 : -0.15;
  const difficultyFactor = (6 - difficulty) / 10; // Easier = more gain
  return Math.max(0, Math.min(1, currentLevel + (adjustment * difficultyFactor)));
}

function calculateInterval(currentInterval: number, correct: boolean, difficulty: number): number {
  if (!correct) {
    return Math.max(1, Math.floor(currentInterval * 0.5));
  }
  
  const easeFactor = 1.3 + (5 - difficulty) * 0.1;
  return Math.floor(currentInterval * easeFactor);
}

function calculateNextReview(interval: number, correct: boolean, difficulty: number): Date {
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);
  return nextReview;
}

function calculateRetrievability(responseTime?: number, difficulty: number = 3): number {
  if (!responseTime) return 0.8;
  
  // Faster response = higher retrievability
  // Normalize response time (assuming 5 seconds is average)
  const normalizedTime = Math.min(10, responseTime / 1000);
  const timeScore = Math.max(0.1, 1 - (normalizedTime / 10));
  const difficultyScore = (6 - difficulty) / 5;
  
  return Math.min(1, (timeScore * 0.7) + (difficultyScore * 0.3));
}

// Submit review results and update spaced repetition (with cache invalidation)
router.post("/review", 
  invalidateCache((req) => [
    `user:${req.user?.userId}:*`,
    `stats:${req.user?.userId}:*`,
    `vocab:mastery:${req.user?.userId}:*`
  ]), 
  async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { phraseId, correct, responseTime, difficulty = 3 } = req.body;

      if (!phraseId || typeof correct !== "boolean") {
        return res.status(400).json({
          status: "error",
          message: "Phrase ID and correct flag are required"
        });
      }

      const currentMastery = await prisma.vocabularyMastery.findUnique({
        where: {
          userId_phraseId: {
            userId: userId!,
            phraseId
          }
        }
      });

      if (!currentMastery) {
        const newMastery = await prisma.vocabularyMastery.create({
          data: {
            userId: userId!,
            phraseId,
            masteryLevel: correct ? 0.3 : 0.1,
            timesEncountered: 1,
            timesCorrect: correct ? 1 : 0,
            lastEncountered: new Date(),
            nextReview: calculateNextReview(1, correct, difficulty),
            reviewInterval: 1,
            difficulty: difficulty / 5,
            stability: 1.0,
            retrievability: correct ? 0.9 : 0.3,
            isLearned: false,
            learningPhase: "new"
          }
        });

        return res.status(200).json({
          status: "success",
          message: "Review submitted successfully",
          data: { mastery: newMastery }
        });
      }

      const newTimesEncountered = currentMastery.timesEncountered + 1;
      const newTimesCorrect = currentMastery.timesCorrect + (correct ? 1 : 0);
      const newMasteryLevel = calculateMasteryLevel(currentMastery.masteryLevel, correct, difficulty);
      const newInterval = calculateInterval(currentMastery.reviewInterval, correct, difficulty);
      const newRetrievability = calculateRetrievability(responseTime, difficulty);
      
      const updatedMastery = await prisma.vocabularyMastery.update({
        where: {
          userId_phraseId: {
            userId: userId!,
            phraseId
          }
        },
        data: {
          masteryLevel: newMasteryLevel,
          timesEncountered: newTimesEncountered,
          timesCorrect: newTimesCorrect,
          lastEncountered: new Date(),
          nextReview: calculateNextReview(newInterval, correct, difficulty),
          reviewInterval: newInterval,
          difficulty: Math.max(0.1, Math.min(1.0, currentMastery.difficulty + (correct ? -0.1 : 0.1))),
          retrievability: newRetrievability,
          isLearned: newMasteryLevel > 0.8,
          learningPhase: newMasteryLevel > 0.8 ? "mastered" : newMasteryLevel > 0.5 ? "review" : "learning"
        }
      });

      res.status(200).json({
        status: "success",
        message: "Review submitted successfully",
        data: { mastery: updatedMastery }
      });

    } catch (error) {
      console.error("Submit review error:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error while submitting review"
      });
    }
  }
);

// Start new learning session
router.post("/sessions", async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { sessionType, targetLanguage, topicCovered, difficultyLevel } = req.body;

    if (!sessionType || !targetLanguage) {
      return res.status(400).json({
        status: "error",
        message: "Session type and target language are required"
      });
    }

    const session = await prisma.learningSession.create({
      data: {
        userId: userId!,
        sessionType: sessionType as SessionType,
        languagePracticed: targetLanguage,
        topicCovered,
        difficultyLevel,
        sessionDate: new Date()
      }
    });

    res.status(201).json({
      status: "success",
      message: "Learning session started",
      data: { session }
    });

  } catch (error) {
    console.error("Create session error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error while creating session"
    });
  }
});

// Complete learning session
router.post("/sessions/:id/complete", 
  invalidateCache((req) => [
    `user:${req.user?.userId}:*`,
    `stats:${req.user?.userId}:*`,
    `session:${req.user?.userId}:*`
  ]),
  async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;
      const { 
        wordsLearned, 
        timeSpent, 
        xpEarned, 
        accuracyPercentage, 
        completionRate,
        sessionData 
      } = req.body;

      const session = await prisma.learningSession.update({
        where: { 
          id,
          userId: userId!
        },
        data: {
          wordsLearned: wordsLearned || 0,
          timeSpent: timeSpent || 0,
          xpEarned: xpEarned || 0,
          accuracyPercentage,
          completionRate,
          sessionData,
          endedAt: new Date()
        }
      });

      if (timeSpent > 0 || xpEarned > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            totalLearningTime: {
              increment: timeSpent || 0
            },
            xpPoints: {
              increment: xpEarned || 0
            }
          }
        });
      }

      res.status(200).json({
        status: "success",
        message: "Session completed successfully",
        data: { session }
      });

    } catch (error) {
      console.error("Complete session error:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error while completing session"
      });
    }
  }
);
export default router;
