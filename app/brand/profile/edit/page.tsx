'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BrandProfileForm } from '@/components/brand/ProfileForm'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import type { BrandProfile } from '@/types/brand'

export default function EditBrandProfilePage() {
    const router = useRouter()
    const [profile, setProfile] = useState<BrandProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    
    useEffect(() => {
        async function loadProfile() {
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
                
                // Get profile via API route
                const profileResponse = await fetch('/api/brand/profile', {
                    headers: { 'Accept': 'application/json' },
                })
                
                if (profileResponse.ok) {
                    const profileData = await profileResponse.json()
                    setProfile(profileData)
                } else if (profileResponse.status === 404) {
                    router.push('/brand/profile/create')
                    return
                }
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
                    'Accept': 'application/json',
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
        return null
    }
    
    return (
        <div className='min-h-screen bg-transparent p-4'>
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
