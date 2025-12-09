'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { deductCredit } from '@/lib/subscriptions/credits'
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
            const {
                data: { user },
            } = await supabase.auth.getUser()
            
            if (!user) return
            
            const { data: brandProfile } = await supabase
                .from('brand_profiles')
                .select('id')
                .eq('user_id', user.id)
                .single()
            
            if (!brandProfile) return
            
            const { data: subscription } = await supabase
                .from('subscriptions')
                .select('campaign_credits')
                .eq('brand_id', brandProfile.id)
                .single()
            
            setCredits(subscription?.campaign_credits || 0)
        } catch (error) {
            console.error('Failed to load credits:', error)
        } finally {
            setLoading(false)
        }
    }
    
    const handleSubmit = async (briefData: any) => {
        if (credits === null || credits <= 0) {
            alert('You need campaign credits to create a multi-creator brief. Please subscribe first.')
            return
        }
        
        setSaving(true)
        try {
            // Create the brief first
            const response = await fetch('/api/brand/briefs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(briefData),
            })
            
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to create brief')
            }
            
            // Deduct credit
            const {
                data: { user },
            } = await supabase.auth.getUser()
            
            if (!user) throw new Error('Not authenticated')
            
            const { data: brandProfile } = await supabase
                .from('brand_profiles')
                .select('id')
                .eq('user_id', user.id)
                .single()
            
            if (!brandProfile) throw new Error('Brand profile not found')
            
            const success = await deductCredit(brandProfile.id)
            if (!success) {
                throw new Error('Failed to deduct credit')
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
            <div className='min-h-screen bg-[var(--color-neutral-100)] p-4'>
                <div className='max-w-2xl mx-auto mt-8'>
                    <Card>
                        <CardHeader>
                            <CardTitle>No Campaign Credits</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <p className='text-[var(--color-neutral-700)]'>
                                You need campaign credits to create multi-creator briefs. Please subscribe to a plan first.
                            </p>
                            <Link href='/brand/subscription'>
                                <Button variant='primary' className='w-full'>
                                    View Subscription Plans
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }
    
    return (
        <div className='min-h-screen bg-[var(--color-neutral-100)] p-4'>
            <div className='max-w-3xl mx-auto mt-8'>
                <Card>
                    <CardHeader>
                        <CardTitle>Create Multi-Creator Brief</CardTitle>
                        <p className='text-sm text-[var(--color-neutral-600)] mt-2'>
                            You have {credits} campaign credit{credits !== 1 ? 's' : ''} remaining. This will use 1 credit.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <BriefForm onSubmit={handleSubmit} loading={saving} isMultiCreator={true} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

