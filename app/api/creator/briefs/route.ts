import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api-client'
import { getBriefsForCreator } from '@/lib/supabase/queries/briefs'

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
        
        const briefs = await getBriefsForCreator(profile.id)
        
        return NextResponse.json(briefs)
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}

