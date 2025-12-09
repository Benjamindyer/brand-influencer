import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api-client'
import { getCreatorProfile, createCreatorProfile, updateCreatorProfile } from '@/lib/supabase/queries/creator'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createApiClient()
        
        const {
            data: { user },
        } = await supabase.auth.getUser()
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        
        const profile = await getCreatorProfile(user.id)
        
        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
        }
        
        return NextResponse.json(profile)
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createApiClient()
        
        const {
            data: { user },
        } = await supabase.auth.getUser()
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        
        const body = await request.json()
        const { additional_trades, ...profileData } = body
        
        const profile = await createCreatorProfile(user.id, profileData)
        
        // Add additional trades if provided
        if (additional_trades && Array.isArray(additional_trades)) {
            for (const tradeId of additional_trades) {
                await supabase
                    .from('creator_trades')
                    .insert({
                        creator_id: profile.id,
                        trade_id: tradeId,
                    })
            }
        }
        
        return NextResponse.json(profile, { status: 201 })
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const supabase = await createApiClient()
        
        const {
            data: { user },
        } = await supabase.auth.getUser()
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        
        const body = await request.json()
        const { additional_trades, ...profileData } = body
        
        const profile = await updateCreatorProfile(user.id, profileData)
        
        // Update additional trades if provided
        if (additional_trades !== undefined) {
            // Get current profile to get creator_id
            const currentProfile = await getCreatorProfile(user.id)
            if (currentProfile) {
                // Remove all existing additional trades
                await supabase
                    .from('creator_trades')
                    .delete()
                    .eq('creator_id', currentProfile.id)
                
                // Add new ones
                if (Array.isArray(additional_trades)) {
                    for (const tradeId of additional_trades) {
                        await supabase
                            .from('creator_trades')
                            .insert({
                                creator_id: currentProfile.id,
                                trade_id: tradeId,
                            })
                    }
                }
            }
        }
        
        return NextResponse.json(profile)
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}

