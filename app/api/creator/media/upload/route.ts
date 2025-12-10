import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api-client'
import { supabaseAdmin } from '@/lib/supabase/server'
import { ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES, MAX_IMAGE_SIZE, MAX_VIDEO_SIZE } from '@/types/media'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createApiClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const formData = await request.formData()
        const file = formData.get('file') as File | null
        const type = formData.get('type') as string // headshot, portfolio, audition

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        if (!type || !['headshot', 'portfolio', 'audition'].includes(type)) {
            return NextResponse.json(
                { error: 'Invalid type. Must be: headshot, portfolio, or audition' },
                { status: 400 }
            )
        }

        // Validate file type
        const isImage = ALLOWED_IMAGE_TYPES.includes(file.type)
        const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type)

        if (!isImage && !isVideo) {
            return NextResponse.json(
                { error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP, MP4, WebM, MOV' },
                { status: 400 }
            )
        }

        // Validate file size
        const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE
        if (file.size > maxSize) {
            const maxMB = maxSize / (1024 * 1024)
            return NextResponse.json(
                { error: `File too large. Maximum size is ${maxMB}MB for ${isImage ? 'images' : 'videos'}` },
                { status: 400 }
            )
        }

        // Generate unique filename
        const ext = file.name.split('.').pop()
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(2, 8)
        const filename = `${type}_${timestamp}_${randomStr}.${ext}`
        const filePath = `${user.id}/${type}/${filename}`

        // Upload to Supabase Storage
        const arrayBuffer = await file.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)

        const { error: uploadError } = await supabaseAdmin.storage
            .from('media')
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: false
            })

        if (uploadError) {
            console.error('Upload error:', uploadError)
            return NextResponse.json(
                { error: 'Failed to upload file' },
                { status: 500 }
            )
        }

        // Get public URL
        const { data: urlData } = supabaseAdmin.storage
            .from('media')
            .getPublicUrl(filePath)

        const url = urlData.publicUrl

        // If this is a headshot, update the creator profile
        if (type === 'headshot') {
            const { data: profile } = await supabaseAdmin
                .from('creator_profiles')
                .select('id')
                .eq('user_id', user.id)
                .single()

            if (profile) {
                await supabaseAdmin
                    .from('creator_profiles')
                    .update({ profile_photo_url: url })
                    .eq('id', profile.id)
            }
        }

        return NextResponse.json({
            success: true,
            url,
            path: filePath,
            media_type: isImage ? 'image' : 'video',
            file_size: file.size
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
            }
        })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

