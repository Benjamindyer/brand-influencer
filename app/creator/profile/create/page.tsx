'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
                
                // Load trades via API route
                const tradesResponse = await fetch('/api/trades', {
                    headers: { 'Accept': 'application/json' },
                })
                
                if (tradesResponse.ok) {
                    const tradesData = await tradesResponse.json()
                    setTrades(Array.isArray(tradesData) ? tradesData : [])
                }
            } catch (error) {
                console.error('Failed to load trades:', error)
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
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
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
        <div className='min-h-screen bg-transparent p-4'>
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
