'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { createUserProfile } from '@/lib/auth/helpers'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import type { UserRole } from '@/types/auth'

export default function RegisterPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState<UserRole>('creator')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        
        try {
            // Sign up with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/verify-email`,
                },
            })
            
            if (authError) throw authError
            
            if (!authData.user) {
                throw new Error('Failed to create user')
            }
            
            // Create user profile with role
            await createUserProfile(authData.user.id, role)
            
            // Redirect to verification page
            router.push('/verify-email')
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
                    <CardTitle>Create an Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <Select
                            label='I am a...'
                            value={role}
                            onChange={(e) => setRole(e.target.value as UserRole)}
                            options={[
                                { value: 'creator', label: 'Creator / Influencer' },
                                { value: 'brand', label: 'Brand' },
                            ]}
                        />
                        
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
                            minLength={6}
                            disabled={loading}
                            helperText='Must be at least 6 characters'
                        />
                        
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
                            {loading ? 'Creating Account...' : 'Register'}
                        </Button>
                        
                        <p className='text-sm text-center text-[var(--color-neutral-600)]'>
                            Already have an account?{' '}
                            <a href='/login' className='text-[var(--color-primary-600)] hover:underline'>
                                Sign in
                            </a>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

