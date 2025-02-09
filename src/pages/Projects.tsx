/*
* File: Projects.tsx
* Description: Projects page component
* Details: Displays all projects organized by type and status
* - Separates projects by type (Translate vs Enhance)
* - Shows different states (Pending, Ready, Completed)
* - Features beautiful animations and transitions
* - Supports dark mode
* Date: 2024-03-20
*/

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, Sparkles, Clock, CheckCircle, Eye } from 'lucide-react';
import { ProjectCard } from '../components/projects/ProjectCard';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

// Project types and statuses
type ProjectType = 'translate' | 'enhance';
type ProjectStatus = 'pending' | 'ready' | 'completed';

interface Project {
  id: string;
  type: ProjectType;
  status: ProjectStatus;
  title: string;
  description: string;
  lastUpdated: string;
  viewed: boolean;
  languages?: string[];
  enhancementTypes?: string[];
}

// Mock data - replace with real data from your API
const mockProjects: Project[] = [
  {
    id: '1',
    type: 'translate',
    status: 'pending',
    title: 'App Store Description Translation',
    description: 'Translating app description to 5 languages',
    lastUpdated: new Date().toISOString(),
    viewed: false,
    languages: ['Spanish', 'French', 'German', 'Italian', 'Japanese']
  },
  {
    id: '2',
    type: 'enhance',
    status: 'ready',
    title: 'ASO Enhancement',
    description: 'Optimizing keywords and metadata',
    lastUpdated: new Date().toISOString(),
    viewed: false,
    enhancementTypes: ['Keywords', 'Metadata', 'Screenshots']
  },
  // Add more mock projects as needed
];

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<ProjectType | 'all'>('all');

  // Filter projects by type and organize by status
  const filteredProjects = mockProjects.filter(
    project => selectedType === 'all' || project.type === selectedType
  );

  const projectsByStatus = {
    pending: filteredProjects.filter(p => p.status === 'pending'),
    ready: filteredProjects.filter(p => p.status === 'ready'),
    completed: filteredProjects.filter(p => p.status === 'completed')
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
          Your Projects
        </h1>
      </div>

      {/* Type Filter */}
      <div className="flex space-x-4 mb-8">
        <Button
          variant={selectedType === 'all' ? 'gradient' : 'outline'}
          onClick={() => setSelectedType('all')}
        >
          All Projects
        </Button>
        <Button
          variant={selectedType === 'translate' ? 'gradient' : 'outline'}
          onClick={() => setSelectedType('translate')}
          className="flex items-center space-x-2"
        >
          <Languages className="w-4 h-4" />
          <span>Translation Projects</span>
        </Button>
        <Button
          variant={selectedType === 'enhance' ? 'gradient' : 'outline'}
          onClick={() => setSelectedType('enhance')}
          className="flex items-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Enhancement Projects</span>
        </Button>
      </div>

      {/* Project Grid */}
      <div className="space-y-8">
        {/* Create New Project Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProjectCard onClick={() => navigate('/project/new')} />
          
          {/* Pending Projects */}
          {projectsByStatus.pending.map(project => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ProjectCard 
                project={project}
                onClick={() => navigate(`/project/${project.id}`)}
              />
            </motion.div>
          ))}
        </div>

        {/* Ready Projects */}
        {projectsByStatus.ready.length > 0 && (
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Ready to Review</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {projectsByStatus.ready.map(project => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <ProjectCard 
                      project={project}
                      onClick={() => navigate(`/project/${project.id}`)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        )}

        {/* Completed Projects */}
        {projectsByStatus.completed.length > 0 && (
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <Eye className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Completed</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {projectsByStatus.completed.map(project => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <ProjectCard 
                      project={project}
                      onClick={() => navigate(`/project/${project.id}`)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        )}

        {/* Empty State */}
        {filteredProjects.length === 0 && selectedType !== 'all' && (
          <div className="text-center py-12">
            <div className="mb-4">
              <Sparkles className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">No {selectedType} projects found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get started by creating a new {selectedType} project
            </p>
            <Button
              variant="gradient"
              onClick={() => navigate('/project/new')}
              className="flex items-center space-x-2 mx-auto"
            >
              <span>Create Project</span>
              <Sparkles className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}; 