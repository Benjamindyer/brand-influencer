import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api-client'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = await createApiClient()

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Get brief
        const { data: brief, error: briefError } = await supabase
            .from('briefs')
            .select('*')
            .eq('id', id)
            .single()

        if (briefError || !brief) {
            return NextResponse.json(
                { error: 'Brief not found' },
                { status: 404 }
            )
        }

        // Get applications
        const { data: applications, error: appsError } = await supabase
            .from('applications')
            .select(`
                *,
                creator:creator_profiles(
                    id,
                    name,
                    display_name,
                    profile_photo_url,
                    primary_trade:trades!creator_profiles_primary_trade_id_fkey(name)
                )
            `)
            .eq('brief_id', id)
            .order('created_at', { ascending: false })

        if (appsError) {
            return NextResponse.json(
                { error: appsError.message },
                { status: 500 }
            )
        }

        return NextResponse.json({
            brief,
            applications: applications || [],
        })
    } catch (error) {
        console.error('Applications fetch error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

