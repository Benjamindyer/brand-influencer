import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api-client'

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
                { status: 401 }
            )
        }

        const { data: brandProfile } = await supabase
            .from('brand_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()

        if (!brandProfile) {
            return NextResponse.json({ creators: [] })
        }

        const { data: favourites } = await supabase
            .from('favourites')
            .select(`
                creator:creator_profiles(
                    *,
                    primary_trade:trades!creator_profiles_primary_trade_id_fkey(*),
                    social_accounts(*)
                )
            `)
            .eq('brand_id', brandProfile.id)

        const creators = favourites?.map((f: any) => f.creator).filter(Boolean) || []

        return NextResponse.json({ creators })
    } catch (error) {
        console.error('Favourites fetch error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createApiClient()
        const { creatorId } = await request.json()

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

        const { data: brandProfile } = await supabase
            .from('brand_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()

        if (!brandProfile) {
            return NextResponse.json(
                { error: 'Brand profile not found' },
                { status: 404 }
            )
        }

        const { error } = await supabase
            .from('favourites')
            .insert({
                brand_id: brandProfile.id,
                creator_id: creatorId,
            })

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Add favourite error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createApiClient()
        const { creatorId } = await request.json()

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

        const { data: brandProfile } = await supabase
            .from('brand_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()

        if (!brandProfile) {
            return NextResponse.json(
                { error: 'Brand profile not found' },
                { status: 404 }
            )
        }

        await supabase
            .from('favourites')
            .delete()
            .eq('brand_id', brandProfile.id)
            .eq('creator_id', creatorId)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Remove favourite error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

