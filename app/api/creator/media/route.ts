import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api-client'
import { supabaseAdmin } from '@/lib/supabase/server'

// GET - fetch creator's portfolio media
export async function GET(request: NextRequest) {
    try {
        const supabase = createApiClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Get creator profile
        const { data: profile } = await supabaseAdmin
            .from('creator_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()

        if (!profile) {
            return NextResponse.json(
                { error: 'Creator profile not found' },
                { status: 404 }
            )
        }

        // Get type filter if provided
        const url = new URL(request.url)
        const type = url.searchParams.get('type')

        let query = supabaseAdmin
            .from('portfolio_media')
            .select('*')
            .eq('creator_id', profile.id)
            .order('sort_order', { ascending: true })
            .order('created_at', { ascending: false })

        if (type) {
            query = query.eq('type', type)
        }

        const { data: media, error } = await query

        if (error) {
            console.error('Error fetching media:', error)
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
        console.error('Media GET error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// POST - create new media entry after upload
export async function POST(request: NextRequest) {
    try {
        const supabase = createApiClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Get creator profile
        const { data: profile } = await supabaseAdmin
            .from('creator_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()

        if (!profile) {
            return NextResponse.json(
                { error: 'Creator profile not found' },
                { status: 404 }
            )
        }

        const body = await request.json()
        const { type, media_type, url, thumbnail_url, title, description, file_size, duration } = body

        // Validate required fields
        if (!type || !media_type || !url) {
            return NextResponse.json(
                { error: 'Missing required fields: type, media_type, url' },
                { status: 400 }
            )
        }

        // Get current max sort_order
        const { data: existingMedia } = await supabaseAdmin
            .from('portfolio_media')
            .select('sort_order')
            .eq('creator_id', profile.id)
            .eq('type', type)
            .order('sort_order', { ascending: false })
            .limit(1)

        const nextSortOrder = existingMedia && existingMedia.length > 0 
            ? (existingMedia[0].sort_order || 0) + 1 
            : 0

        const { data: media, error } = await supabaseAdmin
            .from('portfolio_media')
            .insert({
                creator_id: profile.id,
                type,
                media_type,
                url,
                thumbnail_url,
                title,
                description,
                file_size,
                duration,
                sort_order: nextSortOrder
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating media:', error)
            return NextResponse.json(
                { error: 'Failed to create media entry' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true, media }, {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
            }
        })
    } catch (error) {
        console.error('Media POST error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// DELETE - remove media
export async function DELETE(request: NextRequest) {
    try {
        const supabase = createApiClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Get creator profile
        const { data: profile } = await supabaseAdmin
            .from('creator_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()

        if (!profile) {
            return NextResponse.json(
                { error: 'Creator profile not found' },
                { status: 404 }
            )
        }

        const url = new URL(request.url)
        const mediaId = url.searchParams.get('id')

        if (!mediaId) {
            return NextResponse.json(
                { error: 'Media ID required' },
                { status: 400 }
            )
        }

        // First get the media to get the file path
        const { data: media } = await supabaseAdmin
            .from('portfolio_media')
            .select('*')
            .eq('id', mediaId)
            .eq('creator_id', profile.id)
            .single()

        if (!media) {
            return NextResponse.json(
                { error: 'Media not found' },
                { status: 404 }
            )
        }

        // Delete from storage if it's a Supabase URL
        if (media.url.includes('supabase.co/storage')) {
            const pathMatch = media.url.match(/\/media\/(.+)$/)
            if (pathMatch) {
                await supabaseAdmin.storage.from('media').remove([pathMatch[1]])
            }
        }

        // Delete from database
        const { error } = await supabaseAdmin
            .from('portfolio_media')
            .delete()
            .eq('id', mediaId)
            .eq('creator_id', profile.id)

        if (error) {
            console.error('Error deleting media:', error)
            return NextResponse.json(
                { error: 'Failed to delete media' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true }, {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
            }
        })
    } catch (error) {
        console.error('Media DELETE error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

