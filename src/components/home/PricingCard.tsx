/*
* File: PricingCard.tsx
* Description: Pricing card component for displaying subscription plans
* Details: Provides an elegant card layout for pricing information
* - Supports dark mode with proper text contrast
* - Features beautiful gradients and animations
* - Includes hover effects and transitions
* - Adapts colors based on highlight state
* Date: 2024-03-20
*/

import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../Button';
import { cn } from '../../lib/utils';
import { CheckoutButton } from '../payments/CheckoutButton';

interface PricingCardProps {
  title: string;
  price: string | number;
  originalPrice?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  priceId?: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  originalPrice,
  description,
  features,
  highlighted,
  priceId
}) => (
  <div
    className={cn(
      // Base styles
      'p-8 rounded-xl transition-all duration-500',
      'transform hover:-translate-y-2 hover:shadow-2xl relative h-full',
      'animate-fade-in motion-safe:animate-[fade-in_1s_ease-out]',
      
      // Light mode styles
      highlighted
        ? 'bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 text-white'
        : 'bg-white dark:bg-gray-800',
      
      // Border and shadow styles
      highlighted
        ? 'ring-4 ring-indigo-200/50 shadow-xl dark:ring-indigo-900/50'
        : 'border-2 border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 shadow-lg'
    )}
  >
    {highlighted && (
      <div className="absolute -right-2 top-6 bg-gradient-to-r from-amber-500 to-orange-500 
                    text-white px-4 py-1.5 rounded-l-full text-sm font-semibold shadow-lg 
                    animate-slide-in dark:from-amber-600 dark:to-orange-600">
        Most Popular
        <div className="absolute -right-2 -bottom-2 w-2 h-2 bg-orange-700 dark:bg-orange-800" 
             style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }} />
      </div>
    )}
    <div className="flex flex-col h-full">
      <div>
        <h3 className={cn(
          "text-2xl font-bold mb-2 flex items-center gap-2",
          highlighted ? "text-white" : "text-gray-900 dark:text-white"
        )}>
          {title}
          {highlighted && (
            <Sparkles className="w-5 h-5 text-amber-300 dark:text-amber-400 animate-pulse" />
          )}
        </h3>
        <div className="mb-2">
          <div className="flex items-baseline gap-2">
            <span className={cn(
              "text-4xl font-bold animate-fade-up motion-safe:animate-[fade-up_0.5s_ease-out]",
              highlighted ? "text-white" : "text-gray-900 dark:text-white"
            )}>
              {typeof price === 'number' ? `$${price}` : price}
            </span>
            {typeof price === 'number' && (
              <span className={cn(
                "text-sm self-start mt-2 opacity-80",
                highlighted ? "text-white" : "text-gray-600 dark:text-gray-300"
              )}>/month</span>
            )}
          </div>
          {originalPrice && (
            <div className="mt-1 animate-fade-up motion-safe:animate-[fade-up_0.7s_ease-out]">
              <span className={cn(
                "text-lg decoration-2 line-through",
                highlighted ? "text-white/70" : "text-gray-500 dark:text-gray-400"
              )}>
                {originalPrice}
              </span>
              <span className={cn(
                "ml-2 text-sm font-medium rounded-full px-2 py-0.5 inline-flex items-center",
                highlighted 
                  ? "bg-white/20 text-white" 
                  : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
              )}>
                Save ${parseInt(originalPrice.replace('$', '')) - parseInt(price.toString().replace('$', ''))}
              </span>
            </div>
          )}
        </div>
        <p className={cn(
          "mb-8 transition-colors duration-300",
          highlighted 
            ? "text-white/90" 
            : "text-gray-600 dark:text-gray-300"
        )}>
          {description}
        </p>
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li 
              key={index} 
              className={cn(
                "flex items-center transition-all duration-300 hover:translate-x-1",
                "animate-fade-up",
                `motion-safe:animate-[fade-up_${0.3 + index * 0.1}s_ease-out]`
              )}
            >
              <Star className={cn(
                "w-5 h-5 mr-3 flex-shrink-0 transition-colors duration-300",
                highlighted 
                  ? "text-amber-300 dark:text-amber-400" 
                  : "text-primary-500 dark:text-primary-400"
              )} />
              <span className={cn(
                highlighted 
                  ? "text-white/90" 
                  : "text-gray-600 dark:text-gray-300"
              )}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-auto">
        {price === 'Contact Us' ? (
          <Link to="/contact" className="block">
            <Button
              variant={highlighted ? 'secondary' : 'gradient'}
              size="lg"
              className={cn(
                "w-full font-semibold group transition-all duration-300",
                highlighted ? "bg-white dark:bg-gray-900 hover:bg-white/90 dark:hover:bg-gray-900/90 text-indigo-600 dark:text-indigo-400 border-0" : "",
                "animate-fade-up motion-safe:animate-[fade-up_1s_ease-out]"
              )}
            >
              Contact Sales
              <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        ) : (
          <CheckoutButton
            priceId={priceId || ''}
            planName={title}
            variant={highlighted ? 'secondary' : 'gradient'}
            className={cn(
              "w-full h-14 text-base font-semibold group transition-all duration-300",
              highlighted ? "bg-white dark:bg-gray-900 hover:bg-white/90 dark:hover:bg-gray-900/90 text-indigo-600 dark:text-indigo-400 border-0" : "",
              "animate-fade-up motion-safe:animate-[fade-up_1s_ease-out]"
            )}
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </CheckoutButton>
        )}
      </div>
    </div>
  </div>
);