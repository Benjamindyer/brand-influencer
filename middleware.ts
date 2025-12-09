import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { UserRole } from '@/types/auth'

export async function middleware(request: NextRequest) {
    try {
        const res = NextResponse.next()
        const pathname = request.nextUrl.pathname
        
        // Public routes - allow access without auth
        const publicRoutes = ['/auth', '/']
        const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))
        
        if (isPublicRoute) {
            return res
        }
        
        // Check if Supabase env vars are available
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        if (!supabaseUrl || !supabaseAnonKey) {
            // If env vars aren't set, allow the request through
            // This can happen during build or if env vars aren't configured
            console.warn('Supabase environment variables not set in middleware')
            return res
        }
        
        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    get(name: string) {
                        return request.cookies.get(name)?.value
                    },
                    set(name: string, value: string, options: any) {
                        request.cookies.set({
                            name,
                            value,
                            ...options,
                        })
                        res.cookies.set({
                            name,
                            value,
                            ...options,
                        })
                    },
                    remove(name: string, options: any) {
                        request.cookies.set({
                            name,
                            value: '',
                            ...options,
                        })
                        res.cookies.set({
                            name,
                            value: '',
                            ...options,
                        })
                    },
                },
            }
        )
        
        const {
            data: { session },
            error: sessionError,
        } = await supabase.auth.getSession()
        
        // If there's an error getting the session, allow the request through
        // The route handlers will handle authentication
        if (sessionError) {
            console.error('Middleware session error:', sessionError)
            return res
        }
        
        // Protected routes
        if (!session) {
            const redirectUrl = request.nextUrl.clone()
            redirectUrl.pathname = '/auth/login'
            redirectUrl.searchParams.set('redirect', pathname)
            return NextResponse.redirect(redirectUrl)
        }
        
        // Get user role
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()
        
        if (profileError || !profile) {
            const redirectUrl = request.nextUrl.clone()
            redirectUrl.pathname = '/auth/register'
            return NextResponse.redirect(redirectUrl)
        }
        
        const userRole = profile.role as UserRole
        
        // Role-based route protection
        if (pathname.startsWith('/creator') && userRole !== 'creator') {
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
        
        if (pathname.startsWith('/brand') && userRole !== 'brand') {
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
        
        if (pathname.startsWith('/admin') && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
        
        // Also protect auth routes - redirect if already logged in
        if (pathname.startsWith('/auth') && session) {
            // Redirect to appropriate dashboard based on role
            if (userRole === 'creator') {
                return NextResponse.redirect(new URL('/creator/dashboard', request.url))
            } else if (userRole === 'brand') {
                return NextResponse.redirect(new URL('/brand/dashboard', request.url))
            } else if (userRole === 'admin') {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url))
            }
        }
        
        return res
    } catch (error) {
        // If middleware fails, log the error and allow the request through
        // Route handlers will handle authentication
        console.error('Middleware error:', error)
        return NextResponse.next()
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}

