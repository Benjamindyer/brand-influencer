'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Input'
import { Select, MultiSelect } from '@/components/ui/Select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import type { CreatorProfileWithTrades } from '@/types/creator'

interface Trade {
    id: string
    name: string
    slug: string
}

interface ProfileFormProps {
    initialData?: CreatorProfileWithTrades | null
    trades: Trade[]
    onSubmit: (data: any) => Promise<void>
    loading?: boolean
}

export function ProfileForm({ initialData, trades, onSubmit, loading = false }: ProfileFormProps) {
    const [name, setName] = useState(initialData?.name || '')
    const [displayName, setDisplayName] = useState(initialData?.display_name || '')
    const [locationCity, setLocationCity] = useState(initialData?.location_city || '')
    const [locationCountry, setLocationCountry] = useState(initialData?.location_country || '')
    const [bio, setBio] = useState(initialData?.bio || '')
    const [primaryTradeId, setPrimaryTradeId] = useState(initialData?.primary_trade_id || '')
    const [additionalTrades, setAdditionalTrades] = useState<string[]>(
        initialData?.additional_trades?.map((t) => t.id) || []
    )
    const [error, setError] = useState<string | null>(null)
    
    const tradeOptions = trades.map((trade) => ({
        value: trade.id,
        label: trade.name,
    }))
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        
        if (!name.trim()) {
            setError('Name is required')
            return
        }
        
        if (!primaryTradeId) {
            setError('Primary trade is required')
            return
        }
        
        try {
            await onSubmit({
                name: name.trim(),
                display_name: displayName.trim() || null,
                location_city: locationCity.trim() || null,
                location_country: locationCountry.trim() || null,
                bio: bio.trim() || null,
                primary_trade_id: primaryTradeId,
                additional_trades: additionalTrades,
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save profile')
        }
    }
    
    return (
        <form onSubmit={handleSubmit} className='space-y-4'>
            <Input
                label='Name *'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
            />
            
            <Input
                label='Display Name'
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={loading}
                helperText='Optional public display name'
            />
            
            <div className='grid grid-cols-2 gap-4'>
                <Input
                    label='City'
                    value={locationCity}
                    onChange={(e) => setLocationCity(e.target.value)}
                    disabled={loading}
                />
                
                <Input
                    label='Country'
                    value={locationCountry}
                    onChange={(e) => setLocationCountry(e.target.value)}
                    disabled={loading}
                />
            </div>
            
            <Select
                label='Primary Trade *'
                value={primaryTradeId}
                onChange={(e) => setPrimaryTradeId(e.target.value)}
                options={tradeOptions}
                placeholder='Select primary trade'
                required
                disabled={loading}
            />
            
            <MultiSelect
                label='Additional Trades'
                value={additionalTrades}
                onChange={setAdditionalTrades}
                options={tradeOptions.filter((t) => t.value !== primaryTradeId)}
                helperText='Select any additional trades you work in'
            />
            
            <Textarea
                label='Bio'
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={loading}
                rows={4}
                helperText='Tell brands about yourself and your work'
            />
            
            {error && (
                <div className='p-3 bg-[var(--color-error-100)] text-[var(--color-error-800)] rounded-md text-sm'>
                    {error}
                </div>
            )}
            
            <Button type='submit' variant='primary' disabled={loading} className='w-full'>
                {loading ? 'Saving...' : initialData ? 'Update Profile' : 'Create Profile'}
            </Button>
        </form>
    )
}

