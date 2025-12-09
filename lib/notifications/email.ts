import { resend } from '@/lib/resend'

export async function sendBriefMatchEmail(to: string, briefTitle: string, brandName: string) {
    try {
        await resend.emails.send({
            from: 'Brand Influencer <noreply@brandinfluencer.com>',
            to,
            subject: `New Brief Match: ${briefTitle}`,
            html: `
                <h2>New Brief Match!</h2>
                <p>A new brief has been posted that matches your profile:</p>
                <h3>${briefTitle}</h3>
                <p>Brand: ${brandName}</p>
                <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/creator/briefs">View Brief</a></p>
            `,
        })
    } catch (error) {
        console.error('Failed to send brief match email:', error)
        throw error
    }
}

export async function sendApplicationAcceptedEmail(to: string, briefTitle: string, brandName: string) {
    try {
        await resend.emails.send({
            from: 'Brand Influencer <noreply@brandinfluencer.com>',
            to,
            subject: `Application Accepted: ${briefTitle}`,
            html: `
                <h2>Congratulations!</h2>
                <p>Your application has been accepted:</p>
                <h3>${briefTitle}</h3>
                <p>Brand: ${brandName}</p>
                <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/creator/applications">View Application</a></p>
            `,
        })
    } catch (error) {
        console.error('Failed to send acceptance email:', error)
        throw error
    }
}

export async function sendApplicationRejectedEmail(to: string, briefTitle: string, brandName: string) {
    try {
        await resend.emails.send({
            from: 'Brand Influencer <noreply@brandinfluencer.com>',
            to,
            subject: `Application Update: ${briefTitle}`,
            html: `
                <h2>Application Update</h2>
                <p>Unfortunately, your application was not selected:</p>
                <h3>${briefTitle}</h3>
                <p>Brand: ${brandName}</p>
                <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/creator/applications">View Application</a></p>
            `,
        })
    } catch (error) {
        console.error('Failed to send rejection email:', error)
        throw error
    }
}

export async function sendSubscriptionConfirmationEmail(to: string, tier: string) {
    try {
        await resend.emails.send({
            from: 'Brand Influencer <noreply@brandinfluencer.com>',
            to,
            subject: 'Subscription Confirmed',
            html: `
                <h2>Subscription Confirmed!</h2>
                <p>Your ${tier} subscription has been activated.</p>
                <p>You can now create multi-creator campaigns.</p>
                <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/brand/dashboard">Go to Dashboard</a></p>
            `,
        })
    } catch (error) {
        console.error('Failed to send subscription confirmation:', error)
        throw error
    }
}

