'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'

export default function BriefApplicationsPage() {
    const params = useParams()
    const briefId = params.id as string
    const [brief, setBrief] = useState<any>(null)
    const [applications, setApplications] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        loadData()
    }, [briefId])
    
    async function loadData() {
        try {
            const [briefData, applicationsData] = await Promise.all([
                supabase
                    .from('briefs')
                    .select('*')
                    .eq('id', briefId)
                    .single(),
                supabase
                    .from('applications')
                    .select(`
                        *,
                        creator:creator_profiles(
                            id,
                            name,
                            display_name,
                            profile_photo_url,
                            primary_trade:trades!creator_profiles_primary_trade_id_fkey(name)
                        )
                    `)
                    .eq('brief_id', briefId)
                    .order('created_at', { ascending: false }),
            ])
            
            if (briefData.error) throw briefData.error
            if (applicationsData.error) throw applicationsData.error
            
            setBrief(briefData.data)
            setApplications(applicationsData.data || [])
        } catch (error) {
            console.error('Failed to load data:', error)
        } finally {
            setLoading(false)
        }
    }
    
    async function handleStatusChange(applicationId: string, status: 'accepted' | 'rejected') {
        try {
            const response = await fetch(`/api/brand/applications/${applicationId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            })
            
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to update status')
            }
            
            await loadData()
        } catch (error) {
            alert('Failed to update application status')
            console.error(error)
        }
    }
    
    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <p>Loading...</p>
            </div>
        )
    }
    
    const pendingApplications = applications.filter((a) => a.status === 'pending')
    const acceptedApplications = applications.filter((a) => a.status === 'accepted')
    const rejectedApplications = applications.filter((a) => a.status === 'rejected')
    
    return (
        <div className='min-h-screen bg-transparent p-4'>
            <div className='max-w-4xl mx-auto mt-8 space-y-6'>
                <Card>
                    <CardHeader>
                        <CardTitle>{brief?.title}</CardTitle>
                        {brief && (
                            <div className='text-sm text-[var(--color-text-secondary)] mt-2'>
                                {brief.type === 'multi_creator' ? (
                                    <div>
                                        Slots: {brief.slots_filled} / {brief.num_creators_required}
                                    </div>
                                ) : (
                                    <div>Status: {brief.status}</div>
                                )}
                            </div>
                        )}
                    </CardHeader>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Applications ({applications.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {applications.length === 0 ? (
                            <div className='text-center py-8 text-[var(--color-text-tertiary)]'>
                                No applications yet
                            </div>
                        ) : (
                            <div className='space-y-4'>
                                {pendingApplications.length > 0 && (
                                    <div>
                                        <h3 className='font-semibold mb-3'>Pending ({pendingApplications.length})</h3>
                                        {pendingApplications.map((app) => (
                                            <ApplicationCard
                                                key={app.id}
                                                application={app}
                                                onAccept={() => handleStatusChange(app.id, 'accepted')}
                                                onReject={() => handleStatusChange(app.id, 'rejected')}
                                                canAccept={brief?.status === 'open' && (brief?.type === 'standard' || (brief?.slots_filled || 0) < brief?.num_creators_required)}
                                            />
                                        ))}
                                    </div>
                                )}
                                
                                {acceptedApplications.length > 0 && (
                                    <div>
                                        <h3 className='font-semibold mb-3'>Accepted ({acceptedApplications.length})</h3>
                                        {acceptedApplications.map((app) => (
                                            <ApplicationCard key={app.id} application={app} />
                                        ))}
                                    </div>
                                )}
                                
                                {rejectedApplications.length > 0 && (
                                    <div>
                                        <h3 className='font-semibold mb-3'>Rejected ({rejectedApplications.length})</h3>
                                        {rejectedApplications.map((app) => (
                                            <ApplicationCard key={app.id} application={app} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function ApplicationCard({
    application,
    onAccept,
    onReject,
    canAccept = false,
}: {
    application: any
    onAccept?: () => void
    onReject?: () => void
    canAccept?: boolean
}) {
    return (
        <div className='p-4 border border-[var(--color-neutral-200)] rounded-lg'>
            <div className='flex items-start gap-4 mb-4'>
                <Avatar
                    src={application.creator?.profile_photo_url}
                    alt={application.creator?.display_name || application.creator?.name}
                />
                <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                        <h4 className='font-semibold'>
                            {application.creator?.display_name || application.creator?.name}
                        </h4>
                        <Badge variant={
                            application.status === 'accepted' ? 'success' :
                            application.status === 'rejected' ? 'error' : 'default'
                        }>
                            {application.status}
                        </Badge>
                    </div>
                    {application.creator?.primary_trade && (
                        <p className='text-sm text-[var(--color-text-secondary)] mb-2'>
                            {application.creator.primary_trade.name}
                        </p>
                    )}
                    {application.message && (
                        <p className='text-[var(--color-text-secondary)] mb-2'>{application.message}</p>
                    )}
                    {application.links && application.links.length > 0 && (
                        <div className='text-sm mb-2'>
                            <span className='font-medium'>Links: </span>
                            {application.links.map((link: string, i: number) => (
                                <a
                                    key={i}
                                    href={link}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-[var(--color-primary-600)] hover:underline mr-2'
                                >
                                    {link}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {onAccept && onReject && canAccept && application.status === 'pending' && (
                <div className='flex gap-2'>
                    <Button variant='primary' size='sm' onClick={onAccept}>
                        Accept
                    </Button>
                    <Button variant='outline' size='sm' onClick={onReject}>
                        Reject
                    </Button>
                </div>
            )}
        </div>
    )
}

