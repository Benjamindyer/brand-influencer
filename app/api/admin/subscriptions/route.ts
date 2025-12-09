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
        
        const { data, error } = await supabaseAdmin
            .from('subscriptions')
            .select(`
                *,
                brand:brand_profiles(company_name)
            `)
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

