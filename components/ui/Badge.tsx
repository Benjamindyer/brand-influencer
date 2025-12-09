import React from 'react'

interface BadgeProps {
    children: React.ReactNode
    variant?: 'default' | 'success' | 'error' | 'warning' | 'info'
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'default',
    size = 'md',
    className = '',
}) => {
    const variants = {
        default: 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border-light)]',
        success: 'bg-[var(--color-success-500)]/20 text-[var(--color-success-500)] border border-[var(--color-success-500)]/30',
        error: 'bg-[var(--color-error-500)]/20 text-[var(--color-error-500)] border border-[var(--color-error-500)]/30',
        warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
        info: 'bg-[var(--color-primary-600)]/20 text-[var(--color-primary-500)] border border-[var(--color-primary-500)]/30',
    }
    
    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
    }
    
    return (
        <span
            className={`
                inline-flex items-center rounded-full font-medium
                ${variants[variant]}
                ${sizes[size]}
                ${className}
            `}
        >
            {children}
        </span>
    )
}

