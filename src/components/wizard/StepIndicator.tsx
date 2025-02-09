import React from 'react';
import { cn } from '../../lib/utils';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {steps.map((label, index) => (
          <div
            key={label}
            className={cn(
              "flex items-center",
              index <= currentStep 
                ? "text-purple-600 dark:text-purple-400" 
                : "text-gray-400 dark:text-gray-500"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                index <= currentStep
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              )}
            >
              {index + 1}
            </div>
            <span className="ml-2">{label}</span>
          </div>
        ))}
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
        <div
          className="h-full rounded-full transition-all duration-300 ease-in-out
                     bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500"
          style={{
            width: `${((currentStep + 1) * 100) / steps.length}%`,
          }}
        />
      </div>
    </div>
  );
};