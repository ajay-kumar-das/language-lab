import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get phrases by language and topic
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { language, topic, type = 'word', page = 1, limit = 10 } = req.query;

    const where: any = {};
    if (language) where.languageCode = language;
    if (topic) where.topic = topic;
    if (type) where.type = type;

    const skip = (Number(page) - 1) * Number(limit);

    const [phrases, total] = await Promise.all([
      prisma.phrase.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.phrase.count({ where })
    ]);

    res.json({
      phrases,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get phrases error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new phrase
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      textEnglish,
      textTargetLanguage,
      phoneticTranscription,
      topic,
      difficultyLevel,
      type,
      imageUrl,
      usageContext,
      languageCode
    } = req.body;

    const phrase = await prisma.phrase.create({
      data: {
        textEnglish,
        textTargetLanguage,
        phoneticTranscription,
        topic,
        difficultyLevel: difficultyLevel || 1,
        type: type || 'word',
        imageUrl,
        usageContext,
        languageCode
      }
    });

    res.status(201).json(phrase);
  } catch (error) {
    console.error('Create phrase error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get phrase by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const phrase = await prisma.phrase.findUnique({
      where: { id },
      include: {
        speakingAttempts: {
          where: { userId: req.user!.id },
          orderBy: { attemptDate: 'desc' },
          take: 5
        }
      }
    });

    if (!phrase) {
      return res.status(404).json({ error: 'Phrase not found' });
    }

    res.json(phrase);
  } catch (error) {
    console.error('Get phrase error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate vocabulary using comprehensive database
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { targetLanguage, nativeLanguage, topic, type = 'word', count = 10 } = req.body;

    if (!targetLanguage || !nativeLanguage || !topic) {
      return res.status(400).json({ error: 'Missing required parameters: targetLanguage, nativeLanguage, topic' });
    }

    // Import vocabulary service
    const { generateVocabulary } = require('../services/vocabularyService');
    
    // Generate vocabulary items
    const generatedPhrases = generateVocabulary(topic, type, targetLanguage, nativeLanguage, count);

    res.json({
      message: `Generated ${generatedPhrases.length} ${type}s for ${topic}`,
      phrases: generatedPhrases
    });
  } catch (error) {
    console.error('Generate phrases error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;