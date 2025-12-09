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
                    className='block text-sm font-medium text-[var(--color-neutral-700)] mb-1'
                >
                    {label}
                </label>
            )}
            <select
                id={selectId}
                className={`
                    w-full px-4 py-2 border rounded-md
                    text-[var(--color-neutral-900)] bg-white
                    focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent
                    disabled:bg-[var(--color-neutral-100)] disabled:cursor-not-allowed
                    ${error ? 'border-[var(--color-error-500)]' : 'border-[var(--color-neutral-300)]'}
                    ${className}
                `}
                {...props}
            >
                {placeholder && (
                    <option value='' disabled>
                        {placeholder}
                    </option>
                )}
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
                <p className='mt-1 text-sm text-[var(--color-neutral-500)]'>{helperText}</p>
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
                    className='block text-sm font-medium text-[var(--color-neutral-700)] mb-1'
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
                    w-full px-4 py-2 border rounded-md
                    text-[var(--color-neutral-900)] bg-white
                    focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent
                    disabled:bg-[var(--color-neutral-100)] disabled:cursor-not-allowed
                    min-h-[100px]
                    ${error ? 'border-[var(--color-error-500)]' : 'border-[var(--color-neutral-300)]'}
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
                <p className='mt-1 text-sm text-[var(--color-neutral-500)]'>{helperText}</p>
            )}
        </div>
    )
}

