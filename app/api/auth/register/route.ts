import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api-client'
import { supabaseAdmin } from '@/lib/supabase/server'
import type { UserRole } from '@/types/auth'

export async function POST(request: NextRequest) {
    try {
        // Check if Supabase environment variables are configured
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json(
                { 
                    error: 'Server configuration error: Missing Supabase environment variables. Please contact the administrator or check Vercel environment variables.',
                    details: 'Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY'
                },
                { status: 500 }
            )
        }

        const body = await request.json()
        const { email, password, role } = body

        if (!email || !password || !role) {
            return NextResponse.json(
                { error: 'Email, password, and role are required' },
                { status: 400 }
            )
        }

        // Create user with Supabase Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm email for now
        })

        if (authError) {
            return NextResponse.json(
                { error: authError.message },
                { status: 400 }
            )
        }

        if (!authData.user) {
            return NextResponse.json(
                { error: 'Failed to create user' },
                { status: 500 }
            )
        }

        // Create user profile with role
        const { error: profileError } = await supabaseAdmin
            .from('user_profiles')
            .insert({
                id: authData.user.id,
                role: role as UserRole,
            })

        if (profileError) {
            // Clean up: delete the auth user if profile creation fails
            await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
            return NextResponse.json(
                { error: `Failed to create user profile: ${profileError.message}` },
                { status: 500 }
            )
        }

        return NextResponse.json({
            user: authData.user,
            message: 'User created successfully',
        })
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}

