'use client'

import { useState, useEffect } from 'react'
import { BriefCard } from '@/components/creator/BriefCard'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export default function BrowseBriefsPage() {
    const [briefs, setBriefs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        loadBriefs()
    }, [])
    
    async function loadBriefs() {
        try {
            const response = await fetch('/api/creator/briefs')
            if (!response.ok) throw new Error('Failed to load briefs')
            const data = await response.json()
            setBriefs(data)
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

