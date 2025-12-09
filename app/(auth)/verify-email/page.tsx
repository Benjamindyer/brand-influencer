'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function VerifyEmailPage() {
    return (
        <div className='min-h-screen flex items-center justify-center bg-transparent p-4'>
            <Card className='w-full max-w-md'>
                <CardHeader>
                    <CardTitle>Verify Your Email</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <p className='text-[var(--color-text-secondary)]'>
                        We've sent a verification email to your inbox. Please check your email and click the
                        verification link to activate your account.
                    </p>
                    <p className='text-sm text-[var(--color-text-tertiary)]'>
                        Didn't receive the email? Check your spam folder or{' '}
                        <a href='/register' className='text-[var(--color-primary-600)] hover:underline'>
                            try registering again
                        </a>
                        .
                    </p>
                    <Button variant='outline' className='w-full' onClick={() => window.location.href = '/login'}>
                        Back to Sign In
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

