import React from 'react';
import { Sparkles, Target, Globe2 } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import { useTranslation, Language } from '../../i18n';

interface FeatureSectionProps {
  lang?: Language;
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({ lang = 'english' }) => {
  const t = useTranslation(lang);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Sparkles className="w-8 h-8 text-blue-600" />}
            title={t.home.features.aiTitle}
            description={t.home.features.aiDesc}
          />
          <FeatureCard
            icon={<Target className="w-8 h-8 text-blue-600" />}
            title={t.home.features.asoTitle}
            description={t.home.features.asoDesc}
          />
          <FeatureCard
            icon={<Globe2 className="w-8 h-8 text-blue-600" />}
            title={t.home.features.globalTitle}
            description={t.home.features.globalDesc}
          />
        </div>
      </div>
    </section>
  );
};