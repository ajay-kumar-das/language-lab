import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import { prisma, connectDatabase } from "./config/database";
import redisService from "./services/redis.service";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import vocabularyRoutes from "./routes/vocabulary";
import passport from "./config/passport";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/vocabulary", vocabularyRoutes);

// Health check endpoints with Redis status
app.get("/health", async (req, res) => {
  try {
    const [dbCheck, redisCheck] = await Promise.allSettled([
      prisma.$queryRaw`SELECT 1`,
      redisService.ping()
    ]);

    const databaseStatus = dbCheck.status === "fulfilled" ? "connected" : "failed";
    const redisStatus = redisCheck.status === "fulfilled" && redisCheck.value ? "connected" : "failed";
    
    const overallStatus = databaseStatus === "connected" && redisStatus === "connected" ? "ok" : "degraded";

    res.status(overallStatus === "ok" ? 200 : 503).json({ 
      status: overallStatus, 
      message: "LinguaLeap Backend health check",
      timestamp: new Date().toISOString(),
      services: {
        database: databaseStatus,
        redis: redisStatus,
        cache: redisService.isHealthy() ? "healthy" : "unhealthy"
      }
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      message: "Health check failed",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

app.get("/api/v1/health", async (req, res) => {
  try {
    const [dbCheck, redisCheck] = await Promise.allSettled([
      prisma.$queryRaw`SELECT 1`,
      redisService.ping()
    ]);

    const databaseStatus = dbCheck.status === "fulfilled" ? "connected" : "failed";
    const redisStatus = redisCheck.status === "fulfilled" && redisCheck.value ? "connected" : "failed";
    
    // Get cache statistics
    const cacheStats = redisService.getStats();
    const hitRatio = redisService.getHitRatio();

    const overallStatus = databaseStatus === "connected" && redisStatus === "connected" ? "healthy" : "degraded";

    res.status(overallStatus === "healthy" ? 200 : 503).json({ 
      status: overallStatus, 
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      services: {
        database: databaseStatus,
        redis: redisStatus,
        cache: {
          status: redisService.isHealthy() ? "healthy" : "unhealthy",
          stats: cacheStats,
          hitRatio: Math.round(hitRatio * 100) / 100
        }
      }
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// Database and Redis test endpoint
app.get("/api/v1/db-test", async (req, res) => {
  try {
    const [dbResult, redisResult] = await Promise.allSettled([
      Promise.all([
        prisma.$queryRaw`SELECT 1 as test_value, NOW() as current_time`,
        prisma.user.count(),
        prisma.phrase.count()
      ]),
      Promise.all([
        redisService.set("health-check", { timestamp: new Date().toISOString() }, { ttl: 60 }),
        redisService.get("health-check")
      ])
    ]);

    const dbSuccess = dbResult.status === "fulfilled";
    const redisSuccess = redisResult.status === "fulfilled";

    let responseData: any = {
      status: dbSuccess && redisSuccess ? "success" : "partial",
      message: "Service connectivity test",
      timestamp: new Date().toISOString()
    };

    if (dbSuccess) {
      const [testQuery, userCount, phraseCount] = dbResult.value;
      responseData.database = {
        status: "connected",
        testQuery,
        statistics: {
          totalUsers: userCount,
          totalPhrases: phraseCount
        }
      };
    } else {
      responseData.database = {
        status: "failed",
        error: dbResult.reason?.message || "Database connection failed"
      };
    }

    if (redisSuccess) {
      const cacheStats = redisService.getStats();
      responseData.redis = {
        status: "connected",
        stats: cacheStats,
        hitRatio: redisService.getHitRatio(),
        testResult: "Cache read/write test successful"
      };
    } else {
      responseData.redis = {
        status: "failed", 
        error: redisResult.reason?.message || "Redis connection failed"
      };
    }

    res.status(dbSuccess && redisSuccess ? 200 : 503).json(responseData);

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Service test failed",
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    });
  }
});

// Cache management endpoint
app.get("/api/v1/cache/stats", async (req, res) => {
  try {
    const stats = redisService.getStats();
    const hitRatio = redisService.getHitRatio();
    const isHealthy = redisService.isHealthy();

    res.json({
      status: "success",
      data: {
        cacheHealth: isHealthy ? "healthy" : "unhealthy",
        statistics: stats,
        performance: {
          hitRatio: Math.round(hitRatio * 10000) / 100, // Percentage with 2 decimal places
          totalRequests: stats.hits + stats.misses,
          cacheEfficiency: hitRatio > 0.7 ? "excellent" : hitRatio > 0.5 ? "good" : "needs improvement"
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve cache statistics",
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    });
  }
});

// Cache management endpoints (for development/admin use)
app.delete("/api/v1/cache/clear", async (req, res) => {
  try {
    const { pattern } = req.query;
    let deletedCount = 0;

    if (pattern) {
      deletedCount = await redisService.deleteByPattern(pattern as string);
    } else {
      // Clear all LinguaLeap cache keys
      deletedCount = await redisService.deleteByPattern("*");
    }

    res.json({
      status: "success",
      message: `Cache cleared successfully`,
      data: {
        deletedKeys: deletedCount,
        pattern: pattern || "all"
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to clear cache",
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    });
  }
});

// API info endpoint
app.get("/api/v1", (req, res) => {
  res.json({
    message: "LinguaLeap API v1",
    version: "1.0.0",
    endpoints: [
      "GET /health - Service health check",
      "GET /api/v1/health - API health check with cache stats", 
      "GET /api/v1/db-test - Database and Redis connectivity test",
      "GET /api/v1/cache/stats - Cache performance statistics",
      "DELETE /api/v1/cache/clear - Clear cache (admin endpoint)"
    ],
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not found",
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Start server with Redis connection
async function startServer() {
  try {
    console.log("🔌 Connecting to database...");
    await connectDatabase();
    console.log("✅ Database connected successfully");
    
    console.log("🔌 Connecting to Redis...");
    try {
      await redisService.connect();
      console.log("✅ Redis connected successfully");
    } catch (redisError) {
      console.warn("⚠️ Redis connection failed, continuing without cache:", redisError);
      console.warn("📝 Application will run in degraded mode without caching");
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 LinguaLeap Backend running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔍 API health: http://localhost:${PORT}/api/v1/health`);
      console.log(`🗄️ Database test: http://localhost:${PORT}/api/v1/db-test`);
      console.log(`📈 Cache stats: http://localhost:${PORT}/api/v1/cache/stats`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      console.log(`💾 Cache status: ${redisService.isHealthy() ? "Enabled" : "Disabled (Degraded Mode)"}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("🔄 Shutting down server...");
  try {
    await prisma.$disconnect();
    console.log("✅ Database disconnected");
    
    if (redisService.isHealthy()) {
      await redisService.disconnect();
      console.log("✅ Redis disconnected");
    }
  } catch (error) {
    console.error("⚠️ Error during shutdown:", error);
  }
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("🔄 Received SIGTERM, shutting down server...");
  try {
    await prisma.$disconnect();
    if (redisService.isHealthy()) {
      await redisService.disconnect();
    }
  } catch (error) {
    console.error("⚠️ Error during shutdown:", error);
  }
  process.exit(0);
});

startServer();

export default app;
