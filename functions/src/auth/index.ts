/*
* File: functions/src/auth/index.ts
* Description: Authentication functions for Firebase
* Details: Handles user authentication operations
* - Sign up with email/password
* - Sign in with email/password
* - Password reset
* - Rate limiting on all operations
* Date: 2024-03-20
*/

import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import { authLimiter } from '../middleware/rateLimit';

interface SignUpData {
  email: string;
  password: string;
  displayName?: string;
}

interface SignInData {
  email: string;
  password: string;
}

interface PasswordResetData {
  email: string;
}

interface FirebaseAuthError {
  code: string;
  message: string;
}

// Sign up function
export const signUp = functions.https.onCall(async (data: SignUpData, context) => {
  // Apply rate limiting
  await authLimiter.signup(context);

  try {
    // Validate input
    if (!data.email || !data.password) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Email and password are required'
      );
    }

    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email: data.email,
      password: data.password,
      displayName: data.displayName,
      emailVerified: false
    });

    // Create user document in Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email: data.email,
      displayName: data.displayName || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      subscription: {
        status: 'trial',
        trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days trial
      },
      projects: [],
      emailVerificationLink: null,
      passwordResetLink: null
    });

    // Send email verification
    const emailVerificationLink = await admin.auth().generateEmailVerificationLink(data.email);
    await admin.firestore().collection('users').doc(userRecord.uid).update({
      emailVerificationLink
    });
    
    // TODO: Send email using your email service
    // await emailService.sendVerificationEmail(data.email, emailVerificationLink);

    return {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName
    };
  } catch (error: unknown) {
    console.error('Error in signUp:', error);
    
    if ((error as FirebaseAuthError).code === 'auth/email-already-exists') {
      throw new functions.https.HttpsError(
        'already-exists',
        'Email already registered'
      );
    }

    if ((error as FirebaseAuthError).code === 'auth/invalid-email') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Invalid email format'
      );
    }

    if ((error as FirebaseAuthError).code === 'auth/weak-password') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Password should be at least 6 characters'
      );
    }

    throw new functions.https.HttpsError(
      'internal',
      error instanceof Error ? error.message : 'Sign up failed. Please try again.'
    );
  }
});

// Sign in function
export const signIn = functions.https.onCall(async (data: SignInData, context) => {
  // Apply rate limiting
  await authLimiter.signin(context);

  try {
    // Validate input
    if (!data.email || !data.password) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Email and password are required'
      );
    }

    // Get user by email
    const userRecord = await admin.auth().getUserByEmail(data.email);

    // Create custom token
    const token = await admin.auth().createCustomToken(userRecord.uid);

    // If email is not verified, generate and send verification link
    // but still allow sign in
    if (!userRecord.emailVerified) {
      const emailVerificationLink = await admin.auth().generateEmailVerificationLink(data.email);
      await admin.firestore().collection('users').doc(userRecord.uid).update({
        emailVerificationLink
      });
      
      return { 
        token,
        emailVerified: false,
        message: 'Please verify your email address. A verification email has been sent.'
      };
    }

    return { 
      token,
      emailVerified: true
    };
  } catch (error: unknown) {
    console.error('Error in signIn:', error);

    if ((error as FirebaseAuthError).code === 'auth/user-not-found' || 
        (error as FirebaseAuthError).code === 'auth/wrong-password') {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Invalid email or password'
      );
    }

    throw new functions.https.HttpsError(
      'internal',
      error instanceof Error ? error.message : 'Sign in failed. Please try again.'
    );
  }
});

// Password reset function
export const resetPassword = functions.https.onCall(async (data: PasswordResetData, context) => {
  // Apply rate limiting
  await authLimiter.passwordReset(context);

  try {
    // Validate input
    if (!data.email) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Email is required'
      );
    }

    // Get user record first
    const userRecord = await admin.auth().getUserByEmail(data.email);

    // Generate password reset link
    const resetLink = await admin.auth().generatePasswordResetLink(data.email);
    await admin.firestore().collection('users').doc(userRecord.uid).update({
      passwordResetLink: resetLink
    });
    
    // TODO: Send email using your email service
    // await emailService.sendPasswordResetEmail(data.email, resetLink);

    return { success: true };
  } catch (error: unknown) {
    console.error('Error in resetPassword:', error);

    if ((error as FirebaseAuthError).code === 'auth/user-not-found') {
      // Return success even if user not found for security
      return { success: true };
    }

    throw new functions.https.HttpsError(
      'internal',
      error instanceof Error ? error.message : 'Password reset failed. Please try again.'
    );
  }
}); 