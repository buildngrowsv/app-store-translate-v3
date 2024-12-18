import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';
import { Button } from '../Button';
import { GeneratedContent, TranslatedContent } from '../../services/openai/types';

interface ResultsViewProps {
  type: 'enhance' | 'translate';
  data: GeneratedContent | { translations: (TranslatedContent & { language: string })[] };
  onSave: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ type, data, onSave }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState(
    type === 'translate' && 'translations' in data
      ? data.translations[0]?.language
      : ''
  );
  const [copyStatus, setCopyStatus] = useState<'title' | 'description' | null>(null);

  const content = type === 'enhance' && 'titles' in data
    ? {
        title: data.titles[currentIndex],
        description: data.descriptions[currentIndex],
      }
    : type === 'translate' && 'translations' in data
    ? data.translations.find((t) => t.language === selectedLanguage) || data.translations[0]
    : null;

  if (!content) return null;

  const handleCopy = async (text: string, field: 'title' | 'description') => {
    await navigator.clipboard.writeText(text);
    setCopyStatus(field);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {type === 'translate' && 'translations' in data && (
        <div className="space-y-1.5 mb-6">
          <label className="block text-sm font-medium text-gray-600">
            Language
          </label>
          <select
            className="block w-full h-11 px-4 rounded-md border border-gray-300 text-base shadow-sm
                       focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {data.translations.map((t) => (
              <option key={t.language} value={t.language}>
                {t.language}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-6">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-600 mb-1.5">
            Title
          </label>
          {type === 'enhance' && 'titles' in data && (
            <div className="absolute right-0 top-0 flex items-center space-x-2">
              <button
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-500">
                {currentIndex + 1} of {data.titles.length}
              </span>
              <button
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                onClick={() => setCurrentIndex((i) => Math.min(data.titles.length - 1, i + 1))}
                disabled={currentIndex === data.titles.length - 1}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
          <div className="relative">
            <input
              type="text"
              className="block w-full h-11 px-4 rounded-md border border-gray-300 text-base shadow-sm
                         focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
              value={content.title}
              readOnly
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600"
              onClick={() => handleCopy(content.title, 'title')}
            >
              {copyStatus === 'title' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">
            Description
          </label>
          <div className="relative">
            <textarea
              className="block w-full h-48 px-4 py-3 rounded-md border border-gray-300 text-base shadow-sm
                         focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
              value={content.description}
              readOnly
            />
            <button
              className="absolute right-2 top-2 p-2 text-gray-400 hover:text-gray-600"
              onClick={() => handleCopy(content.description, 'description')}
            >
              {copyStatus === 'description' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={onSave}>Save Changes</Button>
      </div>
    </div>
  );
};