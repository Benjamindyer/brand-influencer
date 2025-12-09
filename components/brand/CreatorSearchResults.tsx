'use client'

import { CreatorCard } from './CreatorCard'

interface CreatorSearchResultsProps {
    creators: any[]
    loading?: boolean
}

export function CreatorSearchResults({ creators, loading = false }: CreatorSearchResultsProps) {
    if (loading) {
        return (
            <div className='text-center py-8'>
                <p>Loading...</p>
            </div>
        )
    }
    
    if (creators.length === 0) {
        return (
            <div className='text-center py-8 text-[var(--color-neutral-500)]'>
                No creators found. Try adjusting your filters.
            </div>
        )
    }
    
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {creators.map((creator) => (
                <CreatorCard key={creator.id} creator={creator} />
            ))}
        </div>
    )
}

