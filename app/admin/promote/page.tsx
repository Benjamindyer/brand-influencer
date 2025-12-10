'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function PromoteAdminPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)
        
        try {
            const response = await fetch('/api/admin/promote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            })
            
            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to promote user')
            }
            
            setSuccess(true)
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push('/auth/login')
            }, 2000)
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
                    <CardTitle>Promote User to Admin</CardTitle>
                    <p className='text-sm text-[var(--color-text-secondary)] mt-2'>
                        Enter the email of the user you want to promote to admin role.
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <Input
                            label='Email Address'
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading || success}
                            placeholder='user@example.com'
                        />
                        
                        {error && (
                            <div className='p-3 bg-[var(--color-error-100)] text-[var(--color-error-800)] rounded-md text-sm'>
                                {error}
                            </div>
                        )}
                        
                        {success && (
                            <div className='p-3 bg-[var(--color-success-100)] text-[var(--color-success-800)] rounded-md text-sm'>
                                ✓ User has been promoted to admin! Redirecting to login...
                            </div>
                        )}
                        
                        <Button
                            type='submit'
                            variant='primary'
                            className='w-full'
                            disabled={loading || success}
                        >
                            {loading ? 'Promoting...' : 'Promote to Admin'}
                        </Button>
                        
                        <div className='text-xs text-[var(--color-text-tertiary)] mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md'>
                            <strong>Security Note:</strong> After promoting yourself, please delete this page and the /api/admin/promote endpoint for security.
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
