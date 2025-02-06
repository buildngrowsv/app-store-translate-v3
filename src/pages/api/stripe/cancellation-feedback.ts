import { FirebaseService } from '../../../services/firebase';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { reason, feedback } = req.body;
    const userId = req.user?.id; // You'll need to add user authentication

    if (!reason) {
      return res.status(400).json({ message: 'Reason is required' });
    }

    // Store feedback in Firestore
    await FirebaseService.updateSubscription(userId, {
      cancellationFeedback: {
        reason,
        feedback,
        timestamp: new Date().toISOString()
      }
    });

    return res.status(200).json({ message: 'Feedback received' });
  } catch (error) {
    console.error('Error storing cancellation feedback:', error);
    return res.status(500).json({ message: 'Error storing feedback' });
  }
} 