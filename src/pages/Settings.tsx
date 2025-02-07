import React, { useState } from 'react';
import { CreditCard, Lock, LifeBuoy, CreditCardIcon, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../contexts/AuthContext';
import { StripeService } from '../services/stripe';
import { CancellationSurvey } from '../components/modals/CancellationSurvey';
import { useAnalytics } from '../hooks/useAnalytics';
import { cn } from '../lib/utils';

export const Settings: React.FC = () => {
  const { user, userData } = useAuth();
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your account settings and subscription preferences
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Subscription Section */}
          <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200 animate-fade-up">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCardIcon className="h-8 w-8 text-indigo-600" />
                  <div className="ml-4">
                    <h2 className="text-lg font-medium text-gray-900">Subscription</h2>
                    <p className="text-sm text-gray-500">Manage your subscription and billing</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">Current Plan</p>
                    <p className="text-sm text-gray-500">{userData?.subscription?.plan || 'Free Trial'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">Status</p>
                    <p className={cn(
                      "text-sm",
                      userData?.subscription?.status === 'active' ? 'text-green-600' : 'text-gray-500'
                    )}>
                      {userData?.subscription?.status || 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>

              {userData?.subscription?.trialEnd && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Trial ends: {new Date(userData.subscription.trialEnd).toLocaleDateString()}</span>
                </div>
              )}

              <div className="mt-6 flex gap-4">
                <Button
                  variant="gradient"
                  onClick={handleManageSubscription}
                  disabled={isLoading}
                  className="flex items-center"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Manage Subscription
                </Button>
                {userData?.subscription?.status === 'active' && (
                  <Button
                    variant="outline"
                    onClick={() => setShowCancellationSurvey(true)}
                    disabled={isLoading}
                    className="text-gray-700"
                  >
                    Cancel Subscription
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Password Reset Section */}
          <div className="bg-white shadow-sm rounded-lg p-6 animate-fade-up motion-safe:animate-[fade-up_0.3s_ease-out]">
            <div className="flex items-center mb-6">
              <Lock className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">Password</h2>
                <p className="text-sm text-gray-500">Update your password</p>
              </div>
            </div>

            <form onSubmit={handlePasswordReset} className="space-y-4 max-w-md">
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
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </div>

          {/* Support Section */}
          <div className="bg-white shadow-sm rounded-lg p-6 animate-fade-up motion-safe:animate-[fade-up_0.4s_ease-out]">
            <div className="flex items-center mb-6">
              <LifeBuoy className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">Support</h2>
                <p className="text-sm text-gray-500">Get help with your account</p>
              </div>
            </div>

            <form onSubmit={handleSupportTicket} className="space-y-4 max-w-md">
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
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm resize-none"
                  rows={4}
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  required
                  placeholder="How can we help you?"
                />
              </div>
              <Button type="submit" variant="primary">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>

      {showCancellationSurvey && (
        <CancellationSurvey
          onClose={() => setShowCancellationSurvey(false)}
          onConfirmCancel={async (reason, feedback) => {
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
          }}
        />
      )}
    </div>
  );
};