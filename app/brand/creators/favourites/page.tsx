'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CreatorCard } from '@/components/brand/CreatorCard'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export default function FavouritesPage() {
    const router = useRouter()
    const [creators, setCreators] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        loadFavourites()
    }, [])
    
    async function loadFavourites() {
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
            
            const response = await fetch('/api/brand/favourites', {
                headers: { 'Accept': 'application/json' },
            })
            
            if (response.ok) {
                const data = await response.json()
                setCreators(data.creators || [])
            }
        } catch (error) {
            console.error('Failed to load favourites:', error)
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
    
    return (
        <div className='min-h-screen bg-transparent p-4'>
            <div className='max-w-7xl mx-auto mt-8'>
                <Card className='mb-6'>
                    <CardHeader>
                        <CardTitle>Favourite Creators</CardTitle>
                    </CardHeader>
                </Card>
                
                {creators.length === 0 ? (
                    <Card>
                        <CardContent className='text-center py-8 text-[var(--color-text-tertiary)]'>
                            No favourite creators yet. Start searching and add creators to your favourites!
                        </CardContent>
                    </Card>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {creators.map((creator) => (
                            <CreatorCard key={creator.id} creator={creator} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
