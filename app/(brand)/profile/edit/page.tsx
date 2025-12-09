'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getBrandProfile } from '@/lib/supabase/queries/brand'
import { BrandProfileForm } from '@/components/brand/ProfileForm'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { supabase } from '@/lib/supabase/client'
import type { BrandProfile } from '@/types/brand'

export default function EditBrandProfilePage() {
    const router = useRouter()
    const [profile, setProfile] = useState<BrandProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    
    useEffect(() => {
        async function loadProfile() {
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser()
                
                if (!user) {
                    router.push('/login')
                    return
                }
                
                const profileData = await getBrandProfile(user.id)
                setProfile(profileData)
            } catch (error) {
                console.error('Failed to load profile:', error)
            } finally {
                setLoading(false)
            }
        }
        
        loadProfile()
    }, [router])
    
    const handleSubmit = async (profileData: any) => {
        setSaving(true)
        try {
            const response = await fetch('/api/brand/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
            })
            
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to update profile')
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
    
    if (!profile) {
        router.push('/brand/profile/create')
        return null
    }
    
    return (
        <div className='min-h-screen bg-[var(--color-neutral-100)] p-4'>
            <div className='max-w-2xl mx-auto mt-8'>
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Your Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BrandProfileForm initialData={profile} onSubmit={handleSubmit} loading={saving} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

