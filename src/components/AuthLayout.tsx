/*
* File: AuthLayout.tsx
* Description: Layout component for authentication pages
* Details: Provides a consistent layout for login, signup, and other auth pages
* - Supports dark mode
* - Features elegant gradients and animations
* - Includes logo and branding
* - Centers content with a card-like container
* Date: 2024-03-20
*/

import React from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 
                    bg-gradient-to-br from-gray-50 via-white to-gray-50
                    dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
                    transition-colors duration-300">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-48 -top-48 w-96 h-96 
                      bg-gradient-to-br from-purple-500/10 to-pink-500/10 
                      dark:from-purple-500/5 dark:to-pink-500/5 
                      rounded-full blur-3xl animate-pulse" />
        <div className="absolute -right-48 -bottom-48 w-96 h-96 
                      bg-gradient-to-br from-blue-500/10 to-purple-500/10 
                      dark:from-blue-500/5 dark:to-purple-500/5 
                      rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative">
        <Link 
          to="/" 
          className="flex items-center justify-center space-x-2 group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 
                          rounded-lg blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white dark:bg-gray-800 rounded-lg p-2">
              <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 
                        bg-clip-text text-transparent">
            ReachMix
          </span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold 
                    text-gray-900 dark:text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative">
        <div className="relative">
          {/* Card glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 
                       rounded-lg blur opacity-25 dark:opacity-20" />
          <div className="relative bg-white dark:bg-gray-800 py-8 px-4 shadow-xl 
                       sm:rounded-lg sm:px-10 border border-gray-100 dark:border-gray-700
                       transition-colors duration-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};