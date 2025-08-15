import { apiClient } from "./apiClient";
import { API_ENDPOINTS, User, UserStats } from "../../types/api.types";

/**
 * User Service - Profile management and statistics
 */
class UserApiService {
  
  /**
   * Get user profile data
   */
  async getUserProfile(): Promise<User> {
    const response = await apiClient.get<User>(API_ENDPOINTS.USERS.PROFILE);
    
    if (response.status !== "success" || !response.data) {
      throw new Error(response.message || "Failed to get user profile");
    }
    
    return response.data;
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<User>): Promise<User> {
    const response = await apiClient.put<{user: User}>(API_ENDPOINTS.USERS.PROFILE, updates);
    
    if (response.status !== "success" || !response.data || !response.data.user) {
      throw new Error(response.message || "Failed to update profile");
    }
    
    return response.data.user;
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<UserStats> {
    const response = await apiClient.get<UserStats>(API_ENDPOINTS.USERS.STATS);
    
    if (response.status !== "success" || !response.data) {
      throw new Error(response.message || "Failed to get user statistics");
    }
    
    return response.data;
  }
}

// Export singleton instance
export const userApiService = new UserApiService();
export default userApiService;
