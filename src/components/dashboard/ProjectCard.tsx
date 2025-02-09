/*
* File: ProjectCard.tsx
* Description: Dashboard project card component
* Details: Displays project information with different states
* - Shows project status with appropriate visual indicators
* - Features elegant animations and transitions
* - Supports dark mode
* Date: 2024-03-20
*/

import React, { useState } from 'react';
import { Plus, Loader2, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ConfirmDialog } from '../modals/ConfirmDialog';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  isNew?: boolean;
  title?: string;
  description?: string;
  lastUpdated?: string;
  status?: 'in-progress' | 'completed' | 'error';
  onClick: () => void;
  onDelete?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  isNew,
  title,
  description,
  lastUpdated,
  status,
  onClick,
  onDelete
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (isNew) {
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

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    onDelete?.();
  };

  const StatusIndicator = () => {
    if (status === 'in-progress') {
      return (
        <div className="flex items-center text-blue-600 dark:text-blue-400">
          <Loader2 className="w-4 h-4 animate-spin mr-1" />
          <span className="text-xs">Processing</span>
        </div>
      );
    }
    if (status === 'error') {
      return <div className="text-xs text-red-600 dark:text-red-400">Error</div>;
    }
    return null;
  };

  return (
    <>
      <motion.div 
        whileHover={{ y: -4 }}
        onClick={onClick}
        className={cn(
          // Base styles
          "relative group block w-full h-48 rounded-xl border transition-all duration-300",
          "bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm",
          "border-gray-200 dark:border-gray-700",
          "hover:border-transparent",
          "hover:shadow-lg hover:shadow-purple-500/5 dark:hover:shadow-purple-400/5",
          
          // Status-based styles
          status === 'in-progress' && "hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20",
          status === 'completed' && "hover:bg-gradient-to-br hover:from-green-50/50 hover:to-blue-50/50 dark:hover:from-green-900/20 dark:hover:to-blue-900/20",
          status === 'error' && "hover:bg-gradient-to-br hover:from-red-50/50 hover:to-orange-50/50 dark:hover:from-red-900/20 dark:hover:to-orange-900/20",
          !status && "hover:bg-gradient-to-br hover:from-purple-50/50 hover:to-pink-50/50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20",
          
          // Cursor
          "cursor-pointer"
        )}
      >
        {onDelete && (
          <button
            onClick={handleDelete}
            className={cn(
              "absolute top-3 right-3 p-2 rounded-full",
              "text-gray-400 dark:text-gray-500",
              "hover:text-red-600 dark:hover:text-red-400",
              "hover:bg-red-50 dark:hover:bg-red-900/30",
              "opacity-0 group-hover:opacity-100",
              "transition-all duration-200",
              "z-10"
            )}
            aria-label="Delete project"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        <div className="relative p-6 h-full flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate pr-8">
              {title}
            </h3>
            <div className={cn(
              "transform transition-all duration-200",
              onDelete ? "group-hover:-translate-x-10" : ""
            )}>
              <StatusIndicator />
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
            {description}
          </p>
          
          <div className="mt-auto text-xs text-gray-500 dark:text-gray-400">
            {lastUpdated && (
              <>Last updated {formatDistanceToNow(new Date(lastUpdated))} ago</>
            )}
          </div>
        </div>
      </motion.div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
};