import React from 'react';
import { Input } from '../Input';
import { cn } from '../../lib/utils';

interface ProjectDetailsProps {
  data: {
    name: string;
    description: string;
    keywords: string;
  };
  onChange: (data: Partial<ProjectDetailsProps['data']>) => void;
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <Input
        label="App Name"
        value={data.name}
        onChange={(e) => onChange({ name: e.target.value })}
        required
      />
      
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          App Description
        </label>
        <textarea
          className={cn(
            "block w-full h-32 px-4 py-3 rounded-md text-base shadow-sm",
            "bg-white dark:bg-gray-800",
            "border border-gray-300 dark:border-gray-600",
            "text-gray-900 dark:text-white",
            "placeholder:text-gray-500 dark:placeholder:text-gray-400",
            "transition-[border-color,box-shadow] duration-300 ease-out",
            "focus:border-purple-500 dark:focus:border-purple-400",
            "focus:shadow-[0_0_0_2px_rgba(168,85,247,0.2)] dark:focus:shadow-[0_0_0_2px_rgba(192,132,252,0.2)]",
            "focus:outline-none"
          )}
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          required
          aria-label="App Description"
          placeholder="Enter your app description"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Targeted Keywords
        </label>
        <textarea
          className={cn(
            "block w-full h-24 px-4 py-3 rounded-md text-base shadow-sm",
            "bg-white dark:bg-gray-800",
            "border border-gray-300 dark:border-gray-600",
            "text-gray-900 dark:text-white",
            "placeholder:text-gray-500 dark:placeholder:text-gray-400",
            "transition-[border-color,box-shadow] duration-300 ease-out",
            "focus:border-purple-500 dark:focus:border-purple-400",
            "focus:shadow-[0_0_0_2px_rgba(168,85,247,0.2)] dark:focus:shadow-[0_0_0_2px_rgba(192,132,252,0.2)]",
            "focus:outline-none"
          )}
          value={data.keywords}
          onChange={(e) => onChange({ keywords: e.target.value })}
          placeholder="Enter keywords separated by commas"
          aria-label="Targeted Keywords"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400">Optional</p>
      </div>
    </div>
  );
};