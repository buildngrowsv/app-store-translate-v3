// Firebase configuration and authentication service
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  DocumentData,
  DocumentReference,
  CollectionReference,
  enableIndexedDbPersistence
} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqyfe6xv13BpQhAwMf_UFXBltOsoHbYn8",
  authDomain: "reachmix.firebaseapp.com",
  projectId: "reachmix",
  storageBucket: "reachmix.firebasestorage.app",
  messagingSenderId: "308749387179",
  appId: "1:308749387179:web:b635c6c88d22ca52c5beee",
  measurementId: "G-WK6KD2YSCC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Enable offline persistence
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
    } else if (err.code == 'unimplemented') {
      console.warn('The current browser doesn\'t support persistence.');
    }
  });
} catch (err) {
  console.warn('Error enabling persistence:', err);
}

// Collection references
const usersCollection = collection(db, 'users');
const projectsCollection = collection(db, 'projects');

export class FirebaseService {
  // Sign up with email and password
  static async signUp(email: string, password: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      const userData = {
        email: userCredential.user.email,
        createdAt: new Date().toISOString(),
        projects: [],
        subscription: {
          status: 'trial',
          trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days trial
        }
      };

      // Use set with merge option to handle potential conflicts
      await setDoc(doc(usersCollection, userCredential.user.uid), userData, { merge: true });
      
      return userCredential.user;
    } catch (error: any) {
      console.error('Error signing up:', error);
      if (error.code === 'permission-denied') {
        throw new Error('Database access denied. Please check Firestore rules.');
      }
      throw error;
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Get current user
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Subscribe to auth state changes
  static onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  // Get user data from Firestore
  static async getUserData(userId: string): Promise<DocumentData | null> {
    try {
      const userDoc = await getDoc(doc(usersCollection, userId));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      throw error;
    }
  }

  // Create a new project
  static async createProject(userId: string, projectData: any): Promise<string> {
    try {
      // Check if user document exists, if not create it
      const userRef = doc(usersCollection, userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Create user document if it doesn't exist
        await setDoc(userRef, {
          projects: [],
          subscription: {
            status: 'trial',
            trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days trial
          }
        });
      }
      
      // Create project document
      const projectRef = doc(projectsCollection);
      const projectId = projectRef.id;
      
      const project = {
        ...projectData,
        id: projectId,
        userId,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        status: 'in-progress',
        results: {
          status: 'in-progress'
        }
      };
      
      await setDoc(projectRef, project);
      
      // Update user's projects array
      await updateDoc(userRef, {
        projects: [...(await this.getUserProjects(userId)), projectId]
      });
      
      return projectId;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  // Get user's projects
  static async getUserProjects(userId: string): Promise<string[]> {
    try {
      const userDoc = await getDoc(doc(usersCollection, userId));
      return userDoc.exists() ? userDoc.data().projects || [] : [];
    } catch (error) {
      console.error('Error getting user projects:', error);
      throw error;
    }
  }

  // Get project data
  static async getProject(projectId: string): Promise<DocumentData | null> {
    try {
      const projectDoc = await getDoc(doc(projectsCollection, projectId));
      return projectDoc.exists() ? projectDoc.data() : null;
    } catch (error) {
      console.error('Error getting project:', error);
      throw error;
    }
  }

  // Update project
  static async updateProject(projectId: string, updates: any): Promise<void> {
    try {
      const projectRef = doc(projectsCollection, projectId);
      await updateDoc(projectRef, {
        ...updates,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  // Update user subscription
  static async updateSubscription(userId: string, subscriptionData: any): Promise<void> {
    try {
      const userRef = doc(usersCollection, userId);
      await updateDoc(userRef, {
        subscription: {
          ...subscriptionData,
          updatedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  // Delete project
  static async deleteProject(projectId: string): Promise<void> {
    try {
      // Get project to check user ID
      const projectDoc = await getDoc(doc(projectsCollection, projectId));
      if (!projectDoc.exists()) {
        throw new Error('Project not found');
      }

      const projectData = projectDoc.data();
      const userId = projectData.userId;

      // Delete project document
      await deleteDoc(doc(projectsCollection, projectId));

      // Update user's projects array
      const userRef = doc(usersCollection, userId);
      const userData = await getDoc(userRef);
      if (userData.exists()) {
        const projects = userData.data().projects || [];
        await updateDoc(userRef, {
          projects: projects.filter((id: string) => id !== projectId)
        });
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
}

export { auth, analytics, db }; 