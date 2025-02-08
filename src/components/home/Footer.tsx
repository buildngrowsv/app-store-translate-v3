/*
* File: Footer.tsx
* Description: Footer component for the application
* Details: Provides navigation links and company information
* - Supports dark mode
* - Features beautiful gradients and animations
* - Includes hover effects and transitions
* - Uses gradient accents
* Date: 2024-03-20
*/

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation, Language } from '../../i18n';
import { cn } from '../../lib/utils';

interface FooterProps {
  lang?: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang = 'english' }) => {
  const t = useTranslation(lang);

  const linkClasses = cn(
    "transition-colors duration-200",
    "text-gray-400 hover:text-white",
    "dark:text-gray-500 dark:hover:text-gray-300"
  );

  return (
    <footer className="relative mt-auto overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 
                    dark:from-gray-950 dark:to-gray-900" />
      
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-48 top-0 w-96 h-96 
                      bg-gradient-to-br from-purple-500/5 to-pink-500/5 
                      dark:from-purple-400/5 dark:to-pink-400/5 
                      rounded-full blur-3xl" />
        <div className="absolute -right-48 bottom-0 w-96 h-96 
                      bg-gradient-to-br from-blue-500/5 to-purple-500/5 
                      dark:from-blue-400/5 dark:to-purple-400/5 
                      rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className={cn(
              "font-bold mb-4",
              "bg-gradient-to-r from-purple-400 to-pink-400",
              "dark:from-purple-500 dark:to-pink-500",
              "bg-clip-text text-transparent"
            )}>
              ReachMix
            </h3>
            <p className="text-gray-400 dark:text-gray-500">
              Transform your app's global presence
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white dark:text-gray-200 font-bold mb-4">
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className={linkClasses}>
                  About
                </Link>
              </li>
              <li>
                <Link to="/privacy" className={linkClasses}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className={linkClasses}>
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-white dark:text-gray-200 font-bold mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className={linkClasses}>
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/docs" className={linkClasses}>
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Links */}
          <div>
            <h4 className="text-white dark:text-gray-200 font-bold mb-4">
              Contact
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className={linkClasses}>
                  Get in Touch
                </Link>
              </li>
              <li>
                <Link to="/support" className={linkClasses}>
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 dark:border-gray-700">
          <p className="text-center text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} ReachMix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};