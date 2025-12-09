import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api-client'
import { stripe } from '@/lib/stripe/client'
import { subscriptionTiers } from '@/lib/stripe/products'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createApiClient()
        
        const {
            data: { user },
        } = await supabase.auth.getUser()
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        
        const body = await request.json()
        const { tier } = body
        
        if (!tier || !(tier in subscriptionTiers)) {
            return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
        }
        
        const tierConfig = subscriptionTiers[tier as keyof typeof subscriptionTiers]
        
        if (!tierConfig.priceId) {
            return NextResponse.json({ error: 'Price ID not configured for this tier' }, { status: 500 })
        }
        
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: tierConfig.priceId,
                    quantity: 1,
                },
            ],
            customer_email: user.email || undefined,
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/brand/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/brand/subscription/cancel`,
            metadata: {
                user_id: user.id,
                tier,
            },
        })
        
        return NextResponse.json({ url: session.url })
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}

