'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { getCreatorProfile } from '@/lib/supabase/queries/creator'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { MetricCard } from '@/components/ui/MetricCard'
import { TaskCard } from '@/components/ui/TaskCard'
import Link from 'next/link'

export default function CreatorDashboard() {
    const router = useRouter()
    const [profile, setProfile] = useState<any>(null)
    const [stats, setStats] = useState({
        applications: 0,
        accepted: 0,
        pending: 0,
    })
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        async function loadData() {
            try {
                // Only run in browser
                if (typeof window === 'undefined') return
                
                const {
                    data: { user },
                } = await supabase.auth.getUser()
                
                if (!user) {
                    router.push('/auth/login')
                    return
                }
                
                const profileData = await getCreatorProfile(user.id)
                setProfile(profileData)
                
                if (profileData) {
                    const { data: applications } = await supabase
                        .from('applications')
                        .select('status')
                        .eq('creator_id', profileData.id)
                    
                    if (applications) {
                        setStats({
                            applications: applications.length,
                            accepted: applications.filter((a: any) => a.status === 'accepted').length,
                            pending: applications.filter((a: any) => a.status === 'pending').length,
                        })
                    }
                }
            } catch (error) {
                console.error('Failed to load dashboard:', error)
            } finally {
                setLoading(false)
            }
        }
        
        loadData()
    }, [router])
    
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
                            <Link href='/creator/profile/create'>
                                <Button variant='primary'>Create Profile</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }
    
    const profileComplete = profile.name && profile.primary_trade_id
    
    return (
        <div className='min-h-screen bg-[var(--color-bg-primary)] p-8'>
            <div className='max-w-7xl mx-auto space-y-6'>
                <div>
                    <h1 className='text-3xl font-bold mb-2 text-[var(--color-text-primary)]'>Home</h1>
                    <p className='text-[var(--color-text-tertiary)]'>Monitor all of your projects and tasks here.</p>
                </div>
                
                {!profileComplete && (
                    <Card className='bg-yellow-500/10 border-yellow-500/20'>
                        <CardContent className='p-4'>
                            <p className='text-sm text-yellow-400'>
                                Complete your profile to start applying to briefs.{' '}
                                <Link href='/creator/profile/edit' className='underline hover:text-yellow-300'>
                                    Edit Profile
                                </Link>
                            </p>
                        </CardContent>
                    </Card>
                )}
                
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <MetricCard
                        title='Total Applications'
                        value={stats.applications}
                        trend={{ value: 2, isPositive: true }}
                    />
                    <MetricCard
                        title='Accepted'
                        value={stats.accepted}
                        trend={{ value: 1, isPositive: true }}
                    />
                    <MetricCard
                        title='Pending'
                        value={stats.pending}
                        trend={{ value: 1, isPositive: false }}
                    />
                </div>
                
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-2'>
                            <Link href='/creator/profile/edit'>
                                <Button variant='outline' className='w-full justify-start'>
                                    Edit Profile
                                </Button>
                            </Link>
                            <Link href='/creator/profile/social'>
                                <Button variant='outline' className='w-full justify-start'>
                                    Manage Social Accounts
                                </Button>
                            </Link>
                            <Link href='/creator/profile/content'>
                                <Button variant='outline' className='w-full justify-start'>
                                    Manage Featured Content
                                </Button>
                            </Link>
                            <Link href='/creator/briefs'>
                                <Button variant='outline' className='w-full justify-start'>
                                    Browse Briefs
                                </Button>
                            </Link>
                            <Link href='/creator/applications'>
                                <Button variant='outline' className='w-full justify-start'>
                                    View Applications
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-2 text-sm'>
                                <div className='flex justify-between'>
                                    <span>Profile Created</span>
                                    <Badge variant={profileComplete ? 'success' : 'error'}>
                                        {profileComplete ? 'Complete' : 'Incomplete'}
                                    </Badge>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Primary Trade</span>
                                    <span>{profile.primary_trade?.name || 'Not set'}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

