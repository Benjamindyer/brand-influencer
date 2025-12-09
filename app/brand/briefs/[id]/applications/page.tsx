'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'

export default function BriefApplicationsPage() {
    const params = useParams()
    const router = useRouter()
    const briefId = params.id as string
    const [brief, setBrief] = useState<any>(null)
    const [applications, setApplications] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        loadData()
    }, [briefId])
    
    async function loadData() {
        try {
            // Check auth first
            const authResponse = await fetch('/api/auth/status', {
                headers: { 'Accept': 'application/json' },
            })
            
            if (!authResponse.ok) {
                router.push('/auth/login')
                return
            }
            
            const authData = await authResponse.json()
            if (!authData.authenticated) {
                router.push('/auth/login')
                return
            }
            
            const response = await fetch(`/api/brand/briefs/${briefId}/applications`, {
                headers: { 'Accept': 'application/json' },
            })
            
            if (response.ok) {
                const data = await response.json()
                setBrief(data.brief)
                setApplications(data.applications || [])
            }
        } catch (error) {
            console.error('Failed to load data:', error)
        } finally {
            setLoading(false)
        }
    }
    
    async function handleApplicationAction(applicationId: string, action: 'accepted' | 'rejected') {
        try {
            const response = await fetch(`/api/brand/applications/${applicationId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ status: action }),
            })
            
            if (!response.ok) {
                throw new Error('Failed to update application')
            }
            
            // Update local state
            setApplications((prev) =>
                prev.map((app) =>
                    app.id === applicationId ? { ...app, status: action } : app
                )
            )
        } catch (error) {
            console.error('Failed to update application:', error)
        }
    }
    
    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <p>Loading...</p>
            </div>
        )
    }
    
    if (!brief) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <p>Brief not found</p>
            </div>
        )
    }
    
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant='warning'>Pending</Badge>
            case 'accepted':
                return <Badge variant='success'>Accepted</Badge>
            case 'rejected':
                return <Badge variant='error'>Rejected</Badge>
            default:
                return <Badge>{status}</Badge>
        }
    }
    
    return (
        <div className='min-h-screen bg-transparent p-4'>
            <div className='max-w-4xl mx-auto mt-8 space-y-6'>
                <Card>
                    <CardHeader>
                        <div className='flex items-center justify-between'>
                            <CardTitle>{brief.title}</CardTitle>
                            <Badge variant={brief.status === 'open' ? 'success' : 'info'}>
                                {brief.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className='text-[var(--color-text-secondary)]'>{brief.description}</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Applications ({applications.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {applications.length === 0 ? (
                            <p className='text-[var(--color-text-tertiary)] text-center py-8'>
                                No applications yet
                            </p>
                        ) : (
                            <div className='space-y-4'>
                                {applications.map((app) => (
                                    <div
                                        key={app.id}
                                        className='p-4 border border-[var(--color-neutral-200)] rounded-lg'
                                    >
                                        <div className='flex items-start justify-between'>
                                            <div className='flex items-center gap-4'>
                                                <Avatar
                                                    src={app.creator?.profile_photo_url}
                                                    alt={app.creator?.display_name || app.creator?.name}
                                                    size='md'
                                                />
                                                <div>
                                                    <div className='font-medium'>
                                                        {app.creator?.display_name || app.creator?.name}
                                                    </div>
                                                    {app.creator?.primary_trade?.name && (
                                                        <div className='text-sm text-[var(--color-text-secondary)]'>
                                                            {app.creator.primary_trade.name}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {getStatusBadge(app.status)}
                                        </div>
                                        
                                        {app.message && (
                                            <p className='mt-3 text-sm text-[var(--color-text-secondary)]'>
                                                {app.message}
                                            </p>
                                        )}
                                        
                                        {app.status === 'pending' && (
                                            <div className='mt-4 flex gap-2'>
                                                <Button
                                                    variant='primary'
                                                    size='sm'
                                                    onClick={() => handleApplicationAction(app.id, 'accepted')}
                                                >
                                                    Accept
                                                </Button>
                                                <Button
                                                    variant='outline'
                                                    size='sm'
                                                    onClick={() => handleApplicationAction(app.id, 'rejected')}
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
