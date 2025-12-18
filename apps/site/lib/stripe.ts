import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})

export const STRIPE_PLANS = {
  standard: {
    name: 'Standard Plan',
    priceId: process.env.NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID!,
    amount: 4900, // $49 in cents
    features: [
      'Access to all 9 core modules',
      'Community Discord access',
      'Course certificates',
      'Lifetime access',
    ],
  },
  mastery: {
    name: 'Mastery Plan',
    priceId: process.env.NEXT_PUBLIC_STRIPE_MASTERY_PRICE_ID!,
    amount: 9900, // $99 in cents
    features: [
      'Everything in Standard',
      '1-on-1 mentorship sessions',
      'Advanced project reviews',
      'Priority support',
      'Job board access',
    ],
  },
  mastermind: {
    name: 'Mastermind Plan',
    priceId: process.env.NEXT_PUBLIC_STRIPE_MASTERMIND_PRICE_ID!,
    amount: 19900, // $199 in cents
    features: [
      'Everything in Mastery',
      'Private mastermind group',
      'Weekly live sessions',
      'Affiliate program access',
      'Lifetime updates',
    ],
  },
} as const

export type PlanType = keyof typeof STRIPE_PLANS