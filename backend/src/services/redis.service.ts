import { Redis } from "ioredis";

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  serialize?: boolean; // Whether to JSON serialize the value
}

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  errors: number;
}

class RedisService {
  private redis: Redis;
  private isConnected: boolean = false;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    errors: 0
  };

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_URL?.replace("redis://", "").split(":")[0] || "localhost",
      port: parseInt(process.env.REDIS_URL?.split(":")[2] || "6379"),
      password: process.env.REDIS_PASSWORD,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      enableReadyCheck: true,
      // maxmemoryPolicy: "allkeys-lru", // Not a valid IORedis option
      keepAlive: 30000,
      family: 4,
      connectionName: "lingualeap-backend",
      db: 0
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.redis.on("connect", () => {
      console.log("[Redis] Connected to Redis server");
      this.isConnected = true;
    });

    this.redis.on("ready", () => {
      console.log("[Redis] Redis client ready");
    });

    this.redis.on("error", (error) => {
      console.error("[Redis] Redis connection error:", error);
      this.isConnected = false;
      this.stats.errors++;
    });

    this.redis.on("close", () => {
      console.log("[Redis] Redis connection closed");
      this.isConnected = false;
    });

    this.redis.on("reconnecting", () => {
      console.log("[Redis] Attempting to reconnect to Redis...");
    });
  }

  async connect(): Promise<void> {
    try {
      await this.redis.connect();
      this.isConnected = true;
      console.log("[Redis] Successfully connected to Redis");
    } catch (error) {
      console.error("[Redis] Failed to connect to Redis:", error);
      this.isConnected = false;
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.redis.disconnect();
      this.isConnected = false;
      console.log("[Redis] Disconnected from Redis");
    } catch (error) {
      console.error("[Redis] Error disconnecting from Redis:", error);
      throw error;
    }
  }

  isHealthy(): boolean {
    return this.isConnected;
  }

  async ping(): Promise<boolean> {
    try {
      const result = await this.redis.ping();
      return result === "PONG";
    } catch (error) {
      console.error("[Redis] Ping failed:", error);
      return false;
    }
  }

  // Core caching methods
  async get<T = any>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(this.prefixKey(key));
      if (value === null) {
        this.stats.misses++;
        return null;
      }

      this.stats.hits++;
      
      try {
        return JSON.parse(value);
      } catch {
        // If not JSON, return as string
        return value as T;
      }
    } catch (error) {
      console.error(`[Redis] Error getting key ${key}:`, error);
      this.stats.errors++;
      return null;
    }
  }

  async set(key: string, value: any, options?: CacheOptions): Promise<boolean> {
    try {
      const prefixedKey = this.prefixKey(key);
      const serializedValue = typeof value === "string" ? value : JSON.stringify(value);
      
      let result;
      if (options?.ttl) {
        result = await this.redis.setex(prefixedKey, options.ttl, serializedValue);
      } else {
        result = await this.redis.set(prefixedKey, serializedValue);
      }

      this.stats.sets++;
      return result === "OK";
    } catch (error) {
      console.error(`[Redis] Error setting key ${key}:`, error);
      this.stats.errors++;
      return false;
    }
  }

  async del(key: string | string[]): Promise<number> {
    try {
      const keys = Array.isArray(key) ? key : [key];
      const prefixedKeys = keys.map(k => this.prefixKey(k));
      
      const deletedCount = await this.redis.del(...prefixedKeys);
      this.stats.deletes += deletedCount;
      return deletedCount;
    } catch (error) {
      console.error(`[Redis] Error deleting key(s) ${key}:`, error);
      this.stats.errors++;
      return 0;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(this.prefixKey(key));
      return result === 1;
    } catch (error) {
      console.error(`[Redis] Error checking existence of key ${key}:`, error);
      this.stats.errors++;
      return false;
    }
  }

  // Pattern-based operations
  async keys(pattern: string): Promise<string[]> {
    try {
      const keys = await this.redis.keys(this.prefixKey(pattern));
      return keys.map(key => this.unprefixKey(key));
    } catch (error) {
      console.error(`[Redis] Error getting keys with pattern ${pattern}:`, error);
      this.stats.errors++;
      return [];
    }
  }

  async deleteByPattern(pattern: string): Promise<number> {
    try {
      const keys = await this.redis.keys(this.prefixKey(pattern));
      if (keys.length === 0) return 0;
      
      const deletedCount = await this.redis.del(...keys);
      this.stats.deletes += deletedCount;
      return deletedCount;
    } catch (error) {
      console.error(`[Redis] Error deleting keys with pattern ${pattern}:`, error);
      this.stats.errors++;
      return 0;
    }
  }

  // Statistics and monitoring
  getStats(): CacheStats {
    return { ...this.stats };
  }

  resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      errors: 0
    };
  }

  getHitRatio(): number {
    const total = this.stats.hits + this.stats.misses;
    return total === 0 ? 0 : this.stats.hits / total;
  }

  // Utility methods
  private prefixKey(key: string): string {
    return `lingualeap:${key}`;
  }

  private unprefixKey(key: string): string {
    return key.replace(/^lingualeap:/, "");
  }

  // Specific cache invalidation patterns for LinguaLeap
  async invalidateUserCache(userId: string): Promise<number> {
    return this.deleteByPattern(`user:*:${userId}`);
  }

  async invalidateVocabularyCache(targetLanguage?: string): Promise<number> {
    const pattern = targetLanguage ? `vocab:*:${targetLanguage}` : "vocab:*";
    return this.deleteByPattern(pattern);
  }

  async invalidateStatsCache(userId?: string): Promise<number> {
    const pattern = userId ? `stats:${userId}:*` : "stats:*";
    return this.deleteByPattern(pattern);
  }

  async invalidateSessionCache(userId: string): Promise<number> {
    return this.deleteByPattern(`session:${userId}:*`);
  }
}

// Singleton instance
const redisService = new RedisService();

export default redisService;
export { RedisService, CacheOptions, CacheStats };
