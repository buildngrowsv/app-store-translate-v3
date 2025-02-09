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
              "block w-full px-4 py-3 rounded-md text-base shadow-sm",
              "bg-white dark:bg-gray-800",
              "border border-gray-300 dark:border-gray-600",
              "text-gray-900 dark:text-white",
              "placeholder:text-gray-500 dark:placeholder:text-gray-400",
              
              // Focus and transition
              "transition-[border-color,box-shadow] duration-300 ease-out",
              "focus:border-purple-500 dark:focus:border-purple-400",
              "focus:shadow-[0_0_0_2px_rgba(168,85,247,0.2)] dark:focus:shadow-[0_0_0_2px_rgba(192,132,252,0.2)]",
              "focus:outline-none",
              
              // Error state
              error && [
                "border-red-500 dark:border-red-400",
                "focus:border-red-500 dark:focus:border-red-400",
                "focus:shadow-[0_0_0_2px_rgba(239,68,68,0.2)] dark:focus:shadow-[0_0_0_2px_rgba(248,113,113,0.2)]"
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

Input.displayName = 'Input';