import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api-client'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createApiClient()

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Get brand profile
        const { data: brandProfile, error: profileError } = await supabase
            .from('brand_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()

        if (profileError || !brandProfile) {
            return NextResponse.json(
                { subscription: null, credits: 0, tier: null },
                { status: 200 }
            )
        }

        // Get subscription
        const { data: subscription, error: subError } = await supabase
            .from('subscriptions')
            .select('campaign_credits, tier, status')
            .eq('brand_id', brandProfile.id)
            .single()

        if (subError || !subscription) {
            return NextResponse.json(
                { subscription: null, credits: 0, tier: null },
                { status: 200 }
            )
        }

        return NextResponse.json({
            subscription,
            credits: subscription.campaign_credits || 0,
            tier: subscription.tier,
        })
    } catch (error) {
        console.error('Subscription fetch error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

