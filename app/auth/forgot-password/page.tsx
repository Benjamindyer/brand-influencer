'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)
        
        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            })
            
            if (resetError) throw resetError
            
            setMessage('Check your email for a password reset link')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <div className='min-h-screen flex items-center justify-center bg-[var(--color-neutral-100)] p-4'>
            <Card className='w-full max-w-md'>
                <CardHeader>
                    <CardTitle>Reset Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <Input
                            label='Email'
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            helperText="Enter your email address and we'll send you a reset link"
                        />
                        
                        {error && (
                            <div className='p-3 bg-[var(--color-error-100)] text-[var(--color-error-800)] rounded-md text-sm'>
                                {error}
                            </div>
                        )}
                        
                        {message && (
                            <div className='p-3 bg-[var(--color-success-100)] text-[var(--color-success-800)] rounded-md text-sm'>
                                {message}
                            </div>
                        )}
                        
                        <Button
                            type='submit'
                            variant='primary'
                            className='w-full'
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                        
                        <p className='text-sm text-center text-[var(--color-neutral-600)]'>
                            <a href='/login' className='text-[var(--color-primary-600)] hover:underline'>
                                Back to Sign In
                            </a>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

