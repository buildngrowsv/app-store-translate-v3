import React from 'react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { CreditCard, Lock, LifeBuoy } from 'lucide-react';

export const Settings: React.FC = () => {
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [supportSubject, setSupportSubject] = React.useState('');
  const [supportMessage, setSupportMessage] = React.useState('');

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement password reset logic
  };

  const handleSupportTicket = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement support ticket submission
    window.location.href = `mailto:buildngrowsv@gmail.com?subject=${encodeURIComponent(supportSubject)}&body=${encodeURIComponent(supportMessage)}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

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
                <p className="text-gray-600">Current Plan: Pro</p>
                <p className="text-gray-600">Next billing date: April 15, 2024</p>
              </div>
              <div className="flex space-x-4">
                <Button variant="outline">Change Plan</Button>
                <Button variant="outline">Update Billing</Button>
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
                <Button type="submit">Update Password</Button>
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
                  />
                </div>
                <Button type="submit">Submit Ticket</Button>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};