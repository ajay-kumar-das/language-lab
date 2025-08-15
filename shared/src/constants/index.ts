// API Constants
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/profile",
  },
  USERS: {
    BASE: "/users",
    PROFILE: "/users/profile",
    PREFERENCES: "/users/preferences",
  },
  HEALTH: {
    BASE: "/health",
    DETAILED: "/health/detailed",
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Cache Keys
export const CACHE_KEYS = {
  USER_PROFILE: "user:profile",
  USER_PREFERENCES: "user:preferences",
  HEALTH_STATUS: "system:health",
} as const;

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const;

// Validation Constants
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  EMAIL_MAX_LENGTH: 254,
  NAME_MAX_LENGTH: 100,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
} as const;

// Language Learning Constants
export const LANGUAGES = {
  SUPPORTED: ["en", "es", "fr", "de", "it", "pt", "ru", "zh", "ja", "ko"] as const,
  DEFAULT: "en" as const,
} as const;

export const DIFFICULTY_LEVELS = ["beginner", "intermediate", "advanced"] as const;

export const LESSON_TYPES = ["vocabulary", "grammar", "pronunciation", "conversation"] as const;
