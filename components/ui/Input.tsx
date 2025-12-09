import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helperText?: string
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    className = '',
    id,
    ...props
}) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    
    return (
        <div className='w-full'>
            {label && (
                <label
                    htmlFor={inputId}
                    className='block text-sm font-medium text-[var(--color-neutral-700)] mb-1'
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`
                    w-full px-4 py-2 border rounded-md
                    text-[var(--color-neutral-900)] bg-white
                    focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent
                    disabled:bg-[var(--color-neutral-100)] disabled:cursor-not-allowed
                    ${error ? 'border-[var(--color-error-500)]' : 'border-[var(--color-neutral-300)]'}
                    ${className}
                `}
                {...props}
            />
            {error && (
                <p className='mt-1 text-sm text-[var(--color-error-600)]'>{error}</p>
            )}
            {helperText && !error && (
                <p className='mt-1 text-sm text-[var(--color-neutral-500)]'>{helperText}</p>
            )}
        </div>
    )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
    helperText?: string
}

export const Textarea: React.FC<TextareaProps> = ({
    label,
    error,
    helperText,
    className = '',
    id,
    ...props
}) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`
    
    return (
        <div className='w-full'>
            {label && (
                <label
                    htmlFor={textareaId}
                    className='block text-sm font-medium text-[var(--color-neutral-700)] mb-1'
                >
                    {label}
                </label>
            )}
            <textarea
                id={textareaId}
                className={`
                    w-full px-4 py-2 border rounded-md
                    text-[var(--color-neutral-900)] bg-white
                    focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent
                    disabled:bg-[var(--color-neutral-100)] disabled:cursor-not-allowed
                    resize-y min-h-[100px]
                    ${error ? 'border-[var(--color-error-500)]' : 'border-[var(--color-neutral-300)]'}
                    ${className}
                `}
                {...props}
            />
            {error && (
                <p className='mt-1 text-sm text-[var(--color-error-600)]'>{error}</p>
            )}
            {helperText && !error && (
                <p className='mt-1 text-sm text-[var(--color-neutral-500)]'>{helperText}</p>
            )}
        </div>
    )
}

