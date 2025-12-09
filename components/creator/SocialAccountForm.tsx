'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { SocialAccount } from '@/types/creator'

interface SocialAccountFormProps {
    initialData?: SocialAccount | null
    onSubmit: (data: any) => Promise<void>
    onCancel?: () => void
    loading?: boolean
}

const platforms = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'other', label: 'Other' },
]

export function SocialAccountForm({
    initialData,
    onSubmit,
    onCancel,
    loading = false,
}: SocialAccountFormProps) {
    const [platform, setPlatform] = useState(initialData?.platform || '')
    const [url, setUrl] = useState(initialData?.url || '')
    const [followerCount, setFollowerCount] = useState(initialData?.follower_count?.toString() || '')
    const [engagementRate, setEngagementRate] = useState(initialData?.engagement_rate?.toString() || '')
    const [averageReach, setAverageReach] = useState(initialData?.average_reach?.toString() || '')
    const [error, setError] = useState<string | null>(null)
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        
        if (!platform || !url) {
            setError('Platform and URL are required')
            return
        }
        
        try {
            await onSubmit({
                id: initialData?.id,
                platform,
                url,
                follower_count: followerCount ? parseInt(followerCount, 10) : 0,
                engagement_rate: engagementRate ? parseFloat(engagementRate) : 0,
                average_reach: averageReach ? parseInt(averageReach, 10) : 0,
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save account')
        }
    }
    
    return (
        <form onSubmit={handleSubmit} className='space-y-4'>
            <Select
                label='Platform *'
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                options={platforms}
                placeholder='Select platform'
                required
                disabled={loading}
            />
            
            <Input
                label='URL *'
                type='url'
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                disabled={loading}
                placeholder='https://...'
            />
            
            <Input
                label='Follower Count'
                type='number'
                value={followerCount}
                onChange={(e) => setFollowerCount(e.target.value)}
                disabled={loading}
                min='0'
            />
            
            <Input
                label='Engagement Rate (%)'
                type='number'
                value={engagementRate}
                onChange={(e) => setEngagementRate(e.target.value)}
                disabled={loading}
                min='0'
                max='100'
                step='0.01'
            />
            
            <Input
                label='Average Reach'
                type='number'
                value={averageReach}
                onChange={(e) => setAverageReach(e.target.value)}
                disabled={loading}
                min='0'
            />
            
            {error && (
                <div className='p-3 bg-[var(--color-error-100)] text-[var(--color-error-800)] rounded-md text-sm'>
                    {error}
                </div>
            )}
            
            <div className='flex gap-2'>
                <Button type='submit' variant='primary' disabled={loading} className='flex-1'>
                    {loading ? 'Saving...' : initialData ? 'Update' : 'Add Account'}
                </Button>
                {onCancel && (
                    <Button type='button' variant='outline' onClick={onCancel} disabled={loading}>
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    )
}

