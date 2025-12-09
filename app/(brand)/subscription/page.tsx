'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const tiers = [
    {
        id: 'tier1',
        name: 'Tier 1',
        campaigns: 3,
        price: '$29/month',
        features: ['3 multi-creator campaigns per year', 'Unlimited standard briefs', 'Full creator search'],
    },
    {
        id: 'tier2',
        name: 'Tier 2',
        campaigns: 6,
        price: '$59/month',
        features: ['6 multi-creator campaigns per year', 'Unlimited standard briefs', 'Full creator search'],
    },
    {
        id: 'tier3',
        name: 'Tier 3',
        campaigns: 12,
        price: '$99/month',
        features: ['12 multi-creator campaigns per year', 'Unlimited standard briefs', 'Full creator search'],
    },
]

export default function SubscriptionPage() {
    const [loading, setLoading] = useState<string | null>(null)
    
    async function handleSubscribe(tierId: string) {
        setLoading(tierId)
        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tier: tierId }),
            })
            
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to create checkout session')
            }
            
            const { url } = await response.json()
            if (url) {
                window.location.href = url
            }
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to subscribe')
        } finally {
            setLoading(null)
        }
    }
    
    return (
        <div className='min-h-screen bg-transparent p-4'>
            <div className='max-w-6xl mx-auto mt-8'>
                <div className='text-center mb-8'>
                    <h1 className='text-4xl font-bold mb-2'>Choose Your Plan</h1>
                    <p className='text-[var(--color-text-secondary)]'>
                        Select a subscription tier to unlock multi-creator campaigns
                    </p>
                </div>
                
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {tiers.map((tier) => (
                        <Card key={tier.id} className='relative'>
                            {tier.id === 'tier2' && (
                                <div className='absolute top-0 right-0 bg-[var(--color-primary-600)] text-white px-3 py-1 rounded-bl-lg text-sm font-medium'>
                                    Popular
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className='text-2xl'>{tier.name}</CardTitle>
                                <div className='text-3xl font-bold mt-2'>{tier.price}</div>
                            </CardHeader>
                            <CardContent>
                                <ul className='space-y-2 mb-6'>
                                    {tier.features.map((feature, i) => (
                                        <li key={i} className='flex items-start'>
                                            <span className='text-[var(--color-success-600)] mr-2'>✓</span>
                                            <span className='text-sm'>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    variant={tier.id === 'tier2' ? 'primary' : 'outline'}
                                    className='w-full'
                                    onClick={() => handleSubscribe(tier.id)}
                                    disabled={loading !== null}
                                >
                                    {loading === tier.id ? 'Processing...' : 'Subscribe'}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

