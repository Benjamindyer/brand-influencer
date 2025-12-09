'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Input'
import { Select, MultiSelect } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase/client'

interface BriefFormProps {
    initialData?: any
    onSubmit: (data: any) => Promise<void>
    loading?: boolean
    isMultiCreator?: boolean
}

export function BriefForm({ initialData, onSubmit, loading = false, isMultiCreator = false }: BriefFormProps) {
    const [trades, setTrades] = useState<any[]>([])
    const [title, setTitle] = useState(initialData?.title || '')
    const [description, setDescription] = useState(initialData?.description || '')
    const [deliverables, setDeliverables] = useState(initialData?.deliverables || '')
    const [compensationType, setCompensationType] = useState(initialData?.compensation_type || '')
    const [feeAmount, setFeeAmount] = useState(initialData?.fee_amount?.toString() || '')
    const [timeline, setTimeline] = useState(initialData?.timeline || '')
    const [deadline, setDeadline] = useState(initialData?.deadline || '')
    const [numCreators, setNumCreators] = useState(initialData?.num_creators_required?.toString() || '1')
    const [selectedTrades, setSelectedTrades] = useState<string[]>([])
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
    const [minFollowers, setMinFollowers] = useState('')
    const [minEngagement, setMinEngagement] = useState('')
    const [location, setLocation] = useState('')
    const [error, setError] = useState<string | null>(null)
    
    useEffect(() => {
        async function loadTrades() {
            const { data } = await supabase.from('trades').select('*').order('name')
            setTrades(data || [])
        }
        loadTrades()
    }, [])
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        
        if (!title.trim() || !description.trim()) {
            setError('Title and description are required')
            return
        }
        
        if (isMultiCreator && (!numCreators || parseInt(numCreators, 10) < 1)) {
            setError('Number of creators is required for multi-creator briefs')
            return
        }
        
        const targeting: Array<{
            trade_id: string
            platform: string | null
            min_followers: number | null
            min_engagement: number | null
            location: string | null
        }> = []
        if (selectedTrades.length > 0) {
            selectedTrades.forEach((tradeId) => {
                targeting.push({
                    trade_id: tradeId,
                    platform: selectedPlatforms.length > 0 ? selectedPlatforms.join(',') : null,
                    min_followers: minFollowers ? parseInt(minFollowers, 10) : null,
                    min_engagement: minEngagement ? parseFloat(minEngagement) : null,
                    location: location || null,
                })
            })
        }
        
        try {
            await onSubmit({
                type: isMultiCreator ? 'multi_creator' : 'standard',
                title: title.trim(),
                description: description.trim(),
                deliverables: deliverables.trim() || null,
                compensation_type: compensationType || null,
                fee_amount: feeAmount ? parseFloat(feeAmount) : null,
                timeline: timeline.trim() || null,
                deadline: deadline || null,
                num_creators_required: isMultiCreator ? parseInt(numCreators, 10) : 1,
                targeting,
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save brief')
        }
    }
    
    const tradeOptions = trades.map((t) => ({ value: t.id, label: t.name }))
    const platformOptions = [
        { value: 'instagram', label: 'Instagram' },
        { value: 'tiktok', label: 'TikTok' },
        { value: 'youtube', label: 'YouTube' },
        { value: 'facebook', label: 'Facebook' },
    ]
    
    return (
        <form onSubmit={handleSubmit} className='space-y-4'>
            <Input
                label='Title *'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={loading}
            />
            
            <Textarea
                label='Description *'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                disabled={loading}
                rows={4}
            />
            
            <Textarea
                label='Deliverables'
                value={deliverables}
                onChange={(e) => setDeliverables(e.target.value)}
                disabled={loading}
                rows={3}
            />
            
            <Select
                label='Compensation Type'
                value={compensationType}
                onChange={(e) => setCompensationType(e.target.value)}
                options={[
                    { value: 'fee', label: 'Fee' },
                    { value: 'product_only', label: 'Product Only' },
                    { value: 'negotiable', label: 'Negotiable' },
                ]}
                placeholder='Select compensation type'
                disabled={loading}
            />
            
            {compensationType === 'fee' && (
                <Input
                    label='Fee Amount'
                    type='number'
                    value={feeAmount}
                    onChange={(e) => setFeeAmount(e.target.value)}
                    disabled={loading}
                    min='0'
                    step='0.01'
                />
            )}
            
            {isMultiCreator && (
                <Input
                    label='Number of Creators Required *'
                    type='number'
                    value={numCreators}
                    onChange={(e) => setNumCreators(e.target.value)}
                    required
                    disabled={loading}
                    min='1'
                />
            )}
            
            <Input
                label='Timeline'
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                disabled={loading}
                placeholder='e.g., 2 weeks, 1 month'
            />
            
            <Input
                label='Application Deadline'
                type='datetime-local'
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                disabled={loading}
            />
            
            <div className='border-t pt-4'>
                <h3 className='font-semibold mb-4'>Targeting Filters (Optional)</h3>
                
                <MultiSelect
                    label='Trades'
                    value={selectedTrades}
                    onChange={setSelectedTrades}
                    options={tradeOptions}
                />
                
                <MultiSelect
                    label='Platforms'
                    value={selectedPlatforms}
                    onChange={setSelectedPlatforms}
                    options={platformOptions}
                />
                
                <div className='grid grid-cols-2 gap-4'>
                    <Input
                        label='Minimum Followers'
                        type='number'
                        value={minFollowers}
                        onChange={(e) => setMinFollowers(e.target.value)}
                        disabled={loading}
                        min='0'
                    />
                    
                    <Input
                        label='Minimum Engagement (%)'
                        type='number'
                        value={minEngagement}
                        onChange={(e) => setMinEngagement(e.target.value)}
                        disabled={loading}
                        min='0'
                        max='100'
                        step='0.1'
                    />
                </div>
                
                <Input
                    label='Location'
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={loading}
                    placeholder='City or country'
                />
            </div>
            
            {error && (
                <div className='p-3 bg-[var(--color-error-100)] text-[var(--color-error-800)] rounded-md text-sm'>
                    {error}
                </div>
            )}
            
            <Button type='submit' variant='primary' disabled={loading} className='w-full'>
                {loading ? 'Saving...' : 'Create Brief'}
            </Button>
        </form>
    )
}

