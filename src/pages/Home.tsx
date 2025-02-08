/*
* File: Home.tsx
* Description: Main home page component
* Details: Provides the landing page layout and content
* - Supports dark mode
* - Features beautiful gradients and animations
* - Includes all major sections (hero, features, stats, etc.)
* - Adapts to system theme
* Date: 2024-03-20
*/

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation, Language } from '../i18n';
import { Button } from '../components/Button';
import { FeatureSection } from '../components/home/FeatureSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { ComparisonSection } from '../components/home/ComparisonSection';
import { StatsSection } from '../components/home/StatsSection';
import { PricingSection } from '../components/home/PricingSection';
import { Footer } from '../components/home/Footer';
import { cn } from '../lib/utils';

interface HomeProps {
  lang: Language;
}

export const Home: React.FC<HomeProps> = ({ lang }) => {
  const t = useTranslation(lang);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 
                      dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30" />
        
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Animated glow orbs */}
          <div className="absolute -left-48 -top-48 w-96 h-96 
                        bg-gradient-to-br from-purple-500/10 to-pink-500/10 
                        dark:from-purple-500/5 dark:to-pink-500/5 
                        rounded-full blur-3xl animate-pulse" />
          <div className="absolute -right-48 -bottom-48 w-96 h-96 
                        bg-gradient-to-br from-blue-500/10 to-purple-500/10 
                        dark:from-blue-500/5 dark:to-purple-500/5 
                        rounded-full blur-3xl animate-pulse" />
          
          {/* Additional floating orbs */}
          <div className="absolute left-1/4 top-1/4 w-48 h-48 
                        bg-gradient-to-br from-purple-400/20 to-pink-400/20 
                        dark:from-purple-400/10 dark:to-pink-400/10 
                        rounded-full blur-2xl animate-float" />
          <div className="absolute right-1/4 bottom-1/4 w-48 h-48 
                        bg-gradient-to-br from-blue-400/20 to-indigo-400/20 
                        dark:from-blue-400/10 dark:to-indigo-400/10 
                        rounded-full blur-2xl animate-float-delayed" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Title with glow effect */}
            <div className="relative inline-block mb-6">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/0 via-pink-600/25 to-purple-600/0 
                           opacity-0 group-hover:opacity-100 transition-opacity duration-500 
                           animate-glow-slow blur-xl" />
              <h1 className={cn(
                "text-5xl md:text-6xl font-bold relative",
                "bg-gradient-to-r from-purple-600 to-pink-600",
                "dark:from-purple-400 dark:to-pink-400",
                "bg-clip-text text-transparent",
                "animate-fade-up motion-safe:animate-[fade-up_1s_ease-out]",
                "group"
              )}>
                {t.home.hero.title}
              </h1>
            </div>

            {/* Subtitle with subtle glow */}
            <p className={cn(
              "text-xl relative mb-8",
              "text-gray-600 dark:text-gray-300",
              "animate-fade-up motion-safe:animate-[fade-up_1.2s_ease-out]",
              "before:absolute before:inset-0 before:bg-gradient-to-r",
              "before:from-purple-400/0 before:via-pink-400/10 before:to-purple-400/0",
              "before:opacity-0 group-hover:before:opacity-100",
              "before:transition-opacity before:duration-500",
              "before:animate-glow-slow before:blur-xl"
            )}>
              {t.home.hero.subtitle}
            </p>

            {/* CTA Button with enhanced glow */}
            <div className={cn(
              "flex justify-center",
              "animate-fade-up motion-safe:animate-[fade-up_1.4s_ease-out]"
            )}>
              <Link to="/signup" className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 
                             rounded-xl opacity-70 group-hover:opacity-100 blur 
                             transition-all duration-500 group-hover:blur-md animate-pulse" />
                <Button 
                  size="lg" 
                  variant="gradient"
                  className="relative"
                >
                  {t.home.hero.startTrial}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection lang={lang} />

      {/* Features Section */}
      <FeatureSection lang={lang} />

      {/* Comparison Section */}
      <ComparisonSection lang={lang} />

      {/* Testimonials Section */}
      <TestimonialsSection lang={lang} />

      {/* Pricing Section */}
      <PricingSection lang={lang} />

      {/* Footer */}
      <Footer lang={lang} />
    </div>
  );
};