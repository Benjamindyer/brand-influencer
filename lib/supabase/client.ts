import { createBrowserClient } from '@supabase/ssr'

// Client-side Supabase client using SSR package for proper cookie handling
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

// Create browser client with proper cookie handling
// This fixes CORS issues by properly managing authentication cookies
export const supabase = createBrowserClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key',
    {
        cookies: {
            get(name: string) {
                if (typeof document === 'undefined') return undefined
                const value = `; ${document.cookie}`
                const parts = value.split(`; ${name}=`)
                if (parts.length === 2) return parts.pop()?.split(';').shift()
                return undefined
            },
            set(name: string, value: string, options?: any) {
                if (typeof document === 'undefined') return
                let cookie = `${name}=${value}`
                if (options?.maxAge) cookie += `; max-age=${options.maxAge}`
                if (options?.path) cookie += `; path=${options.path}`
                if (options?.domain) cookie += `; domain=${options.domain}`
                if (options?.secure) cookie += '; secure'
                if (options?.sameSite) cookie += `; samesite=${options.sameSite}`
                document.cookie = cookie
            },
            remove(name: string, options?: any) {
                if (typeof document === 'undefined') return
                document.cookie = `${name}=; max-age=0; path=${options?.path || '/'}`
            },
        },
    }
)
