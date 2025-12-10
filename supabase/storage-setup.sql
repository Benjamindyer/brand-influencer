-- Supabase Storage Setup
-- Run these commands in the Supabase SQL Editor to set up storage buckets

-- Create the media bucket for creator uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'media',
    'media',
    true,
    52428800, -- 50MB limit
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'];

-- Storage policies for the media bucket

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload media" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'media' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Allow users to update their own files
CREATE POLICY "Users can update own media" ON storage.objects
    FOR UPDATE TO authenticated
    USING (
        bucket_id = 'media' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Allow users to delete their own files
CREATE POLICY "Users can delete own media" ON storage.objects
    FOR DELETE TO authenticated
    USING (
        bucket_id = 'media' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Allow public read access to all media
CREATE POLICY "Public read access for media" ON storage.objects
    FOR SELECT TO public
    USING (bucket_id = 'media');

