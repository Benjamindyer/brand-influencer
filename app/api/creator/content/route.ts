import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api-client'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createApiClient()
        
        const {
            data: { user },
        } = await supabase.auth.getUser()
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        
        const { data: profile } = await supabase
            .from('creator_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()
        
        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
        }
        
        const { data, error } = await supabase
            .from('featured_content')
            .select('*')
            .eq('creator_id', profile.id)
            .order('created_at', { ascending: false })
        
        if (error) throw error
        
        return NextResponse.json(data || [])
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}

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
        const { thumbnail_url, post_url, platform, likes, views } = body
        
        const { data: profile } = await supabase
            .from('creator_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()
        
        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
        }
        
        const { data, error } = await supabase
            .from('featured_content')
            .insert({
                creator_id: profile.id,
                thumbnail_url,
                post_url,
                platform,
                likes: likes || null,
                views: views || null,
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
        const supabase = await createApiClient()
        
        const {
            data: { user },
        } = await supabase.auth.getUser()
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        
        const body = await request.json()
        const { id, ...updates } = body
        
        const { data: profile } = await supabase
            .from('creator_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()
        
        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
        }
        
        const { data: content } = await supabase
            .from('featured_content')
            .select('creator_id')
            .eq('id', id)
            .single()
        
        if (!content || content.creator_id !== profile.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }
        
        const { data, error } = await supabase
            .from('featured_content')
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
        const supabase = await createApiClient()
        
        const {
            data: { user },
        } = await supabase.auth.getUser()
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        
        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 })
        }
        
        const { data: profile } = await supabase
            .from('creator_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()
        
        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
        }
        
        const { data: content } = await supabase
            .from('featured_content')
            .select('creator_id')
            .eq('id', id)
            .single()
        
        if (!content || content.creator_id !== profile.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }
        
        const { error } = await supabase
            .from('featured_content')
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

