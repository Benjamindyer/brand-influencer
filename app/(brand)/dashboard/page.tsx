'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { getBrandProfile } from '@/lib/supabase/queries/brand'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { CreditDisplay } from '@/components/brand/CreditDisplay'
import Link from 'next/link'
import type { BrandProfile } from '@/types/brand'

export default function BrandDashboard() {
    const router = useRouter()
    const [profile, setProfile] = useState<BrandProfile | null>(null)
    const [briefs, setBriefs] = useState<any[]>([])
    const [applications, setApplications] = useState<any[]>([])
    const [subscription, setSubscription] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        loadData()
    }, [])
    
    async function loadData() {
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            
            if (!user) {
                router.push('/login')
                return
            }
            
            const [profileData, briefsData, applicationsData, subscriptionData] = await Promise.all([
                getBrandProfile(user.id),
                fetch('/api/brand/briefs').then((r) => r.json()),
                supabase
                    .from('applications')
                    .select(`
                        *,
                        brief:briefs!inner(brand_id, title)
                    `)
                    .eq('briefs.brand_id', (await supabase.from('brand_profiles').select('id').eq('user_id', user.id).single()).data?.id || '')
                    .eq('status', 'pending'),
                supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('brand_id', (await supabase.from('brand_profiles').select('id').eq('user_id', user.id).single()).data?.id || '')
                    .single(),
            ])
            
            setProfile(profileData)
            setBriefs(briefsData || [])
            setApplications(applicationsData.data || [])
            setSubscription(subscriptionData.data)
        } catch (error) {
            console.error('Failed to load dashboard:', error)
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
    
    if (!profile) {
        return (
            <div className='min-h-screen bg-transparent p-4'>
                <div className='max-w-2xl mx-auto mt-8'>
                    <Card>
                        <CardContent className='text-center py-8'>
                            <p className='mb-4'>You need to create your profile first</p>
                            <Link href='/brand/profile/create'>
                                <Button variant='primary'>Create Profile</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }
    
    return (
        <div className='min-h-screen bg-transparent p-4'>
            <div className='max-w-6xl mx-auto mt-8 space-y-6'>
                <div>
                    <h1 className='text-3xl font-bold mb-2'>Brand Dashboard</h1>
                    <p className='text-[var(--color-text-secondary)]'>Welcome back, {profile.company_name}!</p>
                </div>
                
                <Card>
                    <CardHeader>
                        <div className='flex items-center justify-between'>
                            <CardTitle>Subscription Status</CardTitle>
                            <CreditDisplay />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {subscription ? (
                            <div className='space-y-2'>
                                <div className='flex justify-between'>
                                    <span>Tier:</span>
                                    <Badge variant='info'>{subscription.tier}</Badge>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Status:</span>
                                    <Badge variant={subscription.status === 'active' ? 'success' : 'error'}>
                                        {subscription.status}
                                    </Badge>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className='text-[var(--color-text-secondary)] mb-4'>
                                    Subscribe to unlock multi-creator campaigns
                                </p>
                                <Link href='/brand/subscription'>
                                    <Button variant='primary'>View Plans</Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
                
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Briefs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {briefs.length === 0 ? (
                                <p className='text-[var(--color-text-tertiary)] text-sm mb-4'>
                                    No briefs yet
                                </p>
                            ) : (
                                <div className='space-y-2 mb-4'>
                                    {briefs.slice(0, 5).map((brief) => (
                                        <div key={brief.id} className='flex items-center justify-between p-2 border border-[var(--color-neutral-200)] rounded'>
                                            <div>
                                                <div className='font-medium'>{brief.title}</div>
                                                <div className='text-xs text-[var(--color-text-secondary)]'>
                                                    {brief.status}
                                                </div>
                                            </div>
                                            <Link href={`/brand/briefs/${brief.id}/applications`}>
                                                <Button variant='outline' size='sm'>
                                                    View
                                                </Button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <Link href='/brand/briefs/create'>
                                <Button variant='primary' className='w-full'>
                                    Create Brief
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Applications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {applications.length === 0 ? (
                                <p className='text-[var(--color-text-tertiary)] text-sm'>
                                    No pending applications
                                </p>
                            ) : (
                                <div className='space-y-2'>
                                    {applications.slice(0, 5).map((app) => (
                                        <div key={app.id} className='p-2 border border-[var(--color-neutral-200)] rounded'>
                                            <div className='font-medium text-sm'>{app.brief?.title}</div>
                                            <div className='text-xs text-[var(--color-text-secondary)]'>
                                                {applications.length} pending
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                        <Link href='/brand/creators/search'>
                            <Button variant='outline' className='w-full'>
                                Search Creators
                            </Button>
                        </Link>
                        <Link href='/brand/briefs/create'>
                            <Button variant='outline' className='w-full'>
                                Create Brief
                            </Button>
                        </Link>
                        <Link href='/brand/profile/edit'>
                            <Button variant='outline' className='w-full'>
                                Edit Profile
                            </Button>
                        </Link>
                        <Link href='/brand/subscription'>
                            <Button variant='outline' className='w-full'>
                                Manage Subscription
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

