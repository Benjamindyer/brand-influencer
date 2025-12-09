import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api-client'
import { createCreatorProfile, updateCreatorProfile } from '@/lib/supabase/queries/creator'

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
        
        // Use server-side client directly instead of getCreatorProfile
        const { data, error } = await supabase
            .from('creator_profiles')
            .select(`
                *,
                primary_trade:trades!creator_profiles_primary_trade_id_fkey(*),
                additional_trades:creator_trades(
                    trade:trades(*)
                )
            `)
            .eq('user_id', user.id)
            .single()
        
        if (error) {
            // Handle specific Supabase error codes
            if (error.code === 'PGRST116') {
                return NextResponse.json(
                    { error: 'Profile not found' },
                    { 
                        status: 404,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )
            }
            
            // Log the error for debugging
            console.error('Supabase query error:', error)
            
            return NextResponse.json(
                { error: error.message || 'Failed to fetch profile' },
                { 
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
        }
        
        if (!data) {
            return NextResponse.json(
                { error: 'Profile not found' },
                { 
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
        }
        
        const profile = {
            ...data,
            primary_trade: data.primary_trade,
            additional_trades: data.additional_trades?.map((ct: any) => ct.trade) || [],
        }
        
        return NextResponse.json(profile, {
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

export async function POST(request: NextRequest) {
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
        
        const body = await request.json()
        const { additional_trades, ...profileData } = body
        
        // Create profile using server-side client
        const { data: profile, error: createError } = await supabase
            .from('creator_profiles')
            .insert({
                user_id: user.id,
                ...profileData,
            })
            .select()
            .single()
        
        if (createError) {
            console.error('Failed to create profile:', createError)
            return NextResponse.json(
                { error: createError.message || 'Failed to create profile' },
                { 
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
        }
        
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
        
        return NextResponse.json(profile, { 
            status: 201,
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

export async function PATCH(request: NextRequest) {
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
        
        const body = await request.json()
        const { additional_trades, ...profileData } = body
        
        // Get current profile first
        const { data: currentProfile, error: profileFetchError } = await supabase
            .from('creator_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()
        
        if (profileFetchError || !currentProfile) {
            return NextResponse.json(
                { error: 'Profile not found' },
                { 
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
        }
        
        // Update profile using server-side client
        const { data: profile, error: updateError } = await supabase
            .from('creator_profiles')
            .update(profileData)
            .eq('user_id', user.id)
            .select()
            .single()
        
        if (updateError) {
            console.error('Failed to update profile:', updateError)
            return NextResponse.json(
                { error: updateError.message || 'Failed to update profile' },
                { 
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
        }
        
        // Update additional trades if provided
        if (additional_trades !== undefined) {
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
        
        return NextResponse.json(profile, {
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

