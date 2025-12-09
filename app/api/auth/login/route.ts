import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            )
        }

        const cookieStore = await cookies()
        
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                    set(name: string, value: string, options: any) {
                        cookieStore.set({ name, value, ...options })
                    },
                    remove(name: string, options: any) {
                        cookieStore.set({ name, value: '', ...options })
                    },
                },
            }
        )

        const { data, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (authError) {
            return NextResponse.json(
                { error: authError.message },
                { status: 401 }
            )
        }

        if (!data.user) {
            return NextResponse.json(
                { error: 'Login failed' },
                { status: 401 }
            )
        }

        // Get user role
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', data.user.id)
            .single()

        return NextResponse.json({
            user: {
                id: data.user.id,
                email: data.user.email,
                role: profile?.role || null,
            },
            redirectTo: profile?.role === 'creator' 
                ? '/creator/dashboard' 
                : profile?.role === 'brand' 
                    ? '/brand/dashboard' 
                    : profile?.role === 'admin'
                        ? '/admin/dashboard'
                        : '/',
        })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

