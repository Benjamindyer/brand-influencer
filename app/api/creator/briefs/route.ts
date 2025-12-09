import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api-client'
import { getBriefsForCreator } from '@/lib/supabase/queries/briefs'

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
                { 
                    status: 401,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
        }
        
        const { data: profile, error: profileError } = await supabase
            .from('creator_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()
        
        if (profileError || !profile) {
            return NextResponse.json(
                { error: 'Creator profile not found' },
                { 
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
        }
        
        const briefs = await getBriefsForCreator(profile.id)
        
        return NextResponse.json(briefs, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
            },
        })
    } catch (error) {
        console.error('API route error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { 
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
    }
}

