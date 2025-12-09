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
        
        const { data: applications, error } = await supabase
            .from('applications')
            .select(`
                *,
                brief:briefs(
                    *,
                    brand:brand_profiles(company_name)
                )
            `)
            .eq('creator_id', profile.id)
            .order('created_at', { ascending: false })
        
        if (error) throw error
        
        return NextResponse.json(applications || [])
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
        
        const { data: profile } = await supabase
            .from('creator_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()
        
        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
        }
        
        const body = await request.json()
        const { brief_id, message, links } = body
        
        // Check if already applied
        const { data: existing } = await supabase
            .from('applications')
            .select('id')
            .eq('brief_id', brief_id)
            .eq('creator_id', profile.id)
            .single()
        
        if (existing) {
            return NextResponse.json({ error: 'Already applied to this brief' }, { status: 400 })
        }
        
        const { data, error } = await supabase
            .from('applications')
            .insert({
                brief_id,
                creator_id: profile.id,
                message: message || null,
                links: links || null,
                status: 'pending',
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

