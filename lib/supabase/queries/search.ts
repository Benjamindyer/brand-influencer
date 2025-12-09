import { supabase } from '@/lib/supabase/client'

export interface SearchFilters {
    primary_trade?: string
    additional_trades?: string[]
    platforms?: string[]
    min_followers?: number
    max_followers?: number
    min_engagement?: number
    max_engagement?: number
    location?: string
    keyword?: string
}

export async function searchCreators(filters: SearchFilters, page = 1, pageSize = 20) {
    let query = supabase
        .from('creator_profiles')
        .select(`
            *,
            primary_trade:trades!creator_profiles_primary_trade_id_fkey(*),
            additional_trades:creator_trades(
                trade:trades(*)
            ),
            social_accounts(*)
        `)
    
    if (filters.primary_trade) {
        query = query.eq('primary_trade_id', filters.primary_trade)
    }
    
    if (filters.keyword) {
        query = query.or(`name.ilike.%${filters.keyword}%,display_name.ilike.%${filters.keyword}%,bio.ilike.%${filters.keyword}%`)
    }
    
    if (filters.location) {
        query = query.or(`location_city.ilike.%${filters.location}%,location_country.ilike.%${filters.location}%`)
    }
    
    const { data, error } = await query
        .range((page - 1) * pageSize, page * pageSize - 1)
        .order('created_at', { ascending: false })
    
    if (error) {
        throw new Error(`Failed to search creators: ${error.message}`)
    }
    
    // Filter by additional criteria in memory (for complex queries)
    let filtered = data || []
    
    if (filters.platforms && filters.platforms.length > 0) {
        filtered = filtered.filter((creator) => {
            return creator.social_accounts?.some((account: any) =>
                filters.platforms!.includes(account.platform)
            )
        })
    }
    
    if (filters.min_followers || filters.max_followers) {
        filtered = filtered.filter((creator) => {
            const totalFollowers = creator.social_accounts?.reduce(
                (sum: number, account: any) => sum + (account.follower_count || 0),
                0
            ) || 0
            
            if (filters.min_followers && totalFollowers < filters.min_followers) return false
            if (filters.max_followers && totalFollowers > filters.max_followers) return false
            return true
        })
    }
    
    if (filters.min_engagement || filters.max_engagement) {
        filtered = filtered.filter((creator) => {
            const avgEngagement = creator.social_accounts?.reduce(
                (sum: number, account: any, _: any, arr: any[]) =>
                    sum + (account.engagement_rate || 0) / arr.length,
                0
            ) || 0
            
            if (filters.min_engagement && avgEngagement < filters.min_engagement) return false
            if (filters.max_engagement && avgEngagement > filters.max_engagement) return false
            return true
        })
    }
    
    return filtered
}

