import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { openaiService } from '../services/openai/index';
import { ResultsView } from '../components/results/ResultsView';
import { FirebaseService } from '../services/firebase';
import { DocumentData } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { Project as BaseProject } from '../types';

// Extend the base Project type to handle error state in Firestore
interface ProjectData extends Omit<BaseProject, 'results'> {
  results?: {
    status: 'in-progress' | 'completed' | 'error';
    data?: any;
    error?: string;
  };
}

export const ProjectResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<BaseProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      if (!user || !id) {
        navigate('/dashboard');
        return;
      }

      try {
        const projectData = await FirebaseService.getProject(id) as ProjectData;
        if (!projectData) {
          navigate('/dashboard');
          return;
        }

        // Convert Firestore data to BaseProject type
        const project: BaseProject = {
          id: projectData.id,
          name: projectData.name,
          description: projectData.description,
          keywords: projectData.keywords || '',
          type: projectData.type,
          languages: projectData.languages || [],
          lastUpdated: projectData.lastUpdated,
          results: projectData.results?.status === 'error' || !projectData.results
            ? undefined
            : {
                status: projectData.results.status,
                data: projectData.results.data
              }
        };

        setProject(project);
        console.log('Current project:', project);
        
        // Only process if no results exist or if they're in-progress and not already processing
        if ((!project.results || project.results.status === 'in-progress') && !isProcessing) {
          console.log('Processing project as no results exist or in-progress');
          processProject(project);
        } else {
          console.log('Project already has results or is being processed:', project.results);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Failed to load project');
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [user, id, navigate, isProcessing]);

  const processProject = async (project: BaseProject) => {
    if (isProcessing) {
      console.log('Already processing, skipping duplicate call');
      return;
    }

    console.log('Starting project processing:', project);
    setProcessingError(null);
    setIsProcessing(true);
    
    try {
      // Update project status to in-progress
      await FirebaseService.updateProject(project.id, {
        results: {
          status: 'in-progress'
        }
      });

      // Process with Worker
      const results = await openaiService.processProject(project);
      console.log('Project processing results:', results);
      
      // Update project with results
      await FirebaseService.updateProject(project.id, { 
        results: {
          status: 'completed',
          data: results.data
        }
      });

      setProject(prev => prev ? { 
        ...prev, 
        results: {
          status: 'completed',
          data: results.data
        }
      } : null);
      
    } catch (error) {
      console.error('Failed to process project:', error);
      
      await FirebaseService.updateProject(project.id, {
        results: {
          status: 'error',
          error: 'Failed to process project'
        }
      });

      setProcessingError('Failed to process project. Please try again.');
      setProject(prev => prev ? { ...prev, results: undefined } : null);
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!project || !project.results?.data) return;
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-4 text-blue-600 hover:text-blue-500"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Project not found</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-4 text-blue-600 hover:text-blue-500"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
        <p className="text-gray-600">{project.description}</p>
      </div>

      {project.results?.status === 'completed' && project.results.data && (
        <ResultsView 
          type={project.type} 
          data={project.results.data} 
          onSave={handleSave}
        />
      )}

      {processingError && (
        <div className="text-center text-red-600">
          <p>{processingError}</p>
          <button 
            onClick={() => processProject(project)}
            className="mt-4 text-blue-600 hover:text-blue-500"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};