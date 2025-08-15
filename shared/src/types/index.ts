import { z } from "zod";
import { LANGUAGES, DIFFICULTY_LEVELS, LESSON_TYPES } from "../constants";

// User Types
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string().min(3).max(30),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  avatar: z.string().url().optional(),
  isActive: z.boolean().default(true),
  isVerified: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isActive: true,
  isVerified: true,
});

export type CreateUser = z.infer<typeof CreateUserSchema>;

// Auth Types
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginRequest = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  username: z.string().min(3).max(30),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
});

export type RegisterRequest = z.infer<typeof RegisterSchema>;

export const AuthResponseSchema = z.object({
  user: UserSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// API Response Types
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    message: z.string().optional(),
    errors: z.array(z.string()).optional(),
    meta: z.object({
      timestamp: z.string(),
      requestId: z.string().optional(),
    }),
  });

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  meta: {
    timestamp: string;
    requestId?: string;
  };
};

// Error Types
export const ApiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }),
  meta: z.object({
    timestamp: z.string(),
    requestId: z.string().optional(),
  }),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

// Language Learning Types
export const LanguageSchema = z.enum(LANGUAGES.SUPPORTED);
export type Language = z.infer<typeof LanguageSchema>;

export const DifficultyLevelSchema = z.enum(DIFFICULTY_LEVELS);
export type DifficultyLevel = z.infer<typeof DifficultyLevelSchema>;

export const LessonTypeSchema = z.enum(LESSON_TYPES);
export type LessonType = z.infer<typeof LessonTypeSchema>;

// Health Check Types
export const HealthStatusSchema = z.object({
  status: z.enum(["ok", "degraded", "error"]),
  timestamp: z.string(),
  uptime: z.number(),
  environment: z.string(),
  services: z
    .object({
      database: z.object({
        status: z.enum(["ok", "error", "warning"]),
        message: z.string().optional(),
      }),
      redis: z.object({
        status: z.enum(["ok", "error", "warning"]),
        message: z.string().optional(),
      }),
      memory: z.object({
        status: z.enum(["ok", "error", "warning"]),
        usage: z
          .object({
            total: z.string(),
            used: z.string(),
            percentage: z.string(),
          })
          .optional(),
      }),
    })
    .optional(),
});

export type HealthStatus = z.infer<typeof HealthStatusSchema>;
