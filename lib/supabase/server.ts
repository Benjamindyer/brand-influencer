import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseAdminInstance: SupabaseClient | null = null

function getSupabaseAdmin() {
    if (supabaseAdminInstance) {
        return supabaseAdminInstance
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error('Missing Supabase environment variables')
    }

    supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })

    return supabaseAdminInstance
}

// Server-side Supabase client with service role key
// Use this for admin operations, not for user-facing requests
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        return getSupabaseAdmin()[prop as keyof SupabaseClient]
    },
})
