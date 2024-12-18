import React from 'react';
import { PricingCard } from './PricingCard';
import { useTranslation, Language } from '../../i18n';

interface PricingSectionProps {
  lang?: Language;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ lang = 'english' }) => {
  const t = useTranslation(lang);

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{t.home.pricing.title}</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard
            title={t.home.pricing.starter.title}
            price={t.home.pricing.starter.price}
            description={t.home.pricing.starter.description}
            features={t.home.pricing.starter.features}
          />
          <PricingCard
            title={t.home.pricing.growth.title}
            price={t.home.pricing.growth.price}
            description={t.home.pricing.growth.description}
            features={t.home.pricing.growth.features}
            highlighted
          />
          <PricingCard
            title={t.home.pricing.enterprise.title}
            price={t.home.pricing.enterprise.price}
            description={t.home.pricing.enterprise.description}
            features={t.home.pricing.enterprise.features}
          />
        </div>
      </div>
    </section>
  );
};