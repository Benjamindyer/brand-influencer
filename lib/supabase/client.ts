import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// Client-side Supabase client using SSR package
// NEXT_PUBLIC_ env vars are available at build time and runtime
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Lazy initialization - only create client when actually needed in browser
let supabaseInstance: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient {
    // Only create in browser environment
    if (typeof window === 'undefined') {
        throw new Error('Supabase client can only be used in browser environment')
    }
    
    if (supabaseInstance) {
        return supabaseInstance
    }
    
    if (!supabaseUrl || !supabaseAnonKey) {
        const missing = []
        if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL')
        if (!supabaseAnonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
        throw new Error(
            `Missing Supabase environment variables: ${missing.join(', ')}. ` +
            'Please configure these in your Vercel project settings under Environment Variables.'
        )
    }
    
    // Create browser client - Supabase handles CORS automatically
    supabaseInstance = createBrowserClient(
        supabaseUrl,
        supabaseAnonKey
    )
    
    return supabaseInstance
}

// Export a proxy that only creates the client when accessed
export const supabase = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        const client = getSupabaseClient()
        const value = (client as any)[prop]
        if (typeof value === 'function') {
            return value.bind(client)
        }
        return value
    },
})
