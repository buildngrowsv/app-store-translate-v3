import React from 'react';
import { Card } from '../Card';
import { Plus, Calendar } from 'lucide-react';

interface ProjectCardProps {
  isNew?: boolean;
  onClick?: () => void;
  title?: string;
  description?: string;
  lastUpdated?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  isNew,
  onClick,
  title,
  description,
  lastUpdated,
}) => {
  if (isNew) {
    return (
      <Card
        className="flex items-center justify-center h-64 cursor-pointer hover:border-blue-300 transition-colors"
        onClick={onClick}
      >
        <div className="text-center">
          <Plus className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Create New Project</p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="h-64 cursor-pointer hover:border-blue-300 transition-colors flex flex-col p-6"
      onClick={onClick}
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 flex-grow">{description}</p>
      {lastUpdated && (
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-2" />
          Last updated: {lastUpdated}
        </div>
      )}
    </Card>
  );
};