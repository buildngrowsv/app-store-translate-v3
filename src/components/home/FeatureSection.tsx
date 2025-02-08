/*
* File: FeatureSection.tsx
* Description: Feature section component for displaying product features
* Details: Provides a beautiful grid of feature cards
* - Supports dark mode
* - Features beautiful gradients and animations
* - Includes hover effects and transitions
* - Uses elegant blur effects
* Date: 2024-03-20
*/

import React from 'react';
import { Sparkles, Target, Globe2 } from 'lucide-react';
import { useTranslation, Language } from '../../i18n';
import { FeatureCard } from './FeatureCard';
import { cn } from '../../lib/utils';

interface FeatureSectionProps {
  lang?: Language;
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({ lang = 'english' }) => {
  const t = useTranslation(lang);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 
                    dark:from-gray-900 dark:via-gray-900 dark:to-gray-800" />
      
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-48 -top-48 w-96 h-96 
                      bg-gradient-to-br from-purple-500/10 to-pink-500/10 
                      dark:from-purple-400/5 dark:to-pink-400/5 
                      rounded-full blur-3xl animate-pulse" />
        <div className="absolute -right-48 -bottom-48 w-96 h-96 
                      bg-gradient-to-br from-blue-500/10 to-purple-500/10 
                      dark:from-blue-400/5 dark:to-purple-400/5 
                      rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="animate-fade-up motion-safe:animate-[fade-up_1s_ease-out]">
            <FeatureCard
              icon={<Sparkles className={cn(
                "w-8 h-8",
                "text-gradient from-purple-600 to-pink-600",
                "dark:from-purple-400 dark:to-pink-400"
              )} />}
              title={t.home.features.aiTitle}
              description={t.home.features.aiDesc}
            />
          </div>
          
          <div className="animate-fade-up motion-safe:animate-[fade-up_1.2s_ease-out]">
            <FeatureCard
              icon={<Target className={cn(
                "w-8 h-8",
                "text-gradient from-blue-600 to-indigo-600",
                "dark:from-blue-400 dark:to-indigo-400"
              )} />}
              title={t.home.features.asoTitle}
              description={t.home.features.asoDesc}
            />
          </div>
          
          <div className="animate-fade-up motion-safe:animate-[fade-up_1.4s_ease-out]">
            <FeatureCard
              icon={<Globe2 className={cn(
                "w-8 h-8",
                "text-gradient from-indigo-600 to-purple-600",
                "dark:from-indigo-400 dark:to-purple-400"
              )} />}
              title={t.home.features.globalTitle}
              description={t.home.features.globalDesc}
            />
          </div>
        </div>
      </div>
    </section>
  );
};