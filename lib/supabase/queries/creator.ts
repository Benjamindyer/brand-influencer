import { supabase } from '@/lib/supabase/client'
import type { CreatorProfile, CreatorProfileWithTrades } from '@/types/creator'

export async function getCreatorProfile(userId: string): Promise<CreatorProfileWithTrades | null> {
    const { data, error } = await supabase
        .from('creator_profiles')
        .select(`
            *,
            primary_trade:trades!creator_profiles_primary_trade_id_fkey(*),
            additional_trades:creator_trades(
                trade:trades(*)
            )
        `)
        .eq('user_id', userId)
        .single()
    
    if (error) {
        if (error.code === 'PGRST116') {
            return null
        }
        throw new Error(`Failed to get creator profile: ${error.message}`)
    }
    
    if (!data) return null
    
    return {
        ...data,
        primary_trade: data.primary_trade,
        additional_trades: data.additional_trades?.map((ct: any) => ct.trade) || [],
    } as CreatorProfileWithTrades
}

export async function createCreatorProfile(
    userId: string,
    profileData: Omit<CreatorProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<CreatorProfile> {
    const { data, error } = await supabase
        .from('creator_profiles')
        .insert({
            user_id: userId,
            ...profileData,
        })
        .select()
        .single()
    
    if (error) {
        throw new Error(`Failed to create creator profile: ${error.message}`)
    }
    
    return data
}

export async function updateCreatorProfile(
    userId: string,
    updates: Partial<Omit<CreatorProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<CreatorProfile> {
    const { data, error } = await supabase
        .from('creator_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single()
    
    if (error) {
        throw new Error(`Failed to update creator profile: ${error.message}`)
    }
    
    return data
}

export async function addCreatorTrade(creatorId: string, tradeId: string): Promise<void> {
    const { error } = await supabase
        .from('creator_trades')
        .insert({
            creator_id: creatorId,
            trade_id: tradeId,
        })
    
    if (error) {
        throw new Error(`Failed to add trade: ${error.message}`)
    }
}

export async function removeCreatorTrade(creatorId: string, tradeId: string): Promise<void> {
    const { error } = await supabase
        .from('creator_trades')
        .delete()
        .eq('creator_id', creatorId)
        .eq('trade_id', tradeId)
    
    if (error) {
        throw new Error(`Failed to remove trade: ${error.message}`)
    }
}

