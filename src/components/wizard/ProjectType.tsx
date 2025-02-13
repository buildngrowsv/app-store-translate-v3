import React from 'react';
import { Card } from '../Card';
import { Wand2, Languages } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ProjectTypeProps {
  selected: string;
  onSelect: (type: 'enhance' | 'translate') => void;
}

export const ProjectType: React.FC<ProjectTypeProps> = ({ selected, onSelect }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card
        className={cn(
          "cursor-pointer transition-all p-6",
          selected === 'enhance'
            ? "ring-2 ring-purple-500 dark:ring-purple-400"
            : "hover:border-purple-200 dark:hover:border-purple-700"
        )}
        onClick={() => onSelect('enhance')}
      >
        <div className="flex flex-col items-center text-center">
          <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-xl mb-4">
            <Wand2 className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Enhance</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Optimize your app description with AI-powered suggestions
          </p>
        </div>
      </Card>

      <Card
        className={cn(
          "cursor-pointer transition-all p-6",
          selected === 'translate'
            ? "ring-2 ring-purple-500 dark:ring-purple-400"
            : "hover:border-purple-200 dark:hover:border-purple-700"
        )}
        onClick={() => onSelect('translate')}
      >
        <div className="flex flex-col items-center text-center">
          <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-xl mb-4">
            <Languages className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Translate</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Translate your app content into multiple languages
          </p>
        </div>
      </Card>
    </div>
  );
};