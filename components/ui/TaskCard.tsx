'use client'

import Link from 'next/link'

interface TaskCardProps {
    title: string
    project?: string
    dueDate: string
    href?: string
}

export function TaskCard({ title, project, dueDate, href }: TaskCardProps) {
    const content = (
        <div className='flex items-center justify-between p-4 hover:bg-[var(--color-bg-hover)] rounded-lg transition-colors cursor-pointer group'>
            <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-green)] transition-colors'>
                    {title}
                </p>
                {project && (
                    <p className='text-xs text-[var(--color-text-tertiary)] mt-1'>{project}</p>
                )}
                <p className='text-xs text-[var(--color-text-muted)] mt-1'>{dueDate}</p>
            </div>
            <svg className='w-5 h-5 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-accent-green)] transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
            </svg>
        </div>
    )
    
    if (href) {
        return <Link href={href}>{content}</Link>
    }
    
    return content
}

