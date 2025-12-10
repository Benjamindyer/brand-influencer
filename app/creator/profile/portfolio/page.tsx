'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MediaUpload, MediaGallery } from '@/components/creator/MediaUpload'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { PortfolioMedia, MediaType } from '@/types/media'

export default function PortfolioPage() {
    const [media, setMedia] = useState<PortfolioMedia[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<MediaType>('headshot')
    const [showAddModal, setShowAddModal] = useState(false)
    const [newMediaTitle, setNewMediaTitle] = useState('')
    const [newMediaDescription, setNewMediaDescription] = useState('')
    const [pendingUpload, setPendingUpload] = useState<{
        url: string
        media_type: 'image' | 'video'
        file_size: number
    } | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    useEffect(() => {
        fetchMedia()
    }, [])

    const fetchMedia = async () => {
        try {
            const response = await fetch('/api/creator/media')
            if (response.ok) {
                const data = await response.json()
                setMedia(data)
            }
        } catch (err) {
            console.error('Failed to fetch media:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleUploadComplete = async (data: {
        url: string
        media_type: 'image' | 'video'
        file_size: number
    }) => {
        if (activeTab === 'headshot') {
            // Headshot is automatically saved to profile, just save the media entry
            await saveMedia(data, 'headshot')
        } else {
            // For portfolio and audition, show modal for title/description
            setPendingUpload(data)
            setShowAddModal(true)
        }
    }

    const saveMedia = async (
        uploadData: { url: string; media_type: 'image' | 'video'; file_size: number },
        type: MediaType,
        title?: string,
        description?: string
    ) => {
        try {
            const response = await fetch('/api/creator/media', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    media_type: uploadData.media_type,
                    url: uploadData.url,
                    title,
                    description,
                    file_size: uploadData.file_size
                })
            })

            if (response.ok) {
                const { media: newMedia } = await response.json()
                setMedia(prev => [...prev, newMedia])
                setSuccess('Media uploaded successfully!')
                setTimeout(() => setSuccess(null), 3000)
            } else {
                const data = await response.json()
                setError(data.error || 'Failed to save media')
            }
        } catch (err) {
            setError('Failed to save media')
        }
    }

    const handleSaveWithDetails = async () => {
        if (!pendingUpload) return

        await saveMedia(pendingUpload, activeTab, newMediaTitle, newMediaDescription)
        
        // Reset
        setPendingUpload(null)
        setNewMediaTitle('')
        setNewMediaDescription('')
        setShowAddModal(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this media?')) return

        try {
            const response = await fetch(`/api/creator/media?id=${id}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                setMedia(prev => prev.filter(m => m.id !== id))
                setSuccess('Media deleted successfully')
                setTimeout(() => setSuccess(null), 3000)
            } else {
                const data = await response.json()
                setError(data.error || 'Failed to delete media')
            }
        } catch (err) {
            setError('Failed to delete media')
        }
    }

    const tabs: { id: MediaType; label: string; description: string }[] = [
        { id: 'headshot', label: 'Profile Photo', description: 'Your professional headshot' },
        { id: 'portfolio', label: 'Portfolio', description: 'Photos and videos of your work' },
        { id: 'audition', label: 'Audition Videos', description: 'Introduction videos for brands' }
    ]

    const filteredMedia = media.filter(m => m.type === activeTab)
    const headshot = media.find(m => m.type === 'headshot')

    if (loading) {
        return (
            <div className='min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-accent-green)]' />
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-[var(--color-bg-primary)] p-6'>
            <div className='max-w-5xl mx-auto'>
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold text-[var(--color-text-primary)]'>
                        Media Portfolio
                    </h1>
                    <p className='text-[var(--color-text-secondary)] mt-2'>
                        Upload photos and videos to showcase your work to brands
                    </p>
                </div>

                {error && (
                    <div className='mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400'>
                        {error}
                        <button onClick={() => setError(null)} className='ml-4 underline'>Dismiss</button>
                    </div>
                )}

                {success && (
                    <div className='mb-6 p-4 bg-[var(--color-accent-green)]/10 border border-[var(--color-accent-green)]/20 rounded-xl text-[var(--color-accent-green)]'>
                        {success}
                    </div>
                )}

                {/* Tabs */}
                <div className='flex gap-2 mb-6 border-b border-[var(--color-border)]'>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                px-4 py-3 font-medium transition-colors relative
                                ${activeTab === tab.id 
                                    ? 'text-[var(--color-accent-green)]' 
                                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                                }
                            `}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent-green)]' />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content based on active tab */}
                {activeTab === 'headshot' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Photo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='grid md:grid-cols-2 gap-8'>
                                <div>
                                    <h3 className='text-lg font-medium text-[var(--color-text-primary)] mb-4'>
                                        Current Photo
                                    </h3>
                                    {headshot ? (
                                        <div className='relative w-48 h-48 rounded-full overflow-hidden mx-auto'>
                                            <img
                                                src={headshot.url}
                                                alt='Profile'
                                                className='w-full h-full object-cover'
                                            />
                                        </div>
                                    ) : (
                                        <div className='w-48 h-48 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center mx-auto'>
                                            <svg className='w-16 h-16 text-[var(--color-text-tertiary)]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className='text-lg font-medium text-[var(--color-text-primary)] mb-4'>
                                        Upload New Photo
                                    </h3>
                                    <MediaUpload
                                        type='headshot'
                                        accept='image'
                                        onUploadComplete={handleUploadComplete}
                                        onError={setError}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 'portfolio' && (
                    <div className='space-y-6'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Add to Portfolio</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <MediaUpload
                                    type='portfolio'
                                    accept='both'
                                    onUploadComplete={handleUploadComplete}
                                    onError={setError}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Your Portfolio ({filteredMedia.length} items)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <MediaGallery
                                    media={filteredMedia}
                                    onDelete={handleDelete}
                                    editable
                                />
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === 'audition' && (
                    <div className='space-y-6'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Upload Audition Video</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='mb-6 p-4 bg-[var(--color-bg-secondary)] rounded-xl'>
                                    <h4 className='font-medium text-[var(--color-text-primary)] mb-2'>
                                        Tips for a great audition video:
                                    </h4>
                                    <ul className='list-disc list-inside text-sm text-[var(--color-text-secondary)] space-y-1'>
                                        <li>Keep it under 2 minutes</li>
                                        <li>Introduce yourself and your expertise</li>
                                        <li>Showcase your personality</li>
                                        <li>Good lighting and clear audio</li>
                                        <li>Mention the types of brands you&apos;d like to work with</li>
                                    </ul>
                                </div>
                                <MediaUpload
                                    type='audition'
                                    accept='video'
                                    onUploadComplete={handleUploadComplete}
                                    onError={setError}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Your Audition Videos ({filteredMedia.length})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <MediaGallery
                                    media={filteredMedia}
                                    onDelete={handleDelete}
                                    editable
                                />
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            {/* Add details modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => {
                    setShowAddModal(false)
                    setPendingUpload(null)
                    setNewMediaTitle('')
                    setNewMediaDescription('')
                }}
                title='Add Details'
            >
                <div className='space-y-4'>
                    <Input
                        label='Title (optional)'
                        value={newMediaTitle}
                        onChange={(e) => setNewMediaTitle(e.target.value)}
                        placeholder='e.g., Kitchen Renovation Project'
                    />
                    <div>
                        <label className='block text-sm font-medium text-[var(--color-text-secondary)] mb-1'>
                            Description (optional)
                        </label>
                        <textarea
                            value={newMediaDescription}
                            onChange={(e) => setNewMediaDescription(e.target.value)}
                            placeholder='Tell brands about this work...'
                            rows={3}
                            className='w-full px-4 py-3 border rounded-xl text-[var(--color-text-primary)] bg-[var(--color-bg-card)] border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-green)]/50'
                        />
                    </div>
                    <div className='flex gap-3 pt-4'>
                        <Button
                            variant='secondary'
                            onClick={() => {
                                setShowAddModal(false)
                                setPendingUpload(null)
                            }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSaveWithDetails}>
                            Save
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

