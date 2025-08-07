import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        name: true,
        nativeLanguage: true,
        targetLanguage: true,
        currentLevel: true,
        xpPoints: true,
        dailyStreak: true,
        longestStreak: true,
        lastActive: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.patch('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, nativeLanguage, targetLanguage, currentLevel } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(name && { name }),
        ...(nativeLanguage && { nativeLanguage }),
        ...(targetLanguage && { targetLanguage }),
        ...(currentLevel && { currentLevel })
      },
      select: {
        id: true,
        email: true,
        name: true,
        nativeLanguage: true,
        targetLanguage: true,
        currentLevel: true,
        xpPoints: true,
        dailyStreak: true,
        longestStreak: true,
        lastActive: true,
        createdAt: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user progress
router.get('/progress', authMiddleware, async (req, res) => {
  try {
    const { language } = req.query;

    const where: any = { userId: req.user!.id };
    if (language) where.language = language;

    const progress = await prisma.userProgress.findMany({
      where,
      orderBy: { lastUpdated: 'desc' }
    });

    res.json(progress);
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user learning sessions
router.get('/sessions', authMiddleware, async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [sessions, total] = await Promise.all([
      prisma.learningSession.findMany({
        where: { userId: req.user!.id },
        orderBy: { sessionDate: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.learningSession.count({
        where: { userId: req.user!.id }
      })
    ]);

    res.json({
      sessions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user speaking attempts
router.get('/speaking-attempts', authMiddleware, async (req, res) => {
  try {
    const { phraseId, limit = 10, page = 1 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { userId: req.user!.id };
    if (phraseId) where.phraseId = phraseId;

    const [attempts, total] = await Promise.all([
      prisma.speakingAttempt.findMany({
        where,
        include: {
          phrase: {
            select: {
              textEnglish: true,
              textTargetLanguage: true,
              topic: true
            }
          }
        },
        orderBy: { attemptDate: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.speakingAttempt.count({ where })
    ]);

    res.json({
      attempts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get speaking attempts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;