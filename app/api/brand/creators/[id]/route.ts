import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api-client'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = await createApiClient()

        const { data: creator, error } = await supabase
            .from('creator_profiles')
            .select(`
                *,
                primary_trade:trades!creator_profiles_primary_trade_id_fkey(*),
                additional_trades:creator_trades(
                    trade:trades(*)
                ),
                social_accounts(*),
                featured_content(*)
            `)
            .eq('id', id)
            .single()

        if (error || !creator) {
            return NextResponse.json(
                { error: 'Creator not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(creator)
    } catch (error) {
        console.error('Creator fetch error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

