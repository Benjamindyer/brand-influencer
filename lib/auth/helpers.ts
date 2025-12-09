import { supabase } from '@/lib/supabase/client'
import type { UserRole, UserProfile } from '@/types/auth'

export async function createUserProfile(userId: string, role: UserRole): Promise<void> {
    const { error } = await supabase
        .from('user_profiles')
        .insert({
            id: userId,
            role,
        })
    
    if (error) {
        throw new Error(`Failed to create user profile: ${error.message}`)
    }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()
    
    if (error) {
        if (error.code === 'PGRST116') {
            return null
        }
        throw new Error(`Failed to get user profile: ${error.message}`)
    }
    
    return data
}

export async function getUserRole(userId: string): Promise<UserRole | null> {
    const profile = await getUserProfile(userId)
    return profile?.role || null
}

export async function signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) {
        throw new Error(`Failed to sign out: ${error.message}`)
    }
}

