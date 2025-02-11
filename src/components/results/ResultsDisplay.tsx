/*
* File: src/components/results/ResultsDisplay.tsx
* Description: Project results display component
* Details: Displays project results with animations
* - Handles different project types (enhance/translate)
* - Shows loading and error states
* - Includes save and retry actions
* Date: 2024-03-20
*/

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Save, RefreshCw } from 'lucide-react';
import { Button } from '../Button';
import { ErrorMessage } from '../ErrorMessage';
import type { ProjectResults } from '../../types';

interface ResultsDisplayProps {
  results?: ProjectResults;
  onSave: () => void;
  onRetry: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  results,
  onSave,
  onRetry
}) => {
  if (!results) {
    return null;
  }

  if (results.status === 'error') {
    return (
      <div className="space-y-4">
        <ErrorMessage message={results.error || 'An error occurred'} />
        <Button onClick={onRetry} variant="secondary">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (results.status === 'completed' && results.data) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Enhanced Content */}
        {results.data.title && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Enhanced Content</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Title</h3>
                <p className="text-gray-900 dark:text-gray-100">{results.data.title}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Subtitle</h3>
                <p className="text-gray-900 dark:text-gray-100">{results.data.subtitle}</p>
              </div>
              {results.data.keywords && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Keywords</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {results.data.keywords.map((keyword: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Translations */}
        {results.data.translations && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Translations</h2>
            <div className="space-y-6">
              {results.data.translations.map((translation: any, index: number) => (
                <motion.div
                  key={translation.language}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6 last:pb-0"
                >
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    {translation.language}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Title</h4>
                      <p className="text-gray-900 dark:text-gray-100">{translation.title}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Subtitle</h4>
                      <p className="text-gray-900 dark:text-gray-100">{translation.subtitle}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button onClick={onRetry} variant="secondary">
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate Again
          </Button>
          <Button onClick={onSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Results
          </Button>
        </div>
      </motion.div>
    );
  }

  return null;
}; 