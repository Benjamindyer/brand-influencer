import React from 'react'

interface SelectOption {
    value: string
    label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
    error?: string
    helperText?: string
    options: SelectOption[]
    placeholder?: string
}

export const Select: React.FC<SelectProps> = ({
    label,
    error,
    helperText,
    options,
    placeholder,
    className = '',
    id,
    ...props
}) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`
    
    return (
        <div className='w-full'>
            {label && (
                <label
                    htmlFor={selectId}
                    className='block text-sm font-medium text-[var(--color-text-secondary)] mb-1'
                >
                    {label}
                </label>
            )}
            <div className='relative'>
                <select
                    id={selectId}
                    className={`
                        w-full px-4 py-3 border rounded-xl
                        text-[var(--color-text-primary)] bg-[var(--color-bg-card)]
                        border-[var(--color-accent-green)]/30
                        focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-green)]/50 focus:border-[var(--color-accent-green)]
                        disabled:bg-[var(--color-bg-secondary)] disabled:cursor-not-allowed disabled:opacity-50
                        appearance-none cursor-pointer
                        ${error ? 'border-[var(--color-error-500)]' : ''}
                        ${className}
                    `}
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                        paddingRight: '40px',
                    }}
                    {...props}
                >
                    {placeholder && (
                        <option value='' disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option key={option.value} value={option.value} className='bg-[var(--color-bg-card)]'>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            {error && (
                <p className='mt-1 text-sm text-[var(--color-error-600)]'>{error}</p>
            )}
            {helperText && !error && (
                <p className='mt-1 text-sm text-[var(--color-text-tertiary)]'>{helperText}</p>
            )}
        </div>
    )
}

interface MultiSelectProps {
    label?: string
    error?: string
    helperText?: string
    options: SelectOption[]
    value: string[]
    onChange: (value: string[]) => void
    placeholder?: string
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
    label,
    error,
    helperText,
    options,
    value,
    onChange,
    placeholder,
}) => {
    const selectId = `multiselect-${Math.random().toString(36).substr(2, 9)}`
    
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value)
        onChange(selectedOptions)
    }
    
    return (
        <div className='w-full'>
            {label && (
                <label
                    htmlFor={selectId}
                    className='block text-sm font-medium text-[var(--color-text-secondary)] mb-1'
                >
                    {label}
                </label>
            )}
            <select
                id={selectId}
                multiple
                value={value}
                onChange={handleChange}
                className={`
                    w-full px-4 py-2 border rounded-xl
                    text-[var(--color-text-primary)] bg-[var(--color-bg-card)]
                    border-[var(--color-border)]
                    focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-green)]/50 focus:border-[var(--color-accent-green)]
                    disabled:bg-[var(--color-bg-secondary)] disabled:cursor-not-allowed disabled:opacity-50
                    min-h-[100px]
                    ${error ? 'border-[var(--color-error-500)]' : ''}
                `}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className='mt-1 text-sm text-[var(--color-error-600)]'>{error}</p>
            )}
            {helperText && !error && (
                <p className='mt-1 text-sm text-[var(--color-text-tertiary)]'>{helperText}</p>
            )}
        </div>
    )
}
