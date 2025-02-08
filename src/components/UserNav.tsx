/*
* File: UserNav.tsx
* Description: User navigation component
* Details: Provides navigation links and actions for authenticated users
* - Supports dark mode
* - Features elegant hover effects
* - Includes icon animations
* - Uses gradient accents
* Date: 2024-03-20
*/

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '../lib/utils';

export const UserNav: React.FC = () => {
  const { signOut } = useAuth();

  const iconButtonClasses = cn(
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
  );

  const iconClasses = cn(
    'w-5 h-5',
    'text-gray-700 dark:text-gray-300',
    'transition-transform duration-300',
    'group-hover:scale-110'
  );

  return (
    <nav className="flex items-center space-x-2">
      <Link 
        to="/dashboard" 
        className={cn(iconButtonClasses, 'group')}
        aria-label="Dashboard"
      >
        <LayoutDashboard className={iconClasses} />
      </Link>
      
      <Link 
        to="/settings" 
        className={cn(iconButtonClasses, 'group')}
        aria-label="Settings"
      >
        <Settings className={iconClasses} />
      </Link>
      
      <button
        onClick={signOut}
        className={cn(
          iconButtonClasses, 
          'group',
          'hover:from-red-50 hover:to-red-50 dark:hover:from-red-950/50 dark:hover:to-red-900/50',
          'hover:border-red-200 dark:hover:border-red-800'
        )}
        aria-label="Log out"
      >
        <LogOut className={cn(
          iconClasses,
          'text-red-600 dark:text-red-400'
        )} />
      </button>

      <ThemeToggle />
    </nav>
  );
};