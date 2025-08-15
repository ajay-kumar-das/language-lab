// API Response Types
export interface ApiResponse<T = any> {
  status: "success" | "error";
  message?: string;
  data?: T;
  errors?: string[];
}

// User Types - Updated to match backend
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  nativeLanguage?: string;
  appLanguage?: string; // Interface/display language
  targetLanguage?: string;
  targetLanguages?: string[];
  level?: "beginner" | "intermediate" | "advanced";
  profilePicture?: string;
  bio?: string;
  preferences?: UserPreferences;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
  // Client-side fields
  tokenExpiry?: number;
}

export interface UserPreferences {
  dailyGoal: number;
  reminderTime?: string;
  theme?: "light" | "dark" | "system";
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  privacySettings: {
    profileVisibility: "public" | "private";
    showProgress: boolean;
  };
}

export interface UserStats {
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  wordsLearned: number;
  lessonsCompleted: number;
  coursesEnrolled: number;
  timeSpent: number; // in minutes
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface UserGoals {
  id: string;
  userId: string;
  dailyXPGoal: number;
  weeklyGoal: number;
  currentWeekProgress: number;
  targetLanguage: string;
  completionDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Authentication Types - Updated to match backend
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    nativeLanguage?: string;
    appLanguage?: string;
    lastLoginAt?: string;
  };
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  nativeLanguage?: string;
  targetLanguage?: string;
  targetLanguages?: string[];
  level?: "beginner" | "intermediate" | "advanced";
}

export interface RegisterResponse {
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    nativeLanguage?: string;
    appLanguage?: string;
  };
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
  field?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// HTTP Status Codes
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503
}

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/v1/auth/login",
    REGISTER: "/v1/auth/register",
    REFRESH: "/v1/auth/refresh",
    LOGOUT: "/v1/auth/logout",
    ME: "/v1/auth/me",
  },
  // Users
  USERS: {
    PROFILE: "/v1/users/profile",
    STATS: "/v1/users/stats",
  },
  // Vocabulary
  VOCABULARY: {
    PHRASES: "/v1/vocabulary/phrases",
    SESSIONS: "/v1/vocabulary/sessions",
  }
} as const;

// Re-export language types from centralized constants
export type { Language as SupportedLanguage } from '../constants/languages';
export { SUPPORTED_LANGUAGES, APP_INTERFACE_LANGUAGES } from '../constants/languages';
