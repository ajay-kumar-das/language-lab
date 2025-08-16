import express from "express";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, TokenManager } from "../middleware/auth";
import redisService from "../services/redis.service";
import { userCache, invalidateCache } from "../middleware/cache.middleware";
import passport from "../config/passport";
import emailService from "../services/email.service";
import crypto from "crypto";

const router = express.Router();
const prisma = new PrismaClient();

// Register endpoint
router.post("/register", invalidateCache(["user:*", "stats:*"]), async (req, res) => {
  try {
    const { email, password, firstName, lastName, nativeLanguage, appLanguage } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        status: "error",
        message: "Email, password, firstName, and lastName are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 6 characters long"
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "User already exists with this email"
      });
    }


    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || "12");
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        firstName,
        lastName,
        password: hashedPassword,
        targetLanguage: "Spanish", // Default target language
        nativeLanguage: nativeLanguage || "English",
        appLanguage: appLanguage || "English",
        verificationToken,
        isVerified: false
      }
    });

    // Send verification email
    if (emailService.isReady()) {
      await emailService.sendVerificationEmail(user.email, verificationToken, user.firstName);
    }

    const token = jwt.sign(
      {
        id: user.id,
        userId: user.id,
        email: user.email
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d"
      }
    );

    // Cache user session data
    if (redisService.isHealthy()) {
      const sessionData = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        registeredAt: new Date().toISOString()
      };
      
      const ttl = 7 * 24 * 60 * 60; // 7 days in seconds
      await TokenManager.setUserSession(user.id, sessionData, ttl);
      
      // Cache user profile data
      await redisService.set(
        `user:profile:${user.id}`,
        sessionData,
        { ttl: 15 * 60 } // 15 minutes
      );
    }

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        user: {
          id: user.id,
          email: user.email,
                    firstName: user.firstName,
          lastName: user.lastName
        },
        token
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error during registration"
    });
  }
});

// Login endpoint
router.post("/login", invalidateCache((req) => [`user:session:${req.body.email}:*`]), async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required"
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password"
      });
    }

    // Check if user has a Google account (no password)
    if (user.googleId && !user.password) {
      return res.status(401).json({
        status: "error",
        message: "This account is linked to Google. Please use Google Sign-In."
      });
    }

    // Check if user has no password set (shouldn't happen for regular users)
    if (!user.password) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password"
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password!);

    if (!isValidPassword) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        userId: user.id,
        email: user.email
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d"
      }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Cache user session data and profile
    if (redisService.isHealthy()) {
      const sessionData = {
        id: user.id,
        email: user.email,
                firstName: user.firstName,
        lastName: user.lastName,
        lastLoginAt: new Date().toISOString()
      };
      
      const ttl = 7 * 24 * 60 * 60; // 7 days in seconds
      await TokenManager.setUserSession(user.id, sessionData, ttl);
      
      // Cache user profile data
      await redisService.set(
        `user:profile:${user.id}`,
        sessionData,
        { ttl: 15 * 60 } // 15 minutes
      );

      // Invalidate old session caches
      await redisService.invalidateUserCache(user.id);
    }

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
                    firstName: user.firstName,
          lastName: user.lastName,
          nativeLanguage: user.nativeLanguage,
          appLanguage: user.appLanguage,
          lastLoginAt: new Date()
        },
        token
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error during login"
    });
  }
});

// Get current user profile (with caching)
router.get("/me", userCache(900), authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "Invalid token"
      });
    }

    // Try to get from cache first
    let cachedProfile = null;
    if (redisService.isHealthy()) {
      cachedProfile = await redisService.get(`user:profile:${userId}`);
      if (cachedProfile) {
        return res.status(200).json({
          status: "success",
          data: { user: cachedProfile }
        });
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userGoals: true,
        personalizedCourses: {
          select: {
            id: true,
            courseName: true,
            targetLanguage: true,
            proficiencyLevel: true,
            isActive: true,
            totalLessons: true,
            estimatedDurationWeeks: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }

    const userProfile = {
      id: user.id,
      email: user.email,
            firstName: user.firstName,
      lastName: user.lastName,
      nativeLanguage: user.nativeLanguage,
      appLanguage: user.appLanguage,
      lastLoginAt: user.lastLoginAt,
      userGoals: user.userGoals,
      personalizedCourses: user.personalizedCourses
    };

    // Cache the profile data
    if (redisService.isHealthy()) {
      await redisService.set(
        `user:profile:${userId}`,
        userProfile,
        { ttl: 15 * 60 } // 15 minutes
      );
    }

    res.status(200).json({
      status: "success",
      data: { user: userProfile }
    });

  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error while fetching profile"
    });
  }
});

// Logout endpoint with token blacklisting
router.post("/logout", authMiddleware, async (req, res) => {
  try {
    const token = req.headers.authorization?.substring(7);
    const userId = req.user?.userId;

    if (token && redisService.isHealthy()) {
      // Get token expiry for TTL
      const decoded = jwt.decode(token) as any;
      const ttl = decoded?.exp ? decoded.exp - Math.floor(Date.now() / 1000) : 3600;
      
      // Blacklist the token
      await TokenManager.blacklistToken(token, Math.max(ttl, 0));
      
      // Invalidate user sessions
      if (userId) {
        await TokenManager.invalidateUserSessions(userId);
        await redisService.invalidateUserCache(userId);
      }
    }

    res.status(200).json({
      status: "success",
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error during logout"
    });
  }
});

// Refresh token endpoint
router.post("/refresh", authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const currentToken = req.headers.authorization?.substring(7);

    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "Invalid token"
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User not found"
      });
    }

    const newToken = jwt.sign(
      {
        id: user.id,
        userId: user.id,
        email: user.email
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d"
      }
    );

    // Blacklist old token and cache new one
    if (currentToken && redisService.isHealthy()) {
      const decoded = jwt.decode(currentToken) as any;
      const ttl = decoded?.exp ? decoded.exp - Math.floor(Date.now() / 1000) : 3600;
      await TokenManager.blacklistToken(currentToken, Math.max(ttl, 0));
    }

    res.status(200).json({
      status: "success",
      message: "Token refreshed successfully",
      data: {
        user: {
          id: user.id,
          email: user.email,
                    firstName: user.firstName,
          lastName: user.lastName,
          nativeLanguage: user.nativeLanguage,
          appLanguage: user.appLanguage
        },
        token: newToken
      }
    });

  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error during token refresh"
    });
  }
});

// Google OAuth routes
// Initiate Google authentication
router.get("/google", (req, res, next) => {
  // Check if Google strategy is configured
  const googleClientID = process.env.GOOGLE_CLIENT_ID;
  if (!googleClientID || googleClientID === 'your_google_client_id_here') {
    return res.status(503).json({
      status: "error",
      message: "Google OAuth is not configured. Please set up GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.",
      code: "OAUTH_NOT_CONFIGURED"
    });
  }
  
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })(req, res, next);
});

// Google OAuth callback
router.get("/google/callback", (req, res, next) => {
  // Check if Google strategy is configured
  const googleClientID = process.env.GOOGLE_CLIENT_ID;
  if (!googleClientID || googleClientID === 'your_google_client_id_here') {
    const frontendURL = process.env.FRONTEND_URL || "http://localhost:3001";
    return res.redirect(`${frontendURL}/auth/callback?error=oauth_not_configured`);
  }
  
  passport.authenticate("google", { session: false })(req, res, next);
}, async (req: any, res) => {
    try {
      const { user, token } = req.user;
      
      // Cache user session data
      if (redisService.isHealthy()) {
        const sessionData = {
          id: user.id,
          email: user.email,
                    firstName: user.firstName,
          lastName: user.lastName,
          loginMethod: 'google'
        };
        
        const ttl = 7 * 24 * 60 * 60; // 7 days
        await TokenManager.setUserSession(user.id, sessionData, ttl);
        
        // Cache user profile
        await redisService.set(
          `user:profile:${user.id}`,
          sessionData,
          { ttl: 15 * 60 } // 15 minutes
        );
      }

      // Redirect to frontend with token
      const frontendURL = process.env.FRONTEND_URL || "http://localhost:3001";
      res.redirect(`${frontendURL}/auth/callback?token=${token}&success=true`);
      
    } catch (error) {
      console.error("Google OAuth callback error:", error);
      const frontendURL = process.env.FRONTEND_URL || "http://localhost:3001";
      res.redirect(`${frontendURL}/auth/callback?error=oauth_failed`);
    }
  }
);

// Email verification endpoint
router.post("/verify-email", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        status: "error",
        message: "Verification token is required"
      });
    }

    const user = await prisma.user.findFirst({
      where: { verificationToken: token }
    });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired verification token"
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        status: "error",
        message: "Email is already verified"
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null
      }
    });

    // Invalidate user cache
    if (redisService.isHealthy()) {
      await redisService.invalidateUserCache(user.id);
    }

    res.status(200).json({
      status: "success",
      message: "Email verified successfully"
    });

  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error during email verification"
    });
  }
});

// Resend verification email endpoint
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email is required"
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        status: "error",
        message: "Email is already verified"
      });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');

    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken }
    });

    // Send verification email
    if (emailService.isReady()) {
      await emailService.sendVerificationEmail(user.email, verificationToken, user.firstName);
    }

    res.status(200).json({
      status: "success",
      message: "Verification email sent successfully"
    });

  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error while resending verification email"
    });
  }
});

// Forgot password endpoint
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email is required"
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      // Return success even if user doesn't exist for security
      return res.status(200).json({
        status: "success",
        message: "If an account with that email exists, a password reset link has been sent"
      });
    }

    // Check if user has a Google account (no password)
    if (user.googleId && !user.password) {
      return res.status(400).json({
        status: "error",
        message: "This account is linked to Google. Please use Google Sign-In."
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires
      }
    });

    // Send password reset email
    if (emailService.isReady()) {
      await emailService.sendPasswordResetEmail(user.email, resetToken, user.firstName);
    }

    res.status(200).json({
      status: "success",
      message: "If an account with that email exists, a password reset link has been sent"
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error during password reset request"
    });
  }
});

// Reset password endpoint
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        status: "error",
        message: "Token and new password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 6 characters long"
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired reset token"
      });
    }

    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || "12");
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null
      }
    });

    // Invalidate all user sessions for security
    if (redisService.isHealthy()) {
      await TokenManager.invalidateUserSessions(user.id);
      await redisService.invalidateUserCache(user.id);
    }

    // Send confirmation email
    if (emailService.isReady()) {
      await emailService.sendPasswordResetConfirmation(user.email, user.firstName);
    }

    res.status(200).json({
      status: "success",
      message: "Password reset successfully"
    });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error during password reset"
    });
  }
});

export default router;
