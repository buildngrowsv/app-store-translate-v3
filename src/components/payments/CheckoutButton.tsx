import React, { useState } from 'react';
import { Button } from '../Button';
import { StripeService } from '../../services/stripe';
import { useAnalytics } from '../../hooks/useAnalytics';
import { STRIPE_PLANS } from '../../config/stripe';

interface CheckoutButtonProps {
  priceId: string;
  planName: string;
  className?: string;
  variant?: 'primary' | 'secondary';
}

export const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  priceId,
  planName,
  className,
  variant = 'primary'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { trackSubscription } = useAnalytics();

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      
      // Track subscription attempt
      const plan = Object.values(STRIPE_PLANS).find(p => p.id === priceId);
      if (plan) {
        trackSubscription(planName, typeof plan.price === 'number' ? plan.price : 0);
      }

      await StripeService.redirectToCheckout(priceId);
    } catch (error) {
      console.error('Error during checkout:', error);
      // Here you might want to show an error toast or message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading}
      className={className}
      variant={variant}
    >
      {isLoading ? 'Processing...' : `Subscribe to ${planName}`}
    </Button>
  );
}; 