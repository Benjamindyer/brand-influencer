'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { getCreatorProfile } from '@/lib/supabase/queries/creator'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
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
                const {
                    data: { user },
                } = await supabase.auth.getUser()
                
                if (!user) {
                    router.push('/login')
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
                            accepted: applications.filter((a) => a.status === 'accepted').length,
                            pending: applications.filter((a) => a.status === 'pending').length,
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
            <div className='min-h-screen bg-[var(--color-neutral-100)] p-4'>
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
        <div className='min-h-screen bg-[var(--color-neutral-100)] p-4'>
            <div className='max-w-6xl mx-auto mt-8 space-y-6'>
                <div>
                    <h1 className='text-3xl font-bold mb-2'>Creator Dashboard</h1>
                    <p className='text-[var(--color-neutral-600)]'>Welcome back, {profile.display_name || profile.name}!</p>
                </div>
                
                {!profileComplete && (
                    <Card>
                        <CardContent className='p-4 bg-yellow-50 border-yellow-200'>
                            <p className='text-sm text-yellow-800'>
                                Complete your profile to start applying to briefs.{' '}
                                <Link href='/creator/profile/edit' className='underline'>
                                    Edit Profile
                                </Link>
                            </p>
                        </CardContent>
                    </Card>
                )}
                
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <Card>
                        <CardContent className='p-6'>
                            <div className='text-2xl font-bold'>{stats.applications}</div>
                            <div className='text-sm text-[var(--color-neutral-600)]'>Total Applications</div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className='p-6'>
                            <div className='text-2xl font-bold text-[var(--color-success-600)]'>{stats.accepted}</div>
                            <div className='text-sm text-[var(--color-neutral-600)]'>Accepted</div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className='p-6'>
                            <div className='text-2xl font-bold text-[var(--color-primary-600)]'>{stats.pending}</div>
                            <div className='text-sm text-[var(--color-neutral-600)]'>Pending</div>
                        </CardContent>
                    </Card>
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

