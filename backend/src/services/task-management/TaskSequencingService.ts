import { PrismaClient } from "@prisma/client";
import { TaskType, LearningPhase, UserLevel } from "@prisma/client";

export interface UserGoals {
  targetLanguage: string;
  nativeLanguage: string;
  proficiencyLevel: UserLevel;
  learningMotivation: string;
  timeCommitment: number;
  learningStyle: string[];
  specificScenarios?: string[];
}

export interface Task {
  id: string;
  taskType: TaskType;
  taskName: string;
  difficultyLevel: number;
  prerequisites?: string[];
  learningObjectives?: any;
  estimatedDurationMinutes?: number;
  taskContent: any;
  scoringCriteria?: any;
}

export interface DifficultyAdjustment {
  newDifficultyLevel: number;
  adjustmentReason: string;
  adjustmentMagnitude: 'MAJOR_DECREASE' | 'MINOR_DECREASE' | 'MAINTAIN' | 'MINOR_INCREASE' | 'MAJOR_INCREASE';
  recommendedTaskTypes: TaskType[];
  estimatedTimeToMastery: number; // in minutes
}

export interface TaskResult {
  taskId: string;
  userId: string;
  score: number;
  accuracy: number;
  completionTime: number; // seconds
  attemptNumber: number;
  difficultyAttempted: number;
  performanceMetrics: {
    responseTime: number[];
    errorTypes: string[];
    hintUsage: number;
    retryAttempts: number;
    engagementLevel: number; // 0-1
    frustractionIndicators: number;
  };
}
