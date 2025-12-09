import { supabase } from '@/lib/supabase/client'
import type { Brief, BriefTargeting } from '@/types/brief'

export async function getBriefsByBrand(brandId: string) {
    const { data, error } = await supabase
        .from('briefs')
        .select('*')
        .eq('brand_id', brandId)
        .order('created_at', { ascending: false })
    
    if (error) {
        throw new Error(`Failed to get briefs: ${error.message}`)
    }
    
    return data || []
}

export async function getBriefById(briefId: string) {
    const { data, error } = await supabase
        .from('briefs')
        .select(`
            *,
            brand:brand_profiles(*),
            targeting:brief_targeting(*)
        `)
        .eq('id', briefId)
        .single()
    
    if (error) {
        throw new Error(`Failed to get brief: ${error.message}`)
    }
    
    return data
}

export async function createBrief(
    brandId: string,
    briefData: Omit<Brief, 'id' | 'brand_id' | 'created_at' | 'updated_at' | 'slots_filled'>,
    targeting?: Omit<BriefTargeting, 'id' | 'brief_id'>[]
) {
    const { data: brief, error: briefError } = await supabase
        .from('briefs')
        .insert({
            brand_id: brandId,
            ...briefData,
            slots_filled: 0,
        })
        .select()
        .single()
    
    if (briefError) {
        throw new Error(`Failed to create brief: ${briefError.message}`)
    }
    
    if (targeting && targeting.length > 0) {
        const targetingData = targeting.map((t) => ({
            brief_id: brief.id,
            ...t,
        }))
        
        const { error: targetingError } = await supabase
            .from('brief_targeting')
            .insert(targetingData)
        
        if (targetingError) {
            throw new Error(`Failed to create targeting: ${targetingError.message}`)
        }
    }
    
    return brief
}

export async function getBriefsForCreator(creatorId: string) {
    // Get creator profile to match against targeting
    const { data: creator } = await supabase
        .from('creator_profiles')
        .select(`
            *,
            primary_trade_id,
            additional_trades:creator_trades(trade_id),
            social_accounts(platform)
        `)
        .eq('id', creatorId)
        .single()
    
    if (!creator) return []
    
    // Get all open briefs
    const { data: briefs, error } = await supabase
        .from('briefs')
        .select(`
            *,
            brand:brand_profiles(company_name, logo_url),
            targeting:brief_targeting(*)
        `)
        .eq('status', 'open')
        .gte('deadline', new Date().toISOString())
        .order('created_at', { ascending: false })
    
    if (error) {
        throw new Error(`Failed to get briefs: ${error.message}`)
    }
    
    // Filter briefs that match creator's profile
    const matchingBriefs = (briefs || []).filter((brief) => {
        if (!brief.targeting || brief.targeting.length === 0) return true
        
        return brief.targeting.some((target: any) => {
            // Check trade match
            if (target.trade_id) {
                if (target.trade_id !== creator.primary_trade_id) {
                    const hasAdditionalTrade = creator.additional_trades?.some(
                        (at: any) => at.trade_id === target.trade_id
                    )
                    if (!hasAdditionalTrade) return false
                }
            }
            
            // Check platform match
            if (target.platform) {
                const hasPlatform = creator.social_accounts?.some(
                    (sa: any) => sa.platform === target.platform
                )
                if (!hasPlatform) return false
            }
            
            // Check follower count
            if (target.min_followers) {
                const totalFollowers = creator.social_accounts?.reduce(
                    (sum: number, sa: any) => sum + (sa.follower_count || 0),
                    0
                ) || 0
                if (totalFollowers < target.min_followers) return false
            }
            
            // Check engagement
            if (target.min_engagement) {
                const avgEngagement = creator.social_accounts?.length
                    ? creator.social_accounts.reduce(
                          (sum: number, sa: any) => sum + (sa.engagement_rate || 0),
                          0
                      ) / creator.social_accounts.length
                    : 0
                if (avgEngagement < target.min_engagement) return false
            }
            
            // Check location
            if (target.location) {
                const locationMatch =
                    creator.location_city?.toLowerCase().includes(target.location.toLowerCase()) ||
                    creator.location_country?.toLowerCase().includes(target.location.toLowerCase())
                if (!locationMatch) return false
            }
            
            return true
        })
    })
    
    return matchingBriefs
}

