'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type ViewRole = 'admin' | 'brand' | 'creator'

interface RoleSwitcherProps {
    onRoleChange?: (role: ViewRole) => void
}

export function RoleSwitcher({ onRoleChange }: RoleSwitcherProps) {
    const router = useRouter()
    const [viewingAs, setViewingAs] = useState<ViewRole>('admin')
    
    useEffect(() => {
        // Load saved preference
        const saved = localStorage.getItem('admin_viewing_as') as ViewRole
        if (saved && ['admin', 'brand', 'creator'].includes(saved)) {
            setViewingAs(saved)
        }
    }, [])
    
    const handleChange = (role: ViewRole) => {
        setViewingAs(role)
        localStorage.setItem('admin_viewing_as', role)
        onRoleChange?.(role)
        
        // Navigate to the appropriate dashboard
        if (role === 'admin') {
            router.push('/admin/dashboard')
        } else if (role === 'brand') {
            router.push('/brand/dashboard')
        } else if (role === 'creator') {
            router.push('/creator/dashboard')
        }
    }
    
    const roles: { value: ViewRole; label: string; icon: string }[] = [
        { value: 'admin', label: 'Admin', icon: '🛡️' },
        { value: 'brand', label: 'Brand', icon: '🏢' },
        { value: 'creator', label: 'Creator', icon: '👷' },
    ]
    
    return (
        <div className='flex items-center gap-2 px-3 py-2 bg-[var(--color-primary-50)] rounded-lg border border-[var(--color-primary-200)]'>
            <span className='text-xs font-medium text-[var(--color-primary-700)]'>View as:</span>
            <div className='flex gap-1'>
                {roles.map((role) => (
                    <button
                        key={role.value}
                        onClick={() => handleChange(role.value)}
                        className={`
                            px-2 py-1 text-xs font-medium rounded transition-colors
                            ${viewingAs === role.value
                                ? 'bg-[var(--color-primary-600)] text-white'
                                : 'bg-white text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)]'
                            }
                        `}
                        title={`View as ${role.label}`}
                    >
                        <span className='mr-1'>{role.icon}</span>
                        {role.label}
                    </button>
                ))}
            </div>
        </div>
    )
}
