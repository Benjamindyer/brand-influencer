import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api-client'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createApiClient()
        await supabase.auth.signOut()

        return NextResponse.json(
            { success: true },
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store',
                },
            }
        )
    } catch (error) {
        return NextResponse.json(
            { success: false },
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store',
                },
            }
        )
    }
}

