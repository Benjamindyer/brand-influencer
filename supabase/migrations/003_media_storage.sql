-- Media storage for creator portfolios
-- Run this in the Supabase SQL Editor

-- Portfolio media table for photos, videos, and auditions
CREATE TABLE IF NOT EXISTS portfolio_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('headshot', 'portfolio', 'audition')),
    media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('image', 'video')),
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    title VARCHAR(255),
    description TEXT,
    file_size INTEGER,
    duration INTEGER, -- for videos, in seconds
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add profile_photo_url to creator_profiles if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'creator_profiles' AND column_name = 'profile_photo_url'
    ) THEN
        ALTER TABLE creator_profiles ADD COLUMN profile_photo_url TEXT;
    END IF;
END $$;

-- Add cover_photo_url to creator_profiles for profile banner
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'creator_profiles' AND column_name = 'cover_photo_url'
    ) THEN
        ALTER TABLE creator_profiles ADD COLUMN cover_photo_url TEXT;
    END IF;
END $$;

-- Enable RLS on portfolio_media
ALTER TABLE portfolio_media ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view portfolio media (public portfolios)
DROP POLICY IF EXISTS "Portfolio media is viewable by everyone" ON portfolio_media;
CREATE POLICY "Portfolio media is viewable by everyone" ON portfolio_media
    FOR SELECT USING (true);

-- Policy: Creators can manage their own media
DROP POLICY IF EXISTS "Creators can manage own media" ON portfolio_media;
CREATE POLICY "Creators can manage own media" ON portfolio_media
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM creator_profiles
            WHERE id = creator_id AND user_id = auth.uid()
        )
    );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_portfolio_media_creator ON portfolio_media(creator_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_media_type ON portfolio_media(type);

