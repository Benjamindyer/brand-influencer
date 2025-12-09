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

        const { data: brief, error } = await supabase
            .from('briefs')
            .select('*')
            .eq('id', id)
            .single()

        if (error || !brief) {
            return NextResponse.json(
                { error: 'Brief not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(brief)
    } catch (error) {
        console.error('Brief fetch error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

