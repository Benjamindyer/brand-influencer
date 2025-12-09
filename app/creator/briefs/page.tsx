'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BriefCard } from '@/components/creator/BriefCard'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function BrowseBriefsPage() {
    const router = useRouter()
    const [briefs, setBriefs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [needsProfile, setNeedsProfile] = useState(false)
    
    useEffect(() => {
        loadBriefs()
    }, [])
    
    async function loadBriefs() {
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
            
            const response = await fetch('/api/creator/briefs', {
                headers: { 'Accept': 'application/json' },
            })
            
            if (!response.ok) {
                if (response.status === 404) {
                    // Creator profile doesn't exist yet
                    setNeedsProfile(true)
                    return
                }
                if (response.status === 401) {
                    router.push('/auth/login')
                    return
                }
                throw new Error('Failed to load briefs')
            }
            
            const data = await response.json()
            setBriefs(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Failed to load briefs:', error)
        } finally {
            setLoading(false)
        }
    }
    
    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <p>Loading...</p>
            </div>
        )
    }
    
    if (needsProfile) {
        return (
            <div className='min-h-screen bg-transparent p-4'>
                <div className='max-w-2xl mx-auto mt-8'>
                    <Card>
                        <CardContent className='text-center py-8'>
                            <p className='mb-4 text-[var(--color-text-secondary)]'>
                                You need to create your profile before you can browse briefs.
                            </p>
                            <Link href='/creator/profile/create'>
                                <Button variant='primary'>Create Profile</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }
    
    return (
        <div className='min-h-screen bg-transparent p-4'>
            <div className='max-w-6xl mx-auto mt-8'>
                <Card className='mb-6'>
                    <CardHeader>
                        <CardTitle>Available Briefs</CardTitle>
                    </CardHeader>
                </Card>
                
                {briefs.length === 0 ? (
                    <Card>
                        <CardContent className='text-center py-8 text-[var(--color-text-tertiary)]'>
                            No briefs available at the moment. Check back later!
                        </CardContent>
                    </Card>
                ) : (
                    <div className='space-y-4'>
                        {briefs.map((brief) => (
                            <BriefCard key={brief.id} brief={brief} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
