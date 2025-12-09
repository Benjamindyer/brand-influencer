import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api-client'
import { supabase } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
    try {
        const supabaseClient = await createApiClient()
        
        const {
            data: { user },
        } = await supabaseClient.auth.getUser()
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        
        // Get creator profile
        const { data: profile } = await supabaseClient
            .from('creator_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()
        
        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
        }
        
        // Get social accounts
        const { data: accounts, error } = await supabaseClient
            .from('social_accounts')
            .select('*')
            .eq('creator_id', profile.id)
            .order('created_at', { ascending: false })
        
        if (error) throw error
        
        return NextResponse.json(accounts || [])
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabaseClient = await createApiClient()
        
        const {
            data: { user },
        } = await supabaseClient.auth.getUser()
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        
        const body = await request.json()
        const { platform, url, follower_count, engagement_rate, average_reach } = body
        
        // Get creator profile
        const { data: profile } = await supabaseClient
            .from('creator_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()
        
        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
        }
        
        const { data, error } = await supabaseClient
            .from('social_accounts')
            .insert({
                creator_id: profile.id,
                platform,
                url,
                follower_count: follower_count || 0,
                engagement_rate: engagement_rate || 0,
                average_reach: average_reach || 0,
            })
            .select()
            .single()
        
        if (error) throw error
        
        return NextResponse.json(data, { status: 201 })
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const supabaseClient = await createApiClient()
        
        const {
            data: { user },
        } = await supabaseClient.auth.getUser()
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        
        const body = await request.json()
        const { id, ...updates } = body
        
        // Verify ownership
        const { data: profile } = await supabaseClient
            .from('creator_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()
        
        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
        }
        
        const { data: account } = await supabaseClient
            .from('social_accounts')
            .select('creator_id')
            .eq('id', id)
            .single()
        
        if (!account || account.creator_id !== profile.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }
        
        const { data, error } = await supabaseClient
            .from('social_accounts')
            .update(updates)
            .eq('id', id)
            .select()
            .single()
        
        if (error) throw error
        
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const supabaseClient = await createApiClient()
        
        const {
            data: { user },
        } = await supabaseClient.auth.getUser()
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        
        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 })
        }
        
        // Verify ownership
        const { data: profile } = await supabaseClient
            .from('creator_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()
        
        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
        }
        
        const { data: account } = await supabaseClient
            .from('social_accounts')
            .select('creator_id')
            .eq('id', id)
            .single()
        
        if (!account || account.creator_id !== profile.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }
        
        const { error } = await supabaseClient
            .from('social_accounts')
            .delete()
            .eq('id', id)
        
        if (error) throw error
        
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}

