'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import type { FeaturedContent } from '@/types/creator'

interface ContentGalleryProps {
    content: FeaturedContent[]
    onEdit: (content: FeaturedContent) => void
    onDelete: (id: string) => void
    loading?: boolean
}

export function ContentGallery({
    content,
    onEdit,
    onDelete,
    loading = false,
}: ContentGalleryProps) {
    if (content.length === 0) {
        return (
            <div className='text-center py-8 text-[var(--color-neutral-500)]'>
                No featured content added yet
            </div>
        )
    }
    
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {content.map((item) => (
                <div
                    key={item.id}
                    className='border border-[var(--color-neutral-200)] rounded-lg overflow-hidden'
                >
                    <div className='relative aspect-square'>
                        <Image
                            src={item.thumbnail_url}
                            alt='Featured content'
                            fill
                            className='object-cover'
                        />
                    </div>
                    <div className='p-4'>
                        <div className='text-sm text-[var(--color-neutral-600)] mb-2'>
                            {item.platform}
                        </div>
                        {(item.likes || item.views) && (
                            <div className='text-xs text-[var(--color-neutral-500)] space-y-1 mb-3'>
                                {item.likes && <div>Likes: {item.likes.toLocaleString()}</div>}
                                {item.views && <div>Views: {item.views.toLocaleString()}</div>}
                            </div>
                        )}
                        <div className='flex gap-2'>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => window.open(item.post_url, '_blank')}
                                className='flex-1'
                            >
                                View
                            </Button>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => onEdit(item)}
                                disabled={loading}
                            >
                                Edit
                            </Button>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => onDelete(item.id)}
                                disabled={loading}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

