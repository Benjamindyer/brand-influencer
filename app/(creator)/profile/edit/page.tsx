'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { getCreatorProfile } from '@/lib/supabase/queries/creator'
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
                const {
                    data: { user },
                } = await supabase.auth.getUser()
                
                if (!user) {
                    router.push('/login')
                    return
                }
                
                const [profileData, tradesData] = await Promise.all([
                    getCreatorProfile(user.id),
                    supabase.from('trades').select('*').order('name'),
                ])
                
                if (tradesData.error) throw tradesData.error
                
                setProfile(profileData)
                setTrades(tradesData.data || [])
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
        router.push('/creator/profile/create')
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

