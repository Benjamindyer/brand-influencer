'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProfileForm } from '@/components/creator/ProfileForm'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import type { CreatorProfileWithTrades } from '@/types/creator'

interface Trade {
    id: string
    name: string
    slug: string
}

export default function EditProfilePage() {
    const router = useRouter()
    const [profile, setProfile] = useState<CreatorProfileWithTrades | null>(null)
    const [trades, setTrades] = useState<Trade[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    
    useEffect(() => {
        async function loadData() {
            try {
                // Check auth via API route to avoid CORS
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
                
                // Fetch profile and trades via API routes
                const [profileResponse, tradesResponse] = await Promise.all([
                    fetch('/api/creator/profile', {
                        headers: { 'Accept': 'application/json' },
                    }),
                    fetch('/api/trades', {
                        headers: { 'Accept': 'application/json' },
                    }),
                ])
                
                // Handle trades
                if (tradesResponse.ok) {
                    const tradesData = await tradesResponse.json()
                    setTrades(Array.isArray(tradesData) ? tradesData : [])
                }
                
                // Handle profile
                if (profileResponse.ok) {
                    const profileData = await profileResponse.json()
                    setProfile(profileData)
                } else if (profileResponse.status === 404) {
                    // Profile doesn't exist, redirect to create
                    router.push('/creator/profile/create')
                    return
                } else if (profileResponse.status === 401) {
                    router.push('/auth/login')
                    return
                }
            } catch (error) {
                console.error('Failed to load data:', error)
            } finally {
                setLoading(false)
            }
        }
        
        loadData()
    }, [router])
    
    const handleSubmit = async (profileData: any) => {
        setSaving(true)
        try {
            const response = await fetch('/api/creator/profile', {
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
            
            router.push('/creator/dashboard')
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
                        <ProfileForm
                            initialData={profile}
                            trades={trades}
                            onSubmit={handleSubmit}
                            loading={saving}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
