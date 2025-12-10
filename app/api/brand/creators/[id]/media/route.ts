import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api-client'
import { supabaseAdmin } from '@/lib/supabase/server'

// GET - fetch creator's public portfolio media
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: creatorId } = await params
        const supabase = createApiClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Verify user is a brand
        const { data: userProfile } = await supabaseAdmin
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (!userProfile || userProfile.role !== 'brand') {
            return NextResponse.json(
                { error: 'Only brands can view creator portfolios' },
                { status: 403 }
            )
        }

        // Get type filter if provided
        const url = new URL(request.url)
        const type = url.searchParams.get('type')

        let query = supabaseAdmin
            .from('portfolio_media')
            .select('*')
            .eq('creator_id', creatorId)
            .order('sort_order', { ascending: true })
            .order('created_at', { ascending: false })

        if (type) {
            query = query.eq('type', type)
        }

        const { data: media, error } = await query

        if (error) {
            console.error('Error fetching creator media:', error)
            return NextResponse.json(
                { error: 'Failed to fetch media' },
                { status: 500 }
            )
        }

        return NextResponse.json(media || [], {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
            }
        })
    } catch (error) {
        console.error('Creator media GET error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

