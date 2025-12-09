'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { ProfileForm } from '@/components/creator/ProfileForm'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

interface Trade {
    id: string
    name: string
    slug: string
}

export default function CreateProfilePage() {
    const router = useRouter()
    const [trades, setTrades] = useState<Trade[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    
    useEffect(() => {
        async function loadTrades() {
            try {
                const { data, error } = await supabase
                    .from('trades')
                    .select('*')
                    .order('name')
                
                if (error) throw error
                setTrades(data || [])
            } catch (error) {
                console.error('Failed to load trades:', error)
            } finally {
                setLoading(false)
            }
        }
        
        loadTrades()
    }, [])
    
    const handleSubmit = async (profileData: any) => {
        setSaving(true)
        try {
            const response = await fetch('/api/creator/profile', {
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
    
    return (
        <div className='min-h-screen bg-[var(--color-neutral-100)] p-4'>
            <div className='max-w-2xl mx-auto mt-8'>
                <Card>
                    <CardHeader>
                        <CardTitle>Create Your Creator Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ProfileForm
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

