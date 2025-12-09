'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { Select, MultiSelect } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

interface Trade {
    id: string
    name: string
}

interface CreatorSearchFiltersProps {
    trades: Trade[]
    onSearch: (filters: any) => void
    loading?: boolean
}

export function CreatorSearchFilters({ trades, onSearch, loading = false }: CreatorSearchFiltersProps) {
    const [keyword, setKeyword] = useState('')
    const [primaryTrade, setPrimaryTrade] = useState('')
    const [platforms, setPlatforms] = useState<string[]>([])
    const [minFollowers, setMinFollowers] = useState('')
    const [maxFollowers, setMaxFollowers] = useState('')
    const [minEngagement, setMinEngagement] = useState('')
    const [maxEngagement, setMaxEngagement] = useState('')
    const [location, setLocation] = useState('')
    
    const platformOptions = [
        { value: 'instagram', label: 'Instagram' },
        { value: 'tiktok', label: 'TikTok' },
        { value: 'youtube', label: 'YouTube' },
        { value: 'facebook', label: 'Facebook' },
    ]
    
    const tradeOptions = trades.map((t) => ({ value: t.id, label: t.name }))
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch({
            keyword: keyword || undefined,
            primary_trade: primaryTrade || undefined,
            platforms: platforms.length > 0 ? platforms : undefined,
            min_followers: minFollowers ? parseInt(minFollowers, 10) : undefined,
            max_followers: maxFollowers ? parseInt(maxFollowers, 10) : undefined,
            min_engagement: minEngagement ? parseFloat(minEngagement) : undefined,
            max_engagement: maxEngagement ? parseFloat(maxEngagement) : undefined,
            location: location || undefined,
        })
    }
    
    const handleReset = () => {
        setKeyword('')
        setPrimaryTrade('')
        setPlatforms([])
        setMinFollowers('')
        setMaxFollowers('')
        setMinEngagement('')
        setMaxEngagement('')
        setLocation('')
        onSearch({})
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Search Filters</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <Input
                        label='Keyword Search'
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder='Search by name or bio...'
                        disabled={loading}
                    />
                    
                    <Select
                        label='Primary Trade'
                        value={primaryTrade}
                        onChange={(e) => setPrimaryTrade(e.target.value)}
                        options={tradeOptions}
                        placeholder='Any trade'
                        disabled={loading}
                    />
                    
                    <MultiSelect
                        label='Platforms'
                        value={platforms}
                        onChange={setPlatforms}
                        options={platformOptions}
                    />
                    
                    <div className='grid grid-cols-2 gap-4'>
                        <Input
                            label='Min Followers'
                            type='number'
                            value={minFollowers}
                            onChange={(e) => setMinFollowers(e.target.value)}
                            disabled={loading}
                            min='0'
                        />
                        
                        <Input
                            label='Max Followers'
                            type='number'
                            value={maxFollowers}
                            onChange={(e) => setMaxFollowers(e.target.value)}
                            disabled={loading}
                            min='0'
                        />
                    </div>
                    
                    <div className='grid grid-cols-2 gap-4'>
                        <Input
                            label='Min Engagement (%)'
                            type='number'
                            value={minEngagement}
                            onChange={(e) => setMinEngagement(e.target.value)}
                            disabled={loading}
                            min='0'
                            max='100'
                            step='0.1'
                        />
                        
                        <Input
                            label='Max Engagement (%)'
                            type='number'
                            value={maxEngagement}
                            onChange={(e) => setMaxEngagement(e.target.value)}
                            disabled={loading}
                            min='0'
                            max='100'
                            step='0.1'
                        />
                    </div>
                    
                    <Input
                        label='Location'
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder='City or country'
                        disabled={loading}
                    />
                    
                    <div className='flex gap-2'>
                        <Button type='submit' variant='primary' disabled={loading} className='flex-1'>
                            Search
                        </Button>
                        <Button type='button' variant='outline' onClick={handleReset} disabled={loading}>
                            Reset
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

