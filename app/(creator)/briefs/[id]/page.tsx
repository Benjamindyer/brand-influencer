'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function BriefDetailPage() {
    const params = useParams()
    const router = useRouter()
    const briefId = params.id as string
    const [brief, setBrief] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        loadBrief()
    }, [briefId])
    
    async function loadBrief() {
        try {
            const { data, error } = await supabase
                .from('briefs')
                .select(`
                    *,
                    brand:brand_profiles(*),
                    targeting:brief_targeting(*)
                `)
                .eq('id', briefId)
                .single()
            
            if (error) throw error
            setBrief(data)
        } catch (error) {
            console.error('Failed to load brief:', error)
        } finally {
            setLoading(false)
        }
    }
    
    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <p>Loading...</p>
            </div>
        )
    }
    
    if (!brief) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <p>Brief not found</p>
            </div>
        )
    }
    
    return (
        <div className='min-h-screen bg-[var(--color-neutral-100)] p-4'>
            <div className='max-w-4xl mx-auto mt-8 space-y-6'>
                <Card>
                    <CardHeader>
                        <div className='flex items-center justify-between'>
                            <div>
                                <CardTitle className='text-2xl mb-2'>{brief.title}</CardTitle>
                                {brief.brand && (
                                    <p className='text-[var(--color-neutral-600)]'>
                                        {brief.brand.company_name}
                                    </p>
                                )}
                            </div>
                            <Badge variant={brief.type === 'multi_creator' ? 'info' : 'default'}>
                                {brief.type === 'multi_creator' ? 'Multi-Creator' : 'Standard'}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div>
                            <h4 className='font-semibold mb-2'>Description</h4>
                            <p className='text-[var(--color-neutral-700)] whitespace-pre-wrap'>
                                {brief.description}
                            </p>
                        </div>
                        
                        {brief.deliverables && (
                            <div>
                                <h4 className='font-semibold mb-2'>Deliverables</h4>
                                <p className='text-[var(--color-neutral-700)] whitespace-pre-wrap'>
                                    {brief.deliverables}
                                </p>
                            </div>
                        )}
                        
                        <div className='grid grid-cols-2 gap-4 text-sm'>
                            {brief.compensation_type && (
                                <div>
                                    <span className='font-medium'>Compensation: </span>
                                    {brief.compensation_type}
                                    {brief.fee_amount && ` - $${brief.fee_amount}`}
                                </div>
                            )}
                            {brief.timeline && (
                                <div>
                                    <span className='font-medium'>Timeline: </span>
                                    {brief.timeline}
                                </div>
                            )}
                            {brief.deadline && (
                                <div>
                                    <span className='font-medium'>Deadline: </span>
                                    {new Date(brief.deadline).toLocaleDateString()}
                                </div>
                            )}
                            {brief.type === 'multi_creator' && (
                                <div>
                                    <span className='font-medium'>Creators Required: </span>
                                    {brief.num_creators_required}
                                </div>
                            )}
                        </div>
                        
                        <Link href={`/creator/briefs/${briefId}/apply`}>
                            <Button variant='primary' className='w-full'>
                                Apply to This Brief
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

