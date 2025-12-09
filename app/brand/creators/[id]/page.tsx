'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Image from 'next/image'

export default function CreatorProfileViewPage() {
    const params = useParams()
    const creatorId = params.id as string
    const [creator, setCreator] = useState<any>(null)
    const [isFavourite, setIsFavourite] = useState(false)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        loadCreator()
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
            </div>
        </div>
    )
}
