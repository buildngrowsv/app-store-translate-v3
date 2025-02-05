import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Button } from '../Button';
import { cn } from '../../lib/utils';
import { CheckoutButton } from '../payments/CheckoutButton';

interface PricingCardProps {
  title: string;
  price: string | number;
  description: string;
  features: string[];
  highlighted?: boolean;
  priceId?: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  highlighted,
  priceId
}) => (
  <div
    className={cn(
      'p-8 rounded-xl transition-all duration-300 transform hover:-translate-y-2',
      highlighted
        ? 'bg-gradient-to-br from-primary-600 to-accent-600 text-white ring-4 ring-primary-200'
        : 'bg-white border-2 border-gray-100'
    )}
  >
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <div className="mb-4">
      <span className="text-4xl font-bold">
        {typeof price === 'number' ? `$${price}` : price}
      </span>
      {typeof price === 'number' && <span className="text-sm">/month</span>}
    </div>
    <p className="mb-8 opacity-90">{description}</p>
    <ul className="space-y-4 mb-8">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <Star className="w-5 h-5 mr-3 flex-shrink-0" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    {price === 'Contact Us' ? (
      <Link to="/contact" className="block">
        <CheckoutButton
          priceId=""
          planName={title}
          variant={highlighted ? 'secondary' : 'primary'}
          className="w-full h-14 text-base font-semibold shadow-lg"
        />
      </Link>
    ) : (
      <CheckoutButton
        priceId={priceId || ''}
        planName={title}
        variant={highlighted ? 'secondary' : 'primary'}
        className="w-full h-14 text-base font-semibold shadow-lg"
      />
    )}
  </div>
);