import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export default function Home() {
    return (
        <main className='min-h-screen bg-[var(--color-neutral-100)]'>
            <div className='max-w-4xl mx-auto px-4 py-16'>
                <div className='text-center mb-12'>
                    <h1 className='text-5xl font-bold mb-4'>Brand Influencer</h1>
                    <p className='text-xl text-[var(--color-neutral-600)] mb-8'>
                        Connect construction industry brands with creators, influencers, and tradespeople
                    </p>
                    <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                        <Link href='/register'>
                            <Button variant='primary' size='lg'>
                                Get Started
                            </Button>
                        </Link>
                        <Link href='/login'>
                            <Button variant='outline' size='lg'>
                                Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
                
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
                    <Card>
                        <CardHeader>
                            <CardTitle>For Creators</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className='space-y-2 text-sm text-[var(--color-neutral-700)]'>
                                <li>✓ Build your professional profile</li>
                                <li>✓ Showcase your work and social accounts</li>
                                <li>✓ Apply to relevant briefs</li>
                                <li>✓ Connect with brands in your industry</li>
                            </ul>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>For Brands</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className='space-y-2 text-sm text-[var(--color-neutral-700)]'>
                                <li>✓ Search and filter creators</li>
                                <li>✓ Post campaign briefs</li>
                                <li>✓ Manage applications</li>
                                <li>✓ Multi-creator campaign support</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    )
}
