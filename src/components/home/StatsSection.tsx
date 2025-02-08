/*
* File: StatsSection.tsx
* Description: Statistics section component for displaying key metrics
* Details: Provides a visually appealing display of statistics
* - Supports dark mode
* - Features beautiful gradients and animations
* - Includes hover effects and transitions
* - Uses backdrop blur for depth
* Date: 2024-03-20
*/

import React from 'react';
import { useTranslation, Language } from '../../i18n';
import { cn } from '../../lib/utils';

interface StatsSectionProps {
  lang: Language;
}

interface Stat {
  value: string;
  label: string;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ lang }) => {
  const t = useTranslation(lang);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-accent-600 
                    dark:from-primary-900 dark:via-primary-800 dark:to-accent-800" />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />
      
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-48 w-96 h-96 
                      bg-gradient-to-br from-white/10 to-transparent 
                      rounded-full blur-3xl animate-pulse" />
        <div className="absolute -right-48 -bottom-48 w-96 h-96 
                      bg-gradient-to-br from-white/10 to-transparent 
                      rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {t.home.stats.items.map((stat: Stat, index: number) => (
            <div 
              key={index} 
              className={cn(
                // Base styles
                "backdrop-blur-sm rounded-lg p-6",
                "transform transition-all duration-300",
                "hover:scale-105",
                
                // Background and border
                "bg-white/10",
                "border border-white/20",
                
                // Shadow effects
                "shadow-xl shadow-black/5",
                
                // Animation
                "animate-fade-up",
                `motion-safe:animate-[fade-up_${0.3 + index * 0.1}s_ease-out]`
              )}
            >
              <div className={cn(
                "text-4xl font-bold mb-2",
                "bg-gradient-to-r from-white to-white/90",
                "bg-clip-text text-transparent"
              )}>
                {stat.value}
              </div>
              <div className="text-white/90 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};