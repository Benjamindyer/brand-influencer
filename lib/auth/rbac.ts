import { supabase } from '@/lib/supabase/client'
import type { UserRole } from '@/types/auth'

export async function getUserRole(): Promise<UserRole | null> {
    const {
        data: { user },
    } = await supabase.auth.getUser()
    
    if (!user) return null
    
    const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()
    
    return profile?.role as UserRole || null
}

export async function hasRole(role: UserRole): Promise<boolean> {
    const userRole = await getUserRole()
    return userRole === role
}

export async function hasAnyRole(roles: UserRole[]): Promise<boolean> {
    const userRole = await getUserRole()
    return userRole !== null && roles.includes(userRole)
}

export function isCreator(role: UserRole | null): boolean {
    return role === 'creator'
}

export function isBrand(role: UserRole | null): boolean {
    return role === 'brand'
}

export function isAdmin(role: UserRole | null): boolean {
    return role === 'admin'
}

