import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

/**
 * One-time utility endpoint to promote a user to admin
 * SECURITY: This should be removed or protected after first use
 * 
 * Usage: POST /api/admin/promote
 * Body: { email: 'user@example.com' }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email } = body

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            )
        }

        // Find user by email
        const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers()
        
        if (userError) {
            return NextResponse.json(
                { error: `Failed to find users: ${userError.message}` },
                { status: 500 }
            )
        }

        const user = users.users.find(u => u.email === email)
        
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        // Update user profile role to admin
        const { error: updateError } = await supabaseAdmin
            .from('user_profiles')
            .update({ role: 'admin' })
            .eq('id', user.id)

        if (updateError) {
            return NextResponse.json(
                { error: `Failed to update role: ${updateError.message}` },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: `User ${email} has been promoted to admin`,
            userId: user.id,
        })
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}
