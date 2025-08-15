import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import redisService from "../services/redis.service";

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: string; userId?: string;
        email: string;
      };
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: {
    id?: string; userId?: string;
    email: string;
  };
}

// JWT Token caching and blacklisting utilities
class TokenManager {
  private static readonly TOKEN_CACHE_PREFIX = "jwt:token:";
  private static readonly BLACKLIST_PREFIX = "jwt:blacklist:";
  private static readonly USER_SESSION_PREFIX = "jwt:session:";

  static async cacheToken(token: string, decoded: any, ttl: number): Promise<void> {
    try {
      const tokenHash = this.hashToken(token);
      await redisService.set(
        `${this.TOKEN_CACHE_PREFIX}${tokenHash}`,
        {
          userId: decoded.userId || decoded.id,
          email: decoded.email,
          iat: decoded.iat,
          exp: decoded.exp
        },
        { ttl }
      );
    } catch (error) {
      console.error("[TokenManager] Error caching token:", error);
    }
  }

  static async getCachedToken(token: string): Promise<any | null> {
    try {
      const tokenHash = this.hashToken(token);
      return await redisService.get(`${this.TOKEN_CACHE_PREFIX}${tokenHash}`);
    } catch (error) {
      console.error("[TokenManager] Error getting cached token:", error);
      return null;
    }
  }

  static async blacklistToken(token: string, ttl: number): Promise<void> {
    try {
      const tokenHash = this.hashToken(token);
      await redisService.set(
        `${this.BLACKLIST_PREFIX}${tokenHash}`,
        { blacklistedAt: new Date().toISOString() },
        { ttl }
      );
      
      // Remove from cache
      await redisService.del(`${this.TOKEN_CACHE_PREFIX}${tokenHash}`);
    } catch (error) {
      console.error("[TokenManager] Error blacklisting token:", error);
    }
  }

  static async isTokenBlacklisted(token: string): Promise<boolean> {
    try {
      const tokenHash = this.hashToken(token);
      const blacklisted = await redisService.exists(`${this.BLACKLIST_PREFIX}${tokenHash}`);
      return blacklisted;
    } catch (error) {
      console.error("[TokenManager] Error checking blacklist:", error);
      return false;
    }
  }

  static async setUserSession(userId: string, sessionData: any, ttl: number): Promise<void> {
    try {
      await redisService.set(
        `${this.USER_SESSION_PREFIX}${userId}`,
        sessionData,
        { ttl }
      );
    } catch (error) {
      console.error("[TokenManager] Error setting user session:", error);
    }
  }

  static async getUserSession(userId: string): Promise<any | null> {
    try {
      return await redisService.get(`${this.USER_SESSION_PREFIX}${userId}`);
    } catch (error) {
      console.error("[TokenManager] Error getting user session:", error);
      return null;
    }
  }

  static async invalidateUserSessions(userId: string): Promise<void> {
    try {
      await redisService.del(`${this.USER_SESSION_PREFIX}${userId}`);
    } catch (error) {
      console.error("[TokenManager] Error invalidating user sessions:", error);
    }
  }

  private static hashToken(token: string): string {
    const crypto = require("crypto");
    return crypto.createHash("sha256").update(token).digest("hex");
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        message: "No token provided or invalid format"
      });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "No token provided"
      });
    }

    // Check if token is blacklisted
    if (redisService.isHealthy()) {
      const isBlacklisted = await TokenManager.isTokenBlacklisted(token);
      if (isBlacklisted) {
        return res.status(401).json({
          status: "error",
          message: "Token has been invalidated"
        });
      }

      // Try to get cached token data first
      const cachedToken = await TokenManager.getCachedToken(token);
      if (cachedToken) {
        // Use cached token data
        const userId = cachedToken.userId;
        req.user = {
          id: userId,
          userId: userId,
          email: cachedToken.email
        };
        return next();
      }
    }

    // Verify JWT token (fallback or when Redis unavailable)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id?: string;
      userId?: string;
      email: string;
      iat: number;
      exp: number;
    };

    // Cache the token for faster future verification
    if (redisService.isHealthy()) {
      const ttl = decoded.exp - Math.floor(Date.now() / 1000);
      if (ttl > 0) {
        await TokenManager.cacheToken(token, decoded, ttl);
      }
    }

    // Add user info to request object
    const userId = decoded.userId || decoded.id;
    req.user = {
      id: userId,
      userId: userId,
      email: decoded.email
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        status: "error",
        message: "Token has expired"
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        status: "error",
        message: "Invalid token"
      });
    } else {
      console.error("Auth middleware error:", error);
      return res.status(500).json({
        status: "error",
        message: "Internal server error in authentication"
      });
    }
  }
};

// Optional middleware for routes that work both with and without auth
export const optionalAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(); // Continue without user info
    }

    const token = authHeader.substring(7);

    if (!token) {
      return next(); // Continue without user info
    }

    // Check if token is blacklisted
    if (redisService.isHealthy()) {
      const isBlacklisted = await TokenManager.isTokenBlacklisted(token);
      if (isBlacklisted) {
        return next(); // Continue without user info
      }

      // Try to get cached token data first
      const cachedToken = await TokenManager.getCachedToken(token);
      if (cachedToken) {
        const userId = cachedToken.userId;
        req.user = {
          id: userId,
          userId: userId,
          email: cachedToken.email
        };
        return next();
      }
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id?: string;
      userId?: string;
      email: string;
      iat: number;
      exp: number;
    };

    // Cache the token for faster future verification
    if (redisService.isHealthy()) {
      const ttl = decoded.exp - Math.floor(Date.now() / 1000);
      if (ttl > 0) {
        await TokenManager.cacheToken(token, decoded, ttl);
      }
    }

    // Add user info to request object
    const userId = decoded.userId || decoded.id;
    req.user = {
      id: userId,
      userId: userId,
      email: decoded.email
    };

    next();
  } catch (error) {
    // If token is invalid, continue without user info
    next();
  }
};

// Export TokenManager for use in auth routes
export { TokenManager };
