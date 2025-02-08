/*
* File: Header.tsx
* Description: Main application header component
* Details: Provides navigation and theme switching functionality
* - Displays logo and main navigation links
* - Includes theme toggle button
* - Shows user navigation when logged in
* - Adapts to dark mode
* Date: 2024-03-20
*/

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import { Sparkles } from 'lucide-react';
import { useTranslation, Language, languageMap } from '../i18n';
import { useAuth } from '../contexts/AuthContext';
import { UserNav } from './UserNav';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '../lib/utils';

interface HeaderProps {
  lang?: Language;
}

export const Header: React.FC<HeaderProps> = ({ lang = 'english' }) => {
  const t = useTranslation(lang);
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-900 dark:to-pink-900 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo with animated glow */}
          <Link 
            to="/" 
            className={cn(
              "flex items-center space-x-2 group relative",
              "before:absolute before:-inset-2 before:rounded-lg",
              "before:bg-gradient-to-r before:from-purple-400/0 before:via-white/25 before:to-pink-400/0",
              "before:opacity-0 hover:before:opacity-100",
              "before:transition-opacity before:duration-500",
              "before:animate-glow-slow",
              "before:blur-md"
            )}
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 
                           rounded-full opacity-75 group-hover:opacity-100 blur 
                           transition-opacity duration-500 animate-pulse" />
              <Sparkles className="w-6 h-6 text-white relative animate-pulse-glow" />
            </div>
            <span className={cn(
              "text-xl font-bold text-white relative",
              "bg-clip-text text-transparent bg-gradient-to-r",
              "from-white via-white/90 to-white/80",
              "group-hover:from-white group-hover:via-purple-100 group-hover:to-pink-100",
              "transition-all duration-500"
            )}>
              ReachMix
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-white/90 hover:text-white transition-colors">
              About
            </Link>
            <a 
              href="#pricing" 
              className="text-white/90 hover:text-white transition-colors"
            >
              Pricing
            </a>

            <div className="relative group">
              <button className="text-white/90 hover:text-white transition-colors">
                Languages
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg 
                            opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                            transition-all duration-300">
                <div className="py-2">
                  {(Object.entries(languageMap) as [Language, string][]).map(([key, label]) => (
                    <Link
                      key={key}
                      to={`/${key === 'english' ? '' : key}`}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-gray-700"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <UserNav />
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button 
                    variant="secondary"
                    className="relative group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-white/25 to-pink-400/0 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-500 
                                animate-glow-slow blur-md" />
                    <span className="relative">Log in</span>
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button 
                    variant="gradient"
                    className="relative group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-white/25 to-pink-400/0 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-500 
                                animate-glow-slow blur-md" />
                    <span className="relative">Sign up</span>
                  </Button>
                </Link>
                <ThemeToggle />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};