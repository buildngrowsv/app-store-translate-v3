import React from 'react';

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
            className={`flex items-center ${
              index <= currentStep ? 'text-purple-600' : 'text-gray-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentStep
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {index + 1}
            </div>
            <span className="ml-2">{label}</span>
          </div>
        ))}
      </div>
      <div className="h-2 bg-gray-200 rounded-full">
        <div
          className="h-full rounded-full transition-all duration-300 ease-in-out
                     bg-gradient-to-r from-purple-600 to-pink-600"
          style={{
            width: `${((currentStep + 1) * 100) / steps.length}%`,
          }}
        />
      </div>
    </div>
  );
};