/*
* File: functions/src/stripe/feedback.ts
* Description: Handles subscription cancellation feedback
* Details: Stores user feedback when cancelling subscription
* - Saves feedback to Firestore
* - Links feedback to subscription and user
* - Includes reason and additional comments
* Date: 2024-03-20
*/

import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

interface CancellationFeedback {
  reason: string;
  feedback?: string;
  subscriptionId: string;
}

export const handleCancellationFeedback = functions.https.onCall(
  async (data: CancellationFeedback, context) => {
    // Authentication check
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Must be logged in to submit feedback'
      );
    }

    try {
      // Input validation
      if (!data.reason || !data.subscriptionId) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'Reason and subscription ID are required'
        );
      }

      // Create feedback document
      const feedbackRef = admin.firestore().collection('cancellation_feedback').doc();
      await feedbackRef.set({
        userId: context.auth.uid,
        subscriptionId: data.subscriptionId,
        reason: data.reason,
        feedback: data.feedback || '',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Update user's subscription document with cancellation reason
      const userRef = admin.firestore().collection('users').doc(context.auth.uid);
      await userRef.update({
        'subscription.cancellationReason': data.reason,
        'subscription.cancellationFeedback': data.feedback || '',
        'subscription.cancelledAt': admin.firestore.FieldValue.serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      console.error('Error handling cancellation feedback:', error);
      throw new functions.https.HttpsError(
        'internal',
        error instanceof Error ? error.message : 'Failed to save cancellation feedback'
      );
    }
  }
); 