import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function SubscriptionCancelPage() {
    return (
        <div className='min-h-screen flex items-center justify-center bg-transparent p-4'>
            <Card className='w-full max-w-md'>
                <CardHeader>
                    <CardTitle>Subscription Cancelled</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <p className='text-[var(--color-text-secondary)]'>
                        Your subscription was cancelled. You can subscribe again at any time.
                    </p>
                    <div className='flex gap-2'>
                        <Link href='/brand/subscription' className='flex-1'>
                            <Button variant='primary' className='w-full'>
                                Try Again
                            </Button>
                        </Link>
                        <Link href='/brand/dashboard' className='flex-1'>
                            <Button variant='outline' className='w-full'>
                                Dashboard
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

