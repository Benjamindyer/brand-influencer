'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'

// Client-side Supabase client using SSR package
// NEXT_PUBLIC_ env vars are available at build time and runtime
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Lazy initialization - only create when actually needed
let supabaseInstance: SupabaseClient | null = null

function createClient(): SupabaseClient {
    if (typeof window === 'undefined') {
        throw new Error('Supabase client can only be used in browser')
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
            'Please configure these in your Vercel project settings.'
        )
    }
    
    try {
        supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey)
        return supabaseInstance
    } catch (error) {
        console.error('Failed to create Supabase client:', error)
        throw error
    }
}

// Export client with lazy initialization
export const supabase = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        try {
            const client = createClient()
            const value = (client as any)[prop]
            if (typeof value === 'function') {
                return (...args: any[]) => {
                    try {
                        return value.apply(client, args)
                    } catch (error) {
                        // Silently handle CORS errors - they're expected if env vars aren't set
                        if (error instanceof TypeError && error.message.includes('Load failed')) {
                            console.warn('Supabase request failed (likely CORS or missing env vars):', error)
                            return Promise.resolve({ data: null, error: { message: 'Client not configured' } })
                        }
                        throw error
                    }
                }
            }
            return value
        } catch (error) {
            // Return a no-op for SSR or when client can't be created
            if (typeof window === 'undefined') {
                return () => Promise.resolve({ data: null, error: { message: 'Server-side usage not allowed' } })
            }
            throw error
        }
    },
})
