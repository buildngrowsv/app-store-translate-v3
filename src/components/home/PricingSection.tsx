/*
* File: PricingSection.tsx
* Description: Pricing section component for displaying subscription plans
* Details: Provides a beautiful grid of pricing cards
* - Supports dark mode
* - Features beautiful gradients and animations
* - Includes hover effects and transitions
* - Uses elegant blur effects
* Date: 2024-03-20
*/

import React from 'react';
import { PricingCard } from './PricingCard';
import { useTranslation, Language } from '../../i18n';
import { STRIPE_PLANS } from '../../config/stripe';
import { cn } from '../../lib/utils';

interface PricingSectionProps {
  lang?: Language;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ lang = 'english' }) => {
  const t = useTranslation(lang);

  return (
    <section id="pricing" className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 
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
        <h2 className={cn(
          "text-3xl font-bold text-center mb-4",
          "bg-gradient-to-r from-purple-600 to-pink-600",
          "dark:from-purple-400 dark:to-pink-400",
          "bg-clip-text text-transparent",
          "animate-fade-up motion-safe:animate-[fade-up_1s_ease-out]"
        )}>
          {t.home.pricing.title}
        </h2>
        
        <div className="w-24 h-1 mx-auto mb-12 rounded-full 
                     bg-gradient-to-r from-purple-500 to-pink-500 
                     dark:from-purple-400 dark:to-pink-400
                     animate-fade-up motion-safe:animate-[fade-up_1.2s_ease-out]" />

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="animate-fade-up motion-safe:animate-[fade-up_1.3s_ease-out]">
            <PricingCard
              title={t.home.pricing.starter.title}
              price={t.home.pricing.starter.price}
              description={t.home.pricing.starter.description}
              features={t.home.pricing.starter.features}
              priceId={STRIPE_PLANS.STARTER.id}
            />
          </div>
          
          <div className="animate-fade-up motion-safe:animate-[fade-up_1.4s_ease-out]">
            <PricingCard
              title={t.home.pricing.growth.title}
              price={t.home.pricing.growth.price}
              description={t.home.pricing.growth.description}
              features={t.home.pricing.growth.features}
              highlighted
              priceId={STRIPE_PLANS.PRO.id}
            />
          </div>
          
          <div className="animate-fade-up motion-safe:animate-[fade-up_1.5s_ease-out]">
            <PricingCard
              title={t.home.pricing.enterprise.title}
              price={t.home.pricing.enterprise.price}
              description={t.home.pricing.enterprise.description}
              features={t.home.pricing.enterprise.features}
            />
          </div>
        </div>
      </div>
    </section>
  );
};