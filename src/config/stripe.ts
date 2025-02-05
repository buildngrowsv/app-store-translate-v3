export const STRIPE_PLANS = {
  STARTER: {
    name: 'Starter',
    id: import.meta.env.VITE_STRIPE_STARTER_PRICE_ID,
    price: 29,
    features: [
      'Up to 10 languages',
      'Basic ASO optimization',
      'Standard support',
      'Monthly updates'
    ]
  },
  PRO: {
    name: 'Pro',
    id: import.meta.env.VITE_STRIPE_PRO_PRICE_ID,
    price: 79,
    features: [
      'Up to 25 languages',
      'Advanced ASO optimization',
      'Priority support',
      'Weekly updates',
      'Custom keywords'
    ]
  },
  ENTERPRISE: {
    name: 'Enterprise',
    id: import.meta.env.VITE_STRIPE_ENTERPRISE_PRICE_ID,
    price: 'Custom',
    features: [
      'Unlimited languages',
      'Premium ASO optimization',
      'Dedicated support',
      'Daily updates',
      'Custom integration',
      'API access'
    ]
  }
}; 