import { AIServiceConfig } from '../types/ai.types';

export const aiConfig: AIServiceConfig = {
  providers: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
      baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
      models: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
      defaultModel: 'gpt-4o-mini',
      maxRetries: 3,
      timeout: 60000
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      baseURL: process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com/v1',
      models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'],
      defaultModel: 'claude-3-5-sonnet-20241022',
      maxRetries: 3,
      timeout: 60000
    },
    google: {
      apiKey: process.env.GOOGLE_AI_API_KEY || '',
      baseURL: process.env.GOOGLE_AI_BASE_URL || 'https://generativelanguage.googleapis.com/v1',
      models: ['gemini-1.5-pro', 'gemini-1.5-flash'],
      defaultModel: 'gemini-1.5-flash',
      maxRetries: 3,
      timeout: 60000
    }
  },
  fallbackOrder: ['openai', 'anthropic', 'google'],
  rateLimiting: {
    requestsPerMinute: 60,
    tokensPerMinute: 50000
  },
  caching: {
    enabled: true,
    ttl: 3600, // 1 hour
    maxSize: 1000
  },
  monitoring: {
    enabled: true,
    logRequests: process.env.NODE_ENV === 'development',
    trackCosts: true
  }
};

export const promptTemplates = {
  courseGeneration: `You are an expert language learning curriculum designer. Create a personalized language course based on the user's goals and preferences.

User Profile:
- Native Language: {nativeLanguage}
- Target Language: {targetLanguage}
- Current Level: {proficiencyLevel}
- Learning Motivation: {learningMotivation}
- Time Commitment: {timeCommitment} minutes per day
- Learning Style: {learningStyle}
- Specific Scenarios: {specificScenarios}

Requirements:
1. Create a structured course with 4-6 modules
2. Each module should have 5-10 diverse tasks
3. Progress from basic to advanced concepts
4. Include real-world applications
5. Consider cultural context and sensitivity
6. Provide clear learning objectives
7. Estimate realistic completion times

Format your response as valid JSON matching the GeneratedCourse interface.`,

  taskCreation: `Create a specific language learning task for the following context:

Course Context:
- Module: {moduleName}
- Target Language: {targetLanguage}
- User Level: {proficiencyLevel}
- Task Type: {taskType}
- Difficulty: {difficultyLevel}/10
- Duration: {estimatedDuration} minutes

Requirements:
1. Create engaging, interactive content
2. Include clear instructions and examples
3. Define scoring criteria
4. Ensure cultural appropriateness
5. Provide meaningful feedback opportunities

Format as valid JSON matching the GeneratedTask interface.`,

  contentEvaluation: `Evaluate the quality and appropriateness of this language learning content:

Content: {content}
Language: {targetLanguage}
Level: {proficiencyLevel}
Cultural Context: {culturalContext}

Evaluate:
1. Accuracy (grammar, vocabulary, pronunciation)
2. Appropriateness for level
3. Cultural sensitivity
4. Pedagogical value
5. Engagement potential

Provide a score (1-10) and detailed feedback.`
};
