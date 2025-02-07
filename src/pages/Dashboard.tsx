import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectCard } from '../components/dashboard/ProjectCard';
import { useAuth } from '../contexts/AuthContext';
import { FirebaseService } from '../services/firebase';
import { DocumentData } from 'firebase/firestore';

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
      if (!user || !userData?.projects.length) {
        setProjects([]);
        setLoading(false);
        return;
      }

      try {
        const projectPromises = userData.projects.map((projectId: string) => 
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
    navigate('/dashboard/new');
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Projects</h1>
        {userData?.subscription && (
          <div className="text-sm text-gray-600">
            Subscription: {userData.subscription.status}
            {userData.subscription.plan && ` - ${userData.subscription.plan}`}
          </div>
        )}
      </div>

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
    </div>
  );
};