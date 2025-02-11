/*
* File: src/pages/ProjectResults.tsx
* Description: Project results page component
* Details: Displays and processes project results
* - Uses Firebase Functions for project operations
* - Shows loading states and animations
* - Handles errors and retries
* Date: 2024-03-20
*/

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { openaiService } from '../services/openai';
import { projectService } from '../services/project';
import type { Project, ProjectResults } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { ResultsDisplay } from '../components/results/ResultsDisplay';
import { Button } from '../components/Button';

export const ProjectResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!user || !id) {
        navigate('/login');
        return;
      }

      try {
        const [fetchedProject] = await projectService.getProjects([id]);
        if (!fetchedProject) {
          setError('Project not found');
          setIsLoading(false);
          return;
        }

        setProject(fetchedProject);
        setIsLoading(false);

        // If project is pending or has no results, start processing
        if (!fetchedProject.results || fetchedProject.results.status === 'pending') {
          await processProject(fetchedProject);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Failed to load project');
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [user, id, navigate]);

  const processProject = async (project: Project) => {
    if (isProcessing) {
      console.log('Already processing, skipping duplicate call');
      return;
    }

    console.log('Starting project processing:', project);
    setProcessingError(null);
    setIsProcessing(true);
    
    try {
      // Update project status to in-progress
      await projectService.updateProject(project.id, {
        results: {
          status: 'pending',
          data: null,
          error: null
        }
      });

      // Process with OpenAI
      const results = await openaiService.processProject(project);
      console.log('Project processing results:', results);
      
      // Update project with results
      await projectService.updateProject(project.id, { 
        results: {
          status: 'completed',
          data: results.data,
          error: null
        }
      });

      // Fetch updated project
      const [updatedProject] = await projectService.getProjects([project.id]);
      setProject(updatedProject);
      
    } catch (error) {
      console.error('Failed to process project:', error);
      
      await projectService.updateProject(project.id, {
        results: {
          status: 'error',
          data: null,
          error: error instanceof Error ? error.message : 'Failed to process project'
        }
      });

      setProcessingError('Failed to process project. Please try again.');
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  const handleRetry = async () => {
    if (!project) return;
    await processProject(project);
  };

  const handleSave = async () => {
    if (!project || !project.results?.data) return;
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} />
        <Button onClick={() => navigate('/dashboard')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message="Project not found" />
        <Button onClick={() => navigate('/dashboard')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
        <p className="text-gray-600 dark:text-gray-400">{project.description}</p>
      </div>

      {isProcessing ? (
        <div className="flex flex-col items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-lg">Processing your project...</p>
        </div>
      ) : (
        <>
          {processingError ? (
            <div className="mb-8">
              <ErrorMessage message={processingError} />
              <Button onClick={handleRetry} className="mt-4">
                Retry Processing
              </Button>
            </div>
          ) : (
            <ResultsDisplay 
              results={project.results} 
              onSave={handleSave}
              onRetry={handleRetry}
            />
          )}
        </>
      )}
    </div>
  );
};