import React, { useState } from 'react';
import { LanguageList } from './LanguageList';
import { UpgradeModal } from '../modals/UpgradeModal';
import { useNavigate } from 'react-router-dom';

interface LanguageSelectionProps {
  selected: string[];
  onChange: (languages: string[]) => void;
}

export const LanguageSelection: React.FC<LanguageSelectionProps> = ({
  selected,
  onChange,
}) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const navigate = useNavigate();

  const handleLanguageChange = (languages: string[]) => {
    onChange(languages);
  };

  const handleUpgrade = () => {
    setShowUpgradeModal(false);
    navigate('/signup');
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Select Target Languages
        </h3>
        <p className="text-sm text-gray-500">
          Choose up to 3 languages for your free trial
        </p>
      </div>

      <LanguageList
        selected={selected}
        onChange={handleLanguageChange}
        maxLanguages={3}
        onMaxLanguagesExceeded={() => setShowUpgradeModal(true)}
      />

      {showUpgradeModal && (
        <UpgradeModal
          onClose={() => setShowUpgradeModal(false)}
          onUpgrade={handleUpgrade}
        />
      )}
    </div>
  );
};