import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { UserRole } from '@/types/auth'

export async function middleware(request: NextRequest) {
    const res = NextResponse.next()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
    } = await supabase.auth.getSession()
    
    const pathname = request.nextUrl.pathname
    
    // Public routes
    const publicRoutes = ['/login', '/register', '/forgot-password', '/verify-email', '/']
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))
    
    if (isPublicRoute) {
        return res
    }
    
    // Protected routes
    if (!session) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/login'
        redirectUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(redirectUrl)
    }
    
    // Get user role
    const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()
    
    if (!profile) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/register'
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
    
    return res
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}

