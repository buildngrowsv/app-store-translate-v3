import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import { Sparkles } from 'lucide-react';
import { useTranslation, Language, languageMap } from '../i18n';
import { useAuth } from './auth/AuthContext';
import { UserNav } from './UserNav';

interface HeaderProps {
  lang?: Language;
}

export const Header: React.FC<HeaderProps> = ({ lang = 'english' }) => {
  const t = useTranslation(lang);
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-pink-600">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-white" />
            <span className="text-xl font-bold text-white">ReachMix</span>
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
              <div className="fixed top-16 right-0 mt-2 w-48 bg-white rounded-lg shadow-lg 
                            opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                            transition-all duration-300">
                <div className="py-2">
                  {(Object.entries(languageMap) as [Language, string][]).map(([key, label]) => (
                    <Link
                      key={key}
                      to={`/${key === 'english' ? '' : key}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="flex items-center space-x-6">
            {user ? (
              <UserNav />
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-white/90 transition-colors">
                  Login
                </Link>
                <Link to="/signup">
                  <Button variant="secondary" className="shadow-lg">
                    Start Now
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};