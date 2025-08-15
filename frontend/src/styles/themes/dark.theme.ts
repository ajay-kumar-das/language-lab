export const darkTheme = {
  name: 'dark',
  colors: {
    // Primary colors
    primary: '#3b82f6', // blue-500
    primaryRgb: '59, 130, 246', // RGB values for glow effects
    primaryForeground: '#ffffff',
    primaryMuted: '#1e40af', // blue-800
    
    // Secondary colors
    secondary: '#6366f1', // indigo-500
    secondaryForeground: '#ffffff',
    secondaryMuted: '#3730a3', // indigo-800
    
    // Accent colors
    accent: '#8b5cf6', // violet-500
    accentForeground: '#ffffff',
    accentMuted: '#5b21b6', // violet-800
    
    // Success, warning, error
    success: '#10b981', // emerald-500
    successForeground: '#ffffff',
    successMuted: '#065f46', // emerald-800
    
    warning: '#f59e0b', // amber-500
    warningForeground: '#ffffff',
    warningMuted: '#92400e', // amber-800
    
    error: '#ef4444', // red-500
    errorForeground: '#ffffff',
    errorMuted: '#991b1b', // red-800
    
    // Background colors (matching mockup design)
    background: '#0f172a', // slate-900 - deep dark background
    backgroundSecondary: '#1e293b', // slate-800
    backgroundTertiary: '#334155', // slate-700
    
    // Surface colors
    surface: '#1e293b', // slate-800
    surfaceSecondary: '#334155', // slate-700
    surfaceTertiary: '#475569', // slate-600
    
    // Text colors
    text: {
      primary: '#f8fafc', // slate-50 - bright white text
      secondary: '#e2e8f0', // slate-200 - secondary text
      tertiary: '#cbd5e1', // slate-300 - muted text
      muted: '#94a3b8', // slate-400 - very muted
      inverse: '#0f172a', // slate-900 - for light backgrounds
    },
    
    // Border colors
    border: {
      primary: '#334155', // slate-700
      secondary: '#475569', // slate-600
      muted: '#64748b', // slate-500
      focus: '#3b82f6', // blue-500
    },
    
    // Interactive states
    interactive: {
      hover: '#334155', // slate-700
      pressed: '#475569', // slate-600
      disabled: '#1e293b', // slate-800
      focus: '#1e40af', // blue-800
    },
    
    // Sidebar specific (matching mockup exactly)
    sidebar: {
      background: '#0f172a', // slate-900 - matching mockup sidebar
      surface: '#1e293b', // slate-800 - for sidebar items
      text: '#f8fafc', // slate-50 - white text
      textSecondary: '#cbd5e1', // slate-300 - secondary text
      textMuted: '#94a3b8', // slate-400 - muted text like email
      hover: '#334155', // slate-700 - hover state
      active: '#3b82f6', // blue-500 - active item (Dashboard)
      activeBg: '#1e3a8a', // blue-900 - active background
      border: '#334155', // slate-700 - borders
    },
    
    // Gradients (adjusted for dark theme)
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
  
  // Spacing scale (same as light)
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
    '3xl': '4rem',  // 64px
  },
  
  // Typography (same as light)
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
  
  // Border radius (same as light)
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
  
  // Shadows (darker shadows for dark theme)
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.6)',
  },
} as const;

export type DarkTheme = typeof darkTheme;