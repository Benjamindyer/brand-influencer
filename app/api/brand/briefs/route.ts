import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api-client'
import { createBrief, getBriefsByBrand } from '@/lib/supabase/queries/briefs'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createApiClient()
        
        const {
            data: { user },
        } = await supabase.auth.getUser()
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        
        const { data: brandProfile } = await supabase
            .from('brand_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()
        
        if (!brandProfile) {
            return NextResponse.json({ error: 'Brand profile not found' }, { status: 404 })
        }
        
        const briefs = await getBriefsByBrand(brandProfile.id)
        
        return NextResponse.json(briefs)
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
        
        const { data: brandProfile } = await supabase
            .from('brand_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()
        
        if (!brandProfile) {
            return NextResponse.json({ error: 'Brand profile not found' }, { status: 404 })
        }
        
        const body = await request.json()
        const { targeting, ...briefData } = body
        
        const brief = await createBrief(brandProfile.id, briefData, targeting)
        
        return NextResponse.json(brief, { status: 201 })
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}

