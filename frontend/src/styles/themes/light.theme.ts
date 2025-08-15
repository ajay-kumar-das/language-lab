export const lightTheme = {
  name: 'light',
  colors: {
    // Primary colors
    primary: '#3b82f6', // blue-500
    primaryRgb: '59, 130, 246', // RGB values for glow effects
    primaryForeground: '#ffffff',
    primaryMuted: '#dbeafe', // blue-100
    
    // Secondary colors
    secondary: '#6366f1', // indigo-500
    secondaryForeground: '#ffffff',
    secondaryMuted: '#e0e7ff', // indigo-100
    
    // Accent colors
    accent: '#8b5cf6', // violet-500
    accentForeground: '#ffffff',
    accentMuted: '#ede9fe', // violet-100
    
    // Success, warning, error
    success: '#10b981', // emerald-500
    successForeground: '#ffffff',
    successMuted: '#d1fae5', // emerald-100
    
    warning: '#f59e0b', // amber-500
    warningForeground: '#ffffff',
    warningMuted: '#fef3c7', // amber-100
    
    error: '#ef4444', // red-500
    errorForeground: '#ffffff',
    errorMuted: '#fee2e2', // red-100
    
    // Background colors
    background: '#f8fafc', // slate-50 - slightly off-white for better contrast
    backgroundSecondary: '#f1f5f9', // slate-100
    backgroundTertiary: '#e2e8f0', // slate-200
    
    // Surface colors
    surface: '#ffffff', // pure white for cards to stand out
    surfaceSecondary: '#f8fafc',
    surfaceTertiary: '#f1f5f9',
    
    // Text colors
    text: {
      primary: '#0f172a', // slate-900 - dark text for main content
      secondary: '#374151', // gray-700 - darker secondary text for better contrast
      tertiary: '#6b7280', // gray-500 - readable tertiary text
      muted: '#9ca3af', // gray-400 - muted but still readable
      inverse: '#ffffff',
    },
    
    // Border colors
    border: {
      primary: '#e2e8f0', // slate-200
      secondary: '#cbd5e1', // slate-300
      muted: '#f1f5f9', // slate-100
      focus: '#3b82f6', // blue-500
    },
    
    // Interactive states
    interactive: {
      hover: '#f1f5f9', // slate-100
      pressed: '#e2e8f0', // slate-200
      disabled: '#f8fafc', // slate-50
      focus: '#dbeafe', // blue-100
    },
    
    // Sidebar specific (light theme)
    sidebar: {
      background: '#ffffff', // white background
      surface: '#f1f5f9', // slate-100 - slightly darker for sidebar items
      text: '#0f172a', // slate-900 - dark text
      textSecondary: '#374151', // gray-700 - darker secondary text for better contrast
      textMuted: '#6b7280', // gray-500 - more readable muted text
      hover: '#e2e8f0', // slate-200 - more visible hover state
      active: '#06b6d4', // cyan-500 - active item
      activeBg: '#e0f2fe', // cyan-50 - active background
      border: '#d1d5db', // gray-300 - more visible borders
    },
    
    // Gradients (light theme with cyan-blue scheme)
    gradients: {
      primary: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', // cyan to blue - our app base
      secondary: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
      accent: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      success: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
      warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      
      // Core app gradient - cyan to blue
      cyanBlue: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', // from-cyan-500 to-blue-600
      
      // Color variations
      purple: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      blue: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
      green: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
      teal: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)',
      orange: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      red: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      
      // Page-specific gradients using app base
      dashboard: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
      sidebar: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
      navigation: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
      
      // Feature-specific gradients
      learning: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
      practice: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
      courses: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      vocabulary: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
    },
  },
  
  // Spacing scale
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
    '3xl': '4rem',  // 64px
  },
  
  // Typography
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Consolas', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',   // 12px
      sm: '0.875rem',  // 14px
      base: '1rem',    // 16px
      lg: '1.125rem',  // 18px
      xl: '1.25rem',   // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  
  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',  // 2px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',   // 16px
    '3xl': '1.5rem', // 24px
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },
} as const;

export type LightTheme = typeof lightTheme;