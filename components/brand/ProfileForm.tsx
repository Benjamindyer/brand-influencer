'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import type { BrandProfile } from '@/types/brand'

interface ProfileFormProps {
    initialData?: BrandProfile | null
    onSubmit: (data: any) => Promise<void>
    loading?: boolean
}

export function BrandProfileForm({ initialData, onSubmit, loading = false }: ProfileFormProps) {
    const [companyName, setCompanyName] = useState(initialData?.company_name || '')
    const [logoUrl, setLogoUrl] = useState(initialData?.logo_url || '')
    const [industrySegment, setIndustrySegment] = useState(initialData?.industry_segment || '')
    const [website, setWebsite] = useState(initialData?.website || '')
    const [description, setDescription] = useState(initialData?.description || '')
    const [contactName, setContactName] = useState(initialData?.contact_name || '')
    const [email, setEmail] = useState(initialData?.email || '')
    const [phone, setPhone] = useState(initialData?.phone || '')
    const [error, setError] = useState<string | null>(null)
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        
        if (!companyName.trim()) {
            setError('Company name is required')
            return
        }
        
        try {
            await onSubmit({
                company_name: companyName.trim(),
                logo_url: logoUrl.trim() || null,
                industry_segment: industrySegment.trim() || null,
                website: website.trim() || null,
                description: description.trim() || null,
                contact_name: contactName.trim() || null,
                email: email.trim() || null,
                phone: phone.trim() || null,
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save profile')
        }
    }
    
    return (
        <form onSubmit={handleSubmit} className='space-y-4'>
            <Input
                label='Company Name *'
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                disabled={loading}
            />
            
            <Input
                label='Logo URL'
                type='url'
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                disabled={loading}
                placeholder='https://...'
            />
            
            <Input
                label='Industry Segment'
                value={industrySegment}
                onChange={(e) => setIndustrySegment(e.target.value)}
                disabled={loading}
            />
            
            <Input
                label='Website'
                type='url'
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                disabled={loading}
                placeholder='https://...'
            />
            
            <Textarea
                label='Company Description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                rows={4}
            />
            
            <Input
                label='Contact Name'
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                disabled={loading}
            />
            
            <Input
                label='Email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
            />
            
            <Input
                label='Phone'
                type='tel'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
            />
            
            {error && (
                <div className='p-3 bg-[var(--color-error-100)] text-[var(--color-error-800)] rounded-md text-sm'>
                    {error}
                </div>
            )}
            
            <Button type='submit' variant='primary' disabled={loading} className='w-full'>
                {loading ? 'Saving...' : initialData ? 'Update Profile' : 'Create Profile'}
            </Button>
        </form>
    )
}

