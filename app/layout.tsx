import type { Metadata } from 'next'
import './globals.css'
import { Navigation } from '@/components/layout/Navigation'

export const metadata: Metadata = {
    title: 'Brand Influencer',
    description: 'Connect brands with influencers',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang='en'>
            <body>
                <Navigation />
                {children}
            </body>
        </html>
    )
}
