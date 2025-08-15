/**
 * TypeScript types for Vocabulary Management System
 * LinguaLeap - Language Learning Platform
 */

export interface VocabularyFilterParams {
  // Language filtering
  nativeLanguageCode?: string;
  targetLanguageCode?: string;
  
  // Difficulty and content filtering
  difficultyLevel?: number | number[];
  minDifficulty?: number;
  maxDifficulty?: number;
  topic?: string | string[];
  type?: string;
  
  // Progress filtering
  masteryLevel?: 'unlearned' | 'learning' | 'review' | 'mastered';
  dueForReview?: boolean;
  isLearned?: boolean;
  
  // Search and content
  searchText?: string;
  tags?: string | string[];
  frequency?: number;
  
  // Pagination
  page?: number;
  limit?: number;
  offset?: number;
  
  // Sorting
  sortBy?: 'frequency' | 'difficulty' | 'created' | 'mastery' | 'nextReview';
  sortOrder?: 'asc' | 'desc';
}

export interface VocabularyResponse {
  id: string;
  textNativeLanguage: string;
  textTargetLanguage: string;
  phoneticTranscription?: string;
  topic: string;
  difficultyLevel: number;
  type: string;
  imageUrl?: string;
  usageContext?: string;
  usageExample?: string;
  nativeLanguageCode: string;
  targetLanguageCode: string;
  audioUrl?: string;
  tags: string[];
  frequency?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  
  // User-specific data (included when authenticated)
  userProgress?: {
    masteryLevel: number;
    timesEncountered: number;
    timesCorrect: number;
    lastEncountered: string;
    nextReview: string;
    reviewInterval: number;
    difficulty: number;
    stability: number;
    retrievability: number;
    isLearned: boolean;
    learningPhase: string;
  };
}

export interface CreatePhraseRequest {
  textNativeLanguage: string;
  textTargetLanguage: string;
  phoneticTranscription?: string;
  topic: string;
  difficultyLevel: number;
  type?: string;
  imageUrl?: string;
  usageContext?: string;
  usageExample?: string;
  nativeLanguageCode: string;
  targetLanguageCode: string;
  audioUrl?: string;
  tags?: string[];
  frequency?: number;
}

export interface ReviewSubmissionRequest {
  phraseId: string;
  isCorrect: boolean;
  responseTime: number;
  confidence: number;
  difficultyRating: number;
  userAnswer?: string;
  attemptedAt: string;
}

export interface APIResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}
