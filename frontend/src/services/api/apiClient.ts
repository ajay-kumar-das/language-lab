import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { ApiResponse, ApiError, HttpStatus } from "../../types/api.types";

/**
 * Enhanced API Client for LinguaLeap
 * Handles authentication, token management, and comprehensive error handling
 */
class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;
  private tokenRefreshPromise: Promise<boolean> | null = null;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getStoredToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(this.handleRequestError(error));
      }
    );

    // Response interceptor for error handling and token refresh
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Handle 401 errors with token refresh
        if (error.response?.status === HttpStatus.UNAUTHORIZED && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshed = await this.refreshTokenIfNeeded();
            if (refreshed && originalRequest.headers) {
              const newToken = this.getStoredToken();
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            this.handleUnauthorized();
            return Promise.reject(this.handleResponseError(error));
          }
        }

        return Promise.reject(this.handleResponseError(error));
      }
    );
  }

  /**
   * Get stored JWT token
   */
  private getStoredToken(): string | null {
    try {
      const authData = localStorage.getItem("lingualeap-auth");
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.state?.token || null;
      }
    } catch (error) {
      console.error("Error getting stored token:", error);
    }
    return null;
  }

  /**
   * Get stored refresh token
   */
  private getStoredRefreshToken(): string | null {
    try {
      const authData = localStorage.getItem("lingualeap-auth");
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.state?.refreshToken || null;
      }
    } catch (error) {
      console.error("Error getting stored refresh token:", error);
    }
    return null;
  }

  /**
   * Check if token needs refresh and refresh if needed
   */
  private async refreshTokenIfNeeded(): Promise<boolean> {
    if (this.tokenRefreshPromise) {
      return this.tokenRefreshPromise;
    }

    const refreshToken = this.getStoredRefreshToken();
    if (!refreshToken) {
      return false;
    }

    this.tokenRefreshPromise = this.performTokenRefresh(refreshToken);
    
    try {
      const result = await this.tokenRefreshPromise;
      return result;
    } finally {
      this.tokenRefreshPromise = null;
    }
  }

  /**
   * Perform actual token refresh
   */
  private async performTokenRefresh(refreshToken: string): Promise<boolean> {
    try {
      const response = await axios.post(`${this.baseURL}/v1/auth/refresh`, {
        refreshToken
      });

      const { token, refreshToken: newRefreshToken } = response.data.data;
      
      // Update stored tokens
      this.updateStoredTokens(token, newRefreshToken);
      
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  }

  /**
   * Update stored authentication tokens
   */
  private updateStoredTokens(token: string, refreshToken: string) {
    try {
      const authData = localStorage.getItem("lingualeap-auth");
      if (authData) {
        const parsed = JSON.parse(authData);
        parsed.state.token = token;
        parsed.state.refreshToken = refreshToken;
        localStorage.setItem("lingualeap-auth", JSON.stringify(parsed));
      }
    } catch (error) {
      console.error("Error updating stored tokens:", error);
    }
  }

  /**
   * Handle unauthorized access - clear auth and redirect
   */
  private handleUnauthorized() {
    localStorage.removeItem("lingualeap-auth");
    // Dispatch logout event
    window.dispatchEvent(new CustomEvent("auth-logout"));
    // Optionally redirect to login
    if (window.location.pathname !== "/") {
      window.location.href = "/";
    }
  }

  /**
   * Handle request errors
   */
  private handleRequestError(error: any): ApiError {
    return {
      message: "Request failed",
      details: error,
    };
  }

  /**
   * Handle response errors with proper error formatting
   */
  private handleResponseError(error: AxiosError): ApiError {
    const response = error.response;
    
    if (!response) {
      return {
        message: "Network error - please check your connection",
        code: "NETWORK_ERROR",
      };
    }

    const apiError: ApiError = {
      message: "An error occurred",
      code: response.status.toString(),
    };

    // Handle different status codes
    switch (response.status) {
      case HttpStatus.BAD_REQUEST:
        apiError.message = response.data?.message || "Invalid request";
        apiError.details = response.data?.errors;
        break;
      case HttpStatus.UNAUTHORIZED:
        apiError.message = response.data?.message || "Authentication required";
        break;
      case HttpStatus.FORBIDDEN:
        apiError.message = "Access denied";
        break;
      case HttpStatus.NOT_FOUND:
        apiError.message = "Resource not found";
        break;
      case HttpStatus.CONFLICT:
        apiError.message = response.data?.message || "Conflict occurred";
        break;
      case HttpStatus.UNPROCESSABLE_ENTITY:
        apiError.message = response.data?.message || "Validation failed";
        apiError.details = response.data?.errors;
        break;
      case HttpStatus.INTERNAL_SERVER_ERROR:
        apiError.message = "Server error - please try again later";
        break;
      case HttpStatus.SERVICE_UNAVAILABLE:
        apiError.message = "Service temporarily unavailable";
        break;
      default:
        apiError.message = response.data?.message || "An unexpected error occurred";
    }

    return apiError;
  }

  /**
   * Generic API request wrapper
   */
  private async makeRequest<T>(
    method: "get" | "post" | "put" | "patch" | "delete",
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client[method](
        url,
        ...(method === "get" || method === "delete" ? [config] : [data, config])
      );
      
      return response.data;
    } catch (error) {
      throw error; // Let interceptors handle the error
    }
  }

  // HTTP Methods with proper typing
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>("get", url, undefined, config);
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>("post", url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>("put", url, data, config);
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>("patch", url, data, config);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>("delete", url, config);
  }

  // Utility methods
  setAuthToken(token: string) {
    this.client.defaults.headers.Authorization = `Bearer ${token}`;
  }

  clearAuthToken() {
    delete this.client.defaults.headers.Authorization;
  }

  getBaseURL(): string {
    return this.baseURL;
  }

  /**
   * Upload file with progress tracking
   */
  async uploadFile<T = any>(
    url: string,
    file: File,
    onProgress?: (progressEvent: ProgressEvent) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append("file", file);

    return this.post<T>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: onProgress,
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
