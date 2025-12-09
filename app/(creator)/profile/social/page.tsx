'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { SocialAccountForm } from '@/components/creator/SocialAccountForm'
import { SocialAccountList } from '@/components/creator/SocialAccountList'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import type { SocialAccount } from '@/types/creator'

export default function SocialAccountsPage() {
    const [accounts, setAccounts] = useState<SocialAccount[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editingAccount, setEditingAccount] = useState<SocialAccount | null>(null)
    const [showForm, setShowForm] = useState(false)
    
    useEffect(() => {
        loadAccounts()
    }, [])
    
    async function loadAccounts() {
        try {
            const response = await fetch('/api/creator/social')
            if (!response.ok) throw new Error('Failed to load accounts')
            const data = await response.json()
            setAccounts(data)
        } catch (error) {
            console.error('Failed to load accounts:', error)
        } finally {
            setLoading(false)
        }
    }
    
    async function handleSubmit(formData: any) {
        setSaving(true)
        try {
            const url = formData.id ? '/api/creator/social' : '/api/creator/social'
            const method = formData.id ? 'PATCH' : 'POST'
            
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
            
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to save account')
            }
            
            setShowForm(false)
            setEditingAccount(null)
            await loadAccounts()
        } catch (error) {
            throw error
        } finally {
            setSaving(false)
        }
    }
    
    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this account?')) return
        
        try {
            const response = await fetch(`/api/creator/social?id=${id}`, {
                method: 'DELETE',
            })
            
            if (!response.ok) throw new Error('Failed to delete account')
            
            await loadAccounts()
        } catch (error) {
            alert('Failed to delete account')
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
            <div className='max-w-3xl mx-auto mt-8'>
                <Card>
                    <CardHeader>
                        <div className='flex items-center justify-between'>
                            <CardTitle>Social Accounts</CardTitle>
                            <Button
                                variant='primary'
                                onClick={() => {
                                    setEditingAccount(null)
                                    setShowForm(true)
                                }}
                            >
                                Add Account
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <SocialAccountList
                            accounts={accounts}
                            onEdit={(account) => {
                                setEditingAccount(account)
                                setShowForm(true)
                            }}
                            onDelete={handleDelete}
                            loading={saving}
                        />
                    </CardContent>
                </Card>
            </div>
            
            <Modal
                isOpen={showForm}
                onClose={() => {
                    setShowForm(false)
                    setEditingAccount(null)
                }}
                title={editingAccount ? 'Edit Social Account' : 'Add Social Account'}
            >
                <SocialAccountForm
                    initialData={editingAccount}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setShowForm(false)
                        setEditingAccount(null)
                    }}
                    loading={saving}
                />
            </Modal>
        </div>
    )
}

