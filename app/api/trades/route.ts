import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    try {
        // Use admin client to bypass RLS since trades should be public
        const { data, error } = await supabaseAdmin
            .from('trades')
            .select('*')
            .order('name')

        if (error) {
            console.error('Trades fetch error:', error)
            return NextResponse.json(
                { error: error.message },
                {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store',
                    },
                }
            )
        }

        return NextResponse.json(data || [], {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
            },
        })
    } catch (error) {
        console.error('Trades API error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store',
                },
            }
        )
    }
}
