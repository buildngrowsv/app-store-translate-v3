import React from 'react';
import { useTranslation, Language } from '../../i18n';

interface StatsSectionProps {
  lang: Language;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ lang }) => {
  const t = useTranslation(lang);

  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-500 to-accent-600 
                      text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
      <div className="container mx-auto px-4 relative">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {t.home.stats.items.map((stat, index) => (
            <div 
              key={index} 
              className="backdrop-blur-sm bg-white/10 rounded-lg p-6 transform hover:scale-105 transition-transform duration-200"
            >
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-white/90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};