'use client'

import { useState, useEffect } from 'react'
import { FeaturedContentForm } from '@/components/creator/FeaturedContentForm'
import { ContentGallery } from '@/components/creator/ContentGallery'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import type { FeaturedContent } from '@/types/creator'

export default function FeaturedContentPage() {
    const [content, setContent] = useState<FeaturedContent[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editingContent, setEditingContent] = useState<FeaturedContent | null>(null)
    const [showForm, setShowForm] = useState(false)
    
    useEffect(() => {
        loadContent()
    }, [])
    
    async function loadContent() {
        try {
            const response = await fetch('/api/creator/content')
            if (!response.ok) throw new Error('Failed to load content')
            const data = await response.json()
            setContent(data)
        } catch (error) {
            console.error('Failed to load content:', error)
        } finally {
            setLoading(false)
        }
    }
    
    async function handleSubmit(formData: any) {
        setSaving(true)
        try {
            const url = '/api/creator/content'
            const method = formData.id ? 'PATCH' : 'POST'
            
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
            
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to save content')
            }
            
            setShowForm(false)
            setEditingContent(null)
            await loadContent()
        } catch (error) {
            throw error
        } finally {
            setSaving(false)
        }
    }
    
    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this content?')) return
        
        try {
            const response = await fetch(`/api/creator/content?id=${id}`, {
                method: 'DELETE',
            })
            
            if (!response.ok) throw new Error('Failed to delete content')
            
            await loadContent()
        } catch (error) {
            alert('Failed to delete content')
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
            <div className='max-w-6xl mx-auto mt-8'>
                <Card>
                    <CardHeader>
                        <div className='flex items-center justify-between'>
                            <CardTitle>Featured Content</CardTitle>
                            <Button
                                variant='primary'
                                onClick={() => {
                                    setEditingContent(null)
                                    setShowForm(true)
                                }}
                            >
                                Add Content
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ContentGallery
                            content={content}
                            onEdit={(item) => {
                                setEditingContent(item)
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
                    setEditingContent(null)
                }}
                title={editingContent ? 'Edit Featured Content' : 'Add Featured Content'}
            >
                <FeaturedContentForm
                    initialData={editingContent}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setShowForm(false)
                        setEditingContent(null)
                    }}
                    loading={saving}
                />
            </Modal>
        </div>
    )
}

