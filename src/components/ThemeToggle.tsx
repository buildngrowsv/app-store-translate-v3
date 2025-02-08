/*
* File: ThemeToggle.tsx
* Description: Theme toggle button component
* Details: Provides an animated button to switch between light and dark modes
* Uses Lucide icons and custom animations
* Date: 2024-03-20
*/

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../lib/utils';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        // Base styles
        'relative w-10 h-10 rounded-lg',
        'flex items-center justify-center',
        'transition-all duration-300 ease-spring',
        'hover:scale-110 active:scale-95',
        
        // Light mode styles
        'bg-gradient-to-br from-blue-50 to-purple-50',
        'hover:from-blue-100 hover:to-purple-100',
        'dark:from-gray-800 dark:to-gray-700',
        'dark:hover:from-gray-700 dark:hover:to-gray-600',
        
        // Border and shadow effects
        'border border-gray-200 dark:border-gray-600',
        'shadow-lg shadow-purple-500/5 dark:shadow-purple-500/20',
        
        // Glow effects
        'before:absolute before:inset-0 before:rounded-lg',
        'before:bg-gradient-to-br before:from-purple-500 before:to-blue-500',
        'before:opacity-0 before:transition-opacity before:duration-300',
        'hover:before:opacity-10 dark:hover:before:opacity-20',
        
        // Focus styles
        'focus:outline-none focus-visible:ring-2',
        'focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400',
        'focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800'
      )}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {/* Sun icon */}
      <Sun
        className={cn(
          'w-5 h-5 absolute',
          'transition-all duration-300',
          'text-amber-500',
          theme === 'light'
            ? 'transform opacity-100 rotate-0'
            : 'transform opacity-0 rotate-90 scale-50'
        )}
      />
      
      {/* Moon icon */}
      <Moon
        className={cn(
          'w-5 h-5 absolute',
          'transition-all duration-300',
          'text-purple-400',
          theme === 'dark'
            ? 'transform opacity-100 rotate-0'
            : 'transform opacity-0 -rotate-90 scale-50'
        )}
      />
    </button>
  );
}; 