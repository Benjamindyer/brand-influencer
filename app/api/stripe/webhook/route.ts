import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe/client'
import { supabaseAdmin } from '@/lib/supabase/server'
import { getCampaignCreditsForTier } from '@/lib/stripe/products'

export async function POST(request: NextRequest) {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')
    
    if (!signature) {
        return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }
    
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    
    if (!webhookSecret) {
        return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }
    
    let event
    
    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
        return NextResponse.json(
            { error: `Webhook signature verification failed: ${err instanceof Error ? err.message : 'Unknown error'}` },
            { status: 400 }
        )
    }
    
    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as any
                const subscriptionId = session.subscription as string
                
                if (!subscriptionId) break
                
                const subscriptionData: Stripe.Subscription = await stripe.subscriptions.retrieve(subscriptionId)
                const priceId = subscriptionData.items.data[0]?.price.id
                
                // Get brand profile by customer email or metadata
                const customerEmail = session.customer_email
                if (!customerEmail) break
                
                const { data: users } = await supabaseAdmin.auth.admin.listUsers()
                const user = users.users.find((u) => u.email === customerEmail)
                if (!user) break
                
                const { data: brandProfile } = await supabaseAdmin
                    .from('brand_profiles')
                    .select('id')
                    .eq('user_id', user.id)
                    .single()
                
                if (!brandProfile) break
                
                // Determine tier from price ID
                let tier: 'tier1' | 'tier2' | 'tier3' = 'tier1'
                if (priceId === process.env.STRIPE_TIER2_PRICE_ID) tier = 'tier2'
                else if (priceId === process.env.STRIPE_TIER3_PRICE_ID) tier = 'tier3'
                
                const credits = getCampaignCreditsForTier(tier)
                
                // Create or update subscription
                await supabaseAdmin
                    .from('subscriptions')
                    .upsert({
                        brand_id: brandProfile.id,
                        tier,
                        stripe_subscription_id: subscriptionId,
                        status: subscriptionData.status,
                        current_period_end: new Date((subscriptionData as any).current_period_end * 1000).toISOString(),
                        campaign_credits: credits,
                    })
                
                break
            }
            
            case 'customer.subscription.updated': {
                const subscription = event.data.object as any
                
                const { data: existing } = await supabaseAdmin
                    .from('subscriptions')
                    .select('brand_id')
                    .eq('stripe_subscription_id', subscription.id)
                    .single()
                
                if (!existing) break
                
                const priceId = subscription.items.data[0]?.price.id
                let tier: 'tier1' | 'tier2' | 'tier3' = 'tier1'
                if (priceId === process.env.STRIPE_TIER2_PRICE_ID) tier = 'tier2'
                else if (priceId === process.env.STRIPE_TIER3_PRICE_ID) tier = 'tier3'
                
                const credits = getCampaignCreditsForTier(tier)
                
                await supabaseAdmin
                    .from('subscriptions')
                    .update({
                        tier,
                        status: subscription.status,
                        current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
                        campaign_credits: credits,
                    })
                    .eq('stripe_subscription_id', subscription.id)
                
                break
            }
            
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as any
                
                await supabaseAdmin
                    .from('subscriptions')
                    .update({
                        status: 'cancelled',
                    })
                    .eq('stripe_subscription_id', subscription.id)
                
                break
            }
        }
        
        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('Webhook error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Webhook handler failed' },
            { status: 500 }
        )
    }
}

