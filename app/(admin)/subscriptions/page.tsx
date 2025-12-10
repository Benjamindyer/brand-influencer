'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'

export default function AdminSubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [editingSubscription, setEditingSubscription] = useState<any>(null)
    const [creditValue, setCreditValue] = useState('')
    
    useEffect(() => {
        loadSubscriptions()
    }, [])
    
    async function loadSubscriptions() {
        try {
            const response = await fetch('/api/admin/subscriptions')
            if (!response.ok) throw new Error('Failed to load subscriptions')
            const data = await response.json()
            setSubscriptions(data)
        } catch (error) {
            console.error('Failed to load subscriptions:', error)
        } finally {
            setLoading(false)
        }
    }
    
    async function handleUpdateCredits() {
        if (!editingSubscription) return
        
        try {
            const response = await fetch(`/api/admin/subscriptions/${editingSubscription.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    campaign_credits: parseInt(creditValue, 10),
                }),
            })
            
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to update credits')
            }
            
            setEditingSubscription(null)
            setCreditValue('')
            await loadSubscriptions()
        } catch (error) {
            alert('Failed to update credits')
            console.error(error)
        }
    }
    
    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <p>Loading...</p>
            </div>
        )
    }
    
    return (
        <div className='min-h-screen bg-transparent p-4'>
            <div className='max-w-7xl mx-auto mt-8'>
                <Card>
                    <CardHeader>
                        <CardTitle>Subscriptions & Credits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='overflow-x-auto'>
                            <table className='w-full'>
                                <thead>
                                    <tr className='border-b border-[var(--color-neutral-200)]'>
                                        <th className='text-left p-2'>Brand</th>
                                        <th className='text-left p-2'>Tier</th>
                                        <th className='text-left p-2'>Status</th>
                                        <th className='text-left p-2'>Credits</th>
                                        <th className='text-left p-2'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subscriptions.map((sub) => (
                                        <tr key={sub.id} className='border-b border-[var(--color-neutral-200)]'>
                                            <td className='p-2'>{sub.brand?.company_name || 'N/A'}</td>
                                            <td className='p-2'>
                                                <Badge variant='info'>{sub.tier}</Badge>
                                            </td>
                                            <td className='p-2'>
                                                <Badge variant={sub.status === 'active' ? 'success' : 'error'}>
                                                    {sub.status}
                                                </Badge>
                                            </td>
                                            <td className='p-2'>{sub.campaign_credits || 0}</td>
                                            <td className='p-2'>
                                                <Button
                                                    variant='outline'
                                                    size='sm'
                                                    onClick={() => {
                                                        setEditingSubscription(sub)
                                                        setCreditValue(sub.campaign_credits?.toString() || '0')
                                                    }}
                                                >
                                                    Adjust Credits
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <Modal
                isOpen={!!editingSubscription}
                onClose={() => {
                    setEditingSubscription(null)
                    setCreditValue('')
                }}
                title='Adjust Campaign Credits'
            >
                <div className='space-y-4'>
                    <Input
                        label='Campaign Credits'
                        type='number'
                        value={creditValue}
                        onChange={(e) => setCreditValue(e.target.value)}
                        min='0'
                    />
                    <div className='flex gap-2'>
                        <Button variant='primary' onClick={handleUpdateCredits} className='flex-1'>
                            Update
                        </Button>
                        <Button
                            variant='outline'
                            onClick={() => {
                                setEditingSubscription(null)
                                setCreditValue('')
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

