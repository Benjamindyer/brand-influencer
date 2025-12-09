import { supabase } from '@/lib/supabase/client'

export interface NotificationData {
    user_id: string
    type: string
    title: string
    message: string
}

export async function createNotification(data: NotificationData): Promise<void> {
    const { error } = await supabase
        .from('notifications')
        .insert({
            user_id: data.user_id,
            type: data.type,
            title: data.title,
            message: data.message,
            read: false,
        })
    
    if (error) {
        throw new Error(`Failed to create notification: ${error.message}`)
    }
}

