import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api-client'

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
        
        const { data: brandProfile } = await supabase
            .from('brand_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()
        
        if (!brandProfile) {
            return NextResponse.json({ error: 'Brand profile not found' }, { status: 404 })
        }
        
        const body = await request.json()
        const { status } = body
        
        // Verify the application belongs to a brief owned by this brand
        const { data: application } = await supabase
            .from('applications')
            .select(`
                *,
                brief:briefs!inner(brand_id)
            `)
            .eq('id', id)
            .single()
        
        if (!application || application.brief.brand_id !== brandProfile.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }
        
        // Update application status
        const { data: updated, error: updateError } = await supabase
            .from('applications')
            .update({ status })
            .eq('id', id)
            .select()
            .single()
        
        if (updateError) throw updateError
        
        // If accepted, update brief status
        if (status === 'accepted') {
            const { data: brief } = await supabase
                .from('briefs')
                .select('type, slots_filled, num_creators_required')
                .eq('id', application.brief_id)
                .single()
            
            if (brief) {
                const newSlotsFilled = (brief.slots_filled || 0) + 1
                
                if (brief.type === 'standard') {
                    // Mark standard brief as completed
                    await supabase
                        .from('briefs')
                        .update({ status: 'completed', slots_filled: newSlotsFilled })
                        .eq('id', application.brief_id)
                } else if (brief.type === 'multi_creator') {
                    // Update slots filled
                    await supabase
                        .from('briefs')
                        .update({ slots_filled: newSlotsFilled })
                        .eq('id', application.brief_id)
                    
                    // Mark as full if all slots filled
                    if (newSlotsFilled >= brief.num_creators_required) {
                        await supabase
                            .from('briefs')
                            .update({ status: 'full' })
                            .eq('id', application.brief_id)
                    }
                }
            }
        }
        
        return NextResponse.json(updated)
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}

