import React from 'react';
import { Button } from '../Button';
import { X } from 'lucide-react';

interface UpgradeModalProps {
  onClose: () => void;
  onUpgrade: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ onClose, onUpgrade }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold mb-4">Unlock More Languages</h2>
        <p className="text-gray-600 mb-6">
          Sign up for ReachMix to translate your app to more languages and reach a wider audience.
        </p>
        
        <div className="space-y-4">
          <Button onClick={onUpgrade} className="w-full">
            Sign Up Now
          </Button>
          <button
            onClick={onClose}
            className="w-full text-gray-500 hover:text-gray-700"
          >
            I don't want to reach more people
          </button>
        </div>
      </div>
    </div>
  );
};