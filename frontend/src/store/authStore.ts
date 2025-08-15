import { create } from "zustand";
import { persist } from "zustand/middleware";

// Updated User interface to match backend structure
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
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
  // Client-side fields
  tokenExpiry?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  sessionExpiry: number | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setTokens: (token: string, refreshToken?: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
  clearError: () => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  extendSession: () => void;
  checkSessionExpiry: () => boolean;
  isTokenExpired: () => boolean;
  
  // Utility methods
  getFullName: () => string;
  getDisplayName: () => string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      error: null,
      sessionExpiry: null,
      
      setUser: (user) => set({
        user,
        isAuthenticated: !!user,
        sessionExpiry: user ? Date.now() + (7 * 24 * 60 * 60 * 1000) : null, // 7 days
      }),
      
      setTokens: (token, refreshToken) => {
        const updates: any = { token };
        if (refreshToken) updates.refreshToken = refreshToken;
        set(updates);
      },
      
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setInitialized: (initialized) => set({ isInitialized: initialized }),
      clearError: () => set({ error: null }),
      
      logout: () => {
        const { user } = get();
        // Preserve user's language preference for next login
        if (user?.appLanguage) {
          localStorage.setItem('lingualeap-auth-language', user.appLanguage);
        }
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          sessionExpiry: null,
          error: null,
        });
      },
      
      updateUser: (updates) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },
      
      extendSession: () => set({
        sessionExpiry: Date.now() + (7 * 24 * 60 * 60 * 1000), // Extend by 7 days
      }),
      
      checkSessionExpiry: () => {
        const { sessionExpiry } = get();
        if (!sessionExpiry) return false;
        return Date.now() > sessionExpiry;
      },
      
      isTokenExpired: () => {
        const { user, token, sessionExpiry } = get();
        if (!token || !user) return true;
        if (user.tokenExpiry && Date.now() > user.tokenExpiry) return true;
        if (sessionExpiry && Date.now() > sessionExpiry) return true;
        return false;
      },
      
      getFullName: () => {
        const { user } = get();
        if (!user) return "";
        return `${user.firstName || ""} ${user.lastName || ""}`.trim();
      },
      
      getDisplayName: () => {
        const { user } = get();
        if (!user) return "User";
        const fullName = get().getFullName();
        return fullName || user.email || "User";
      },
    }),
    {
      name: "lingualeap-auth",
      // Only persist specific fields for security
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        sessionExpiry: state.sessionExpiry,
      }),
    }
  )
);
