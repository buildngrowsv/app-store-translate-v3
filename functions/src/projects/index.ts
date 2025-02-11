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
import { apiLimiter } from '../middleware/rateLimit';

interface ProjectData {
  name: string;
  description: string;
  keywords?: string;
  type: 'enhance' | 'translate';
  languages?: string[];
}

interface ProjectResults {
  status: 'pending' | 'completed' | 'error';
  data?: Record<string, unknown>;
  error?: string | null;
}

interface ProjectDocument {
  userId: string;
  name: string;
  description: string;
  keywords?: string;
  type: 'enhance' | 'translate';
  languages?: string[];
  createdAt: admin.firestore.Timestamp;
  lastUpdated: admin.firestore.Timestamp;
  results: ProjectResults;
}

interface ProjectUpdate {
  name?: string;
  description?: string;
  keywords?: string;
  languages?: string[];
  results?: ProjectResults;
}

// Type guard for project results
function isProjectResults(obj: unknown): obj is ProjectResults {
  if (!obj || typeof obj !== 'object') return false;
  
  const results = obj as Partial<ProjectResults>;
  
  // Check status
  if (!results.status || !['pending', 'completed', 'error'].includes(results.status)) {
    return false;
  }
  
  // Check data if present
  if (results.data !== undefined && (typeof results.data !== 'object' || results.data === null)) {
    return false;
  }
  
  // Check error if present
  if (results.error !== undefined && results.error !== null && typeof results.error !== 'string') {
    return false;
  }
  
  return true;
}

// Clean updates helper function
function cleanProjectUpdates(updates: ProjectUpdate): Partial<ProjectDocument> {
  const cleanUpdates = Object.entries(updates).reduce<Partial<ProjectDocument>>((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key as keyof ProjectDocument] = value;
    }
    return acc;
  }, {});

  // Handle results separately with type checking
  if (cleanUpdates.results) {
    if (!isProjectResults(cleanUpdates.results)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Invalid results format'
      );
    }
    
    cleanUpdates.results = {
      status: cleanUpdates.results.status,
      ...(cleanUpdates.results.data && { data: cleanUpdates.results.data }),
      ...(cleanUpdates.results.error && { error: cleanUpdates.results.error })
    };
  }

  return cleanUpdates;
}

// Create project function
export const createProject = functions.https.onCall(async (data: ProjectData, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  // Apply rate limiting
  await apiLimiter.authenticated(context);

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
export const updateProject = functions.https.onCall(async (data: { projectId: string; updates: ProjectUpdate }, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be logged in to update project'
    );
  }

  // Apply rate limiting
  await apiLimiter.authenticated(context);

  try {
    const { projectId, updates } = data;

    // Validate update data
    if (updates.name === '') {
      throw new functions.https.HttpsError('invalid-argument', 'Name cannot be empty');
    }
    if (updates.description === '') {
      throw new functions.https.HttpsError('invalid-argument', 'Description cannot be empty');
    }
    if (updates.languages && updates.languages.length === 0) {
      throw new functions.https.HttpsError('invalid-argument', 'Languages array cannot be empty');
    }

    const projectRef = admin.firestore().collection('projects').doc(projectId);
    const project = await projectRef.get();

    if (!project.exists) {
      throw new functions.https.HttpsError('not-found', 'Project not found');
    }

    const projectData = project.data() as ProjectDocument;
    if (projectData.userId !== context.auth!.uid) {
      throw new functions.https.HttpsError('permission-denied', 'Not authorized to update this project');
    }

    // Clean and validate updates
    const cleanUpdates = cleanProjectUpdates(updates);

    // Update project with cleaned data
    await projectRef.update({
      ...cleanUpdates,
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

  // Apply rate limiting
  await apiLimiter.authenticated(context);

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
      transaction.update(admin.firestore().collection('users').doc(context.auth!.uid), {
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

  // Apply rate limiting
  await apiLimiter.authenticated(context);

  try {
    const { projectId } = data;
    const projectRef = admin.firestore().collection('projects').doc(projectId);
    const project = await projectRef.get();

    if (!project.exists) {
      throw new functions.https.HttpsError('not-found', 'Project not found');
    }

    const projectData = project.data() as ProjectDocument;
    if (!projectData || projectData.userId !== context.auth.uid) {
      throw new functions.https.HttpsError('permission-denied', 'Not authorized to view this project');
    }

    return {
      status: projectData.results?.status || 'pending',
      data: projectData.results?.data || null,
      error: projectData.results?.error || null
    };
  } catch (error) {
    console.error('Error getting project results:', error);
    throw new functions.https.HttpsError(
      'internal',
      error instanceof Error ? error.message : 'Failed to get project results'
    );
  }
});

// Get multiple projects function
export const getProjects = functions.https.onCall(async (data: { projectIds: string[] }, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  // Apply rate limiting
  await apiLimiter.authenticated(context);

  try {
    const { projectIds } = data;

    if (!Array.isArray(projectIds)) {
      throw new functions.https.HttpsError('invalid-argument', 'Project IDs must be an array');
    }

    // Get all projects in a batch
    const projectRefs = projectIds.map(id => 
      admin.firestore().collection('projects').doc(id)
    );

    const projectDocs = await admin.firestore().getAll(...projectRefs);

    // Filter out non-existent projects and unauthorized access
    const projects = projectDocs
      .filter(doc => {
        const data = doc.data() as ProjectDocument | undefined;
        return doc.exists && data && data.userId === context.auth!.uid;
      })
      .map(doc => ({
        id: doc.id,
        ...(doc.data() as ProjectDocument)
      }));

    return { projects };
  } catch (error) {
    console.error('Error getting projects:', error);
    throw new functions.https.HttpsError(
      'internal',
      error instanceof Error ? error.message : 'Failed to get projects'
    );
  }
}); 