'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { CreatorCard } from '@/components/brand/CreatorCard'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export default function FavouritesPage() {
    const [creators, setCreators] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        loadFavourites()
    }, [])
    
    async function loadFavourites() {
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            
            if (!user) return
            
            const { data: brandProfile } = await supabase
                .from('brand_profiles')
                .select('id')
                .eq('user_id', user.id)
                .single()
            
            if (!brandProfile) return
            
            const { data: favourites } = await supabase
                .from('favourites')
                .select(`
                    creator:creator_profiles(
                        *,
                        primary_trade:trades!creator_profiles_primary_trade_id_fkey(*),
                        social_accounts(*)
                    )
                `)
                .eq('brand_id', brandProfile.id)
            
            if (favourites) {
                setCreators(favourites.map((f: any) => f.creator).filter(Boolean))
            }
        } catch (error) {
            console.error('Failed to load favourites:', error)
        } finally {
            setLoading(false)
        }
    }
    
    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <p>Loading...</p>
            </div>
        )
    }
    
    return (
        <div className='min-h-screen bg-transparent p-4'>
            <div className='max-w-7xl mx-auto mt-8'>
                <Card className='mb-6'>
                    <CardHeader>
                        <CardTitle>Favourite Creators</CardTitle>
                    </CardHeader>
                </Card>
                
                {creators.length === 0 ? (
                    <Card>
                        <CardContent className='text-center py-8 text-[var(--color-text-tertiary)]'>
                            No favourite creators yet. Start searching and add creators to your favourites!
                        </CardContent>
                    </Card>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {creators.map((creator) => (
                            <CreatorCard key={creator.id} creator={creator} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

