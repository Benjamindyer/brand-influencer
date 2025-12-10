'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { ApplicationForm } from '@/components/creator/ApplicationForm'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export default function ApplyToBriefPage() {
    const params = useParams()
    const router = useRouter()
    const briefId = params.id as string
    const [brief, setBrief] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    
    useEffect(() => {
        loadBrief()
    }, [briefId])
    
    async function loadBrief() {
        try {
            const { data, error } = await supabase
                .from('briefs')
                .select('*, brand:brand_profiles(company_name)')
                .eq('id', briefId)
                .single()
            
            if (error) throw error
            setBrief(data)
        } catch (error) {
            console.error('Failed to load brief:', error)
        } finally {
            setLoading(false)
        }
    }
    
    async function handleSubmit(applicationData: any) {
        setSaving(true)
        try {
            const response = await fetch('/api/creator/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(applicationData),
            })
            
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to submit application')
            }
            
            router.push('/creator/applications')
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
    
    if (!brief) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <p>Brief not found</p>
            </div>
        )
    }
    
    return (
        <div className='min-h-screen bg-transparent p-4'>
            <div className='max-w-2xl mx-auto mt-8 space-y-6'>
                <Card>
                    <CardHeader>
                        <CardTitle>Apply to: {brief.title}</CardTitle>
                        {brief.brand && (
                            <p className='text-[var(--color-text-secondary)]'>
                                {brief.brand.company_name}
                            </p>
                        )}
                    </CardHeader>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Your Application</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ApplicationForm briefId={briefId} onSubmit={handleSubmit} loading={saving} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

