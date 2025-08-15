import { Request, Response, NextFunction } from "express";
import redisService from "../services/redis.service";
import crypto from "crypto";

interface CacheMiddlewareOptions {
  ttl?: number; // Time to live in seconds
  keyGenerator?: (req: Request) => string;
  skipCache?: (req: Request) => boolean;
  onHit?: (key: string) => void;
  onMiss?: (key: string) => void;
}

// Cache middleware factory
export const cache = (options: CacheMiddlewareOptions = {}) => {
  const {
    ttl = 300, // 5 minutes default
    keyGenerator = defaultKeyGenerator,
    skipCache = () => false,
    onHit = () => {},
    onMiss = () => {}
  } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip cache for non-GET requests or when skipCache returns true
    if (req.method !== "GET" || skipCache(req)) {
      return next();
    }

    // Skip cache if Redis is not connected
    if (!redisService.isHealthy()) {
      console.warn("[Cache] Redis not healthy, skipping cache");
      return next();
    }

    const cacheKey = keyGenerator(req);
    
    try {
      // Try to get cached data
      const cachedData = await redisService.get(cacheKey);
      
      if (cachedData !== null) {
        // Cache hit
        onHit(cacheKey);
        console.log(`[Cache] HIT: ${cacheKey}`);
        
        res.setHeader("X-Cache", "HIT");
        res.setHeader("X-Cache-Key", cacheKey);
        return res.json(cachedData);
      }

      // Cache miss - continue with request
      onMiss(cacheKey);
      console.log(`[Cache] MISS: ${cacheKey}`);
      
      // Store original res.json method
      const originalJson = res.json;
      
      // Override res.json to cache the response
      res.json = function(data: any) {
        // Cache the response data
        redisService.set(cacheKey, data, { ttl }).catch((error) => {
          console.error(`[Cache] Error caching response for key ${cacheKey}:`, error);
        });
        
        // Set cache headers
        res.setHeader("X-Cache", "MISS");
        res.setHeader("X-Cache-Key", cacheKey);
        
        // Call original json method
        return originalJson.call(this, data);
      };

      next();
      
    } catch (error) {
      console.error(`[Cache] Error in cache middleware for key ${cacheKey}:`, error);
      // Continue without cache on error
      next();
    }
  };
};

// User-specific cache middleware
export const userCache = (ttl: number = 900) => { // 15 minutes default
  return cache({
    ttl,
    keyGenerator: (req: Request) => {
      const userId = req.user?.userId || "anonymous";
      const baseKey = defaultKeyGenerator(req);
      return `user:${userId}:${baseKey}`;
    },
    skipCache: (req: Request) => !req.user?.userId
  });
};

// Vocabulary cache middleware with language-specific caching
export const vocabularyCache = (ttl: number = 3600) => { // 1 hour default
  return cache({
    ttl,
    keyGenerator: (req: Request) => {
      const { targetLanguage, nativeLanguage, topic } = req.query;
      const userId = req.user?.userId;
      const baseKey = defaultKeyGenerator(req);
      
      const parts = [
        "vocab",
        baseKey,
        targetLanguage && `target:${targetLanguage}`,
        nativeLanguage && `native:${nativeLanguage}`,
        topic && `topic:${topic}`,
        userId && `user:${userId}`
      ].filter(Boolean);
      
      return parts.join(":");
    }
  });
};

// Statistics cache middleware
export const statsCache = (ttl: number = 300) => { // 5 minutes default
  return cache({
    ttl,
    keyGenerator: (req: Request) => {
      const userId = req.user?.userId;
      const baseKey = defaultKeyGenerator(req);
      return userId ? `stats:${userId}:${baseKey}` : `stats:global:${baseKey}`;
    }
  });
};

// Session-specific cache middleware
export const sessionCache = (ttl: number = 1800) => { // 30 minutes default
  return cache({
    ttl,
    keyGenerator: (req: Request) => {
      const userId = req.user?.userId;
      const sessionId = req.params.id || req.body.sessionId;
      const baseKey = defaultKeyGenerator(req);
      return `session:${userId}:${sessionId}:${baseKey}`;
    },
    skipCache: (req: Request) => !req.user?.userId
  });
};

// Search results cache middleware
export const searchCache = (ttl: number = 600) => { // 10 minutes default
  return cache({
    ttl,
    keyGenerator: (req: Request) => {
      const { query, targetLanguage, nativeLanguage, limit } = req.query;
      const searchParams = [
        query && `q:${query}`,
        targetLanguage && `target:${targetLanguage}`,
        nativeLanguage && `native:${nativeLanguage}`,
        limit && `limit:${limit}`
      ].filter(Boolean).join(":");
      
      return `search:${crypto.createHash("md5").update(searchParams).digest("hex")}`;
    },
    skipCache: (req: Request) => !req.query.query
  });
};

// Cache invalidation middleware - use after operations that modify data
export const invalidateCache = (patterns: string[] | ((req: Request) => string[])) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Store original json method
    const originalJson = res.json;
    
    res.json = function(data: any) {
      try {
        // Get invalidation patterns
        const patternsToInvalidate = typeof patterns === "function" ? patterns(req) : patterns;
        
        // Invalidate cache patterns
        const invalidationPromises = patternsToInvalidate.map(pattern => 
          redisService.deleteByPattern(pattern)
        );
        
        Promise.allSettled(invalidationPromises).then(results => {
          const totalInvalidated = results
            .filter((result): result is PromiseFulfilledResult<number> => result.status === "fulfilled")
            .reduce((sum, result) => sum + result.value, 0);
          
          console.log(`[Cache] Invalidated ${totalInvalidated} cache entries for patterns:`, patternsToInvalidate);
        }).catch(error => {
          console.error("[Cache] Error invalidating cache:", error);
        });
        
      } catch (error) {
        console.error("[Cache] Error invalidating cache:", error);
      }
      
      // Call original json method
      return originalJson.call(this, data);
    };

    next();
  };
};

// Default key generator
function defaultKeyGenerator(req: Request): string {
  const { path, query } = req;
  const queryString = Object.keys(query).length > 0 ? 
    Object.entries(query)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}:${value}`)
      .join("&") 
    : "";
  
  const baseKey = path.replace(/\//g, ":").replace(/^:/, "");
  return queryString ? `${baseKey}?${queryString}` : baseKey;
}

// Cache warming utilities
export const warmVocabularyCache = async () => {
  try {
    console.log("[Cache] Starting vocabulary cache warming...");
    
    // This would typically fetch commonly accessed vocabulary data
    // and pre-populate the cache. Implementation depends on business logic.
    
    console.log("[Cache] Vocabulary cache warming completed");
  } catch (error) {
    console.error("[Cache] Error warming vocabulary cache:", error);
  }
};

export const warmUserCache = async (userId: string) => {
  try {
    console.log(`[Cache] Warming cache for user ${userId}...`);
    
    // This would typically fetch user-specific data and pre-populate the cache
    // Implementation depends on business logic.
    
    console.log(`[Cache] User cache warming completed for user ${userId}`);
  } catch (error) {
    console.error(`[Cache] Error warming cache for user ${userId}:`, error);
  }
};

export default cache;
