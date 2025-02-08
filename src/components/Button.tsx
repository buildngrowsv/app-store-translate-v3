/*
* File: Button.tsx
* Description: Reusable button component
* Details: Provides a customizable button with various styles and variants
* - Supports multiple variants (primary, secondary, gradient, outline, destructive)
* - Includes dark mode styles
* - Features elegant hover effects and transitions
* - Uses gradient backgrounds and glows
* Date: 2024-03-20
*/

import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gradient' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center font-medium transition-all duration-200',
          'rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
          'before:absolute before:inset-0 before:rounded-xl before:transition-all before:duration-200',
          
          // Size variations
          {
            'text-sm px-6 py-2.5 h-10 gap-1.5': size === 'sm',
            'text-base px-8 py-3 h-12 gap-2': size === 'md',
            'text-lg px-10 py-4 h-14 gap-2.5': size === 'lg',
          },
          
          // Variant styles
          {
            // Gradient variant
            'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white hover:from-purple-700 hover:via-fuchsia-700 hover:to-pink-700 before:opacity-0 hover:before:opacity-100 before:bg-black/10 shadow-lg shadow-purple-500/20 dark:shadow-purple-900/30':
              variant === 'gradient',
            
            // Primary variant
            'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 before:opacity-0 hover:before:opacity-100 before:bg-black/10 shadow-md hover:shadow-lg dark:shadow-blue-900/30':
              variant === 'primary',
            
            // Secondary variant - Updated for better dark mode
            'bg-white/10 dark:bg-white/5 text-white border border-white/10 hover:bg-white/20 dark:hover:bg-white/10 backdrop-blur-sm':
              variant === 'secondary',
            
            // Outline variant
            'border-2 border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500':
              variant === 'outline',
            
            // Destructive variant
            'bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 text-white hover:from-red-700 hover:via-rose-700 hover:to-pink-700 before:opacity-0 hover:before:opacity-100 before:bg-black/10 shadow-md hover:shadow-lg dark:shadow-red-900/30':
              variant === 'destructive',
          },
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center">
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';