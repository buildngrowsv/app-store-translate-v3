import React from 'react';
import { Users, Globe2, Sparkles } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">About ReachMix</h1>
        <p className="text-xl text-gray-600">
          We're on a mission to help app developers reach global audiences with compelling, optimized app store content.
        </p>
      </div>

      {/* Values Section */}
      <div className="grid md:grid-cols-3 gap-12 mb-16">
        <ValueCard
          icon={<Sparkles className="w-8 h-8 text-blue-600" />}
          title="Innovation"
          description="Leveraging cutting-edge AI to transform app store presence"
        />
        <ValueCard
          icon={<Globe2 className="w-8 h-8 text-blue-600" />}
          title="Global Reach"
          description="Breaking down language barriers for apps worldwide"
        />
        <ValueCard
          icon={<Users className="w-8 h-8 text-blue-600" />}
          title="Developer First"
          description="Built by developers, for developers"
        />
      </div>

      {/* Story Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Our Story</h2>
        <div className="prose prose-lg">
          <p>
            ReachMix was born from a simple observation: app developers spend countless hours perfecting their apps, but often struggle to effectively communicate their value across different markets and languages.
          </p>
          <p>
            We built ReachMix to solve this challenge, combining advanced AI technology with deep app store optimization expertise to help developers succeed globally.
          </p>
          <p>
            Today, we're proud to help developers of all sizes optimize their app store presence and reach users around the world.
          </p>
        </div>
      </div>
    </div>
  );
};

const ValueCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="text-center">
    <div className="inline-block p-3 bg-blue-50 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);