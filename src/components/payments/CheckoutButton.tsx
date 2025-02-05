import React, { useState } from 'react';
import { Button } from '../Button';
import { StripeService } from '../../services/stripe';

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

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
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