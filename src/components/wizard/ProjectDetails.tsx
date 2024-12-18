import React from 'react';
import { Input } from '../Input';

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
        <label className="block text-sm font-medium text-gray-600">
          App Description
        </label>
        <textarea
          className="block w-full h-32 px-4 py-3 rounded-md border border-gray-300 text-base shadow-sm
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-600">
          Targeted Keywords
        </label>
        <textarea
          className="block w-full h-24 px-4 py-3 rounded-md border border-gray-300 text-base shadow-sm
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          value={data.keywords}
          onChange={(e) => onChange({ keywords: e.target.value })}
          placeholder="Enter keywords separated by commas"
        />
        <p className="text-sm text-gray-500">Optional</p>
      </div>
    </div>
  );
};