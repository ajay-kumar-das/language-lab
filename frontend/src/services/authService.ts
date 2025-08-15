import { useAuthStore, type User } from "../store/authStore";
import { authApiService } from "./api/authService";
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse
} from "../types/api.types";

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
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

/**
 * Enhanced Authentication Service
 * Integrates with real backend API and manages authentication state
 */
export class AuthService {
  private static instance: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Login user with credentials
   */
  async login(credentials: LoginCredentials): Promise<User> {
    const { setLoading, setError, setUser, setTokens, clearError } = useAuthStore.getState();
    
    setLoading(true);
    clearError();
    
    try {
      const loginRequest: LoginRequest = {
        email: credentials.email,
        password: credentials.password,
        rememberMe: credentials.rememberMe
      };

      const response: LoginResponse = await authApiService.login(loginRequest);
      
      // Convert API user to store user format
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        username: response.user.username,
        nativeLanguage: response.user.nativeLanguage,
        appLanguage: response.user.appLanguage,
        lastLoginAt: response.user.lastLoginAt,
        tokenExpiry: response.expiresIn ? Date.now() + (response.expiresIn * 1000) : Date.now() + (7 * 24 * 60 * 60 * 1000),
      };
      
      // Update store with user and tokens
      setUser(user);
      setTokens(response.token, response.refreshToken);
      
      return user;
    } catch (error: any) {
      const errorMessage = error?.message || "Login failed. Please try again.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<User> {
    const { setLoading, setError, setUser, setTokens, clearError } = useAuthStore.getState();
    
    setLoading(true);
    clearError();
    
    try {
      const registerRequest: RegisterRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        password: data.password,
        nativeLanguage: data.nativeLanguage,
        targetLanguage: data.targetLanguage,
        targetLanguages: data.targetLanguages,
        level: data.level
      };

      const response: RegisterResponse = await authApiService.register(registerRequest);
      
      // Convert API user to store user format
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        username: response.user.username,
        nativeLanguage: response.user.nativeLanguage,
        appLanguage: response.user.appLanguage,
        tokenExpiry: response.expiresIn ? Date.now() + (response.expiresIn * 1000) : Date.now() + (7 * 24 * 60 * 60 * 1000),
      };
      
      // Update store with user and tokens
      setUser(user);
      setTokens(response.token, response.refreshToken);
      
      return user;
    } catch (error: any) {
      const errorMessage = error?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    const { setLoading, logout } = useAuthStore.getState();
    
    setLoading(true);
    
    try {
      // Call backend logout (even if it fails, continue with local logout)
      await authApiService.logout();
    } catch (error) {
      console.warn("Backend logout failed, but continuing with local logout:", error);
    } finally {
      // Always clear local auth state
      logout();
      setLoading(false);
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<boolean> {
    const { refreshToken, setTokens, logout } = useAuthStore.getState();
    
    if (!refreshToken) {
      return false;
    }
    
    try {
      const response = await authApiService.refreshToken(refreshToken);
      setTokens(response.token, response.refreshToken);
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      return false;
    }
  }

  /**
   * Initialize authentication on app start
   */
  async initializeAuth(): Promise<void> {
    const { setLoading, setInitialized, token, logout } = useAuthStore.getState();
    
    try {
      setLoading(true);
      
      if (!token) {
        setInitialized(true);
        return;
      }

      // Verify token by getting current user
      const isValid = await authApiService.verifyToken();
      
      if (!isValid) {
        console.log("Token is invalid, logging out");
        logout();
      } else {
        // Try to get fresh user data
        console.log("Token is valid, getting current user");
        const user = await this.getCurrentUser();
        console.log("Current user loaded:", user);
      }
    } catch (error) {
      console.error("Auth initialization failed:", error);
      logout();
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }

  /**
   * Verify current authentication status
   */
  async verifyAuth(): Promise<boolean> {
    const { token } = useAuthStore.getState();
    
    if (!token) {
      return false;
    }
    
    try {
      return await authApiService.verifyToken();
    } catch (error) {
      console.error("Auth verification failed:", error);
      return false;
    }
  }

  /**
   * Get current user from backend
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const apiUser = await authApiService.getCurrentUser();
      
      // Map backend user structure to frontend User interface
      const user: User = {
        id: apiUser.id,
        email: apiUser.email,
        firstName: apiUser.firstName,
        lastName: apiUser.lastName,
        username: apiUser.username,
        nativeLanguage: apiUser.nativeLanguage,
        appLanguage: apiUser.appLanguage,
        targetLanguage: apiUser.targetLanguage,
        targetLanguages: apiUser.targetLanguages,
        level: apiUser.level,
        lastLoginAt: apiUser.lastLoginAt,
        createdAt: apiUser.createdAt,
        updatedAt: apiUser.updatedAt,
        tokenExpiry: useAuthStore.getState().user?.tokenExpiry,
      };
      
      useAuthStore.getState().setUser(user);
      return user;
    } catch (error) {
      console.error("Failed to get current user:", error);
      return null;
    }
  }

  /**
   * Password reset request (placeholder for future implementation)
   */
  async requestPasswordReset(email: string): Promise<void> {
    // TODO: Implement when backend endpoint is available
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Password reset requested for:", email);
  }

  /**
   * Password reset (placeholder for future implementation)
   */
  async resetPassword(data: any): Promise<void> {
    // TODO: Implement when backend endpoint is available
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Password reset attempted:", data);
  }
}

export const authService = AuthService.getInstance();
