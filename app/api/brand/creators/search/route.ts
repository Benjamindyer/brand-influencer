import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api-client'
import { searchCreators } from '@/lib/supabase/queries/search'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createApiClient()
        
        const {
            data: { user },
        } = await supabase.auth.getUser()
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1', 10)
        const pageSize = parseInt(searchParams.get('pageSize') || '20', 10)
        
        const filters = {
            primary_trade: searchParams.get('primary_trade') || undefined,
            additional_trades: searchParams.get('additional_trades')?.split(',').filter(Boolean) || undefined,
            platforms: searchParams.get('platforms')?.split(',').filter(Boolean) || undefined,
            min_followers: searchParams.get('min_followers') ? parseInt(searchParams.get('min_followers')!, 10) : undefined,
            max_followers: searchParams.get('max_followers') ? parseInt(searchParams.get('max_followers')!, 10) : undefined,
            min_engagement: searchParams.get('min_engagement') ? parseFloat(searchParams.get('min_engagement')!) : undefined,
            max_engagement: searchParams.get('max_engagement') ? parseFloat(searchParams.get('max_engagement')!) : undefined,
            location: searchParams.get('location') || undefined,
            keyword: searchParams.get('keyword') || undefined,
        }
        
        const results = await searchCreators(filters, page, pageSize)
        
        return NextResponse.json({
            results,
            page,
            pageSize,
            total: results.length,
        })
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}

