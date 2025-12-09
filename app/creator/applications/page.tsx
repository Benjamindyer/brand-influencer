'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all')
    
    useEffect(() => {
        loadApplications()
    }, [])
    
    async function loadApplications() {
        try {
            const response = await fetch('/api/creator/applications')
            if (!response.ok) throw new Error('Failed to load applications')
            const data = await response.json()
            setApplications(data)
        } catch (error) {
            console.error('Failed to load applications:', error)
        } finally {
            setLoading(false)
        }
    }
    
    const filteredApplications = applications.filter((app) => {
        if (filter === 'all') return true
        return app.status === filter
    })
    
    const statusColors = {
        pending: 'default',
        accepted: 'success',
        rejected: 'error',
    } as const
    
    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <p>Loading...</p>
            </div>
        )
    }
    
    return (
        <div className='min-h-screen bg-[var(--color-neutral-100)] p-4'>
            <div className='max-w-4xl mx-auto mt-8'>
                <Card className='mb-6'>
                    <CardHeader>
                        <div className='flex items-center justify-between'>
                            <CardTitle>My Applications</CardTitle>
                            <div className='flex gap-2'>
                                {(['all', 'pending', 'accepted', 'rejected'] as const).map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-3 py-1 rounded-md text-sm ${
                                            filter === f
                                                ? 'bg-[var(--color-primary-600)] text-white'
                                                : 'bg-[var(--color-neutral-200)] text-[var(--color-neutral-700)]'
                                        }`}
                                    >
                                        {f.charAt(0).toUpperCase() + f.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardHeader>
                </Card>
                
                {filteredApplications.length === 0 ? (
                    <Card>
                        <CardContent className='text-center py-8 text-[var(--color-neutral-500)]'>
                            No applications found
                        </CardContent>
                    </Card>
                ) : (
                    <div className='space-y-4'>
                        {filteredApplications.map((app) => (
                            <Card key={app.id}>
                                <CardContent className='p-6'>
                                    <div className='flex items-start justify-between mb-4'>
                                        <div className='flex-1'>
                                            <div className='flex items-center gap-2 mb-2'>
                                                <h3 className='text-xl font-semibold'>
                                                    {app.brief?.title}
                                                </h3>
                                                <Badge variant={statusColors[app.status as keyof typeof statusColors]}>
                                                    {app.status}
                                                </Badge>
                                            </div>
                                            {app.brief?.brand && (
                                                <p className='text-sm text-[var(--color-neutral-600)] mb-2'>
                                                    {app.brief.brand.company_name}
                                                </p>
                                            )}
                                            {app.message && (
                                                <p className='text-[var(--color-neutral-700)] mb-2'>
                                                    {app.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className='flex items-center justify-between'>
                                        <div className='text-sm text-[var(--color-neutral-600)]'>
                                            Applied: {new Date(app.created_at).toLocaleDateString()}
                                        </div>
                                        <Link href={`/creator/briefs/${app.brief_id}`}>
                                            <Button variant='outline' size='sm'>
                                                View Brief
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

