'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import { RoleSwitcher } from '@/components/admin/RoleSwitcher'
import Link from 'next/link'

type ViewRole = 'admin' | 'brand' | 'creator'

export function Navigation() {
    const router = useRouter()
    const pathname = usePathname()
    const [user, setUser] = useState<any>(null)
    const [role, setRole] = useState<string | null>(null)
    const [viewingAs, setViewingAs] = useState<ViewRole>('admin')
    const [loading, setLoading] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    
    useEffect(() => {
        // Only run in browser
        if (typeof window === 'undefined') {
            setLoading(false)
            return
        }
        
        // Load admin viewing preference
        const savedViewingAs = localStorage.getItem('admin_viewing_as') as ViewRole
        if (savedViewingAs && ['admin', 'brand', 'creator'].includes(savedViewingAs)) {
            setViewingAs(savedViewingAs)
        }
        
        loadUser()
    }, [])
    
    async function loadUser() {
        try {
            // Use API route instead of direct Supabase call to avoid CORS
            const response = await fetch('/api/auth/status', {
                headers: { 'Accept': 'application/json' },
            })
            
            if (!response.ok) {
                setUser(null)
                setRole(null)
                setLoading(false)
                return
            }
            
            const data = await response.json()
            
            if (data.authenticated && data.user) {
                setUser(data.user)
                setRole(data.user.role)
            } else {
                setUser(null)
                setRole(null)
            }
        } catch (error) {
            // Silently handle errors
            setUser(null)
            setRole(null)
        } finally {
            setLoading(false)
        }
    }
    
    async function handleSignOut() {
        try {
            // Call a sign-out API route
            await fetch('/api/auth/signout', {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
            })
            setUser(null)
            setRole(null)
            router.push('/auth/login')
        } catch (error) {
            console.error('Failed to sign out:', error)
            // Still redirect even if sign out fails
            router.push('/auth/login')
        }
    }
    
    const handleViewingAsChange = (newRole: ViewRole) => {
        setViewingAs(newRole)
    }
    
    const getNavLinks = () => {
        if (!role) return []
        
        // For admin users, show links based on what role they're viewing as
        const effectiveRole = role === 'admin' ? viewingAs : role
        
        if (effectiveRole === 'creator') {
            return [
                { href: '/creator/dashboard', label: 'Dashboard' },
                { href: '/creator/briefs', label: 'Browse Briefs' },
                { href: '/creator/applications', label: 'Applications' },
                { href: '/creator/profile/edit', label: 'Profile' },
            ]
        } else if (effectiveRole === 'brand') {
            return [
                { href: '/brand/dashboard', label: 'Dashboard' },
                { href: '/brand/creators/search', label: 'Search Creators' },
                { href: '/brand/briefs/create', label: 'Create Brief' },
                { href: '/brand/subscription', label: 'Subscription' },
            ]
        } else if (effectiveRole === 'admin') {
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
    
    const effectiveRole = role === 'admin' ? viewingAs : role
    const dashboardHref = effectiveRole === 'creator' 
        ? '/creator/dashboard' 
        : effectiveRole === 'brand' 
            ? '/brand/dashboard' 
            : '/admin/dashboard'
    
    return (
        <nav className='border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] backdrop-blur-md sticky top-0 z-40' style={{
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
        }}>
            <div className='max-w-7xl mx-auto px-4 py-4'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <Link href={dashboardHref} className='text-xl font-bold text-[var(--color-text-primary)]'>
                            Brand Influencer
                        </Link>
                        {role === 'admin' && (
                            <RoleSwitcher onRoleChange={handleViewingAsChange} />
                        )}
                    </div>
                    
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
                            {role === 'admin' && (
                                <div className='px-4 py-2'>
                                    <RoleSwitcher onRoleChange={handleViewingAsChange} />
                                </div>
                            )}
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
