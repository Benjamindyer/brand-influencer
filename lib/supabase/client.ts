'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// Client-side Supabase client using SSR package
// NEXT_PUBLIC_ env vars are available at build time and runtime
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (typeof window !== 'undefined') {
    if (!supabaseUrl || !supabaseAnonKey) {
        const missing = []
        if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL')
        if (!supabaseAnonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
        console.error(
            `Missing Supabase environment variables: ${missing.join(', ')}. ` +
            'Please configure these in your Vercel project settings under Environment Variables.'
        )
    }
}

// Create browser client - Supabase handles CORS automatically
// This file should only be imported in client components ('use client')
// The client will only work in browser environment
let supabaseInstance: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient | null {
    if (typeof window === 'undefined') {
        return null
    }
    
    if (!supabaseUrl || !supabaseAnonKey) {
        return null
    }
    
    if (!supabaseInstance) {
        try {
            supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true,
                },
            })
        } catch (error) {
            console.error('Failed to create Supabase client:', error)
            return null
        }
    }
    
    return supabaseInstance
}

// Export a proxy that handles errors gracefully
export const supabase = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        const client = getSupabaseClient()
        if (!client) {
            // Return no-op functions if client isn't available
            return () => Promise.resolve({ data: null, error: { message: 'Supabase client not available' } })
        }
        
        const value = (client as any)[prop]
        if (typeof value === 'function') {
            return (...args: any[]) => {
                try {
                    return value.apply(client, args)
                } catch (error: any) {
                    // Silently handle CORS/network errors
                    if (error?.message?.includes('Load failed') || error?.message?.includes('CORS') || error?.message?.includes('access control')) {
                        return Promise.resolve({ data: null, error: { message: 'Network error' } })
                    }
                    throw error
                }
            }
        }
        return value
    },
})
