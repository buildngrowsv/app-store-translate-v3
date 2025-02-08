/*
* File: FeatureCard.tsx
* Description: Feature card component for displaying product features
* Details: Provides an elegant card layout for feature information
* - Supports dark mode
* - Features beautiful gradients and animations
* - Includes hover effects and transitions
* - Uses gradient accents for icons
* Date: 2024-03-20
*/

import React from 'react';
import { cn } from '../../lib/utils';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className={cn(
    // Base styles
    "group p-8 rounded-xl transition-all duration-300",
    "transform hover:-translate-y-1",
    
    // Background and border
    "bg-white dark:bg-gray-800",
    "border border-gray-100 dark:border-gray-700",
    
    // Shadow effects
    "shadow-sm hover:shadow-xl",
    "dark:shadow-gray-900/30 dark:hover:shadow-gray-900/50",
    
    // Backdrop blur for depth
    "backdrop-blur-sm"
  )}>
    <div className={cn(
      // Icon container styles
      "mb-6 p-4 rounded-xl",
      "transform transition-transform duration-300 group-hover:scale-110",
      
      // Gradient background
      "bg-gradient-to-r from-purple-600 to-pink-600",
      "dark:from-purple-500 dark:to-pink-500",
      
      // Container layout
      "inline-flex items-center justify-center",
      
      // Glow effect
      "relative",
      "before:absolute before:inset-0 before:rounded-xl",
      "before:bg-gradient-to-r before:from-purple-600 before:to-pink-600",
      "before:opacity-0 before:blur-xl",
      "group-hover:before:opacity-50",
      "dark:before:from-purple-500 dark:before:to-pink-500"
    )}>
      {React.cloneElement(icon as React.ReactElement, {
        className: cn(
          "w-8 h-8 text-white relative z-10",
          "transition-transform duration-300 group-hover:scale-110"
        )
      })}
    </div>
    <h3 className={cn(
      "text-xl font-bold mb-3",
      "bg-gradient-to-r from-purple-600 to-pink-600",
      "dark:from-purple-400 dark:to-pink-400",
      "bg-clip-text text-transparent"
    )}>
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
      {description}
    </p>
  </div>
);