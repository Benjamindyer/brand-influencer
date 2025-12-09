'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export default function AdminDashboard() {
    const [metrics, setMetrics] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        loadMetrics()
    }, [])
    
    async function loadMetrics() {
        try {
            const response = await fetch('/api/admin/analytics')
            if (!response.ok) throw new Error('Failed to load metrics')
            const data = await response.json()
            setMetrics(data)
        } catch (error) {
            console.error('Failed to load metrics:', error)
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
    
    if (!metrics) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <p>Failed to load metrics</p>
            </div>
        )
    }
    
    return (
        <div className='min-h-screen bg-[var(--color-neutral-100)] p-4'>
            <div className='max-w-7xl mx-auto mt-8 space-y-6'>
                <div>
                    <h1 className='text-3xl font-bold mb-2'>Admin Dashboard</h1>
                    <p className='text-[var(--color-neutral-600)]'>Platform overview and metrics</p>
                </div>
                
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                    <Card>
                        <CardContent className='p-6'>
                            <div className='text-2xl font-bold'>{metrics.users.total}</div>
                            <div className='text-sm text-[var(--color-neutral-600)]'>Total Users</div>
                            <div className='text-xs text-[var(--color-neutral-500)] mt-2'>
                                {metrics.users.creators} creators, {metrics.users.brands} brands
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className='p-6'>
                            <div className='text-2xl font-bold'>{metrics.briefs.total}</div>
                            <div className='text-sm text-[var(--color-neutral-600)]'>Total Briefs</div>
                            <div className='text-xs text-[var(--color-neutral-500)] mt-2'>
                                {metrics.briefs.completed} completed
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className='p-6'>
                            <div className='text-2xl font-bold'>{metrics.applications}</div>
                            <div className='text-sm text-[var(--color-neutral-600)]'>Total Applications</div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className='p-6'>
                            <div className='text-2xl font-bold'>{metrics.subscriptions.active}</div>
                            <div className='text-sm text-[var(--color-neutral-600)]'>Active Subscriptions</div>
                            <div className='text-xs text-[var(--color-neutral-500)] mt-2'>
                                {metrics.subscriptions.total} total
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-2'>
                            <Link href='/admin/users'>
                                <Button variant='outline' className='w-full justify-start'>
                                    Manage Users
                                </Button>
                            </Link>
                            <Link href='/admin/content'>
                                <Button variant='outline' className='w-full justify-start'>
                                    Content Moderation
                                </Button>
                            </Link>
                            <Link href='/admin/trades'>
                                <Button variant='outline' className='w-full justify-start'>
                                    Manage Trades
                                </Button>
                            </Link>
                            <Link href='/admin/subscriptions'>
                                <Button variant='outline' className='w-full justify-start'>
                                    Manage Subscriptions
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

