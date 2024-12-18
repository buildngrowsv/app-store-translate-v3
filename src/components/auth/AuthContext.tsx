import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/auth';
import { User, Project } from '../../types';

interface AuthContextType {
  user: User | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  createProject: (project: Omit<Project, 'id' | 'lastUpdated'>) => Promise<string>;
  updateProject: (projectId: string, updates: Partial<Project>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'reachmix_auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem(STORAGE_KEY);
    if (storedEmail) {
      AuthService.getUser(storedEmail).then(user => {
        if (user) setUser(user);
      });
    }
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const user = await AuthService.signUp(email, password);
      setUser(user);
      localStorage.setItem(STORAGE_KEY, email);
      navigate('/dashboard');
    } catch (error) {
      throw new Error('Failed to create account');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const user = await AuthService.signIn(email, password);
      setUser(user);
      localStorage.setItem(STORAGE_KEY, email);
      navigate('/dashboard');
    } catch (error) {
      throw new Error('Invalid email or password');
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    navigate('/');
  };

  const createProject = async (projectData: Omit<Project, 'id' | 'lastUpdated'>) => {
    if (!user) throw new Error('Not authenticated');

    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString(),
      results: {
        status: 'in-progress'
      }
    };

    await AuthService.addProject(user.email, newProject);
    const updatedUser = await AuthService.getUser(user.email);
    if (updatedUser) setUser(updatedUser);
    
    return newProject.id;
  };

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    if (!user) throw new Error('Not authenticated');

    await AuthService.updateProject(user.email, projectId, {
      ...updates,
      lastUpdated: new Date().toISOString()
    });

    const updatedUser = await AuthService.getUser(user.email);
    if (updatedUser) setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      signUp, 
      signIn, 
      signOut,
      createProject,
      updateProject
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};