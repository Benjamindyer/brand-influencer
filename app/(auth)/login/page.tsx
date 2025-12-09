'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        
        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            
            if (authError) throw authError
            
            // Get user role to redirect appropriately
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()
                
                if (profile) {
                    if (profile.role === 'creator') {
                        router.push('/creator/dashboard')
                    } else if (profile.role === 'brand') {
                        router.push('/brand/dashboard')
                    } else if (profile.role === 'admin') {
                        router.push('/admin/dashboard')
                    } else {
                        router.push('/')
                    }
                } else {
                    router.push('/')
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Invalid email or password')
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <div className='min-h-screen flex items-center justify-center bg-transparent p-4'>
            <Card className='w-full max-w-md'>
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
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
                        />
                        
                        <Input
                            label='Password'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                        
                        <div className='flex items-center justify-between'>
                            <a
                                href='/forgot-password'
                                className='text-sm text-[var(--color-primary-600)] hover:underline'
                            >
                                Forgot password?
                            </a>
                        </div>
                        
                        {error && (
                            <div className='p-3 bg-[var(--color-error-100)] text-[var(--color-error-800)] rounded-md text-sm'>
                                {error}
                            </div>
                        )}
                        
                        <Button
                            type='submit'
                            variant='primary'
                            className='w-full'
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                        
                        <p className='text-sm text-center text-[var(--color-text-secondary)]'>
                            Don't have an account?{' '}
                            <a href='/register' className='text-[var(--color-primary-600)] hover:underline'>
                                Register
                            </a>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

