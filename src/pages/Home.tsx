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

interface HomeProps {
  lang: Language;
}

export const Home: React.FC<HomeProps> = ({ lang }) => {
  const t = useTranslation(lang);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {t.home.hero.title}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {t.home.hero.subtitle}
            </p>
            <div className="flex justify-center">
              <Link to="/signup">
                <Button size="lg">{t.home.hero.startTrial}</Button>
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