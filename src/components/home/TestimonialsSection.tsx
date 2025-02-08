/*
* File: TestimonialsSection.tsx
* Description: Testimonials section component for displaying user reviews
* Details: Provides a beautiful grid of testimonial cards
* - Supports dark mode
* - Features beautiful gradients and animations
* - Includes hover effects and transitions
* - Uses elegant blur effects
* Date: 2024-03-20
*/

import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useTranslation, Language } from '../../i18n';
import { cn } from '../../lib/utils';

interface TestimonialsSectionProps {
  lang: Language;
}

interface Testimonial {
  content: string;
  author: string;
  role: string;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ lang }) => {
  const t = useTranslation(lang);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 
                    dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30" />
      
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
          "text-3xl font-bold text-center mb-12",
          "bg-gradient-to-r from-purple-600 to-pink-600",
          "dark:from-purple-400 dark:to-pink-400",
          "bg-clip-text text-transparent"
        )}>
          {t.home.testimonials.title}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {t.home.testimonials.items.map((testimonial: Testimonial, index: number) => (
            <div 
              key={index} 
              className={cn(
                // Base styles
                "relative group",
                "backdrop-blur-sm rounded-xl",
                "transform transition-all duration-300",
                "hover:-translate-y-1 hover:shadow-xl",
                
                // Background and border
                "bg-white/80 dark:bg-gray-800/80",
                "border border-gray-100 dark:border-gray-700",
                "hover:border-purple-200 dark:hover:border-purple-700",
                
                // Animation
                "animate-fade-up",
                `motion-safe:animate-[fade-up_${0.3 + index * 0.1}s_ease-out]`,
                
                // Shadow
                "shadow-sm",
                "dark:shadow-gray-900/30"
              )}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={cn(
                        "w-4 h-4 fill-current",
                        "text-yellow-400 dark:text-yellow-500"
                      )} 
                    />
                  ))}
                </div>
                <Quote className={cn(
                  "w-8 h-8 mb-4",
                  "text-purple-600 dark:text-purple-400"
                )} />
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {testimonial.content}
                </p>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};