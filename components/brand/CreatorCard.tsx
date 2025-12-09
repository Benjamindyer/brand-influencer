'use client'

import Link from 'next/link'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface CreatorCardProps {
    creator: {
        id: string
        name: string
        display_name: string | null
        profile_photo_url: string | null
        primary_trade?: { name: string } | null
        social_accounts?: Array<{
            platform: string
            follower_count: number
            engagement_rate: number
        }>
    }
}

const platformLabels: Record<string, string> = {
    instagram: 'IG',
    tiktok: 'TT',
    youtube: 'YT',
    facebook: 'FB',
}

export function CreatorCard({ creator }: CreatorCardProps) {
    const totalFollowers = creator.social_accounts?.reduce(
        (sum, account) => sum + (account.follower_count || 0),
        0
    ) || 0
    
    const avgEngagement = creator.social_accounts?.length
        ? creator.social_accounts.reduce(
              (sum, account) => sum + (account.engagement_rate || 0),
              0
          ) / creator.social_accounts.length
        : 0
    
    const platforms = creator.social_accounts?.map((a) => a.platform) || []
    
    return (
        <Card>
            <CardContent className='p-6'>
                <div className='flex items-start gap-4'>
                    <Avatar
                        src={creator.profile_photo_url}
                        alt={creator.display_name || creator.name}
                        size='lg'
                    />
                    <div className='flex-1'>
                        <h3 className='font-semibold text-lg mb-1'>
                            {creator.display_name || creator.name}
                        </h3>
                        {creator.primary_trade && (
                            <Badge variant='info' className='mb-2'>
                                {creator.primary_trade.name}
                            </Badge>
                        )}
                        <div className='flex flex-wrap gap-2 mb-2'>
                            {platforms.map((platform) => (
                                <Badge key={platform} variant='default' size='sm'>
                                    {platformLabels[platform] || platform}
                                </Badge>
                            ))}
                        </div>
                        <div className='text-sm text-[var(--color-text-secondary)] space-y-1 mb-4'>
                            {totalFollowers > 0 && (
                                <div>Total Followers: {totalFollowers.toLocaleString()}</div>
                            )}
                            {avgEngagement > 0 && (
                                <div>Avg Engagement: {avgEngagement.toFixed(1)}%</div>
                            )}
                        </div>
                        <Link href={`/brand/creators/${creator.id}`}>
                            <Button variant='primary' className='w-full'>
                                View Profile
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

