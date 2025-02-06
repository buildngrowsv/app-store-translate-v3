import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../Button';

interface CancellationSurveyProps {
  onClose: () => void;
  onConfirmCancel: (reason: string, feedback: string) => Promise<void>;
}

export const CancellationSurvey: React.FC<CancellationSurveyProps> = ({
  onClose,
  onConfirmCancel,
}) => {
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const reasons = [
    'Too expensive',
    'Not using it enough',
    'Missing features',
    'Found an alternative',
    'Technical issues',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      setError('Please select a reason for cancellation');
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirmCancel(reason, feedback);
    } catch (error) {
      setError('Failed to process cancellation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-4">We're Sorry to See You Go</h2>
        <p className="text-gray-600 mb-6">
          Before you cancel, we'd love to hear your feedback to improve our service.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Why are you cancelling?
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            >
              <option value="">Select a reason</option>
              {reasons.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional feedback (optional)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              rows={4}
              placeholder="Tell us more about your experience..."
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <div className="flex flex-col space-y-3">
            <Button
              type="submit"
              variant="destructive"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Processing...' : 'Confirm Cancellation'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full"
            >
              Keep My Subscription
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 