'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { signOut } from '@/lib/auth/helpers'
import Link from 'next/link'
import { Avatar } from '@/components/ui/Avatar'

interface NavItem {
    href: string
    label: string
    icon: React.ReactNode
}

interface SidebarProps {
    role: string | null
    user: any
}

export function Sidebar({ role, user }: SidebarProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)
    
    const getNavItems = (): NavItem[] => {
        if (!role) return []
        
        if (role === 'creator') {
            return [
                { href: '/creator/dashboard', label: 'Home', icon: <HomeIcon /> },
                { href: '/creator/briefs', label: 'My Tasks', icon: <TasksIcon /> },
                { href: '/creator/applications', label: 'Inbox', icon: <InboxIcon /> },
                { href: '/creator/profile/edit', label: 'Profile', icon: <ProfileIcon /> },
            ]
        } else if (role === 'brand') {
            return [
                { href: '/brand/dashboard', label: 'Home', icon: <HomeIcon /> },
                { href: '/brand/creators/search', label: 'Search Creators', icon: <SearchIcon /> },
                { href: '/brand/briefs/create', label: 'Create Brief', icon: <PlusIcon /> },
                { href: '/brand/subscription', label: 'Subscription', icon: <SubscriptionIcon /> },
            ]
        } else if (role === 'admin') {
            return [
                { href: '/admin/dashboard', label: 'Home', icon: <HomeIcon /> },
                { href: '/admin/users', label: 'Users', icon: <UsersIcon /> },
                { href: '/admin/content', label: 'Content', icon: <ContentIcon /> },
                { href: '/admin/trades', label: 'Trades', icon: <TradesIcon /> },
            ]
        }
        
        return []
    }
    
    const navItems = getNavItems()
    const isActive = (href: string) => pathname === href
    
    async function handleSignOut() {
        try {
            await signOut()
            router.push('/auth/login')
        } catch (error) {
            console.error('Failed to sign out:', error)
        }
    }
    
    return (
        <aside className={`fixed left-0 top-0 h-full bg-[var(--color-bg-sidebar)] border-r border-[var(--color-border)] transition-all duration-300 z-50 ${collapsed ? 'w-20' : 'w-64'}`}>
            <div className='flex flex-col h-full'>
                {/* Logo */}
                <div className='p-6 border-b border-[var(--color-border)]'>
                    <Link href={role === 'creator' ? '/creator/dashboard' : role === 'brand' ? '/brand/dashboard' : '/admin/dashboard'} className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-[var(--color-accent-green)] rounded-lg flex items-center justify-center'>
                            <span className='text-white font-bold text-xl'>B</span>
                        </div>
                        {!collapsed && (
                            <span className='text-xl font-bold text-[var(--color-text-primary)]'>
                                Brand Influencer
                            </span>
                        )}
                    </Link>
                </div>
                
                {/* Navigation */}
                <nav className='flex-1 overflow-y-auto p-4'>
                    <div className='space-y-1'>
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                                    ${isActive(item.href)
                                        ? 'bg-[var(--color-accent-green)]/20 text-[var(--color-accent-green)]'
                                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]'
                                    }
                                `}
                            >
                                <span className='flex-shrink-0'>{item.icon}</span>
                                {!collapsed && (
                                    <span className='text-sm font-medium'>{item.label}</span>
                                )}
                            </Link>
                        ))}
                    </div>
                </nav>
                
                {/* User Section */}
                <div className='p-4 border-t border-[var(--color-border)]'>
                    <div className='flex items-center gap-3 mb-3'>
                        <Avatar
                            src={user?.user_metadata?.avatar_url}
                            alt={user?.email || 'User'}
                            size='sm'
                        />
                        {!collapsed && (
                            <div className='flex-1 min-w-0'>
                                <p className='text-sm font-medium text-[var(--color-text-primary)] truncate'>
                                    {user?.email || 'User'}
                                </p>
                                <p className='text-xs text-[var(--color-text-tertiary)] capitalize'>
                                    {role}
                                </p>
                            </div>
                        )}
                    </div>
                    {!collapsed && (
                        <button
                            onClick={handleSignOut}
                            className='w-full px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] rounded-lg transition-colors'
                        >
                            Sign Out
                        </button>
                    )}
                </div>
            </div>
        </aside>
    )
}

// Icon Components
function HomeIcon() {
    return (
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
        </svg>
    )
}

function TasksIcon() {
    return (
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' />
        </svg>
    )
}

function InboxIcon() {
    return (
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' />
        </svg>
    )
}

function ProfileIcon() {
    return (
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
        </svg>
    )
}

function SearchIcon() {
    return (
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
        </svg>
    )
}

function PlusIcon() {
    return (
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
        </svg>
    )
}

function SubscriptionIcon() {
    return (
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
        </svg>
    )
}

function UsersIcon() {
    return (
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' />
        </svg>
    )
}

function ContentIcon() {
    return (
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
        </svg>
    )
}

function TradesIcon() {
    return (
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
        </svg>
    )
}

