import { createClient } from '@supabase/supabase-js'

// Client-side Supabase client
// NEXT_PUBLIC_ env vars are available at build time and runtime
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables - using placeholder client')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
