import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createApiClient() {
    const cookieStore = await cookies()
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables')
    }
    
    return createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: any) {
                    // Server-side cookies are handled by Next.js
                    // This is a no-op for server components
                },
                remove(name: string, options: any) {
                    // Server-side cookies are handled by Next.js
                    // This is a no-op for server components
                },
            },
        }
    )
}

