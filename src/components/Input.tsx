/*
* File: Input.tsx
* Description: Reusable input component
* Details: Provides a customizable input field with label and error handling
* - Supports dark mode
* - Features elegant focus and hover effects
* - Includes error state styling
* - Uses gradient accents for focus states
* Date: 2024-03-20
*/

import React from 'react';
import { cn } from '../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              // Base styles
              'block w-full rounded-lg transition-all duration-200',
              'px-4 py-2.5 text-gray-900 dark:text-white',
              
              // Background and border
              'bg-white dark:bg-gray-800',
              'border border-gray-300 dark:border-gray-600',
              
              // Placeholder
              'placeholder:text-gray-500 dark:placeholder:text-gray-400',
              
              // Focus state with gradient
              'focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
              'focus:border-transparent focus:ring-primary-500/50 dark:focus:ring-primary-400/50',
              'focus:shadow-[0_0_0_1px_rgba(139,92,246,0.2)] dark:focus:shadow-[0_0_0_1px_rgba(139,92,246,0.3)]',
              
              // Hover state
              'hover:border-gray-400 dark:hover:border-gray-500',
              
              // Error state
              error && [
                'border-red-500 dark:border-red-400',
                'focus:ring-red-500/50 dark:focus:ring-red-400/50',
                'focus:shadow-[0_0_0_1px_rgba(239,68,68,0.2)] dark:focus:shadow-[0_0_0_1px_rgba(239,68,68,0.3)]'
              ],
              
              className
            )}
            {...props}
          />
          {error && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }
);