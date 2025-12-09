'use client'

import { createBrowserClient } from '@supabase/ssr'

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
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

export const supabase = typeof window !== 'undefined' && supabaseUrl && supabaseAnonKey
    ? (() => {
        if (!supabaseInstance) {
            supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true,
                },
            })
        }
        return supabaseInstance
    })()
    : ({} as any) // Return empty object for SSR or when env vars are missing
