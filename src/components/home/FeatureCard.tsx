import React from 'react';
import { cn } from '../../lib/utils';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className={cn(
    "group p-8 bg-white rounded-xl shadow-sm border border-gray-100",
    "hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
  )}>
    <div className={cn(
      "mb-6 transform transition-transform duration-300 group-hover:scale-110",
      "p-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600",
      "inline-flex items-center justify-center"
    )}>
      {React.cloneElement(icon as React.ReactElement, {
        className: "w-8 h-8 text-white"
      })}
    </div>
    <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
      {title}
    </h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);