/*
* File: src/components/ErrorMessage.tsx
* Description: Error message component
* Details: Displays error messages with icon and animation
* - Uses Tailwind CSS for styling
* - Supports dark mode
* - Fade-in animation
* Date: 2024-03-20
*/

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message,
  className 
}) => {
  return (
    <div 
      className={cn(
        'flex items-center gap-2 p-4 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 animate-fade-in',
        className
      )}
    >
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <p>{message}</p>
    </div>
  );
}; 