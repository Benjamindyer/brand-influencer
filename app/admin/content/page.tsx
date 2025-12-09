'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'

export default function AdminContentPage() {
    const [content, setContent] = useState<any>({
        creators: [],
        brands: [],
        briefs: [],
    })
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'creators' | 'brands' | 'briefs'>('creators')
    const [searchTerm, setSearchTerm] = useState('')
    
    useEffect(() => {
        loadContent()
    }, [])
    
    async function loadContent() {
        try {
            const response = await fetch('/api/admin/content')
            if (!response.ok) throw new Error('Failed to load content')
            const data = await response.json()
            setContent(data)
        } catch (error) {
            console.error('Failed to load content:', error)
        } finally {
            setLoading(false)
        }
    }
    
    async function handleDelete(type: string, id: string) {
        if (!confirm(`Are you sure you want to delete this ${type}?`)) return
        
        try {
            const response = await fetch(`/api/admin/content?type=${type}&id=${id}`, {
                method: 'DELETE',
            })
            
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to delete')
            }
            
            await loadContent()
        } catch (error) {
            alert('Failed to delete content')
            console.error(error)
        }
    }
    
    const getFilteredItems = () => {
        const items = content[activeTab] || []
        if (!searchTerm) return items
        
        const search = searchTerm.toLowerCase()
        return items.filter((item: any) => {
            if (activeTab === 'creators') {
                return item.name?.toLowerCase().includes(search) ||
                    item.display_name?.toLowerCase().includes(search)
            } else if (activeTab === 'brands') {
                return item.company_name?.toLowerCase().includes(search)
            } else {
                return item.title?.toLowerCase().includes(search)
            }
        })
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
            <div className='max-w-7xl mx-auto mt-8 space-y-6'>
                <Card>
                    <CardHeader>
                        <div className='flex items-center justify-between mb-4'>
                            <CardTitle>Content Moderation</CardTitle>
                            <Input
                                placeholder='Search...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='w-64'
                            />
                        </div>
                        <div className='flex gap-2'>
                            {(['creators', 'brands', 'briefs'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 rounded-md ${
                                        activeTab === tab
                                            ? 'bg-[var(--color-primary-600)] text-white'
                                            : 'bg-[var(--color-neutral-200)] text-[var(--color-neutral-700)]'
                                    }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)} ({content[tab]?.length || 0})
                                </button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className='overflow-x-auto'>
                            <table className='w-full'>
                                <thead>
                                    <tr className='border-b border-[var(--color-neutral-200)]'>
                                        <th className='text-left p-2'>Name/Title</th>
                                        <th className='text-left p-2'>Created</th>
                                        <th className='text-left p-2'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getFilteredItems().map((item: any) => (
                                        <tr key={item.id} className='border-b border-[var(--color-neutral-200)]'>
                                            <td className='p-2'>
                                                {item.name || item.display_name || item.company_name || item.title}
                                            </td>
                                            <td className='p-2 text-sm text-[var(--color-neutral-600)]'>
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </td>
                                            <td className='p-2'>
                                                <Button
                                                    variant='outline'
                                                    size='sm'
                                                    onClick={() => handleDelete(activeTab.slice(0, -1), item.id)}
                                                >
                                                    Delete
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
        </div>
    )
}

