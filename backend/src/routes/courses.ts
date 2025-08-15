import express from "express";
import { CourseGenerationService } from "../services/CourseGenerationService";
import { AIOrchestrator } from "../services/ai/AIOrchestrator";
import { PrismaClient } from "@prisma/client";
import { Redis } from "ioredis";
import { z } from "zod";

const router = express.Router();

// Request validation schemas
const UserGoalsSchema = z.object({
  primaryMotivation: z.enum(["TRAVEL", "BUSINESS", "FAMILY", "ACADEMIC", "PERSONAL_GROWTH", "CAREER_ADVANCEMENT", "CULTURAL_INTEREST"]),
  targetLanguage: z.string().min(2),
  nativeLanguage: z.string().min(2),
  proficiencyLevel: z.enum(["BEGINNER", "ELEMENTARY", "INTERMEDIATE", "UPPER_INTERMEDIATE", "ADVANCED", "PROFICIENT"]),
  timeCommitmentDaily: z.number().min(5).max(480), // 5 minutes to 8 hours
  timeCommitmentWeekly: z.number().min(30).max(3360), // 30 minutes to 56 hours
  learningStylePreferences: z.array(z.string()),
  specificScenarios: z.array(z.string()).optional(),
  culturalInterests: z.array(z.string()).optional(),
  businessContext: z.object({}).optional(),
  travelDestinations: z.array(z.string()).optional(),
  accessibilityNeeds: z.object({}).optional()
});

// Initialize services (in production, these would be injected)
let courseService: CourseGenerationService;
let aiOrchestrator: AIOrchestrator;

// Initialize dependencies
export const initializeCourseRoutes = (prisma: PrismaClient, redis: Redis) => {
  aiOrchestrator = new AIOrchestrator(redis, prisma);
  courseService = new CourseGenerationService(aiOrchestrator, prisma);
};

// POST /api/v1/courses/generate - Generate a personalized course
router.post("/generate", async (req, res) => {
  try {
    const userId = req.user?.id; // Assumes auth middleware sets req.user
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    res.status(201).json({
      success: true,
      message: "Course generation started",
      status: "processing"
    });

  } catch (error) {
    console.error("Course generation error:", error);
    res.status(500).json({
      error: "Failed to generate course",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export default router;
