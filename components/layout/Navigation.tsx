'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { signOut } from '@/lib/auth/helpers'
import { Button } from '@/components/ui/Button'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import { Avatar } from '@/components/ui/Avatar'
import Link from 'next/link'

export function Navigation() {
    const router = useRouter()
    const pathname = usePathname()
    const [user, setUser] = useState<any>(null)
    const [role, setRole] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    
    useEffect(() => {
        // Only run in browser
        if (typeof window === 'undefined') {
            setLoading(false)
            return
        }
        
        // Check if supabase client is available
        if (!supabase || typeof supabase.auth === 'undefined') {
            setLoading(false)
            return
        }
        
        loadUser()
        
        try {
            const {
                data: { subscription },
            } = supabase.auth.onAuthStateChange(() => {
                loadUser()
            })
            
            return () => {
                subscription.unsubscribe()
            }
        } catch (error) {
            // Silently handle if client isn't available
            console.warn('Failed to set up auth state listener:', error)
            setLoading(false)
        }
    }, [])
    
    async function loadUser() {
        try {
            // Only run in browser
            if (typeof window === 'undefined') {
                setLoading(false)
                return
            }
            
            // Check if supabase client is available
            if (!supabase || typeof supabase.auth === 'undefined') {
                setLoading(false)
                return
            }
            
            const {
                data: { user: authUser },
                error: authError,
            } = await supabase.auth.getUser()
            
            if (authError) {
                // Log the actual error for debugging
                if (authError.message && !authError.message.includes('CORS')) {
                    console.warn('Auth error:', authError.message)
                }
                setUser(null)
                setRole(null)
                setLoading(false)
                return
            }
            
            if (!authUser) {
                setUser(null)
                setRole(null)
                setLoading(false)
                return
            }
            
            setUser(authUser)
            
            const { data: profile, error: profileError } = await supabase
                .from('user_profiles')
                .select('role')
                .eq('id', authUser.id)
                .single()
            
            if (profileError) {
                console.warn('Failed to load user profile:', profileError.message)
            }
            
            setRole(profile?.role || null)
        } catch (error: any) {
            // Only log non-CORS errors
            if (error?.message && !error.message.includes('Load failed') && !error.message.includes('CORS')) {
                console.warn('Failed to load user:', error.message)
            }
            setUser(null)
            setRole(null)
        } finally {
            setLoading(false)
        }
    }
    
    async function handleSignOut() {
        try {
            await signOut()
            router.push('/auth/login')
        } catch (error) {
            console.error('Failed to sign out:', error)
        }
    }
    
    const getNavLinks = () => {
        if (!role) return []
        
        if (role === 'creator') {
            return [
                { href: '/creator/dashboard', label: 'Dashboard' },
                { href: '/creator/briefs', label: 'Browse Briefs' },
                { href: '/creator/applications', label: 'Applications' },
                { href: '/creator/profile/edit', label: 'Profile' },
            ]
        } else if (role === 'brand') {
            return [
                { href: '/brand/dashboard', label: 'Dashboard' },
                { href: '/brand/creators/search', label: 'Search Creators' },
                { href: '/brand/briefs/create', label: 'Create Brief' },
                { href: '/brand/subscription', label: 'Subscription' },
            ]
        } else if (role === 'admin') {
            return [
                { href: '/admin/dashboard', label: 'Dashboard' },
                { href: '/admin/users', label: 'Users' },
                { href: '/admin/content', label: 'Content' },
                { href: '/admin/trades', label: 'Trades' },
            ]
        }
        
        return []
    }
    
    if (loading) {
        return null
    }
    
    const navLinks = getNavLinks()
    const isAuthPage = pathname?.startsWith('/auth')
    
    if (isAuthPage || !user) {
        return (
            <nav className='border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] backdrop-blur-md sticky top-0 z-40' style={{
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
            }}>
                <div className='max-w-7xl mx-auto px-4 py-4 flex items-center justify-between'>
                    <Link href='/' className='text-xl font-bold text-[var(--color-text-primary)]'>
                        Brand Influencer
                    </Link>
                    <div className='flex gap-2'>
                        <Link href='/auth/login'>
                            <Button variant='outline' size='sm'>
                                Sign In
                            </Button>
                        </Link>
                        <Link href='/auth/register'>
                            <Button variant='primary' size='sm'>
                                Register
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>
        )
    }
    
    return (
        <nav className='border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] backdrop-blur-md sticky top-0 z-40' style={{
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
        }}>
            <div className='max-w-7xl mx-auto px-4 py-4'>
                <div className='flex items-center justify-between'>
                    <Link href={role === 'creator' ? '/creator/dashboard' : role === 'brand' ? '/brand/dashboard' : '/admin/dashboard'} className='text-xl font-bold text-[var(--color-text-primary)]'>
                        Brand Influencer
                    </Link>
                    
                    <div className='hidden md:flex items-center gap-6'>
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium ${
                                    pathname === link.href
                                        ? 'text-[var(--color-primary-600)]'
                                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary-600)]'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <NotificationBell />
                        <Button variant='ghost' size='sm' onClick={handleSignOut}>
                            Sign Out
                        </Button>
                    </div>
                    
                    <div className='md:hidden'>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className='p-2'
                        >
                            <svg
                                className='w-6 h-6 text-[var(--color-text-primary)]'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                {mobileMenuOpen ? (
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M6 18L18 6M6 6l12 12'
                                    />
                                ) : (
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M4 6h16M4 12h16M4 18h16'
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
                
                {mobileMenuOpen && (
                    <div className='md:hidden mt-4 pb-4 border-t border-[var(--color-border)] pt-4'>
                        <div className='flex flex-col gap-2'>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`px-4 py-2 rounded-md ${
                                        pathname === link.href
                                            ? 'bg-[var(--color-bg-hover)] text-[var(--color-primary-600)]'
                                            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className='flex items-center justify-between px-4 py-2'>
                                <NotificationBell />
                                <Button variant='ghost' size='sm' onClick={handleSignOut}>
                                    Sign Out
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

