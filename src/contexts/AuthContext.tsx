import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { getDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { StripeService } from '../services/stripe';
import { STRIPE_PLANS } from '../config/stripe';
import { useAnalytics } from '../hooks/useAnalytics';
import { useNavigate } from 'react-router-dom';
import { FirebaseService } from '../services/firebase';

interface UserData {
  email: string | null;
  subscription?: {
    status: 'trial' | 'active' | 'inactive';
    plan?: string;
    trialEnd?: string;
  };
  projects: string[];
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  createProject: (projectData: any) => Promise<string>;
  updateProject: (projectId: string, updates: any) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { trackLogin, trackSignUp } = useAnalytics();
  const navigate = useNavigate();

  // Fetch user data from Firestore
  const fetchUserData = async (userId: string) => {
    try {
      const data = await FirebaseService.getUserData(userId);
      if (data) {
        setUserData(data as UserData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Refresh user data
  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user.uid);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      try {
        if (user) {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const data = userDoc.data();
          setUser(user);
          setUserData(data as UserData | null);

          // Prefetch Stripe sessions if user has subscription
          if (data?.subscription?.status === 'active' || data?.subscription?.status === 'trial') {
            const priceIds = Object.values(STRIPE_PLANS)
              .map(plan => plan.id)
              .filter(id => id && id !== data.subscription?.plan);
            
            // Prefetch in background
            StripeService.prefetchSessions(priceIds).catch(error => {
              console.error('Error prefetching Stripe sessions:', error);
            });
          }
        } else {
          setUser(null);
          setUserData(null);
          // Clear Stripe cache on logout
          StripeService.clearCache();
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    const user = await FirebaseService.signIn(email, password);
    await fetchUserData(user.uid);
    trackLogin();
    navigate('/dashboard');
    return user;
  };

  const handleSignUp = async (email: string, password: string) => {
    const user = await FirebaseService.signUp(email, password);
    await fetchUserData(user.uid);
    trackSignUp();
    navigate('/dashboard');
    return user;
  };

  const handleSignOut = async () => {
    await FirebaseService.signOut();
    setUserData(null);
    navigate('/');
  };

  const handleCreateProject = async (projectData: any) => {
    if (!user) throw new Error('Not authenticated');
    const projectId = await FirebaseService.createProject(user.uid, projectData);
    await refreshUserData();
    return projectId;
  };

  const handleUpdateProject = async (projectId: string, updates: any) => {
    if (!user) throw new Error('Not authenticated');
    await FirebaseService.updateProject(projectId, updates);
    await refreshUserData();
  };

  const value = {
    user,
    userData,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    createProject: handleCreateProject,
    updateProject: handleUpdateProject,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 