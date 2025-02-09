import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectCard } from '../components/dashboard/ProjectCard';
import { useAuth } from '../contexts/AuthContext';
import { FirebaseService } from '../services/firebase';
import { DocumentData } from 'firebase/firestore';
import { cn } from '../lib/utils';
import { Sparkles } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  lastUpdated: string;
  type: 'enhancement' | 'translation';
  results?: {
    status: 'in-progress' | 'completed' | 'error';
    data?: any;
    error?: string;
  };
}

interface UserData {
  email: string | null;
  projects: string[];
  subscription: {
    status: 'trial' | 'active' | 'inactive';
    trialEnd?: string;
    plan?: string;
  };
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user || !userData) {
        setProjects([]);
        setLoading(false);
        return;
      }

      // Initialize projects array if it doesn't exist
      const projectIds = userData.projects || [];
      
      if (projectIds.length === 0) {
        setProjects([]);
        setLoading(false);
        return;
      }

      try {
        const projectPromises = projectIds.map((projectId: string) => 
          FirebaseService.getProject(projectId)
        );
        
        const projectsData = await Promise.all(projectPromises);
        const validProjects = projectsData
          .filter((data): data is DocumentData => data !== null)
          .map((data: DocumentData) => ({
            id: data.id,
            name: data.name,
            description: data.description,
            lastUpdated: data.lastUpdated,
            status: data.status,
            type: data.type as 'enhancement' | 'translation',
            results: data.results
          }));

        setProjects(validProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user, userData]);

  const handleNewProject = () => {
    navigate('/project/new');
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      // Delete project from Firebase
      await FirebaseService.deleteProject(projectId);
      
      // Update local state
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 dark:border-purple-400"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          {/* Title and Subscription Info */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              My Projects
            </h1>
            {userData?.subscription && (
              <div className="flex items-center space-x-2">
                <div className={cn(
                  "px-2 py-1 rounded-full text-sm font-medium",
                  userData.subscription.status === 'active' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                  userData.subscription.status === 'trial' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                  userData.subscription.status === 'inactive' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                )}>
                  {userData.subscription.status.charAt(0).toUpperCase() + userData.subscription.status.slice(1)}
                </div>
                {userData.subscription.plan && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {userData.subscription.plan}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProjectCard isNew onClick={handleNewProject} />
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.name}
              description={project.description}
              lastUpdated={project.lastUpdated}
              status={project.results?.status}
              onClick={() => navigate(`/dashboard/project/${project.id}/results`)}
              onDelete={() => handleDeleteProject(project.id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-12">
            <div className="mb-4">
              <Sparkles className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              No projects yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get started by creating your first project
            </p>
          </div>
        )}
      </div>
    </div>
  );
};