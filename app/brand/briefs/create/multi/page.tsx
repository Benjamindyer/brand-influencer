'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { BriefForm } from '@/components/brand/BriefForm'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function CreateMultiCreatorBriefPage() {
    const router = useRouter()
    const [saving, setSaving] = useState(false)
    const [credits, setCredits] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        loadCredits()
    }, [])
    
    async function loadCredits() {
        try {
            const response = await fetch('/api/brand/subscription', {
                headers: { 'Accept': 'application/json' },
            })
            
            if (response.ok) {
                const data = await response.json()
                setCredits(data.credits || 0)
            } else {
                setCredits(0)
            }
        } catch (error) {
            console.error('Failed to load credits:', error)
            setCredits(0)
        } finally {
            setLoading(false)
        }
    }
    
    const handleSubmit = async (briefData: any) => {
        setSaving(true)
        try {
            // Check credits before creating
            if (!credits || credits <= 0) {
                throw new Error('No campaign credits available')
            }
            
            const response = await fetch('/api/brand/briefs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    ...briefData,
                    type: 'multi_creator',
                }),
            })
            
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to create brief')
            }
            
            router.push('/brand/dashboard')
        } catch (error) {
            throw error
        } finally {
            setSaving(false)
        }
    }
    
    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <p>Loading...</p>
            </div>
        )
    }
    
    if (credits === null || credits <= 0) {
        return (
            <div className='min-h-screen bg-transparent p-4'>
                <div className='max-w-2xl mx-auto mt-8'>
                    <Card>
                        <CardHeader>
                            <CardTitle>No Campaign Credits</CardTitle>
                        </CardHeader>
                        <CardContent className='text-center py-8'>
                            <p className='text-[var(--color-text-secondary)] mb-4'>
                                You need campaign credits to create multi-creator briefs.
                            </p>
                            <Link href='/brand/subscription'>
                                <Button variant='primary'>
                                    View Subscription Options
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }
    
    return (
        <div className='min-h-screen bg-transparent p-4'>
            <div className='max-w-2xl mx-auto mt-8'>
                <Card className='mb-4'>
                    <CardContent className='py-4'>
                        <div className='flex items-center justify-between'>
                            <span className='text-[var(--color-text-secondary)]'>
                                Campaign Credits Available:
                            </span>
                            <span className='font-bold text-[var(--color-primary-600)]'>
                                {credits}
                            </span>
                        </div>
                        <p className='text-sm text-[var(--color-text-tertiary)] mt-2'>
                            Creating this brief will use 1 campaign credit.
                        </p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Create Multi-Creator Brief</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BriefForm
                            onSubmit={handleSubmit}
                            loading={saving}
                            isMultiCreator={true}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
