export type MediaType = 'headshot' | 'portfolio' | 'audition'
export type MediaFileType = 'image' | 'video'

export interface PortfolioMedia {
    id: string
    creator_id: string
    type: MediaType
    media_type: MediaFileType
    url: string
    thumbnail_url?: string
    title?: string
    description?: string
    file_size?: number
    duration?: number // for videos, in seconds
    sort_order: number
    created_at: string
    updated_at: string
}

export interface UploadedFile {
    url: string
    path: string
    thumbnailUrl?: string
}

export interface MediaUploadResponse {
    success: boolean
    media?: PortfolioMedia
    error?: string
}

export const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
]

export const ALLOWED_VIDEO_TYPES = [
    'video/mp4',
    'video/webm',
    'video/quicktime'
]

export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB for images

export const MAX_VIDEO_SIZE = 50 * 1024 * 1024 // 50MB for videos

