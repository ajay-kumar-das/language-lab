export interface AIProvider {
  name: string;
  priority: number;
  isAvailable: boolean;
  costPerToken: number;
  maxTokens: number;
  models: string[];
}

export interface AIRequest {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  userId: string;
  requestType: AIRequestType;
}

export interface AIResponse {
  content: string;
  provider: string;
  model: string;
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  cost: number;
  processingTime: number;
  quality?: number;
}

export enum AIRequestType {
  COURSE_GENERATION = 'course_generation',
  TASK_CREATION = 'task_creation',
  CONTENT_EVALUATION = 'content_evaluation',
  CONVERSATION = 'conversation',
  FEEDBACK_GENERATION = 'feedback_generation'
}

export interface CourseGenerationRequest extends AIRequest {
  userGoals: {
    targetLanguage: string;
    nativeLanguage: string;
    proficiencyLevel: string;
    learningMotivation: string;
    timeCommitment: number;
    learningStyle: string[];
    specificScenarios?: string[];
  };
  requestType: AIRequestType.COURSE_GENERATION;
}

export interface GeneratedCourse {
  courseName: string;
  totalLessons: number;
  estimatedDurationWeeks: number;
  courseStructure: {
    modules: CourseModule[];
    progressionPath: string[];
    prerequisites: Record<string, string[]>;
  };
  learningObjectives: {
    shortTerm: string[];
    longTerm: string[];
    skillTargets: Record<string, number>;
  };
  culturalContext?: {
    regions: string[];
    contexts: string[];
    sensitivity: string[];
  };
}

export interface CourseModule {
  id: string;
  name: string;
  description: string;
  order: number;
  estimatedDuration: number;
  tasks: GeneratedTask[];
  learningObjectives: string[];
}

export interface GeneratedTask {
  taskName: string;
  taskType: string;
  difficultyLevel: number;
  estimatedDurationMinutes: number;
  taskContent: {
    instructions: string;
    materials: any[];
    examples?: any[];
    hints?: string[];
  };
  scoringCriteria: {
    maxScore: number;
    criteria: Array<{
      aspect: string;
      weight: number;
      description: string;
    }>;
  };
  learningObjectives: string[];
  prerequisites?: string[];
}

export interface AIServiceConfig {
  providers: {
    openai: {
      apiKey: string;
      baseURL?: string;
      models: string[];
      defaultModel: string;
      maxRetries: number;
      timeout: number;
    };
    anthropic: {
      apiKey: string;
      baseURL?: string;
      models: string[];
      defaultModel: string;
      maxRetries: number;
      timeout: number;
    };
    google: {
      apiKey: string;
      baseURL?: string;
      models: string[];
      defaultModel: string;
      maxRetries: number;
      timeout: number;
    };
  };
  fallbackOrder: string[];
  rateLimiting: {
    requestsPerMinute: number;
    tokensPerMinute: number;
  };
  caching: {
    enabled: boolean;
    ttl: number;
    maxSize: number;
  };
  monitoring: {
    enabled: boolean;
    logRequests: boolean;
    trackCosts: boolean;
  };
}
