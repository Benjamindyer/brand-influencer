'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'

interface Trade {
    id: string
    name: string
    slug: string
}

export default function AdminTradesPage() {
    const [trades, setTrades] = useState<Trade[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingTrade, setEditingTrade] = useState<Trade | null>(null)
    const [formData, setFormData] = useState({ name: '', slug: '' })
    
    useEffect(() => {
        loadTrades()
    }, [])
    
    async function loadTrades() {
        try {
            const response = await fetch('/api/admin/trades')
            if (!response.ok) throw new Error('Failed to load trades')
            const data = await response.json()
            setTrades(data)
        } catch (error) {
            console.error('Failed to load trades:', error)
        } finally {
            setLoading(false)
        }
    }
    
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        
        try {
            const url = '/api/admin/trades'
            const method = editingTrade ? 'PATCH' : 'POST'
            const body = editingTrade
                ? { id: editingTrade.id, ...formData }
                : formData
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })
            
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to save trade')
            }
            
            setShowForm(false)
            setEditingTrade(null)
            setFormData({ name: '', slug: '' })
            await loadTrades()
        } catch (error) {
            alert('Failed to save trade')
            console.error(error)
        }
    }
    
    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this trade?')) return
        
        try {
            const response = await fetch(`/api/admin/trades?id=${id}`, {
                method: 'DELETE',
            })
            
            if (!response.ok) throw new Error('Failed to delete trade')
            
            await loadTrades()
        } catch (error) {
            alert('Failed to delete trade')
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
        <div className='min-h-screen bg-[var(--color-neutral-100)] p-4'>
            <div className='max-w-4xl mx-auto mt-8'>
                <Card>
                    <CardHeader>
                        <div className='flex items-center justify-between'>
                            <CardTitle>Trades Management</CardTitle>
                            <Button
                                variant='primary'
                                onClick={() => {
                                    setEditingTrade(null)
                                    setFormData({ name: '', slug: '' })
                                    setShowForm(true)
                                }}
                            >
                                Add Trade
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-2'>
                            {trades.map((trade) => (
                                <div
                                    key={trade.id}
                                    className='flex items-center justify-between p-3 border border-[var(--color-neutral-200)] rounded-lg'
                                >
                                    <div>
                                        <div className='font-medium'>{trade.name}</div>
                                        <div className='text-sm text-[var(--color-neutral-600)]'>{trade.slug}</div>
                                    </div>
                                    <div className='flex gap-2'>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            onClick={() => {
                                                setEditingTrade(trade)
                                                setFormData({ name: trade.name, slug: trade.slug })
                                                setShowForm(true)
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            onClick={() => handleDelete(trade.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <Modal
                isOpen={showForm}
                onClose={() => {
                    setShowForm(false)
                    setEditingTrade(null)
                    setFormData({ name: '', slug: '' })
                }}
                title={editingTrade ? 'Edit Trade' : 'Add Trade'}
            >
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <Input
                        label='Name *'
                        value={formData.name}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                name: e.target.value,
                                slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                            })
                        }}
                        required
                    />
                    <Input
                        label='Slug *'
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        required
                    />
                    <div className='flex gap-2'>
                        <Button type='submit' variant='primary' className='flex-1'>
                            {editingTrade ? 'Update' : 'Add'}
                        </Button>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={() => {
                                setShowForm(false)
                                setEditingTrade(null)
                                setFormData({ name: '', slug: '' })
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

