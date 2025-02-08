/*
* File: Card.tsx
* Description: Reusable card component
* Details: Provides a customizable card container with various styles
* - Supports multiple variants (default, highlighted, gradient)
* - Includes dark mode styles
* - Features elegant hover effects and transitions
* - Uses gradient backgrounds and glows
* Date: 2024-03-20
*/

import React from 'react';
import { cn } from '../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'highlighted' | 'gradient';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'rounded-xl transition-all duration-300',
          'backdrop-blur-sm',
          
          // Variant styles
          {
            // Default variant
            'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md dark:shadow-gray-900/30': 
              variant === 'default',
            
            // Highlighted variant
            'bg-gradient-to-br from-primary-600 via-primary-500 to-accent-600 text-white dark:from-primary-800 dark:via-primary-700 dark:to-accent-800 ring-4 ring-primary-200 dark:ring-primary-900/50 shadow-xl shadow-primary-500/20 dark:shadow-primary-900/30': 
              variant === 'highlighted',
            
            // Gradient variant
            'bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border border-primary-100 dark:border-gray-700 shadow-lg shadow-primary-500/10 dark:shadow-primary-900/20': 
              variant === 'gradient',
          },
          className
        )}
        {...props}
      />
    );
  }
);