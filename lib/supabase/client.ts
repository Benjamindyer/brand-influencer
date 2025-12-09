import { createClient } from '@supabase/supabase-js'

// Client-side Supabase client
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

// Create client with error handling
// If env vars are missing, createClient will fail on first use with a clear error
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
)
