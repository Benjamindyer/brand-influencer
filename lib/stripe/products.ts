import { stripe } from './client'

export const subscriptionTiers = {
    tier1: {
        name: 'Tier 1',
        campaignsPerYear: 3,
        priceId: process.env.STRIPE_TIER1_PRICE_ID || '',
    },
    tier2: {
        name: 'Tier 2',
        campaignsPerYear: 6,
        priceId: process.env.STRIPE_TIER2_PRICE_ID || '',
    },
    tier3: {
        name: 'Tier 3',
        campaignsPerYear: 12,
        priceId: process.env.STRIPE_TIER3_PRICE_ID || '',
    },
} as const

export type SubscriptionTier = keyof typeof subscriptionTiers

export function getCampaignCreditsForTier(tier: SubscriptionTier): number {
    return subscriptionTiers[tier].campaignsPerYear
}

