import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api-client'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createApiClient()
        const { id } = await params
        
        const {
            data: { user },
        } = await supabase.auth.getUser()
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single()
        
        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }
        
        const body = await request.json()
        const { action } = body
        
        if (action === 'suspend' || action === 'ban') {
            // Update user metadata to mark as suspended/banned
            await supabaseAdmin.auth.admin.updateUserById(id, {
                user_metadata: {
                    status: action,
                },
            })
        } else if (action === 'reactivate') {
            await supabaseAdmin.auth.admin.updateUserById(id, {
                user_metadata: {
                    status: 'active',
                },
            })
        }
        
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}

