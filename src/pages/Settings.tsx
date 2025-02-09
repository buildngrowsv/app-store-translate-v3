import React, { useState } from 'react';
import { CreditCard, Lock, LifeBuoy, CreditCardIcon, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../contexts/AuthContext';
import { StripeService } from '../services/stripe';
import { CancellationSurvey } from '../components/modals/CancellationSurvey';
import { useAnalytics } from '../hooks/useAnalytics';
import { cn } from '../lib/utils';

// Add subscription plan details
const SUBSCRIPTION_PLANS = {
  starter: {
    id: import.meta.env.VITE_STRIPE_STARTER_PRICE_ID,
    name: 'Starter',
    price: '$9.99/month',
    features: [
      'Up to 5 projects',
      '3 languages per project',
      'Basic support',
      'Standard processing'
    ]
  },
  pro: {
    id: import.meta.env.VITE_STRIPE_PRO_PRICE_ID,
    name: 'Pro',
    price: '$29.99/month',
    features: [
      'Up to 20 projects',
      '10 languages per project',
      'Priority support',
      'Fast processing',
      'Advanced analytics'
    ]
  }
};

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
  const [upgradePlanLoading, setUpgradePlanLoading] = useState<string | null>(null);

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
      setError(null);
      await StripeService.redirectToCustomerPortal();
    } catch (error) {
      console.error('Subscription management error:', error);
      setError(
        error instanceof Error 
          ? error.message 
          : 'Failed to access subscription management. Please try again later.'
      );
      // Show more detailed error message if available
      if (error instanceof Error && error.message.includes('No Stripe customer ID found')) {
        setError('Unable to access subscription portal. Please try refreshing the page or contact support if the issue persists.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgradePlan = async (priceId: string, planName: string) => {
    try {
      setUpgradePlanLoading(planName);
      setError(null);
      await StripeService.redirectToCheckout(priceId);
    } catch (error) {
      console.error('Error upgrading plan:', error);
      setError(
        error instanceof Error 
          ? error.message 
          : 'Failed to process upgrade. Please try again later.'
      );
    } finally {
      setUpgradePlanLoading(null);
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
            {user && (
              <div className="mt-4 flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-600">
                    {user.email?.[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.email}</p>
                  <p className="text-xs text-gray-500">
                    {userData?.subscription?.status === 'active' ? 'Premium Member' : 'Free Account'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Subscription Plans Section */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex items-center mb-6">
              <CreditCardIcon className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">Subscription Plans</h2>
                <p className="text-sm text-gray-500">Choose the plan that best fits your needs</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Starter Plan */}
              <div className="border rounded-lg p-6 bg-gradient-to-br from-purple-50 to-white flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{SUBSCRIPTION_PLANS.starter.name}</h3>
                    <p className="text-2xl font-bold mt-2">{SUBSCRIPTION_PLANS.starter.price}</p>
                  </div>
                  {userData?.subscription?.plan === SUBSCRIPTION_PLANS.starter.id && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Current Plan
                    </span>
                  )}
                </div>
                <ul className="mt-4 space-y-3 flex-grow">
                  {SUBSCRIPTION_PLANS.starter.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleUpgradePlan(SUBSCRIPTION_PLANS.starter.id, 'starter')}
                  disabled={upgradePlanLoading === 'starter' || userData?.subscription?.plan === SUBSCRIPTION_PLANS.starter.id}
                  className="mt-6 w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {upgradePlanLoading === 'starter' ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : userData?.subscription?.plan === SUBSCRIPTION_PLANS.starter.id ? (
                    'Current Plan'
                  ) : (
                    'Upgrade to Starter'
                  )}
                </button>
              </div>

              {/* Pro Plan */}
              <div className="border rounded-lg p-6 bg-gradient-to-br from-indigo-50 to-white flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{SUBSCRIPTION_PLANS.pro.name}</h3>
                    <p className="text-2xl font-bold mt-2">{SUBSCRIPTION_PLANS.pro.price}</p>
                  </div>
                  {userData?.subscription?.plan === SUBSCRIPTION_PLANS.pro.id && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Current Plan
                    </span>
                  )}
                </div>
                <ul className="mt-4 space-y-3 flex-grow">
                  {SUBSCRIPTION_PLANS.pro.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleUpgradePlan(SUBSCRIPTION_PLANS.pro.id, 'pro')}
                  disabled={upgradePlanLoading === 'pro' || userData?.subscription?.plan === SUBSCRIPTION_PLANS.pro.id}
                  className="mt-6 w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {upgradePlanLoading === 'pro' ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : userData?.subscription?.plan === SUBSCRIPTION_PLANS.pro.id ? (
                    'Current Plan'
                  ) : (
                    'Upgrade to Pro'
                  )}
                </button>
              </div>
            </div>
          </div>

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
                  onClick={handleManageSubscription}
                  variant="outline"
                  isLoading={isLoading}
                  loadingText="Redirecting to portal..."
                  className="mt-4"
                >
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