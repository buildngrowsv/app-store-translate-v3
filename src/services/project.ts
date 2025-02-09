/*
* File: src/services/project.ts
* Description: Project service for client-side operations
* Details: Provides interface to Firebase Functions for project management
* - Create, update, delete projects
* - Get project results
* - Handle errors and responses
* Date: 2024-03-20
*/

import { getFunctions, httpsCallable } from 'firebase/functions';
import type { Project, ProjectResults } from '../types';

export class ProjectService {
  private readonly functions = getFunctions();

  async createProject(data: Omit<Project, 'id' | 'lastUpdated'>): Promise<Project> {
    try {
      const createProjectFn = httpsCallable(this.functions, 'createProject');
      const result = await createProjectFn(data);
      return result.data as Project;
    } catch (error: any) {
      console.error('Failed to create project:', error);
      throw new Error(error.message || 'Failed to create project');
    }
  }

  async updateProject(projectId: string, updates: Partial<Project>): Promise<void> {
    try {
      const updateProjectFn = httpsCallable(this.functions, 'updateProject');
      await updateProjectFn({ projectId, updates });
    } catch (error: any) {
      console.error('Failed to update project:', error);
      throw new Error(error.message || 'Failed to update project');
    }
  }

  async deleteProject(projectId: string): Promise<void> {
    try {
      const deleteProjectFn = httpsCallable(this.functions, 'deleteProject');
      await deleteProjectFn({ projectId });
    } catch (error: any) {
      console.error('Failed to delete project:', error);
      throw new Error(error.message || 'Failed to delete project');
    }
  }

  async getProjectResults(projectId: string): Promise<ProjectResults> {
    try {
      const getResultsFn = httpsCallable(this.functions, 'getProjectResults');
      const result = await getResultsFn({ projectId });
      return result.data as ProjectResults;
    } catch (error: any) {
      console.error('Failed to get project results:', error);
      throw new Error(error.message || 'Failed to get project results');
    }
  }
} 