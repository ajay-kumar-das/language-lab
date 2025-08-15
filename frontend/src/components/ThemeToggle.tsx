import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from './ui/utils';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ThemeToggle({ className, showLabel = false, size = 'md' }: ThemeToggleProps) {
  const { themeName, toggleTheme } = useTheme();
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };
  
  const buttonSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "sidebar-nav-item flex items-center gap-2 rounded-lg transition-all duration-200",
        buttonSizeClasses[size],
        showLabel && "justify-start w-full px-3 py-2",
        className
      )}
      title={`Switch to ${themeName === 'dark' ? 'light' : 'dark'} mode`}
    >
      {themeName === 'dark' ? (
        <Sun className={cn(sizeClasses[size], "flex-shrink-0")} />
      ) : (
        <Moon className={cn(sizeClasses[size], "flex-shrink-0")} />
      )}
      
      {showLabel && (
        <span className="text-sm font-medium">
          {themeName === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
}