import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { themes, type Theme, type ThemeName, defaultTheme } from '../styles/themes';

interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (themeName: ThemeName) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultThemeName?: ThemeName;
}

// Helper function to apply theme CSS variables to document root
const applyThemeToDocument = (theme: Theme) => {
  const root = document.documentElement;
  
  // Update all color variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    if (typeof value === "object" && value !== null) {
      // Handle nested objects like text, border, interactive, sidebar, gradients
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        if (typeof nestedValue === "string") {
          root.style.setProperty(`--color-${key}-${nestedKey}`, nestedValue);
        }
      });
    } else if (typeof value === "string") {
      // Handle direct color values
      root.style.setProperty(`--color-${key}`, value);
    }
  });
  
  // Update spacing variables
  Object.entries(theme.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--spacing-${key}`, value);
  });
  
  // Update typography variables
  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    root.style.setProperty(`--font-size-${key}`, value);
  });
  
  Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
    root.style.setProperty(`--font-weight-${key}`, value);
  });
  
  // Update border radius variables
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    root.style.setProperty(`--border-radius-${key}`, value);
  });
  
  // Update shadow variables
  Object.entries(theme.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--shadow-${key}`, value);
  });
  
  // Add theme class to body for Tailwind dark mode support
  const body = document.body;
  body.classList.remove('light', 'dark');
  body.classList.add(theme.name);
  
  // Also add to html for completeness
  const html = document.documentElement;
  html.classList.remove('light', 'dark');
  html.classList.add(theme.name);
};

// Helper function to get stored theme preference
const getStoredTheme = (): ThemeName => {
  if (typeof window === 'undefined') return defaultTheme;
  
  try {
    const stored = localStorage.getItem('lingualeap-theme');
    if (stored && (stored === 'light' || stored === 'dark')) {
      return stored as ThemeName;
    }
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
  }
  
  // Check system preference as fallback
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return defaultTheme;
};

// Helper function to store theme preference
const storeTheme = (themeName: ThemeName) => {
  try {
    localStorage.setItem('lingualeap-theme', themeName);
  } catch (error) {
    console.warn('Failed to store theme in localStorage:', error);
  }
};

export function ThemeProvider({ children, defaultThemeName }: ThemeProviderProps) {
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    return defaultThemeName || getStoredTheme();
  });
  
  const theme = themes[themeName];
  
  // Apply theme to document when theme changes
  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);
  
  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if no theme is manually stored
      try {
        const storedTheme = localStorage.getItem('lingualeap-theme');
        if (!storedTheme) {
          setThemeName(e.matches ? 'dark' : 'light');
        }
      } catch (error) {
        // Fallback to system preference
        setThemeName(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  const setTheme = (newThemeName: ThemeName) => {
    setThemeName(newThemeName);
    storeTheme(newThemeName);
  };
  
  const toggleTheme = () => {
    const newTheme = themeName === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };
  
  const contextValue: ThemeContextType = {
    theme,
    themeName,
    setTheme,
    toggleTheme,
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}