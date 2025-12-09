'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export function CreditDisplay() {
    const [credits, setCredits] = useState<number | null>(null)
    const [tier, setTier] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        loadCredits()
    }, [])
    
    async function loadCredits() {
        try {
            const response = await fetch('/api/brand/subscription', {
                headers: { 'Accept': 'application/json' },
            })
            
            if (!response.ok) {
                setCredits(0)
                return
            }
            
            const data = await response.json()
            setCredits(data.credits || 0)
            setTier(data.tier || null)
        } catch (error) {
            console.error('Failed to load credits:', error)
            setCredits(0)
        } finally {
            setLoading(false)
        }
    }
    
    if (loading) {
        return <div className='text-sm text-[var(--color-text-secondary)]'>Loading...</div>
    }
    
    return (
        <div className='flex items-center gap-4'>
            <div>
                <span className='text-sm text-[var(--color-text-secondary)] mr-2'>Campaign Credits:</span>
                <Badge variant={credits && credits > 0 ? 'success' : 'error'}>
                    {credits || 0}
                </Badge>
            </div>
            {tier && (
                <div>
                    <span className='text-sm text-[var(--color-text-secondary)] mr-2'>Tier:</span>
                    <Badge variant='info'>{tier}</Badge>
                </div>
            )}
            {(!credits || credits === 0) && (
                <Link href='/brand/subscription'>
                    <Button variant='primary' size='sm'>
                        Subscribe
                    </Button>
                </Link>
            )}
        </div>
    )
}
