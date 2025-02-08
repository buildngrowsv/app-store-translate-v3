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
import { AuroraBackground } from '../components/AuroraBackground';
import { cn } from '../lib/utils';
import { LanguageAnimation } from '../components/LanguageAnimation';

interface HomeProps {
  lang: Language;
}

export const Home: React.FC<HomeProps> = ({ lang }) => {
  const t = useTranslation(lang);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900" />
        
        {/* Aurora effect */}
        <AuroraBackground />
        
        {/* Content */}
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Main title with translation focus */}
            <div className="space-y-4">
              <h1 className={cn(
                "text-4xl md:text-5xl lg:text-6xl font-bold",
                "text-white dark:text-white",
                "leading-tight tracking-tight",
                "animate-fade-up motion-safe:animate-[fade-up_1s_ease-out]"
              )}>
                {t.home.hero.translateInto}
              </h1>
              
              {/* Language Animation */}
              <div className="animate-fade-up motion-safe:animate-[fade-up_1.2s_ease-out]">
                <LanguageAnimation lang={lang} />
              </div>
            </div>

            {/* ASO and Translation Benefits */}
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className={cn(
                "p-4 rounded-xl",
                "bg-white/5 backdrop-blur-sm",
                "border border-white/10",
                "animate-fade-up motion-safe:animate-[fade-up_1.4s_ease-out]"
              )}>
                <h3 className="text-xl font-semibold text-purple-400 mb-2">
                  {t.home.hero.aiTranslation}
                </h3>
                <p className="text-gray-300/90">
                  {t.home.hero.aiTranslationDesc}
                </p>
              </div>
              
              <div className={cn(
                "p-4 rounded-xl",
                "bg-white/5 backdrop-blur-sm",
                "border border-white/10",
                "animate-fade-up motion-safe:animate-[fade-up_1.6s_ease-out]"
              )}>
                <h3 className="text-xl font-semibold text-pink-400 mb-2">
                  {t.home.hero.asoOptimization}
                </h3>
                <p className="text-gray-300/90">
                  {t.home.hero.asoOptimizationDesc}
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className={cn(
              "flex justify-center pt-8",
              "animate-fade-up motion-safe:animate-[fade-up_1.8s_ease-out]"
            )}>
              <Link to="/signup" className="relative group">
                <div className="absolute -inset-1 rounded-xl opacity-70 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-lg transform scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-pink-600/50 rounded-xl blur-xl transform scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/25 to-pink-600/25 rounded-xl blur-2xl transform scale-125" />
                </div>
                <Button 
                  size="lg" 
                  variant="gradient"
                  className="relative transform transition-transform duration-500 group-hover:scale-[1.02] font-semibold"
                >
                  {t.home.hero.startTranslating}
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