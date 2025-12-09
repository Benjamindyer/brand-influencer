'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface Notification {
    id: string
    type: string
    title: string
    message: string
    read: boolean
    created_at: string
}

interface NotificationDropdownProps {
    onClose: () => void
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        loadNotifications()
    }, [])
    
    async function loadNotifications() {
        try {
            const response = await fetch('/api/notifications')
            if (!response.ok) {
                if (response.status === 401) {
                    // User not authenticated, close dropdown
                    onClose()
                }
                return
            }
            
            const data = await response.json()
            setNotifications(data)
        } catch (error) {
            console.error('Failed to load notifications:', error)
        } finally {
            setLoading(false)
        }
    }
    
    async function markAsRead(id: string) {
        try {
            await fetch('/api/notifications', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, read: true }),
            })
            
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            )
        } catch (error) {
            console.error('Failed to mark as read:', error)
        }
    }
    
    if (loading) {
        return (
            <div className='absolute right-0 mt-2 w-80 bg-[var(--color-bg-card)] rounded-lg shadow-lg border border-[var(--color-border)] p-4 z-50'>
                <p className='text-sm text-[var(--color-text-secondary)]'>Loading...</p>
            </div>
        )
    }
    
    return (
        <div className='absolute right-0 mt-2 w-80 bg-[var(--color-bg-card)] rounded-lg shadow-lg border border-[var(--color-border)] max-h-96 overflow-y-auto z-50'>
            <div className='p-4 border-b border-[var(--color-border)]'>
                <h3 className='font-semibold text-[var(--color-text-primary)]'>Notifications</h3>
            </div>
            <div className='divide-y divide-[var(--color-border)]'>
                {notifications.length === 0 ? (
                    <div className='p-4 text-center text-sm text-[var(--color-text-tertiary)]'>
                        No notifications
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-4 hover:bg-[var(--color-bg-hover)] cursor-pointer ${
                                !notification.read ? 'bg-[var(--color-primary-600)]/10' : ''
                            }`}
                            onClick={() => !notification.read && markAsRead(notification.id)}
                        >
                            <div className='flex items-start justify-between mb-1'>
                                <h4 className='font-medium text-sm text-[var(--color-text-primary)]'>{notification.title}</h4>
                                {!notification.read && (
                                    <Badge variant='info' size='sm'>New</Badge>
                                )}
                            </div>
                            <p className='text-xs text-[var(--color-text-secondary)] mb-1'>
                                {notification.message}
                            </p>
                            <p className='text-xs text-[var(--color-text-tertiary)]'>
                                {new Date(notification.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

