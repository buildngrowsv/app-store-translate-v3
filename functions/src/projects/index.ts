/*
* File: functions/src/projects/index.ts
* Description: Project management Firebase Functions
* Details: Provides CRUD operations for projects
* - Create project with validation
* - Update project with access control
* - Delete project with cleanup
* - Get project results
* Date: 2024-03-20
*/

import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import { SubscriptionService } from '../services/subscription';

interface ProjectData {
  name: string;
  description: string;
  keywords?: string;
  type: 'enhance' | 'translate';
  languages?: string[];
}

interface ProjectResults {
  status: 'completed' | 'error';
  data?: any;
  error?: string;
}

// Create project function
export const createProject = functions.https.onCall(async (data: ProjectData, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  try {
    // Input validation
    if (!data.name || !data.description) {
      throw new functions.https.HttpsError('invalid-argument', 'Name and description are required');
    }

    if (data.type === 'translate' && (!data.languages || data.languages.length === 0)) {
      throw new functions.https.HttpsError('invalid-argument', 'Languages are required for translation projects');
    }

    // Check subscription limits
    const userId = context.auth.uid;
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    const projectCount = userDoc.exists ? (userDoc.data()?.projects || []).length : 0;

    const canCreate = await SubscriptionService.canCreateProject(userId, projectCount);
    if (!canCreate.allowed) {
      throw new functions.https.HttpsError('resource-exhausted', canCreate.reason || 'Project limit reached');
    }

    // Create project document
    const projectRef = admin.firestore().collection('projects').doc();
    const projectId = projectRef.id;

    const newProjectData = {
      ...data,
      userId: context.auth.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      status: 'pending',
      results: {
        status: 'pending'
      }
    };

    // Create project and update user's projects array in a transaction
    await admin.firestore().runTransaction(async (transaction) => {
      transaction.set(projectRef, newProjectData);
      transaction.update(admin.firestore().collection('users').doc(userId), {
        projects: admin.firestore.FieldValue.arrayUnion(projectId)
      });
    });

    return { id: projectId, ...newProjectData };
  } catch (error) {
    console.error('Error creating project:', error);
    throw new functions.https.HttpsError(
      'internal',
      error instanceof Error ? error.message : 'Project creation failed'
    );
  }
});

// Update project function
export const updateProject = functions.https.onCall(async (data: { projectId: string; updates: any }, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  try {
    const { projectId, updates } = data;
    const projectRef = admin.firestore().collection('projects').doc(projectId);
    const project = await projectRef.get();

    if (!project.exists) {
      throw new functions.https.HttpsError('not-found', 'Project not found');
    }

    const projectData = project.data();
    if (projectData?.userId !== context.auth.uid) {
      throw new functions.https.HttpsError('permission-denied', 'Not authorized to update this project');
    }

    // Update project
    await projectRef.update({
      ...updates,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating project:', error);
    throw new functions.https.HttpsError(
      'internal',
      error instanceof Error ? error.message : 'Project update failed'
    );
  }
});

// Delete project function
export const deleteProject = functions.https.onCall(async (data: { projectId: string }, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  try {
    const { projectId } = data;
    const projectRef = admin.firestore().collection('projects').doc(projectId);
    const project = await projectRef.get();

    if (!project.exists) {
      throw new functions.https.HttpsError('not-found', 'Project not found');
    }

    const projectData = project.data();
    if (projectData?.userId !== context.auth.uid) {
      throw new functions.https.HttpsError('permission-denied', 'Not authorized to delete this project');
    }

    // Delete project and update user's projects array in a transaction
    await admin.firestore().runTransaction(async (transaction) => {
      transaction.delete(projectRef);
      transaction.update(admin.firestore().collection('users').doc(context.auth.uid), {
        projects: admin.firestore.FieldValue.arrayRemove(projectId)
      });
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    throw new functions.https.HttpsError(
      'internal',
      error instanceof Error ? error.message : 'Project deletion failed'
    );
  }
});

// Get project results function
export const getProjectResults = functions.https.onCall(async (data: { projectId: string }, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  try {
    const { projectId } = data;
    const projectRef = admin.firestore().collection('projects').doc(projectId);
    const project = await projectRef.get();

    if (!project.exists) {
      throw new functions.https.HttpsError('not-found', 'Project not found');
    }

    const projectData = project.data();
    if (projectData?.userId !== context.auth.uid) {
      throw new functions.https.HttpsError('permission-denied', 'Not authorized to view this project');
    }

    return {
      status: projectData?.results?.status || 'pending',
      data: projectData?.results?.data,
      error: projectData?.results?.error
    };
  } catch (error) {
    console.error('Error getting project results:', error);
    throw new functions.https.HttpsError(
      'internal',
      error instanceof Error ? error.message : 'Failed to get project results'
    );
  }
}); 