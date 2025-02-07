import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SubscriptionService } from '../../services/subscription';
import { AlertCircle } from 'lucide-react';

interface LanguageSelectionProps {
  selected: string[];
  onChange: (languages: string[]) => void;
}

export const LanguageSelection: React.FC<LanguageSelectionProps> = ({
  selected,
  onChange
}) => {
  const { user } = useAuth();
  const [maxLanguages, setMaxLanguages] = useState<number>(3); // Default to trial limit
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLimits = async () => {
      if (!user) return;
      try {
        const usage = await SubscriptionService.getUsage(user.uid);
        setMaxLanguages(usage.languages.total);
      } catch (error) {
        console.error('Error fetching subscription limits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLimits();
  }, [user]);

  const handleLanguageToggle = (language: string) => {
    if (selected.includes(language)) {
      onChange(selected.filter(l => l !== language));
    } else if (selected.length < maxLanguages) {
      onChange([...selected, language]);
    }
  };

  if (loading) {
    return <div className="animate-pulse h-48 bg-gray-100 rounded-lg" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Select Target Languages</h3>
        <p className="text-gray-600 mb-4">
          Select up to {maxLanguages} languages to translate your content into.
        </p>
        {selected.length >= maxLanguages && (
          <div className="mb-4 p-4 bg-blue-50 text-blue-700 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Language Limit Reached</p>
              <p className="mt-1">
                You've selected the maximum number of languages allowed on your current plan.
              </p>
              <a 
                href="/settings#subscription" 
                className="mt-2 inline-block text-blue-700 hover:text-blue-800 underline"
              >
                Upgrade for more languages
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {LANGUAGES.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageToggle(language.code)}
            disabled={!selected.includes(language.code) && selected.length >= maxLanguages}
            className={`p-4 rounded-lg border transition-all duration-200 ${
              selected.includes(language.code)
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : selected.length >= maxLanguages
                ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            <div className="font-medium">{language.name}</div>
            <div className="text-sm opacity-75">{language.native}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

const LANGUAGES = [
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands' },
  { code: 'pl', name: 'Polish', native: 'Polski' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'zh', name: 'Chinese', native: '中文' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' },
];