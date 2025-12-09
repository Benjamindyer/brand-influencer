import { supabaseAdmin } from '@/lib/supabase/server'

export async function getPlatformMetrics() {
    const [
        { count: creatorCount },
        { count: brandCount },
        { count: briefCount },
        { count: applicationCount },
        { data: subscriptions },
    ] = await Promise.all([
        supabaseAdmin.from('creator_profiles').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('brand_profiles').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('briefs').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('applications').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('subscriptions').select('*'),
    ])
    
    const completedBriefs = await supabaseAdmin
        .from('briefs')
        .select('*', { count: 'exact', head: true })
        .in('status', ['completed', 'full'])
    
    const activeSubscriptions = subscriptions?.filter((s) => s.status === 'active').length || 0
    
    return {
        users: {
            creators: creatorCount || 0,
            brands: brandCount || 0,
            total: (creatorCount || 0) + (brandCount || 0),
        },
        briefs: {
            total: briefCount || 0,
            completed: completedBriefs.count || 0,
        },
        applications: applicationCount || 0,
        subscriptions: {
            total: subscriptions?.length || 0,
            active: activeSubscriptions,
        },
    }
}

