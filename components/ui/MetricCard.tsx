'use client'

import { Card, CardContent } from '@/components/ui/Card'

interface MetricCardProps {
    title: string
    value: string | number
    trend?: {
        value: number
        isPositive: boolean
    }
    icon?: React.ReactNode
}

export function MetricCard({ title, value, trend, icon }: MetricCardProps) {
    return (
        <Card className='bg-[var(--color-bg-card)] border-[var(--color-border)]'>
            <CardContent className='p-6'>
                <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                        <p className='text-sm text-[var(--color-text-tertiary)] mb-1'>{title}</p>
                        <p className='text-3xl font-bold text-[var(--color-text-primary)]'>{value}</p>
                        {trend && (
                            <div className='flex items-center gap-1 mt-2'>
                                {trend.isPositive ? (
                                    <svg className='w-4 h-4 text-[var(--color-accent-green)]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' />
                                    </svg>
                                ) : (
                                    <svg className='w-4 h-4 text-[var(--color-accent-red)]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 17h8m0 0V9m0 8l-8-8-4 4-6-6' />
                                    </svg>
                                )}
                                <span className={`text-xs font-medium ${trend.isPositive ? 'text-[var(--color-accent-green)]' : 'text-[var(--color-accent-red)]'}`}>
                                    {Math.abs(trend.value)}
                                </span>
                            </div>
                        )}
                    </div>
                    {icon && (
                        <div className='text-[var(--color-text-tertiary)] opacity-50'>
                            {icon}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

