'use client'

import { useState, useEffect } from 'react'
import { CreatorSearchFilters } from '@/components/brand/CreatorSearchFilters'
import { CreatorSearchResults } from '@/components/brand/CreatorSearchResults'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'

interface Trade {
    id: string
    name: string
}

export default function CreatorSearchPage() {
    const [trades, setTrades] = useState<Trade[]>([])
    const [creators, setCreators] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searching, setSearching] = useState(false)
    
    useEffect(() => {
        async function loadTrades() {
            try {
                const response = await fetch('/api/trades', {
                    headers: { 'Accept': 'application/json' },
                })
                
                if (response.ok) {
                    const data = await response.json()
                    setTrades(Array.isArray(data) ? data : [])
                }
            } catch (error) {
                console.error('Failed to load trades:', error)
            } finally {
                setLoading(false)
            }
        }
        
        loadTrades()
    }, [])
    
    async function handleSearch(filters: any) {
        setSearching(true)
        try {
            const params = new URLSearchParams()
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    if (Array.isArray(value)) {
                        params.set(key, value.join(','))
                    } else {
                        params.set(key, String(value))
                    }
                }
            })
            
            const response = await fetch(`/api/brand/creators/search?${params.toString()}`, {
                headers: { 'Accept': 'application/json' },
            })
            if (!response.ok) throw new Error('Search failed')
            
            const data = await response.json()
            setCreators(data.results || [])
        } catch (error) {
            console.error('Search failed:', error)
        } finally {
            setSearching(false)
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
                        <CardTitle>Search Creators</CardTitle>
                    </CardHeader>
                </Card>
                
                <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
                    <div className='lg:col-span-1'>
                        <CreatorSearchFilters trades={trades} onSearch={handleSearch} loading={searching} />
                    </div>
                    <div className='lg:col-span-3'>
                        <CreatorSearchResults creators={creators} loading={searching} />
                    </div>
                </div>
            </div>
        </div>
    )
}
