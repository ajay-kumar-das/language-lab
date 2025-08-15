import { lightTheme, type LightTheme } from './light.theme';
import { darkTheme, type DarkTheme } from './dark.theme';

// Union type for all themes
export type Theme = LightTheme | DarkTheme;

// Theme map for easy access
export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

// Theme names type
export type ThemeName = keyof typeof themes;

// Default theme
export const defaultTheme: ThemeName = 'dark'; // Matching mockup designs

// Export individual themes
export { lightTheme, darkTheme };
export type { LightTheme, DarkTheme };