import React from 'react';
import { languages } from '../../data/languages';
import { Card } from '../Card';
import { Check } from 'lucide-react';

interface LanguageListProps {
  selected: string[];
  onChange: (languages: string[]) => void;
  maxLanguages?: number;
  onMaxLanguagesExceeded?: () => void;
}

export const LanguageList: React.FC<LanguageListProps> = ({
  selected,
  onChange,
  maxLanguages = Infinity,
  onMaxLanguagesExceeded,
}) => {
  const handleToggle = (language: string) => {
    if (selected.includes(language)) {
      onChange(selected.filter((l) => l !== language));
    } else if (selected.length < maxLanguages) {
      onChange([...selected, language]);
    } else {
      onMaxLanguagesExceeded?.();
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto p-2">
      {languages.map((language) => (
        <Card
          key={language}
          className={`cursor-pointer transition-all hover:border-purple-200 ${
            selected.includes(language) ? 'ring-2 ring-purple-500' : ''
          }`}
          onClick={() => handleToggle(language)}
        >
          <div className="flex items-center p-3">
            <div
              className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                selected.includes(language)
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-transparent'
                  : 'border-gray-300'
              }`}
            >
              {selected.includes(language) && (
                <Check className="w-3 h-3 text-white" />
              )}
            </div>
            <span className="text-sm">{language}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};