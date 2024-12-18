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
          'rounded-xl transition-all duration-200',
          {
            'bg-white border border-gray-200 shadow-sm hover:shadow-md': 
              variant === 'default',
            'bg-gradient-to-br from-primary-600 to-accent-600 text-white ring-4 ring-primary-200': 
              variant === 'highlighted',
            'bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-100': 
              variant === 'gradient',
          },
          className
        )}
        {...props}
      />
    );
  }
);