import { supabase } from '@/lib/supabase/client'
import type { BrandProfile } from '@/types/brand'

export async function getBrandProfile(userId: string): Promise<BrandProfile | null> {
    const { data, error } = await supabase
        .from('brand_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
    
    if (error) {
        if (error.code === 'PGRST116') {
            return null
        }
        throw new Error(`Failed to get brand profile: ${error.message}`)
    }
    
    return data
}

export async function createBrandProfile(
    userId: string,
    profileData: Omit<BrandProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<BrandProfile> {
    const { data, error } = await supabase
        .from('brand_profiles')
        .insert({
            user_id: userId,
            ...profileData,
        })
        .select()
        .single()
    
    if (error) {
        throw new Error(`Failed to create brand profile: ${error.message}`)
    }
    
    return data
}

export async function updateBrandProfile(
    userId: string,
    updates: Partial<Omit<BrandProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<BrandProfile> {
    const { data, error } = await supabase
        .from('brand_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single()
    
    if (error) {
        throw new Error(`Failed to update brand profile: ${error.message}`)
    }
    
    return data
}

