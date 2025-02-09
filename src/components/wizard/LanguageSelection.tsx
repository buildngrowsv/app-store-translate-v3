import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SubscriptionService } from '../../services/subscription';
import { AlertCircle, Plus, X } from 'lucide-react';
import { languages } from '../../data/languages';
import { cn } from '../../lib/utils';

interface LanguageSelectionProps {
  selected: string[];
  onChange: (languages: string[]) => void;
}

interface CustomLanguage {
  code: string;
  name: string;
  nativeName: string;
}

export const LanguageSelection: React.FC<LanguageSelectionProps> = ({
  selected,
  onChange
}) => {
  const { user } = useAuth();
  const [maxLanguages, setMaxLanguages] = useState<number>(3); // Default to trial limit
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customLanguage, setCustomLanguage] = useState<CustomLanguage>({
    code: '',
    name: '',
    nativeName: ''
  });

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

  const handleLanguageToggle = (languageCode: string) => {
    if (selected.includes(languageCode)) {
      onChange(selected.filter(l => l !== languageCode));
    } else if (selected.length < maxLanguages) {
      onChange([...selected, languageCode]);
    }
  };

  const handleAddCustomLanguage = () => {
    if (customLanguage.code && customLanguage.name) {
      // Add custom language to local storage for persistence
      const customLanguages = JSON.parse(localStorage.getItem('customLanguages') || '[]');
      const newCustomLanguage = {
        ...customLanguage,
        code: `custom-${customLanguage.code.toLowerCase()}`,
        isCustom: true
      };
      
      customLanguages.push(newCustomLanguage);
      localStorage.setItem('customLanguages', JSON.stringify(customLanguages));
      
      // Add to selected languages
      handleLanguageToggle(newCustomLanguage.code);
      
      // Reset and close modal
      setCustomLanguage({ code: '', name: '', nativeName: '' });
      setIsModalOpen(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse h-48 bg-gray-100 rounded-lg" />;
  }

  // Sort languages by popularity
  const sortedLanguages = [...languages].sort((a, b) => a.popularity - b.popularity);
  
  // Get custom languages from local storage
  const customLanguages = JSON.parse(localStorage.getItem('customLanguages') || '[]');
  const allLanguages = [...sortedLanguages, ...customLanguages];

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Select Target Languages</h3>
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

      <div className="grid grid-cols-3 gap-4">
        {allLanguages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageToggle(language.code)}
            disabled={!selected.includes(language.code) && selected.length >= maxLanguages}
            className={`p-4 rounded-lg border text-left transition-colors ${
              selected.includes(language.code)
                ? 'border-purple-500 bg-purple-50'
                : selected.length >= maxLanguages
                ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                : 'border-gray-200 hover:border-purple-500 hover:bg-purple-50'
            }`}
          >
            <div className="font-medium">{language.name}</div>
            <div className="text-sm text-gray-600">{language.nativeName}</div>
          </button>
        ))}
        
        {/* Custom Language Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={selected.length >= maxLanguages}
          className={`p-4 rounded-lg border border-dashed text-left transition-colors ${
            selected.length >= maxLanguages
              ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
              : 'border-purple-300 hover:border-purple-500 hover:bg-purple-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="font-medium">Add Custom Language</span>
          </div>
          <div className="text-sm text-gray-600 mt-1">Define your own language</div>
        </button>
      </div>

      {/* Custom Language Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Add Custom Language</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">r
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language Code
                </label>
                <input
                  type="text"
                  value={customLanguage.code}
                  onChange={(e) => setCustomLanguage(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="e.g., fr, es, de"
                  className={cn(
                    "block w-full px-4 py-3 rounded-md text-base shadow-sm",
                    "bg-white dark:bg-gray-800",
                    "border border-gray-300 dark:border-gray-600",
                    "text-gray-900 dark:text-white",
                    "placeholder:text-gray-500 dark:placeholder:text-gray-400",
                    "transition-[border-color,box-shadow] duration-300 ease-out",
                    "focus:border-purple-500 dark:focus:border-purple-400",
                    "focus:shadow-[0_0_0_2px_rgba(168,85,247,0.2)] dark:focus:shadow-[0_0_0_2px_rgba(192,132,252,0.2)]",
                    "focus:outline-none"
                  )}
                  maxLength={5}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language Name (English)
                </label>
                <input
                  type="text"
                  value={customLanguage.name}
                  onChange={(e) => setCustomLanguage(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., French"
                  className={cn(
                    "block w-full px-4 py-3 rounded-md text-base shadow-sm",
                    "bg-white dark:bg-gray-800",
                    "border border-gray-300 dark:border-gray-600",
                    "text-gray-900 dark:text-white",
                    "placeholder:text-gray-500 dark:placeholder:text-gray-400",
                    "transition-[border-color,box-shadow] duration-300 ease-out",
                    "focus:border-purple-500 dark:focus:border-purple-400",
                    "focus:shadow-[0_0_0_2px_rgba(168,85,247,0.2)] dark:focus:shadow-[0_0_0_2px_rgba(192,132,252,0.2)]",
                    "focus:outline-none"
                  )}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Native Name (Optional)
                </label>
                <input
                  type="text"
                  value={customLanguage.nativeName}
                  onChange={(e) => setCustomLanguage(prev => ({ ...prev, nativeName: e.target.value }))}
                  placeholder="e.g., Français"
                  className={cn(
                    "block w-full px-4 py-3 rounded-md text-base shadow-sm",
                    "bg-white dark:bg-gray-800",
                    "border border-gray-300 dark:border-gray-600",
                    "text-gray-900 dark:text-white",
                    "placeholder:text-gray-500 dark:placeholder:text-gray-400",
                    "transition-[border-color,box-shadow] duration-300 ease-out",
                    "focus:border-purple-500 dark:focus:border-purple-400",
                    "focus:shadow-[0_0_0_2px_rgba(168,85,247,0.2)] dark:focus:shadow-[0_0_0_2px_rgba(192,132,252,0.2)]",
                    "focus:outline-none"
                  )}
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCustomLanguage}
                  disabled={!customLanguage.code || !customLanguage.name}
                  className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Language
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};