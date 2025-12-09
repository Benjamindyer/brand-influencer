'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface BriefCardProps {
    brief: {
        id: string
        type: string
        title: string
        description: string
        compensation_type: string | null
        fee_amount: number | null
        deadline: string | null
        brand?: {
            company_name: string
            logo_url: string | null
        }
    }
}

export function BriefCard({ brief }: BriefCardProps) {
    const deadlineDate = brief.deadline ? new Date(brief.deadline) : null
    const isPastDeadline = deadlineDate && deadlineDate < new Date()
    
    return (
        <Card>
            <CardContent className='p-6'>
                <div className='flex items-start justify-between mb-4'>
                    <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-2'>
                            <h3 className='text-xl font-semibold'>{brief.title}</h3>
                            <Badge variant={brief.type === 'multi_creator' ? 'info' : 'default'}>
                                {brief.type === 'multi_creator' ? 'Multi-Creator' : 'Standard'}
                            </Badge>
                        </div>
                        {brief.brand && (
                            <p className='text-sm text-[var(--color-neutral-600)] mb-2'>
                                {brief.brand.company_name}
                            </p>
                        )}
                        <p className='text-[var(--color-neutral-700)] line-clamp-3 mb-4'>
                            {brief.description}
                        </p>
                    </div>
                </div>
                
                <div className='flex items-center justify-between'>
                    <div className='text-sm text-[var(--color-neutral-600)]'>
                        {brief.compensation_type && (
                            <div>
                                Compensation: {brief.compensation_type}
                                {brief.fee_amount && ` - $${brief.fee_amount}`}
                            </div>
                        )}
                        {deadlineDate && (
                            <div className={isPastDeadline ? 'text-[var(--color-error-600)]' : ''}>
                                Deadline: {deadlineDate.toLocaleDateString()}
                            </div>
                        )}
                    </div>
                    <Link href={`/creator/briefs/${brief.id}`}>
                        <Button variant='primary' size='sm'>
                            View Details
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}

