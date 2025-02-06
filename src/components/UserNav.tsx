import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, LayoutDashboard, Settings } from 'lucide-react';

export const UserNav: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <div className="flex items-center space-x-6">
      <Link 
        to="/dashboard" 
        className="flex items-center text-white/90 hover:text-white transition-colors"
      >
        <LayoutDashboard className="w-4 h-4 mr-2" />
        Dashboard
      </Link>
      <Link 
        to="/settings" 
        className="flex items-center text-white/90 hover:text-white transition-colors"
      >
        <Settings className="w-4 h-4 mr-2" />
        Settings
      </Link>
      <button
        onClick={signOut}
        className="flex items-center text-white/90 hover:text-white transition-colors"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </button>
    </div>
  );
};