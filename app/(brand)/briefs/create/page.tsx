'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { BriefForm } from '@/components/brand/BriefForm'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export default function CreateBriefPage() {
    const router = useRouter()
    const [saving, setSaving] = useState(false)
    
    const handleSubmit = async (briefData: any) => {
        setSaving(true)
        try {
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
            
            router.push('/brand/dashboard')
        } catch (error) {
            throw error
        } finally {
            setSaving(false)
        }
    }
    
    return (
        <div className='min-h-screen bg-[var(--color-neutral-100)] p-4'>
            <div className='max-w-3xl mx-auto mt-8'>
                <Card>
                    <CardHeader>
                        <CardTitle>Create Brief</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BriefForm onSubmit={handleSubmit} loading={saving} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

