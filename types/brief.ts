export type BriefType = 'standard' | 'multi_creator'
export type BriefStatus = 'open' | 'full' | 'completed' | 'cancelled'
export type CompensationType = 'fee' | 'product_only' | 'negotiable'
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected'

export interface Brief {
    id: string
    brand_id: string
    type: BriefType
    title: string
    description: string
    deliverables: string | null
    compensation_type: CompensationType | null
    fee_amount: number | null
    timeline: string | null
    deadline: string | null
    num_creators_required: number
    slots_filled: number
    status: BriefStatus
    created_at: string
    updated_at: string
}

export interface BriefTargeting {
    id: string
    brief_id: string
    trade_id: string | null
    platform: string | null
    min_followers: number | null
    min_engagement: number | null
    location: string | null
}

export interface Application {
    id: string
    brief_id: string
    creator_id: string
    message: string | null
    links: string[] | null
    status: ApplicationStatus
    created_at: string
    updated_at: string
}

