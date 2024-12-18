import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectCard } from '../components/dashboard/ProjectCard';
import { useAuth } from '../components/auth/AuthContext';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNewProject = () => {
    navigate('/dashboard/new');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Projects</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProjectCard isNew onClick={handleNewProject} />
        {user?.projects?.map((project: any) => (
          <ProjectCard
            key={project.id}
            title={project.name}
            description={project.description}
            lastUpdated={project.lastUpdated}
            onClick={() => navigate(`/dashboard/project/${project.id}/results`)}
          />
        ))}
      </div>
    </div>
  );
};