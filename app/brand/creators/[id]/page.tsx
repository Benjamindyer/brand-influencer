'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Image from 'next/image'
import { PortfolioMedia } from '@/types/media'

export default function CreatorProfileViewPage() {
    const params = useParams()
    const creatorId = params.id as string
    const [creator, setCreator] = useState<any>(null)
    const [portfolioMedia, setPortfolioMedia] = useState<PortfolioMedia[]>([])
    const [isFavourite, setIsFavourite] = useState(false)
    const [loading, setLoading] = useState(true)
    const [activeMediaTab, setActiveMediaTab] = useState<'portfolio' | 'audition'>('portfolio')
    const [playingVideo, setPlayingVideo] = useState<string | null>(null)
    
    useEffect(() => {
        loadCreator()
        loadPortfolio()
        checkFavourite()
    }, [creatorId])
    
    async function loadCreator() {
        try {
            const response = await fetch(`/api/brand/creators/${creatorId}`, {
                headers: { 'Accept': 'application/json' },
            })
            
            if (response.ok) {
                const data = await response.json()
                setCreator(data)
            }
        } catch (error) {
            console.error('Failed to load creator:', error)
        } finally {
            setLoading(false)
        }
    }
    
    async function loadPortfolio() {
        try {
            const response = await fetch(`/api/brand/creators/${creatorId}/media`, {
                headers: { 'Accept': 'application/json' },
            })
            
            if (response.ok) {
                const data = await response.json()
                setPortfolioMedia(data)
            }
        } catch (error) {
            console.error('Failed to load portfolio:', error)
        }
    }
    
    async function checkFavourite() {
        try {
            const response = await fetch('/api/brand/favourites', {
                headers: { 'Accept': 'application/json' },
            })
            
            if (response.ok) {
                const data = await response.json()
                const creators = data.creators || []
                setIsFavourite(creators.some((c: any) => c.id === creatorId))
            }
        } catch (error) {
            // Not a favourite
        }
    }
    
    async function toggleFavourite() {
        try {
            if (isFavourite) {
                await fetch('/api/brand/favourites', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({ creatorId }),
                })
            } else {
                await fetch('/api/brand/favourites', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({ creatorId }),
                })
            }
            
            setIsFavourite(!isFavourite)
        } catch (error) {
            console.error('Failed to toggle favourite:', error)
        }
    }
    
    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <p>Loading...</p>
            </div>
        )
    }
    
    if (!creator) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <p>Creator not found</p>
            </div>
        )
    }
    
    const totalFollowers = creator.social_accounts?.reduce(
        (sum: number, account: any) => sum + (account.follower_count || 0),
        0
    ) || 0
    
    return (
        <div className='min-h-screen bg-transparent p-4'>
            <div className='max-w-4xl mx-auto mt-8 space-y-6'>
                <Card>
                    <CardContent className='p-6'>
                        <div className='flex items-start gap-6'>
                            <Avatar
                                src={creator.profile_photo_url}
                                alt={creator.display_name || creator.name}
                                size='xl'
                            />
                            <div className='flex-1'>
                                <div className='flex items-center justify-between mb-4'>
                                    <div>
                                        <h1 className='text-3xl font-bold mb-2'>
                                            {creator.display_name || creator.name}
                                        </h1>
                                        {creator.primary_trade && (
                                            <Badge variant='info' size='lg'>
                                                {creator.primary_trade.name}
                                            </Badge>
                                        )}
                                    </div>
                                    <Button
                                        variant={isFavourite ? 'primary' : 'outline'}
                                        onClick={toggleFavourite}
                                    >
                                        {isFavourite ? '★ Favourited' : '☆ Add to Favourites'}
                                    </Button>
                                </div>
                                
                                {creator.bio && (
                                    <p className='text-[var(--color-text-secondary)] mb-4'>{creator.bio}</p>
                                )}
                                
                                <div className='grid grid-cols-2 gap-4 text-sm'>
                                    {creator.location_city && (
                                        <div>
                                            <span className='font-medium'>Location: </span>
                                            {creator.location_city}
                                            {creator.location_country && `, ${creator.location_country}`}
                                        </div>
                                    )}
                                    {totalFollowers > 0 && (
                                        <div>
                                            <span className='font-medium'>Total Followers: </span>
                                            {totalFollowers.toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                {creator.social_accounts && creator.social_accounts.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Social Accounts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-3'>
                                {creator.social_accounts.map((account: any) => (
                                    <div
                                        key={account.id}
                                        className='flex items-center justify-between p-3 border border-[var(--color-neutral-200)] rounded-lg'
                                    >
                                        <div>
                                            <div className='font-medium'>{account.platform}</div>
                                            <a
                                                href={account.url}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='text-sm text-[var(--color-primary-600)] hover:underline'
                                            >
                                                {account.url}
                                            </a>
                                        </div>
                                        <div className='text-sm text-[var(--color-text-secondary)] text-right'>
                                            <div>Followers: {account.follower_count.toLocaleString()}</div>
                                            {account.engagement_rate > 0 && (
                                                <div>Engagement: {account.engagement_rate}%</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
                
                {creator.featured_content && creator.featured_content.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Featured Content</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                                {creator.featured_content.map((content: any) => (
                                    <div
                                        key={content.id}
                                        className='relative aspect-square rounded-lg overflow-hidden border border-[var(--color-neutral-200)]'
                                    >
                                        <Image
                                            src={content.thumbnail_url}
                                            alt='Featured content'
                                            fill
                                            className='object-cover'
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
                
                {/* Portfolio & Audition Videos */}
                {portfolioMedia.length > 0 && (
                    <Card>
                        <CardHeader>
                            <div className='flex items-center justify-between'>
                                <CardTitle>Media Portfolio</CardTitle>
                                <div className='flex gap-2'>
                                    <button
                                        onClick={() => setActiveMediaTab('portfolio')}
                                        className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                                            activeMediaTab === 'portfolio'
                                                ? 'bg-[var(--color-accent-green)] text-white'
                                                : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                                        }`}
                                    >
                                        Work Samples ({portfolioMedia.filter(m => m.type === 'portfolio').length})
                                    </button>
                                    <button
                                        onClick={() => setActiveMediaTab('audition')}
                                        className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                                            activeMediaTab === 'audition'
                                                ? 'bg-[var(--color-accent-green)] text-white'
                                                : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                                        }`}
                                    >
                                        Audition Videos ({portfolioMedia.filter(m => m.type === 'audition').length})
                                    </button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {activeMediaTab === 'portfolio' && (
                                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                                    {portfolioMedia
                                        .filter(m => m.type === 'portfolio')
                                        .map((item) => (
                                            <div 
                                                key={item.id}
                                                className='relative group aspect-square rounded-xl overflow-hidden bg-[var(--color-bg-secondary)]'
                                            >
                                                {item.media_type === 'video' ? (
                                                    <div className='relative w-full h-full'>
                                                        <video
                                                            src={item.url}
                                                            className='w-full h-full object-cover'
                                                            controls={playingVideo === item.id}
                                                            onPlay={() => setPlayingVideo(item.id)}
                                                            onPause={() => setPlayingVideo(null)}
                                                        />
                                                        {playingVideo !== item.id && (
                                                            <div 
                                                                className='absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer'
                                                                onClick={() => {
                                                                    const video = document.querySelector(`video[src="${item.url}"]`) as HTMLVideoElement
                                                                    video?.play()
                                                                }}
                                                            >
                                                                <div className='w-12 h-12 rounded-full bg-white/90 flex items-center justify-center'>
                                                                    <svg className='w-6 h-6 text-[var(--color-bg-primary)] ml-1' fill='currentColor' viewBox='0 0 24 24'>
                                                                        <path d='M8 5v14l11-7z' />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={item.url}
                                                        alt={item.title || 'Portfolio item'}
                                                        className='w-full h-full object-cover'
                                                    />
                                                )}
                                                {item.title && (
                                                    <div className='absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent'>
                                                        <p className='text-white text-sm truncate'>{item.title}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    {portfolioMedia.filter(m => m.type === 'portfolio').length === 0 && (
                                        <div className='col-span-full text-center py-8 text-[var(--color-text-tertiary)]'>
                                            No work samples uploaded yet
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {activeMediaTab === 'audition' && (
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    {portfolioMedia
                                        .filter(m => m.type === 'audition')
                                        .map((item) => (
                                            <div 
                                                key={item.id}
                                                className='rounded-xl overflow-hidden bg-[var(--color-bg-secondary)]'
                                            >
                                                <video
                                                    src={item.url}
                                                    className='w-full aspect-video object-cover'
                                                    controls
                                                />
                                                {(item.title || item.description) && (
                                                    <div className='p-4'>
                                                        {item.title && (
                                                            <h4 className='font-medium text-[var(--color-text-primary)]'>{item.title}</h4>
                                                        )}
                                                        {item.description && (
                                                            <p className='text-sm text-[var(--color-text-secondary)] mt-1'>{item.description}</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    {portfolioMedia.filter(m => m.type === 'audition').length === 0 && (
                                        <div className='col-span-full text-center py-8 text-[var(--color-text-tertiary)]'>
                                            No audition videos uploaded yet
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
