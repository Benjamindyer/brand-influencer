import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Sidebar } from '@/components/layout/Sidebar'

export default async function CreatorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    )
    
    const {
        data: { user },
    } = await supabase.auth.getUser()
    
    if (!user) {
        redirect('/auth/login')
    }
    
    const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()
    
    if (profile?.role !== 'creator') {
        redirect('/unauthorized')
    }
    
    return (
        <div className='flex min-h-screen'>
            <Sidebar role={profile.role} user={user} />
            <main className='flex-1 ml-64'>
                {children}
            </main>
        </div>
    )
}

