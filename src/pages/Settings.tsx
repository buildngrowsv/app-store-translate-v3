import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { CreditCard, Lock, LifeBuoy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { StripeService } from '../services/stripe';
import { CancellationSurvey } from '../components/modals/CancellationSurvey';
import { useAnalytics } from '../hooks/useAnalytics';

export const Settings: React.FC = () => {
  const { user, userData, refreshUserData } = useAuth();
  const { trackEvent } = useAnalytics();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [showCancellationSurvey, setShowCancellationSurvey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      // TODO: Implement password reset logic with Firebase
      setError(null);
    } catch (error) {
      setError('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupportTicket = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:buildngrowsv@gmail.com?subject=${encodeURIComponent(supportSubject)}&body=${encodeURIComponent(supportMessage)}`;
  };

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);
      await StripeService.redirectToCustomerPortal();
    } catch (error) {
      setError('Failed to access subscription management');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancellationConfirm = async (reason: string, feedback: string) => {
    try {
      await StripeService.submitCancellationFeedback(reason, feedback);
      trackEvent('subscription_cancellation_feedback', {
        reason,
        feedback_provided: !!feedback
      });
      await StripeService.redirectToCustomerPortal();
    } catch (error) {
      setError('Failed to process cancellation');
      setShowCancellationSurvey(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-8">
        {/* Subscription Management */}
        <Card>
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-grow">
              <h2 className="text-xl font-semibold mb-4">Subscription</h2>
              <div className="mb-4">
                <p className="text-gray-600">
                  Current Plan: {userData?.subscription?.plan || 'Free Trial'}
                </p>
                <p className="text-gray-600">
                  Status: {userData?.subscription?.status || 'Inactive'}
                </p>
                {userData?.subscription?.trialEnd && (
                  <p className="text-gray-600">
                    Trial ends: {new Date(userData.subscription.trialEnd).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex space-x-4">
                <Button
                  variant="primary"
                  onClick={handleManageSubscription}
                  disabled={isLoading}
                >
                  Manage Subscription
                </Button>
                {userData?.subscription?.status === 'active' && (
                  <Button
                    variant="outline"
                    onClick={() => setShowCancellationSurvey(true)}
                    disabled={isLoading}
                  >
                    Cancel Subscription
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Password Reset */}
        <Card>
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-grow">
              <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <Input
                  type="password"
                  label="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  label="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </div>
          </div>
        </Card>

        {/* Support Ticket */}
        <Card>
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <LifeBuoy className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-grow">
              <h2 className="text-xl font-semibold mb-4">Support</h2>
              <form onSubmit={handleSupportTicket} className="space-y-4">
                <Input
                  label="Subject"
                  value={supportSubject}
                  onChange={(e) => setSupportSubject(e.target.value)}
                  required
                />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    rows={4}
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    required
                    aria-label="Support message"
                  />
                </div>
                <Button type="submit">Submit Ticket</Button>
              </form>
            </div>
          </div>
        </Card>
      </div>

      {showCancellationSurvey && (
        <CancellationSurvey
          onClose={() => setShowCancellationSurvey(false)}
          onConfirmCancel={handleCancellationConfirm}
        />
      )}
    </div>
  );
};