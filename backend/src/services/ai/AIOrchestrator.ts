import { AIProvider, AIRequest, AIResponse, AIRequestType } from "../../types/ai.types";
import { OpenAIService } from "./providers/OpenAIService";
import { AnthropicService } from "./providers/AnthropicService";
import { GoogleAIService } from "./providers/GoogleAIService";
import { aiConfig } from "../../config/ai.config";
import { Redis } from "ioredis";
import { PrismaClient } from "@prisma/client";

export class AIOrchestrator {
  private providers: Map<string, any> = new Map();
  private redis: Redis;
  private prisma: PrismaClient;
  private requestCounts: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(redis: Redis, prisma: PrismaClient) {
    this.redis = redis;
    this.prisma = prisma;
    this.initializeProviders();
  }

  private initializeProviders(): void {
    // Initialize AI service providers
    if (aiConfig.providers.openai.apiKey) {
      this.providers.set("openai", new OpenAIService(aiConfig.providers.openai));
    }
    
    if (aiConfig.providers.anthropic.apiKey) {
      this.providers.set("anthropic", new AnthropicService(aiConfig.providers.anthropic));
    }
    
    if (aiConfig.providers.google.apiKey) {
      this.providers.set("google", new GoogleAIService(aiConfig.providers.google));
    }
  }

  async processRequest(request: AIRequest): Promise<AIResponse> {
    // Check rate limiting
    await this.checkRateLimit(request.userId);

    // Check cache first
    const cacheKey = this.generateCacheKey(request);
    if (aiConfig.caching.enabled) {
      const cached = await this.getCachedResponse(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Try providers in fallback order
    let lastError: Error | null = null;
    
    for (const providerName of aiConfig.fallbackOrder) {
      const provider = this.providers.get(providerName);
      if (!provider) continue;

      try {
        const startTime = Date.now();
        const response = await provider.generateContent(request);
        const processingTime = Date.now() - startTime;

        const aiResponse: AIResponse = {
          ...response,
          processingTime,
          provider: providerName
        };

        // Log interaction
        await this.logAIInteraction(request, aiResponse);

        // Cache successful response
        if (aiConfig.caching.enabled) {
          await this.cacheResponse(cacheKey, aiResponse);
        }

        return aiResponse;
      } catch (error) {
        console.error(`Provider ${providerName} failed:`, error);
        lastError = error as Error;
        continue;
      }
    }

    throw new Error(`All AI providers failed. Last error: ${lastError?.message}`);
  }

  private async checkRateLimit(userId: string): Promise<void> {
    const key = `rate_limit:${userId}`;
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute window

    let userLimit = this.requestCounts.get(key);
    
    if (!userLimit || now > userLimit.resetTime) {
      userLimit = { count: 0, resetTime: now + windowMs };
      this.requestCounts.set(key, userLimit);
    }

    if (userLimit.count >= aiConfig.rateLimiting.requestsPerMinute) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }

    userLimit.count++;
  }

  private generateCacheKey(request: AIRequest): string {
    const keyData = {
      prompt: request.prompt,
      model: request.model,
      systemPrompt: request.systemPrompt,
      requestType: request.requestType,
      temperature: request.temperature || 0.7,
      maxTokens: request.maxTokens || 2000
    };
    
    return `ai_cache:${Buffer.from(JSON.stringify(keyData)).toString("base64")}`;
  }

  private async getCachedResponse(cacheKey: string): Promise<AIResponse | null> {
    try {
      const cached = await this.redis.get(cacheKey);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error("Cache retrieval error:", error);
      return null;
    }
  }

  private async cacheResponse(cacheKey: string, response: AIResponse): Promise<void> {
    try {
      await this.redis.setex(cacheKey, aiConfig.caching.ttl, JSON.stringify(response));
    } catch (error) {
      console.error("Cache storage error:", error);
    }
  }

  private async logAIInteraction(request: AIRequest, response: AIResponse): Promise<void> {
    try {
      await this.prisma.aIInteraction.create({
        data: {
          userId: request.userId,
          interactionType: request.requestType,
          aiProvider: response.provider,
          prompt: request.prompt.substring(0, 1000), // Limit prompt length
          response: response.content.substring(0, 2000), // Limit response length
          tokenUsage: response.tokenUsage,
          processingTime: response.processingTime,
          cost: response.cost,
          quality: response.quality
        }
      });
    } catch (error) {
      console.error("Failed to log AI interaction:", error);
    }
  }
}
