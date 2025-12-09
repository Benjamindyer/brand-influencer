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
        default: 'bg-[var(--color-neutral-200)] text-[var(--color-neutral-800)]',
        success: 'bg-[var(--color-success-100)] text-[var(--color-success-800)]',
        error: 'bg-[var(--color-error-100)] text-[var(--color-error-800)]',
        warning: 'bg-yellow-100 text-yellow-800',
        info: 'bg-[var(--color-primary-100)] text-[var(--color-primary-800)]',
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

