'use client'

import React, { useEffect } from 'react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    size?: 'sm' | 'md' | 'lg' | 'xl'
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])
    
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }
        
        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
        }
        
        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    }, [isOpen, onClose])
    
    if (!isOpen) return null
    
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    }
    
    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70'
            onClick={onClose}
        >
            <div
                className={`
                    bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl shadow-2xl w-full ${sizeClasses[size]}
                    max-h-[90vh] overflow-y-auto
                `}
                onClick={(e) => e.stopPropagation()}
            >
                {title && (
                    <div className='flex items-center justify-between p-6 border-b border-[var(--color-border)]'>
                        <h2 className='text-xl font-semibold text-[var(--color-text-primary)]'>
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className='text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors'
                            aria-label='Close modal'
                        >
                            <svg
                                className='w-6 h-6'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M6 18L18 6M6 6l12 12'
                                />
                            </svg>
                        </button>
                    </div>
                )}
                <div className='p-6'>{children}</div>
            </div>
        </div>
    )
}

