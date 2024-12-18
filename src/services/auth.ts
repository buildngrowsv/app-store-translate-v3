import { User, Project } from '../types';

// In-memory storage
const users: Record<string, {
  email: string;
  password: string;
  projects: Project[];
}> = {};

export class AuthService {
  static async signUp(email: string, password: string): Promise<User> {
    if (users[email]) {
      throw new Error('User already exists');
    }

    users[email] = {
      email,
      password,
      projects: []
    };

    return {
      email,
      projects: []
    };
  }

  static async signIn(email: string, password: string): Promise<User> {
    const user = users[email];
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }

    return {
      email,
      projects: user.projects
    };
  }

  static async getUser(email: string): Promise<User | null> {
    const user = users[email];
    if (!user) return null;

    return {
      email,
      projects: user.projects
    };
  }

  static async addProject(email: string, project: Omit<Project, 'id' | 'lastUpdated'>): Promise<Project> {
    const user = users[email];
    if (!user) {
      throw new Error('User not found');
    }

    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString(),
      results: {
        status: 'in-progress'
      }
    };

    user.projects.push(newProject);
    return newProject;
  }

  static async updateProject(email: string, projectId: string, updates: Partial<Project>) {
    const user = users[email];
    if (!user) {
      throw new Error('User not found');
    }

    const projectIndex = user.projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }

    user.projects[projectIndex] = {
      ...user.projects[projectIndex],
      ...updates,
      lastUpdated: new Date().toISOString()
    };

    return user.projects[projectIndex];
  }
}