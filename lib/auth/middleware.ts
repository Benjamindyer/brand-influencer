import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { UserRole } from '@/types/auth'

export async function requireAuth(request: NextRequest): Promise<{ userId: string; role: UserRole } | null> {
    const res = NextResponse.next()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set() {},
                remove() {},
            },
        }
    )
    
    const {
        data: { session },
    } = await supabase.auth.getSession()
    
    if (!session?.user) {
        return null
    }
    
    const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()
    
    if (!profile) {
        return null
    }
    
    return {
        userId: session.user.id,
        role: profile.role as UserRole,
    }
}

export function requireRole(allowedRoles: UserRole[]) {
    return async (request: NextRequest): Promise<{ userId: string; role: UserRole } | null> => {
        const auth = await requireAuth(request)
        
        if (!auth) {
            return null
        }
        
        if (!allowedRoles.includes(auth.role)) {
            return null
        }
        
        return auth
    }
}

