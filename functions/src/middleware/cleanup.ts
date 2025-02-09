/*
* File: functions/src/middleware/cleanup.ts
* Description: Cleanup function for rate limit records
* Details: Periodically removes old rate limit records from Firestore
* - Runs every hour
* - Removes records older than the maximum window
* - Maintains database size
* Date: 2024-03-20
*/

import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

// Maximum window size across all rate limits (1 hour)
const MAX_WINDOW_MS = 60 * 60 * 1000;

export const cleanupRateLimits = functions.pubsub
  .schedule('every 60 minutes')
  .onRun(async (context) => {
    const db = admin.firestore();
    const now = Date.now();
    const cutoff = now - MAX_WINDOW_MS;

    try {
      // Get all rate limit documents
      const snapshot = await db.collection('rate_limits').get();
      
      const batch = db.batch();
      let batchCount = 0;

      for (const doc of snapshot.docs) {
        const data = doc.data();
        
        // Remove documents where all requests are old
        if (data.lastReset < cutoff) {
          batch.delete(doc.ref);
          batchCount++;
        } else {
          // Filter out old requests
          const newRequests = data.requests.filter(
            (r: { timestamp: number }) => r.timestamp > cutoff
          );

          if (newRequests.length !== data.requests.length) {
            batch.update(doc.ref, { requests: newRequests });
            batchCount++;
          }
        }

        // Commit batch when it reaches 500 operations
        if (batchCount === 500) {
          await batch.commit();
          batchCount = 0;
        }
      }

      // Commit any remaining operations
      if (batchCount > 0) {
        await batch.commit();
      }

      console.log('Rate limit cleanup completed successfully');
      return null;
    } catch (error) {
      console.error('Error cleaning up rate limits:', error);
      return null;
    }
  }); 