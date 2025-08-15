/**
 * Spaced Repetition Utilities for LinguaLeap
 * Implements SM-2 algorithm with enhancements for language learning
 */

export interface SpacedRepetitionData {
  masteryLevel: number;
  timesEncountered: number;
  timesCorrect: number;
  difficulty: number;
  stability: number;
  retrievability: number;
  reviewInterval: number;
  nextReview: Date;
  learningPhase: string;
}

export interface ReviewResult {
  isCorrect: boolean;
  responseTime: number;
  confidence: number;
  difficultyRating: number;
}

export class SpacedRepetitionEngine {
  private static readonly DEFAULT_EASE_FACTOR = 2.5;
  private static readonly MIN_EASE_FACTOR = 1.3;
  private static readonly MAX_EASE_FACTOR = 5.0;
  
  public static readonly LEARNING_PHASES = {
    NEW: 'new',
    LEARNING: 'learning',
    REVIEW: 'review',
    MASTERED: 'mastered'
  } as const;

  static calculateNextReview(
    currentData: SpacedRepetitionData,
    reviewResult: ReviewResult
  ): Partial<SpacedRepetitionData> {
    const { isCorrect, responseTime, confidence, difficultyRating } = reviewResult;
    
    const timesEncountered = currentData.timesEncountered + 1;
    const timesCorrect = isCorrect ? currentData.timesCorrect + 1 : currentData.timesCorrect;
    const accuracyRate = timesCorrect / timesEncountered;
    
    const difficulty = this.calculateNewDifficulty(
      currentData.difficulty, isCorrect, responseTime, confidence, difficultyRating
    );
    
    const easeFactor = this.calculateEaseFactor(
      currentData.difficulty, isCorrect, confidence, accuracyRate
    );
    
    const { interval, learningPhase } = this.calculateInterval(
      currentData.reviewInterval, currentData.learningPhase, easeFactor, isCorrect, timesEncountered
    );
    
    const stability = this.calculateStability(currentData.stability, isCorrect, responseTime, interval);
    const retrievability = this.calculateRetrievability(stability, interval, difficulty);
    const masteryLevel = this.calculateMasteryLevel(accuracyRate, timesEncountered, learningPhase, stability);
    const nextReview = new Date(Date.now() + interval * 24 * 60 * 60 * 1000);
    
    return {
      masteryLevel, timesEncountered, timesCorrect, difficulty, stability, 
      retrievability, reviewInterval: interval, nextReview, learningPhase
    };
  }

  private static calculateNewDifficulty(
    currentDifficulty: number, isCorrect: boolean, responseTime: number, 
    confidence: number, difficultyRating: number
  ): number {
    let newDifficulty = currentDifficulty;
    newDifficulty += isCorrect ? -0.1 : 0.2;
    newDifficulty += Math.min(0.1, Math.max(-0.1, (responseTime - 3000) / 10000));
    newDifficulty -= (confidence - 3) * 0.05;
    newDifficulty += (difficultyRating - 3) * 0.1;
    return Math.min(1.0, Math.max(0.0, newDifficulty));
  }

  private static calculateEaseFactor(
    difficulty: number, isCorrect: boolean, confidence: number, accuracyRate: number
  ): number {
    let easeFactor = this.DEFAULT_EASE_FACTOR;
    if (isCorrect) {
      easeFactor += (0.1 * confidence / 5);
    } else {
      easeFactor -= (0.8 - 0.28 * difficulty + 0.02 * difficulty * difficulty);
    }
    if (accuracyRate > 0.8) easeFactor += 0.05;
    else if (accuracyRate < 0.6) easeFactor -= 0.1;
    return Math.min(this.MAX_EASE_FACTOR, Math.max(this.MIN_EASE_FACTOR, easeFactor));
  }

  private static calculateInterval(
    currentInterval: number, currentPhase: string, easeFactor: number, 
    isCorrect: boolean, timesEncountered: number
  ): { interval: number; learningPhase: string } {
    let interval = currentInterval;
    let learningPhase = currentPhase;
    
    if (!isCorrect) {
      learningPhase = this.LEARNING_PHASES.LEARNING;
      interval = 1;
    } else {
      switch (currentPhase) {
        case this.LEARNING_PHASES.NEW:
          interval = 1;
          learningPhase = this.LEARNING_PHASES.LEARNING;
          break;
        case this.LEARNING_PHASES.LEARNING:
          interval = timesEncountered < 3 ? 3 : Math.round(6 * easeFactor);
          if (timesEncountered >= 3) learningPhase = this.LEARNING_PHASES.REVIEW;
          break;
        case this.LEARNING_PHASES.REVIEW:
          interval = Math.round(currentInterval * easeFactor);
          if (interval >= 30 && timesEncountered >= 5) learningPhase = this.LEARNING_PHASES.MASTERED;
          break;
        case this.LEARNING_PHASES.MASTERED:
          interval = Math.min(180, Math.round(currentInterval * Math.min(easeFactor, 2.0)));
          break;
      }
    }
    return { interval: Math.max(1, interval), learningPhase };
  }

  private static calculateStability(
    currentStability: number, isCorrect: boolean, responseTime: number, interval: number
  ): number {
    if (isCorrect) {
      const timeBonus = Math.max(0, (5000 - responseTime) / 5000 * 0.1);
      const intervalBonus = Math.min(0.2, interval / 30 * 0.1);
      return Math.min(5.0, currentStability + 0.1 + timeBonus + intervalBonus);
    } else {
      return Math.max(0.1, currentStability * 0.8);
    }
  }

  private static calculateRetrievability(stability: number, daysSinceLastReview: number, difficulty: number): number {
    const decayRate = -0.693 / (stability * (1 + difficulty));
    return Math.max(0, Math.min(1, Math.exp(decayRate * daysSinceLastReview)));
  }

  private static calculateMasteryLevel(
    accuracyRate: number, timesEncountered: number, learningPhase: string, stability: number
  ): number {
    let baseLevel = accuracyRate;
    baseLevel += Math.min(0.2, timesEncountered / 20);
    
    const phaseMultipliers = {
      [this.LEARNING_PHASES.NEW]: 0.1,
      [this.LEARNING_PHASES.LEARNING]: 0.3,
      [this.LEARNING_PHASES.REVIEW]: 0.7,
      [this.LEARNING_PHASES.MASTERED]: 1.0
    };
    
    baseLevel *= phaseMultipliers[learningPhase as keyof typeof phaseMultipliers] || 0.1;
    baseLevel += (stability - 1) * 0.1;
    return Math.min(1.0, Math.max(0.0, baseLevel));
  }

  static getItemsDueForReview(items: SpacedRepetitionData[]): SpacedRepetitionData[] {
    const now = new Date();
    return items.filter(item => item.nextReview <= now);
  }

  static initializeNewItem(): Partial<SpacedRepetitionData> {
    const now = new Date();
    const nextReview = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    return {
      masteryLevel: 0.0,
      timesEncountered: 0,
      timesCorrect: 0,
      difficulty: 0.5,
      stability: 1.0,
      retrievability: 0.9,
      reviewInterval: 1,
      nextReview,
      learningPhase: this.LEARNING_PHASES.NEW
    };
  }
}

export default SpacedRepetitionEngine;
