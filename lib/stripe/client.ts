import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

function getStripeClient() {
    if (stripeInstance) {
        return stripeInstance
    }

    const secretKey = process.env.STRIPE_SECRET_KEY
    
    if (!secretKey) {
        throw new Error('STRIPE_SECRET_KEY is not set')
    }

    stripeInstance = new Stripe(secretKey, {
        apiVersion: '2025-11-17.clover',
    })

    return stripeInstance
}

export const stripe = new Proxy({} as Stripe, {
    get(_target, prop) {
        return getStripeClient()[prop as keyof Stripe]
    },
})

