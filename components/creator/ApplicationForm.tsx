'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/Input'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface ApplicationFormProps {
    briefId: string
    onSubmit: (data: any) => Promise<void>
    loading?: boolean
}

export function ApplicationForm({ briefId, onSubmit, loading = false }: ApplicationFormProps) {
    const [message, setMessage] = useState('')
    const [links, setLinks] = useState<string[]>([''])
    const [error, setError] = useState<string | null>(null)
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        
        if (!message.trim()) {
            setError('Message is required')
            return
        }
        
        try {
            await onSubmit({
                brief_id: briefId,
                message: message.trim(),
                links: links.filter((link) => link.trim()),
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit application')
        }
    }
    
    const addLink = () => {
        setLinks([...links, ''])
    }
    
    const updateLink = (index: number, value: string) => {
        const newLinks = [...links]
        newLinks[index] = value
        setLinks(newLinks)
    }
    
    const removeLink = (index: number) => {
        setLinks(links.filter((_, i) => i !== index))
    }
    
    return (
        <form onSubmit={handleSubmit} className='space-y-4'>
            <Textarea
                label='Application Message *'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                disabled={loading}
                rows={6}
                helperText="Tell the brand why you're a good fit for this brief"
            />
            
            <div>
                <label className='block text-sm font-medium text-[var(--color-text-secondary)] mb-2'>
                    Links (Optional)
                </label>
                {links.map((link, index) => (
                    <div key={index} className='flex gap-2 mb-2'>
                        <Input
                            type='url'
                            value={link}
                            onChange={(e) => updateLink(index, e.target.value)}
                            disabled={loading}
                            placeholder='https://...'
                            className='flex-1'
                        />
                        {links.length > 1 && (
                            <Button
                                type='button'
                                variant='outline'
                                onClick={() => removeLink(index)}
                                disabled={loading}
                            >
                                Remove
                            </Button>
                        )}
                    </div>
                ))}
                <Button
                    type='button'
                    variant='ghost'
                    onClick={addLink}
                    disabled={loading}
                    className='text-sm'
                >
                    + Add Link
                </Button>
            </div>
            
            {error && (
                <div className='p-3 bg-[var(--color-error-100)] text-[var(--color-error-800)] rounded-md text-sm'>
                    {error}
                </div>
            )}
            
            <Button type='submit' variant='primary' disabled={loading} className='w-full'>
                {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
        </form>
    )
}

