import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTranslation, Language } from '../../i18n';

interface ComparisonSectionProps {
  lang: Language;
}

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({ lang }) => {
  const t = useTranslation(lang);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 -z-10" />
      <div className="absolute -right-48 -top-48 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
      <div className="absolute -left-48 -bottom-48 w-96 h-96 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t.home.comparison.title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto relative">
          {/* Before Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-50 rounded-xl transform transition-transform group-hover:scale-105" />
            <div className="relative p-8 backdrop-blur-sm">
              <div className="flex items-center mb-6">
                <h3 className="text-xl font-semibold text-red-600">
                  {t.home.comparison.before.title}
                </h3>
              </div>
              <div className="bg-white/80 p-6 rounded-lg shadow-sm border border-red-100">
                <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                  {t.home.comparison.before.content}
                </p>
              </div>
            </div>
          </div>

          {/* After Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl transform transition-transform group-hover:scale-105" />
            <div className="relative p-8 backdrop-blur-sm">
              <div className="flex items-center mb-6">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {t.home.comparison.after.title}
                </h3>
                <Sparkles className="w-5 h-5 ml-2 text-pink-500" />
              </div>
              <div className="bg-white/80 p-6 rounded-lg shadow-sm border border-purple-100">
                <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                  {t.home.comparison.after.content}
                </p>
              </div>
            </div>
          </div>

          {/* Arrow Decoration - Centered between cards */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="p-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">
              <ArrowRight className="w-8 h-8 text-white transform rotate-0" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};