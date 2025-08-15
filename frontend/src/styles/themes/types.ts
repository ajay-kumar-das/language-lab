export interface Theme {
  name: string;
  displayName: string;
  colors: {
    // Primary brand colors
    primary: string;
    primaryForeground: string;
    primaryHover: string;
    primaryActive: string;
    
    // Secondary colors
    secondary: string;
    secondaryForeground: string;
    secondaryHover: string;
    
    // Accent colors for highlights and CTAs
    accent: string;
    accentForeground: string;
    accentHover: string;
    
    // Background colors
    background: string;
    surface: string;
    surfaceElevated: string;
    
    // Text colors
    text: {
      primary: string;
      secondary: string;
      muted: string;
      inverse: string;
    };
    
    // Border and divider colors
    border: string;
    borderSubtle: string;
    divider: string;
    
    // Status colors
    success: string;
    successForeground: string;
    warning: string;
    warningForeground: string;
    error: string;
    errorForeground: string;
    info: string;
    infoForeground: string;
    
    // Interactive element colors
    interactive: {
      hover: string;
      active: string;
      focus: string;
      disabled: string;
    };
    
    // Sidebar specific colors
    sidebar: {
      background: string;
      foreground: string;
      primary: string;
      primaryForeground: string;
      accent: string;
      accentForeground: string;
      border: string;
    };
    
    // Gradients for visual appeal
    gradients: {
      primary: string;
      secondary: string;
      accent: string;
      hero: string;
      card: string;
    };
    
    // Learning-specific colors
    learning: {
      beginner: string;
      intermediate: string;
      advanced: string;
      correct: string;
      incorrect: string;
      streak: string;
    };
  };
  
  // Spacing system
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
    xxxl: string;
  };
  
  // Typography system
  typography: {
    fontFamily: {
      primary: string;
      secondary: string;
      mono: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      xxl: string;
      xxxl: string;
      xxxxl: string;
    };
    fontWeight: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
    lineHeight: {
      tight: string;
      normal: string;
      relaxed: string;
    };
  };
  
  // Border radius system
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  
  // Shadow system
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    inner: string;
  };
  
  // Animation timings
  animation: {
    fast: string;
    normal: string;
    slow: string;
  };
}

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}
