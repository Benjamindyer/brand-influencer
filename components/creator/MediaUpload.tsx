'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES, MAX_IMAGE_SIZE, MAX_VIDEO_SIZE, MediaType } from '@/types/media'

interface MediaUploadProps {
    type: MediaType
    onUploadComplete: (data: {
        url: string
        media_type: 'image' | 'video'
        file_size: number
    }) => void
    onError?: (error: string) => void
    accept?: 'image' | 'video' | 'both'
    maxFiles?: number
    className?: string
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
    type,
    onUploadComplete,
    onError,
    accept = 'both',
    className = ''
}) => {
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [preview, setPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const acceptedTypes = accept === 'image' 
        ? ALLOWED_IMAGE_TYPES.join(',')
        : accept === 'video'
            ? ALLOWED_VIDEO_TYPES.join(',')
            : [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].join(',')

    const validateFile = (file: File): string | null => {
        const isImage = ALLOWED_IMAGE_TYPES.includes(file.type)
        const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type)

        if (!isImage && !isVideo) {
            return 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP, MP4, WebM, MOV'
        }

        if (accept === 'image' && !isImage) {
            return 'Only image files are allowed'
        }

        if (accept === 'video' && !isVideo) {
            return 'Only video files are allowed'
        }

        const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE
        if (file.size > maxSize) {
            const maxMB = maxSize / (1024 * 1024)
            return `File too large. Maximum size is ${maxMB}MB`
        }

        return null
    }

    const uploadFile = async (file: File) => {
        const error = validateFile(file)
        if (error) {
            onError?.(error)
            return
        }

        setIsUploading(true)
        setUploadProgress(0)

        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
            setPreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('type', type)

            // Simulate progress (actual progress requires XMLHttpRequest)
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90))
            }, 100)

            const response = await fetch('/api/creator/media/upload', {
                method: 'POST',
                body: formData
            })

            clearInterval(progressInterval)

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Upload failed')
            }

            setUploadProgress(100)
            const data = await response.json()
            onUploadComplete(data)

            // Reset after short delay
            setTimeout(() => {
                setPreview(null)
                setUploadProgress(0)
            }, 1000)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Upload failed'
            onError?.(message)
            setPreview(null)
        } finally {
            setIsUploading(false)
        }
    }

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        
        const files = Array.from(e.dataTransfer.files)
        if (files.length > 0) {
            uploadFile(files[0])
        }
    }, [type])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            uploadFile(files[0])
        }
    }

    const typeLabels: Record<MediaType, string> = {
        headshot: 'Profile Photo',
        portfolio: 'Portfolio Item',
        audition: 'Audition Video'
    }

    const typeDescriptions: Record<MediaType, string> = {
        headshot: 'Upload a professional headshot (recommended: 400x400px or larger)',
        portfolio: 'Upload photos or videos of your previous work',
        audition: 'Upload a short video introducing yourself to brands'
    }

    return (
        <div className={className}>
            <div
                className={`
                    relative border-2 border-dashed rounded-xl p-8
                    transition-all duration-200 cursor-pointer
                    ${isDragging 
                        ? 'border-[var(--color-accent-green)] bg-[var(--color-accent-green)]/10' 
                        : 'border-[var(--color-border)] hover:border-[var(--color-accent-green)]/50'
                    }
                    ${isUploading ? 'pointer-events-none' : ''}
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type='file'
                    accept={acceptedTypes}
                    onChange={handleFileSelect}
                    className='hidden'
                />

                {preview ? (
                    <div className='flex flex-col items-center gap-4'>
                        {preview.startsWith('data:video') ? (
                            <video 
                                src={preview} 
                                className='max-h-48 rounded-lg'
                                controls={false}
                            />
                        ) : (
                            <img 
                                src={preview} 
                                alt='Preview' 
                                className='max-h-48 rounded-lg object-cover'
                            />
                        )}
                        {isUploading && (
                            <div className='w-full max-w-xs'>
                                <div className='h-2 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden'>
                                    <div 
                                        className='h-full bg-[var(--color-accent-green)] transition-all duration-300'
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                <p className='text-sm text-[var(--color-text-secondary)] text-center mt-2'>
                                    Uploading... {uploadProgress}%
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className='flex flex-col items-center gap-4 text-center'>
                        <div className='w-16 h-16 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center'>
                            {accept === 'video' ? (
                                <svg className='w-8 h-8 text-[var(--color-text-tertiary)]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' />
                                </svg>
                            ) : (
                                <svg className='w-8 h-8 text-[var(--color-text-tertiary)]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                </svg>
                            )}
                        </div>
                        <div>
                            <p className='text-lg font-medium text-[var(--color-text-primary)]'>
                                {typeLabels[type]}
                            </p>
                            <p className='text-sm text-[var(--color-text-secondary)] mt-1'>
                                {typeDescriptions[type]}
                            </p>
                        </div>
                        <p className='text-sm text-[var(--color-text-tertiary)]'>
                            Drag and drop or <span className='text-[var(--color-accent-green)]'>browse</span>
                        </p>
                        <p className='text-xs text-[var(--color-text-tertiary)]'>
                            {accept === 'image' && 'JPEG, PNG, GIF, WebP (max 10MB)'}
                            {accept === 'video' && 'MP4, WebM, MOV (max 50MB)'}
                            {accept === 'both' && 'Images (max 10MB) or Videos (max 50MB)'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

// Gallery component for displaying uploaded media
interface MediaGalleryProps {
    media: Array<{
        id: string
        url: string
        media_type: 'image' | 'video'
        title?: string
        type: MediaType
    }>
    onDelete?: (id: string) => void
    editable?: boolean
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({
    media,
    onDelete,
    editable = false
}) => {
    const [playingVideo, setPlayingVideo] = useState<string | null>(null)

    if (media.length === 0) {
        return (
            <div className='text-center py-12 text-[var(--color-text-tertiary)]'>
                <svg className='w-12 h-12 mx-auto mb-4 opacity-50' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                </svg>
                <p>No media uploaded yet</p>
            </div>
        )
    }

    return (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {media.map((item) => (
                <div 
                    key={item.id}
                    className='relative group aspect-square rounded-xl overflow-hidden bg-[var(--color-bg-secondary)]'
                >
                    {item.media_type === 'video' ? (
                        <div className='relative w-full h-full'>
                            <video
                                src={item.url}
                                className='w-full h-full object-cover'
                                controls={playingVideo === item.id}
                                onPlay={() => setPlayingVideo(item.id)}
                                onPause={() => setPlayingVideo(null)}
                            />
                            {playingVideo !== item.id && (
                                <div 
                                    className='absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer'
                                    onClick={() => {
                                        const video = document.querySelector(`video[src="${item.url}"]`) as HTMLVideoElement
                                        video?.play()
                                    }}
                                >
                                    <div className='w-12 h-12 rounded-full bg-white/90 flex items-center justify-center'>
                                        <svg className='w-6 h-6 text-[var(--color-bg-primary)] ml-1' fill='currentColor' viewBox='0 0 24 24'>
                                            <path d='M8 5v14l11-7z' />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <img
                            src={item.url}
                            alt={item.title || 'Portfolio item'}
                            className='w-full h-full object-cover'
                        />
                    )}

                    {editable && onDelete && (
                        <button
                            onClick={() => onDelete(item.id)}
                            className='absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'
                            title='Delete'
                        >
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                            </svg>
                        </button>
                    )}

                    {item.title && (
                        <div className='absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent'>
                            <p className='text-white text-sm truncate'>{item.title}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

