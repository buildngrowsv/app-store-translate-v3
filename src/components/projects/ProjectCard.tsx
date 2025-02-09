/*
* File: ProjectCard.tsx
* Description: Enhanced project card component
* Details: Displays project information with different states and visual treatments
* - Different styles for Translation vs Enhancement projects
* - Shows project status with appropriate visual indicators
* - Features elegant animations and transitions
* - Supports dark mode
* Date: 2024-03-20
*/

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Languages, 
  Sparkles, 
  Clock, 
  CheckCircle, 
  Eye, 
  ArrowRight,
  Loader2,
  Plus
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../lib/utils';

interface Project {
  id: string;
  type: 'translate' | 'enhance';
  status: 'pending' | 'ready' | 'completed';
  title: string;
  description: string;
  lastUpdated: string;
  viewed: boolean;
  languages?: string[];
  enhancementTypes?: string[];
}

interface ProjectCardProps {
  project?: Project;
  onClick?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const isTranslation = project?.type === 'translate';

  // Create New Project card
  if (!project) {
    return (
      <motion.button
        whileHover={{ y: -4 }}
        onClick={onClick}
        className={cn(
          // Base styles
          "h-48 w-full rounded-xl border-2 border-dashed transition-all duration-300",
          "bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm",
          "border-gray-300 dark:border-gray-600",
          "hover:border-purple-400 dark:hover:border-purple-500",
          "hover:bg-gradient-to-br hover:from-purple-50/50 hover:to-pink-50/50",
          "dark:hover:from-purple-900/20 dark:hover:to-pink-900/20",
          "focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20",
          "group"
        )}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-3">
          <div className={cn(
            "p-3 rounded-xl transition-all duration-300",
            "bg-purple-100/50 dark:bg-purple-900/30",
            "group-hover:scale-110 group-hover:bg-purple-200/50 dark:group-hover:bg-purple-800/30"
          )}>
            <Plus className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Create New Project
          </span>
        </div>
      </motion.button>
    );
  }

  // Status indicator component
  const StatusIndicator = () => {
    switch (project.status) {
      case 'pending':
        return (
          <div className="flex items-center space-x-1 text-orange-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm">In Progress</span>
          </div>
        );
      case 'ready':
        return (
          <div className="flex items-center space-x-1 text-green-500">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Ready to Review</span>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center space-x-1 text-blue-500">
            <Eye className="w-4 h-4" />
            <span className="text-sm">Completed</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        // Base styles
        "relative overflow-hidden rounded-xl border transition-all duration-300",
        "bg-white dark:bg-gray-800",
        "hover:shadow-lg hover:border-transparent",
        
        // Type-specific styles
        isTranslation
          ? "hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20"
          : "hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20",
        
        // Border colors based on status
        project.status === 'pending' && "border-orange-200 dark:border-orange-800",
        project.status === 'ready' && "border-green-200 dark:border-green-800",
        project.status === 'completed' && "border-blue-200 dark:border-blue-800",
        
        // Cursor
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      {/* Glow effect */}
      <div className={cn(
        "absolute inset-0 opacity-0 transition-opacity duration-300",
        "group-hover:opacity-100",
        isTranslation
          ? "bg-gradient-to-br from-blue-500/5 to-purple-500/5"
          : "bg-gradient-to-br from-purple-500/5 to-pink-500/5"
      )} />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            {isTranslation ? (
              <Languages className="w-5 h-5 text-blue-500" />
            ) : (
              <Sparkles className="w-5 h-5 text-purple-500" />
            )}
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {project.title}
            </h3>
          </div>
          <StatusIndicator />
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {project.description}
        </p>

        {/* Details */}
        <div className="space-y-2">
          {project.languages && (
            <div className="flex flex-wrap gap-2">
              {project.languages.map(lang => (
                <span
                  key={lang}
                  className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                >
                  {lang}
                </span>
              ))}
            </div>
          )}
          {project.enhancementTypes && (
            <div className="flex flex-wrap gap-2">
              {project.enhancementTypes.map(type => (
                <span
                  key={type}
                  className="px-2 py-1 text-xs rounded-full bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                >
                  {type}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>
              Updated {formatDistanceToNow(new Date(project.lastUpdated))} ago
            </span>
            {onClick && (
              <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 