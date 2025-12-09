'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Link from 'next/link'
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
            // Register via API route (handles profile creation server-side)
            const registerResponse = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email, password, role }),
            })

            const registerData = await registerResponse.json()

            if (!registerResponse.ok) {
                throw new Error(registerData.error || 'Registration failed')
            }

            // Sign in via API route after successful registration
            const loginResponse = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            const loginData = await loginResponse.json()

            if (!loginResponse.ok) {
                // Registration succeeded but sign-in failed - redirect to login
                router.push('/auth/login?registered=true')
                return
            }

            // Redirect based on role
            router.push(loginData.redirectTo || '/')
        } catch (err) {
            let errorMessage = 'An error occurred'
            if (err instanceof Error) {
                errorMessage = err.message
                // Provide more helpful error messages
                if (err.message.includes('Missing Supabase') || err.message.includes('configuration error')) {
                    errorMessage = 'Server configuration error. Please contact the administrator.'
                }
            }
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <div className='min-h-screen flex items-center justify-center bg-transparent p-4'>
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
                        
                        <p className='text-sm text-center text-[var(--color-text-secondary)]'>
                            Already have an account?{' '}
                            <Link href='/auth/login' className='text-[var(--color-primary-600)] hover:underline'>
                                Sign in
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
