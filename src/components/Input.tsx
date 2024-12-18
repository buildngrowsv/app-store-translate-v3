import React from 'react';
import { cn } from '../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-gray-600">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'block w-full h-11 px-4 rounded-md border border-gray-300 text-base shadow-sm',
            'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none',
            error && 'border-red-300 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);