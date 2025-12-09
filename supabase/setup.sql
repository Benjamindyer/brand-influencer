-- Brand Influencer Platform - Complete Database Setup
-- Run this file in your Supabase SQL Editor to set up the entire database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Trades table (construction industry trades)
CREATE TABLE IF NOT EXISTS trades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (extends Supabase auth.users with role)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('creator', 'brand', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Creator profiles table
CREATE TABLE IF NOT EXISTS creator_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    profile_photo_url TEXT,
    location_city VARCHAR(100),
    location_country VARCHAR(100),
    bio TEXT,
    primary_trade_id UUID REFERENCES trades(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Brand profiles table
CREATE TABLE IF NOT EXISTS brand_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    industry_segment VARCHAR(100),
    website VARCHAR(255),
    description TEXT,
    contact_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Creator trades (many-to-many for additional trades)
CREATE TABLE IF NOT EXISTS creator_trades (
    creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
    trade_id UUID NOT NULL REFERENCES trades(id) ON DELETE CASCADE,
    PRIMARY KEY (creator_id, trade_id)
);

-- Social accounts table
CREATE TABLE IF NOT EXISTS social_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,
    follower_count INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5, 2),
    average_reach INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Featured content table
CREATE TABLE IF NOT EXISTS featured_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
    thumbnail_url TEXT,
    post_url TEXT NOT NULL,
    platform VARCHAR(50),
    likes INTEGER,
    views INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Briefs table
CREATE TABLE IF NOT EXISTS briefs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES brand_profiles(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('standard', 'multi_creator')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    deliverables TEXT,
    compensation_type VARCHAR(50),
    fee_amount DECIMAL(10, 2),
    timeline VARCHAR(255),
    deadline TIMESTAMP WITH TIME ZONE,
    num_creators_required INTEGER DEFAULT 1,
    slots_filled INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'completed', 'full')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brief targeting table
CREATE TABLE IF NOT EXISTS brief_targeting (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brief_id UUID NOT NULL REFERENCES briefs(id) ON DELETE CASCADE,
    trade_id UUID REFERENCES trades(id),
    platform VARCHAR(50),
    min_followers INTEGER,
    min_engagement DECIMAL(5, 2),
    location VARCHAR(255)
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brief_id UUID NOT NULL REFERENCES briefs(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
    message TEXT,
    links TEXT[],
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(brief_id, creator_id)
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES brand_profiles(id) ON DELETE CASCADE,
    tier VARCHAR(20) NOT NULL CHECK (tier IN ('tier1', 'tier2', 'tier3')),
    stripe_subscription_id VARCHAR(255) UNIQUE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due')),
    current_period_end TIMESTAMP WITH TIME ZONE,
    campaign_credits INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(brand_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Favourites table
CREATE TABLE IF NOT EXISTS favourites (
    brand_id UUID NOT NULL REFERENCES brand_profiles(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (brand_id, creator_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_creator_profiles_user_id ON creator_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_primary_trade ON creator_profiles(primary_trade_id);
CREATE INDEX IF NOT EXISTS idx_brand_profiles_user_id ON brand_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_creator_id ON social_accounts(creator_id);
CREATE INDEX IF NOT EXISTS idx_featured_content_creator_id ON featured_content(creator_id);
CREATE INDEX IF NOT EXISTS idx_briefs_brand_id ON briefs(brand_id);
CREATE INDEX IF NOT EXISTS idx_briefs_status ON briefs(status);
CREATE INDEX IF NOT EXISTS idx_briefs_type ON briefs(type);
CREATE INDEX IF NOT EXISTS idx_brief_targeting_brief_id ON brief_targeting(brief_id);
CREATE INDEX IF NOT EXISTS idx_applications_brief_id ON applications(brief_id);
CREATE INDEX IF NOT EXISTS idx_applications_creator_id ON applications(creator_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_brand_id ON subscriptions(brand_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_favourites_brand_id ON favourites(brand_id);
CREATE INDEX IF NOT EXISTS idx_favourites_creator_id ON favourites(creator_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_creator_profiles_updated_at ON creator_profiles;
CREATE TRIGGER update_creator_profiles_updated_at BEFORE UPDATE ON creator_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_brand_profiles_updated_at ON brand_profiles;
CREATE TRIGGER update_brand_profiles_updated_at BEFORE UPDATE ON brand_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_social_accounts_updated_at ON social_accounts;
CREATE TRIGGER update_social_accounts_updated_at BEFORE UPDATE ON social_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_featured_content_updated_at ON featured_content;
CREATE TRIGGER update_featured_content_updated_at BEFORE UPDATE ON featured_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_briefs_updated_at ON briefs;
CREATE TRIGGER update_briefs_updated_at BEFORE UPDATE ON briefs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE brief_targeting ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE favourites ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

-- Trades: Public read access
DROP POLICY IF EXISTS "Trades are viewable by everyone" ON trades;
CREATE POLICY "Trades are viewable by everyone" ON trades
    FOR SELECT USING (true);

-- User profiles: Users can read their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

-- User profiles: Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Creator profiles: Creators can read/update own profile
DROP POLICY IF EXISTS "Creators can view own profile" ON creator_profiles;
CREATE POLICY "Creators can view own profile" ON creator_profiles
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Creators can update own profile" ON creator_profiles;
CREATE POLICY "Creators can update own profile" ON creator_profiles
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Creators can insert own profile" ON creator_profiles;
CREATE POLICY "Creators can insert own profile" ON creator_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Creator profiles: Brands can view all creator profiles
DROP POLICY IF EXISTS "Brands can view creator profiles" ON creator_profiles;
CREATE POLICY "Brands can view creator profiles" ON creator_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'brand'
        )
    );

-- Brand profiles: Brands can read/update own profile
DROP POLICY IF EXISTS "Brands can view own profile" ON brand_profiles;
CREATE POLICY "Brands can view own profile" ON brand_profiles
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Brands can update own profile" ON brand_profiles;
CREATE POLICY "Brands can update own profile" ON brand_profiles
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Brands can insert own profile" ON brand_profiles;
CREATE POLICY "Brands can insert own profile" ON brand_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Creator trades: Creators can manage their own trades
DROP POLICY IF EXISTS "Creators can manage own trades" ON creator_trades;
CREATE POLICY "Creators can manage own trades" ON creator_trades
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM creator_profiles
            WHERE id = creator_id AND user_id = auth.uid()
        )
    );

-- Social accounts: Creators can manage their own accounts
DROP POLICY IF EXISTS "Creators can manage own social accounts" ON social_accounts;
CREATE POLICY "Creators can manage own social accounts" ON social_accounts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM creator_profiles
            WHERE id = creator_id AND user_id = auth.uid()
        )
    );

-- Social accounts: Brands can view creator social accounts
DROP POLICY IF EXISTS "Brands can view creator social accounts" ON social_accounts;
CREATE POLICY "Brands can view creator social accounts" ON social_accounts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'brand'
        )
    );

-- Featured content: Creators can manage their own content
DROP POLICY IF EXISTS "Creators can manage own content" ON featured_content;
CREATE POLICY "Creators can manage own content" ON featured_content
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM creator_profiles
            WHERE id = creator_id AND user_id = auth.uid()
        )
    );

-- Featured content: Brands can view creator content
DROP POLICY IF EXISTS "Brands can view creator content" ON featured_content;
CREATE POLICY "Brands can view creator content" ON featured_content
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'brand'
        )
    );

-- Briefs: Brands can manage their own briefs
DROP POLICY IF EXISTS "Brands can manage own briefs" ON briefs;
CREATE POLICY "Brands can manage own briefs" ON briefs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM brand_profiles
            WHERE id = brand_id AND user_id = auth.uid()
        )
    );

-- Briefs: Creators can view open briefs
DROP POLICY IF EXISTS "Creators can view open briefs" ON briefs;
CREATE POLICY "Creators can view open briefs" ON briefs
    FOR SELECT USING (
        status = 'open' AND
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'creator'
        )
    );

-- Brief targeting: Same as briefs
DROP POLICY IF EXISTS "Brief targeting follows brief access" ON brief_targeting;
CREATE POLICY "Brief targeting follows brief access" ON brief_targeting
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM briefs
            WHERE id = brief_id
        )
    );

-- Applications: Creators can create and view their own applications
DROP POLICY IF EXISTS "Creators can manage own applications" ON applications;
CREATE POLICY "Creators can manage own applications" ON applications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM creator_profiles
            WHERE id = creator_id AND user_id = auth.uid()
        )
    );

-- Applications: Brands can view applications for their briefs
DROP POLICY IF EXISTS "Brands can view brief applications" ON applications;
CREATE POLICY "Brands can view brief applications" ON applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM briefs b
            JOIN brand_profiles bp ON b.brand_id = bp.id
            WHERE b.id = brief_id AND bp.user_id = auth.uid()
        )
    );

-- Applications: Brands can update applications for their briefs
DROP POLICY IF EXISTS "Brands can update brief applications" ON applications;
CREATE POLICY "Brands can update brief applications" ON applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM briefs b
            JOIN brand_profiles bp ON b.brand_id = bp.id
            WHERE b.id = brief_id AND bp.user_id = auth.uid()
        )
    );

-- Subscriptions: Brands can view their own subscriptions
DROP POLICY IF EXISTS "Brands can view own subscriptions" ON subscriptions;
CREATE POLICY "Brands can view own subscriptions" ON subscriptions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM brand_profiles
            WHERE id = brand_id AND user_id = auth.uid()
        )
    );

-- Notifications: Users can view their own notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

-- Notifications: Users can update their own notifications
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Favourites: Brands can manage their own favourites
DROP POLICY IF EXISTS "Brands can manage own favourites" ON favourites;
CREATE POLICY "Brands can manage own favourites" ON favourites
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM brand_profiles
            WHERE id = brand_id AND user_id = auth.uid()
        )
    );

