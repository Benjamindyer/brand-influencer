import React from 'react'
import Image from 'next/image'

interface AvatarProps {
    src?: string | null
    alt?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    fallback?: string
    className?: string
}

export const Avatar: React.FC<AvatarProps> = ({
    src,
    alt = 'Avatar',
    size = 'md',
    fallback,
    className = '',
}) => {
    const sizes = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
        xl: 'w-16 h-16 text-lg',
    }
    
    const getInitials = (name?: string) => {
        if (!name) return '?'
        const parts = name.trim().split(' ')
        if (parts.length === 1) return parts[0][0].toUpperCase()
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    
    return (
        <div
            className={`
                ${sizes[size]} rounded-full
                flex items-center justify-center
                bg-[var(--color-neutral-200)] text-[var(--color-neutral-700)]
                overflow-hidden
                ${className}
            `}
        >
            {src ? (
                <Image
                    src={src}
                    alt={alt}
                    width={64}
                    height={64}
                    className='w-full h-full object-cover'
                />
            ) : (
                <span className='font-semibold'>{fallback || getInitials(alt)}</span>
            )}
        </div>
    )
}

