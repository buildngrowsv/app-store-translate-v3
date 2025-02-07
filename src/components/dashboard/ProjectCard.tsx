import React, { useState } from 'react';
import { Plus, Loader2, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ConfirmDialog } from '../modals/ConfirmDialog';

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
      <button
        onClick={onClick}
        className="h-48 rounded-xl border-2 border-dashed border-gray-300 bg-white p-6 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
      >
        <div className="flex flex-col items-center justify-center h-full space-y-2">
          <Plus className="w-8 h-8 text-gray-400" />
          <span className="text-sm font-medium text-gray-600">Create New Project</span>
        </div>
      </button>
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
        <div className="flex items-center text-blue-600">
          <Loader2 className="w-4 h-4 animate-spin mr-1" />
          <span className="text-xs">Processing</span>
        </div>
      );
    }
    if (status === 'error') {
      return <div className="text-xs text-red-600">Error</div>;
    }
    return null;
  };

  return (
    <>
      <div 
        onClick={onClick}
        className="relative group block w-full h-48 text-left rounded-xl border border-gray-200 bg-white p-6 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 cursor-pointer overflow-hidden"
      >
        {onDelete && (
          <button
            onClick={handleDelete}
            className="absolute top-3 right-3 p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-200"
            aria-label="Delete project"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900 truncate pr-8">{title}</h3>
            <div className={`transform transition-all duration-200 ${onDelete ? 'group-hover:-translate-x-10' : ''}`}>
              <StatusIndicator />
            </div>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">{description}</p>
          <div className="mt-auto text-xs text-gray-500">
            {lastUpdated && (
              <>Last updated {formatDistanceToNow(new Date(lastUpdated))} ago</>
            )}
          </div>
        </div>
      </div>

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