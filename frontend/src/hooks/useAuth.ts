import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { authService, type LoginCredentials, type RegisterData } from '../services/authService';

/**
 * Authentication hook with comprehensive auth management
 * Provides authentication state and methods for React components
 */
export const useAuth = () => {
  const {
    user,
    token,
    refreshToken,
    isLoading,
    isInitialized,
    error,
    isAuthenticated,
    sessionExpiry,
    setLoading,
    setError,
    clearError,
    hasRole,
    hasPermissions,
    isTokenExpired,
    checkSessionExpiry,
    extendSession,
  } = useAuthStore();

  // Initialize auth state on mount
  useEffect(() => {
    if (!isInitialized) {
      authService.initializeAuth();
    }
  }, [isInitialized]);

  // Session expiry check
  useEffect(() => {
    if (isAuthenticated && sessionExpiry) {
      const checkInterval = setInterval(() => {
        if (checkSessionExpiry()) {
          logout();
        }
      }, 60000); // Check every minute

      return () => clearInterval(checkInterval);
    }
  }, [isAuthenticated, sessionExpiry, checkSessionExpiry]);

  /**
   * Login with credentials
   */
  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    clearError();
    
    try {
      await authService.login(credentials);
      extendSession();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register new user
   */
  const register = async (data: RegisterData) => {
    setLoading(true);
    clearError();
    
    try {
      await authService.register(data);
      extendSession();
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    setLoading(true);
    
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Request password reset
   */
  const requestPasswordReset = async (email: string) => {
    setLoading(true);
    clearError();
    
    try {
      await authService.requestPasswordReset(email);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Password reset failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset password
   */
  const resetPassword = async (email: string, token: string, newPassword: string) => {
    setLoading(true);
    clearError();
    
    try {
      await authService.resetPassword({ email, token, newPassword });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Password reset failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh authentication token
   */
  const refreshAuthToken = async () => {
    try {
      return await authService.refreshToken();
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  /**
   * Check if user has specific role
   */
  const checkRole = (role: string) => {
    return hasRole(role);
  };

  /**
   * Check if user has specific permissions
   */
  const checkPermissions = (permissions: string[]) => {
    return hasPermissions(permissions);
  };

  /**
   * Update user profile
   */
  const updateProfile = async (updates: Partial<typeof user>) => {
    setLoading(true);
    clearError();
    
    try {
      // This would typically make an API call
      // const response = await apiClient.put('/user/profile', updates);
      // useAuthStore.getState().updateUser(response.data);
      
      // For now, just update locally
      useAuthStore.getState().updateUser(updates);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Profile update failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    user,
    token,
    refreshToken,
    isLoading,
    isInitialized,
    error,
    isAuthenticated,
    
    // Actions
    login,
    register,
    logout,
    requestPasswordReset,
    resetPassword,
    refreshAuthToken,
    updateProfile,
    
    // Utilities
    hasRole: checkRole,
    hasPermissions: checkPermissions,
    isTokenExpired,
    clearError,
    extendSession,
  };
};
