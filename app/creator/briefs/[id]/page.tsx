'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function BriefDetailPage() {
    const params = useParams()
    const router = useRouter()
    const briefId = params.id as string
    const [brief, setBrief] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        loadBrief()
    }, [briefId])
    
    async function loadBrief() {
        try {
            const response = await fetch(`/api/creator/briefs/${briefId}`, {
                headers: { 'Accept': 'application/json' },
            })
            
            if (response.ok) {
                const data = await response.json()
                setBrief(data)
            }
        } catch (error) {
            console.error('Failed to load brief:', error)
        } finally {
            setLoading(false)
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
                    <CardContent className='space-y-6'>
                        <div>
                            <h3 className='font-medium mb-2'>Brand</h3>
                            <p className='text-[var(--color-text-secondary)]'>
                                {brief.brand?.company_name}
                            </p>
                        </div>
                        
                        <div>
                            <h3 className='font-medium mb-2'>Description</h3>
                            <p className='text-[var(--color-text-secondary)]'>{brief.description}</p>
                        </div>
                        
                        {brief.deliverables && (
                            <div>
                                <h3 className='font-medium mb-2'>Deliverables</h3>
                                <p className='text-[var(--color-text-secondary)]'>{brief.deliverables}</p>
                            </div>
                        )}
                        
                        <div className='grid grid-cols-2 gap-4'>
                            {brief.compensation_type && (
                                <div>
                                    <h3 className='font-medium mb-2'>Compensation</h3>
                                    <p className='text-[var(--color-text-secondary)]'>
                                        {brief.compensation_type}
                                        {brief.fee_amount && ` - $${brief.fee_amount}`}
                                    </p>
                                </div>
                            )}
                            
                            {brief.timeline && (
                                <div>
                                    <h3 className='font-medium mb-2'>Timeline</h3>
                                    <p className='text-[var(--color-text-secondary)]'>{brief.timeline}</p>
                                </div>
                            )}
                        </div>
                        
                        {brief.deadline && (
                            <div>
                                <h3 className='font-medium mb-2'>Application Deadline</h3>
                                <p className='text-[var(--color-text-secondary)]'>
                                    {new Date(brief.deadline).toLocaleDateString()}
                                </p>
                            </div>
                        )}
                        
                        <div className='flex gap-2 pt-4'>
                            <Link href={`/creator/briefs/${brief.id}/apply`}>
                                <Button variant='primary'>Apply Now</Button>
                            </Link>
                            <Link href='/creator/briefs'>
                                <Button variant='outline'>Back to Briefs</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
