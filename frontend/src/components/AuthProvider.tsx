import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "./LanguageProvider";
import { GlobalLoader } from "./ui/Loading";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Enhanced Authentication Provider Component
 * Integrates with real backend API and provides comprehensive auth state management
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();
  const { initializeFromUser } = useLanguage();
  const [isInitializing, setIsInitializing] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Handle authentication initialization
  useEffect(() => {
    if (auth.isInitialized) {
      setIsInitializing(false);
    }
  }, [auth.isInitialized]);

  // Initialize language preferences when user is authenticated
  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      const appLanguage = auth.user.appLanguage || 'English';
      const nativeLanguage = auth.user.nativeLanguage || 'English';
      console.log('Initializing language preferences:', { appLanguage, nativeLanguage });
      initializeFromUser(appLanguage, nativeLanguage);
    }
  }, [auth.isAuthenticated, auth.user, initializeFromUser]);

  // Listen for logout events from API client
  useEffect(() => {
    const handleLogout = () => {
      auth.logout();
    };

    window.addEventListener("auth-logout", handleLogout);
    
    return () => {
      window.removeEventListener("auth-logout", handleLogout);
    };
  }, [auth.logout]);

  // Enhanced login with better error handling
  const handleLogin = async (credentials: any) => {
    setAuthError(null);
    try {
      await auth.login(credentials);
    } catch (error: any) {
      const errorMessage = error?.message || "Login failed. Please try again.";
      setAuthError(errorMessage);
      throw error;
    }
  };

  // Enhanced registration with better error handling
  const handleRegister = async (data: any) => {
    setAuthError(null);
    try {
      await auth.register(data);
    } catch (error: any) {
      const errorMessage = error?.message || "Registration failed. Please try again.";
      setAuthError(errorMessage);
      throw error;
    }
  };

  // Enhanced logout
  const handleLogout = async () => {
    setAuthError(null);
    try {
      await auth.logout();
    } catch (error: any) {
      console.warn("Logout warning:", error);
      // Continue with logout even if backend fails
    }
  };

  // Show loading screen during initialization
  if (isInitializing || !auth.isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <GlobalLoader />
          <h2 className="text-lg font-semibold text-gray-200 mt-4">
            Initializing LinguaLeap...
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Connecting to your learning environment
          </p>
        </div>
      </div>
    );
  }

  const contextValue: AuthContextType = {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    isLoading: auth.isLoading,
    error: authError || auth.error,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use authentication context
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
