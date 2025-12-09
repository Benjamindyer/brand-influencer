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
        const { data: profile, error: profileError } = await supabase
            .from('brand_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (profileError || !profile) {
            return NextResponse.json(
                { profile: null, briefs: [], applications: [], subscription: null },
                { status: 200 }
            )
        }

        // Get briefs
        const { data: briefs } = await supabase
            .from('briefs')
            .select('*')
            .eq('brand_id', profile.id)
            .order('created_at', { ascending: false })
            .limit(10)

        // Get pending applications for this brand's briefs
        const { data: applications } = await supabase
            .from('applications')
            .select(`
                *,
                brief:briefs!inner(brand_id, title)
            `)
            .eq('brief.brand_id', profile.id)
            .eq('status', 'pending')
            .limit(10)

        // Get subscription
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('brand_id', profile.id)
            .single()

        return NextResponse.json({
            profile,
            briefs: briefs || [],
            applications: applications || [],
            subscription,
        })
    } catch (error) {
        console.error('Dashboard fetch error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

