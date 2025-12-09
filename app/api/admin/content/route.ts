import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api-client'
import { supabaseAdmin } from '@/lib/supabase/server'

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
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single()
        
        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }
        
        const { data: creators, error: creatorsError } = await supabaseAdmin
            .from('creator_profiles')
            .select('*')
            .order('created_at', { ascending: false })
        
        const { data: brands, error: brandsError } = await supabaseAdmin
            .from('brand_profiles')
            .select('*')
            .order('created_at', { ascending: false })
        
        const { data: briefs, error: briefsError } = await supabaseAdmin
            .from('briefs')
            .select('*')
            .order('created_at', { ascending: false })
        
        if (creatorsError || brandsError || briefsError) {
            throw new Error('Failed to load content')
        }
        
        return NextResponse.json({
            creators: creators || [],
            brands: brands || [],
            briefs: briefs || [],
        })
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
        
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single()
        
        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }
        
        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type')
        const id = searchParams.get('id')
        
        if (!type || !id) {
            return NextResponse.json({ error: 'Type and ID required' }, { status: 400 })
        }
        
        let error
        if (type === 'creator') {
            const { error: e } = await supabaseAdmin
                .from('creator_profiles')
                .delete()
                .eq('id', id)
            error = e
        } else if (type === 'brand') {
            const { error: e } = await supabaseAdmin
                .from('brand_profiles')
                .delete()
                .eq('id', id)
            error = e
        } else if (type === 'brief') {
            const { error: e } = await supabaseAdmin
                .from('briefs')
                .delete()
                .eq('id', id)
            error = e
        } else {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
        }
        
        if (error) throw error
        
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}

