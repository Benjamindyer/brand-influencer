export interface CreatorProfile {
    id: string
    user_id: string
    name: string
    display_name: string | null
    profile_photo_url: string | null
    location_city: string | null
    location_country: string | null
    bio: string | null
    primary_trade_id: string | null
    created_at: string
    updated_at: string
}

export interface CreatorProfileWithTrades extends CreatorProfile {
    primary_trade?: {
        id: string
        name: string
        slug: string
    }
    additional_trades?: Array<{
        id: string
        name: string
        slug: string
    }>
}

export interface SocialAccount {
    id: string
    creator_id: string
    platform: 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'other'
    url: string
    follower_count: number
    engagement_rate: number
    average_reach: number
    created_at: string
    updated_at: string
}

export interface FeaturedContent {
    id: string
    creator_id: string
    thumbnail_url: string
    post_url: string
    platform: string
    likes: number | null
    views: number | null
    created_at: string
    updated_at: string
}

