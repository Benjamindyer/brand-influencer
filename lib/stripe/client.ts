import Stripe from 'stripe'

function getStripeClient() {
    const secretKey = process.env.STRIPE_SECRET_KEY
    
    if (!secretKey) {
        throw new Error('STRIPE_SECRET_KEY is not set')
    }

    return new Stripe(secretKey, {
        apiVersion: '2025-11-17.clover',
    })
}

export const stripe = getStripeClient()

