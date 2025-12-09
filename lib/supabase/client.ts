'use client'

import { createBrowserClient } from '@supabase/ssr'

// Client-side Supabase client using SSR package
// NEXT_PUBLIC_ env vars are available at build time and runtime
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    const missing = []
    if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL')
    if (!supabaseAnonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
    console.error(
        `Missing Supabase environment variables: ${missing.join(', ')}. ` +
        'Please configure these in your Vercel project settings under Environment Variables.'
    )
}

// Create browser client - Supabase handles CORS automatically
// This file should only be imported in client components ('use client')
export const supabase = createBrowserClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
)
