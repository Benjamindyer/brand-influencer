'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { NotificationDropdown } from './NotificationDropdown'

export function NotificationBell() {
    const [count, setCount] = useState(0)
    const [showDropdown, setShowDropdown] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    
    useEffect(() => {
        checkAuth()
        
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(() => {
            checkAuth()
        })
        
        return () => {
            subscription.unsubscribe()
        }
    }, [])
    
    useEffect(() => {
        if (isAuthenticated) {
            loadUnreadCount()
            const interval = setInterval(loadUnreadCount, 30000) // Refresh every 30 seconds
            return () => clearInterval(interval)
        }
    }, [isAuthenticated])
    
    async function checkAuth() {
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            setIsAuthenticated(!!user)
        } catch (error) {
            setIsAuthenticated(false)
        }
    }
    
    async function loadUnreadCount() {
        if (!isAuthenticated) return
        
        try {
            const response = await fetch('/api/notifications')
            if (!response.ok) {
                if (response.status === 401) {
                    setIsAuthenticated(false)
                }
                return
            }
            
            const notifications = await response.json()
            const unread = notifications.filter((n: any) => !n.read).length
            setCount(unread)
        } catch (error) {
            console.error('Failed to load notifications:', error)
        }
    }
    
    if (!isAuthenticated) {
        return null
    }
    
    return (
        <div className='relative'>
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className='relative p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            >
                <svg
                    className='w-6 h-6'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                    />
                </svg>
                {count > 0 && (
                    <span className='absolute top-0 right-0 bg-[var(--color-error-600)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                        {count > 9 ? '9+' : count}
                    </span>
                )}
            </button>
            {showDropdown && (
                <NotificationDropdown onClose={() => setShowDropdown(false)} />
            )}
        </div>
    )
}

