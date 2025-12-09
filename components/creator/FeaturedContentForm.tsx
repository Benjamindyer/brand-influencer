'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { FeaturedContent } from '@/types/creator'

interface FeaturedContentFormProps {
    initialData?: FeaturedContent | null
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

export function FeaturedContentForm({
    initialData,
    onSubmit,
    onCancel,
    loading = false,
}: FeaturedContentFormProps) {
    const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnail_url || '')
    const [postUrl, setPostUrl] = useState(initialData?.post_url || '')
    const [platform, setPlatform] = useState(initialData?.platform || '')
    const [likes, setLikes] = useState(initialData?.likes?.toString() || '')
    const [views, setViews] = useState(initialData?.views?.toString() || '')
    const [error, setError] = useState<string | null>(null)
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        
        if (!thumbnailUrl || !postUrl || !platform) {
            setError('Thumbnail URL, Post URL, and Platform are required')
            return
        }
        
        try {
            await onSubmit({
                id: initialData?.id,
                thumbnail_url: thumbnailUrl,
                post_url: postUrl,
                platform,
                likes: likes ? parseInt(likes, 10) : null,
                views: views ? parseInt(views, 10) : null,
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save content')
        }
    }
    
    return (
        <form onSubmit={handleSubmit} className='space-y-4'>
            <Input
                label='Thumbnail Image URL *'
                type='url'
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                required
                disabled={loading}
                placeholder='https://...'
            />
            
            <Input
                label='Post URL *'
                type='url'
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
                required
                disabled={loading}
                placeholder='https://...'
            />
            
            <Select
                label='Platform *'
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                options={platforms}
                placeholder='Select platform'
                required
                disabled={loading}
            />
            
            <div className='grid grid-cols-2 gap-4'>
                <Input
                    label='Likes (optional)'
                    type='number'
                    value={likes}
                    onChange={(e) => setLikes(e.target.value)}
                    disabled={loading}
                    min='0'
                />
                
                <Input
                    label='Views (optional)'
                    type='number'
                    value={views}
                    onChange={(e) => setViews(e.target.value)}
                    disabled={loading}
                    min='0'
                />
            </div>
            
            {error && (
                <div className='p-3 bg-[var(--color-error-100)] text-[var(--color-error-800)] rounded-md text-sm'>
                    {error}
                </div>
            )}
            
            <div className='flex gap-2'>
                <Button type='submit' variant='primary' disabled={loading} className='flex-1'>
                    {loading ? 'Saving...' : initialData ? 'Update' : 'Add Content'}
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

