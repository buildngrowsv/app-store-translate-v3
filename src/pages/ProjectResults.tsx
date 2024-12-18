import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthContext';
import { ResultsView } from '../components/results/ResultsView';
import { openaiService } from '../services/openai';
import type { Project } from '../types';
import { Loader2 } from 'lucide-react';

export const ProjectResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, updateProject } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !id) return;

    const currentProject = user.projects.find(p => p.id === id);
    if (!currentProject) {
      navigate('/dashboard');
      return;
    }

    setProject(currentProject);
    console.log('Current project:', currentProject);
    
    if (currentProject.results?.status === 'in-progress') {
      processProject(currentProject);
    } else {
      setIsLoading(false);
    }
  }, [user, id]);

  const processProject = async (project: Project) => {
    console.log('Starting project processing:', project);
    try {
      const results = await openaiService.processProject(project);
      console.log('Project processing results:', results);
      
      await updateProject(project.id, { results });
      setProject(prev => prev ? { ...prev, results } : null);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to process project:', error);
      setError('Failed to process project. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!project) return;
    try {
      await updateProject(project.id, {
        results: {
          ...project.results,
          status: 'completed',
        },
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save changes:', error);
      setError('Failed to save changes. Please try again.');
    }
  };

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Project not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Project Results</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-4" />
          <p className="text-gray-600">Generating results...</p>
        </div>
      ) : (
        project.results?.data && (
          <ResultsView
            type={project.type}
            data={project.results.data}
            onSave={handleSave}
          />
        )
      )}
    </div>
  );
};