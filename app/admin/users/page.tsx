'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    
    useEffect(() => {
        loadUsers()
    }, [])
    
    async function loadUsers() {
        try {
            const response = await fetch('/api/admin/users')
            if (!response.ok) throw new Error('Failed to load users')
            const data = await response.json()
            setUsers(data)
        } catch (error) {
            console.error('Failed to load users:', error)
        } finally {
            setLoading(false)
        }
    }
    
    async function handleUserAction(userId: string, action: 'suspend' | 'ban' | 'reactivate') {
        if (!confirm(`Are you sure you want to ${action} this user?`)) return
        
        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action }),
            })
            
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to update user')
            }
            
            await loadUsers()
        } catch (error) {
            alert('Failed to update user')
            console.error(error)
        }
    }
    
    const filteredUsers = users.filter((user) => {
        if (!searchTerm) return true
        const search = searchTerm.toLowerCase()
        return (
            user.creator?.name?.toLowerCase().includes(search) ||
            user.brand?.company_name?.toLowerCase().includes(search) ||
            user.role?.toLowerCase().includes(search)
        )
    })
    
    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <p>Loading...</p>
            </div>
        )
    }
    
    return (
        <div className='min-h-screen bg-[var(--color-neutral-100)] p-4'>
            <div className='max-w-7xl mx-auto mt-8 space-y-6'>
                <Card>
                    <CardHeader>
                        <div className='flex items-center justify-between'>
                            <CardTitle>User Management</CardTitle>
                            <Input
                                placeholder='Search users...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='w-64'
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className='overflow-x-auto'>
                            <table className='w-full'>
                                <thead>
                                    <tr className='border-b border-[var(--color-neutral-200)]'>
                                        <th className='text-left p-2'>User</th>
                                        <th className='text-left p-2'>Role</th>
                                        <th className='text-left p-2'>Profile</th>
                                        <th className='text-left p-2'>Status</th>
                                        <th className='text-left p-2'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className='border-b border-[var(--color-neutral-200)]'>
                                            <td className='p-2'>
                                                {user.creator?.name || user.brand?.company_name || 'N/A'}
                                            </td>
                                            <td className='p-2'>
                                                <Badge variant='info'>{user.role}</Badge>
                                            </td>
                                            <td className='p-2'>
                                                {user.creator ? 'Creator' : user.brand ? 'Brand' : 'None'}
                                            </td>
                                            <td className='p-2'>
                                                <Badge variant='default'>Active</Badge>
                                            </td>
                                            <td className='p-2'>
                                                <div className='flex gap-2'>
                                                    <Button
                                                        variant='outline'
                                                        size='sm'
                                                        onClick={() => handleUserAction(user.id, 'suspend')}
                                                    >
                                                        Suspend
                                                    </Button>
                                                    <Button
                                                        variant='outline'
                                                        size='sm'
                                                        onClick={() => handleUserAction(user.id, 'ban')}
                                                    >
                                                        Ban
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

