import { supabase } from '@/lib/supabase/client'

export async function getBrandCredits(brandId: string): Promise<number> {
    const { data, error } = await supabase
        .from('subscriptions')
        .select('campaign_credits')
        .eq('brand_id', brandId)
        .single()
    
    if (error || !data) {
        return 0
    }
    
    return data.campaign_credits || 0
}

export async function deductCredit(brandId: string): Promise<boolean> {
    const { data: subscription, error: fetchError } = await supabase
        .from('subscriptions')
        .select('campaign_credits')
        .eq('brand_id', brandId)
        .single()
    
    if (fetchError || !subscription) {
        return false
    }
    
    if (subscription.campaign_credits <= 0) {
        return false
    }
    
    const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
            campaign_credits: subscription.campaign_credits - 1,
        })
        .eq('brand_id', brandId)
    
    return !updateError
}

