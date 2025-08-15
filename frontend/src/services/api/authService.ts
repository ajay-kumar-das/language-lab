import { apiClient } from "./apiClient";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  User,
  API_ENDPOINTS,
  ApiResponse
} from "../../types/api.types";

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthApiService {
  /**
   * Login user with credentials
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    
    if (response.status !== "success" || !response.data) {
      throw new Error(response.message || "Login failed");
    }
    
    return response.data;
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      userData
    );
    
    if (response.status !== "success" || !response.data) {
      throw new Error(response.message || "Registration failed");
    }
    
    return response.data;
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );
    
    if (response.status !== "success" || !response.data) {
      throw new Error(response.message || "Token refresh failed");
    }
    
    return response.data;
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<{user: User}>(API_ENDPOINTS.AUTH.ME);
    
    if (response.status !== "success" || !response.data || !response.data.user) {
      throw new Error(response.message || "Failed to get user profile");
    }
    
    return response.data.user;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Even if logout fails on server, we should clear local auth
      console.warn("Server logout failed, but continuing with local cleanup:", error);
    }
  }

  /**
   * Verify if current token is valid
   */
  async verifyToken(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const authApiService = new AuthApiService();
export default authApiService;
