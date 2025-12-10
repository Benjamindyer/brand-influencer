'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function SubscriptionSuccessPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const sessionId = searchParams.get('session_id')
    
    useEffect(() => {
        // Refresh subscription status after a delay
        if (sessionId) {
            setTimeout(() => {
                router.refresh()
            }, 2000)
        }
    }, [sessionId, router])
    
    return (
        <div className='min-h-screen flex items-center justify-center bg-transparent p-4'>
            <Card className='w-full max-w-md'>
                <CardHeader>
                    <CardTitle>Subscription Successful!</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <p className='text-[var(--color-text-secondary)]'>
                        Your subscription has been activated. You can now create multi-creator campaigns.
                    </p>
                    <Link href='/brand/dashboard'>
                        <Button variant='primary' className='w-full'>
                            Go to Dashboard
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}

