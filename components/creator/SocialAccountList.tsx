'use client'

import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { SocialAccount } from '@/types/creator'

interface SocialAccountListProps {
    accounts: SocialAccount[]
    onEdit: (account: SocialAccount) => void
    onDelete: (id: string) => void
    loading?: boolean
}

const platformLabels: Record<string, string> = {
    instagram: 'Instagram',
    tiktok: 'TikTok',
    youtube: 'YouTube',
    facebook: 'Facebook',
    other: 'Other',
}

export function SocialAccountList({
    accounts,
    onEdit,
    onDelete,
    loading = false,
}: SocialAccountListProps) {
    if (accounts.length === 0) {
        return (
            <div className='text-center py-8 text-[var(--color-text-tertiary)]'>
                No social accounts added yet
            </div>
        )
    }
    
    return (
        <div className='space-y-3'>
            {accounts.map((account) => (
                <div
                    key={account.id}
                    className='p-4 border border-[var(--color-neutral-200)] rounded-lg flex items-center justify-between'
                >
                    <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-2'>
                            <Badge variant='info'>{platformLabels[account.platform] || account.platform}</Badge>
                        </div>
                        <a
                            href={account.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-[var(--color-primary-600)] hover:underline text-sm'
                        >
                            {account.url}
                        </a>
                        <div className='mt-2 text-sm text-[var(--color-text-secondary)] space-y-1'>
                            {account.follower_count > 0 && (
                                <div>Followers: {account.follower_count.toLocaleString()}</div>
                            )}
                            {account.engagement_rate > 0 && (
                                <div>Engagement: {account.engagement_rate}%</div>
                            )}
                            {account.average_reach > 0 && (
                                <div>Avg Reach: {account.average_reach.toLocaleString()}</div>
                            )}
                        </div>
                    </div>
                    <div className='flex gap-2 ml-4'>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => onEdit(account)}
                            disabled={loading}
                        >
                            Edit
                        </Button>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => onDelete(account.id)}
                            disabled={loading}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}

