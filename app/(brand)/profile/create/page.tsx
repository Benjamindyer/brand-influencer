'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BrandProfileForm } from '@/components/brand/ProfileForm'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export default function CreateBrandProfilePage() {
    const router = useRouter()
    const [saving, setSaving] = useState(false)
    
    const handleSubmit = async (profileData: any) => {
        setSaving(true)
        try {
            const response = await fetch('/api/brand/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
            })
            
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to create profile')
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
            <div className='max-w-2xl mx-auto mt-8'>
                <Card>
                    <CardHeader>
                        <CardTitle>Create Your Brand Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BrandProfileForm onSubmit={handleSubmit} loading={saving} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

