import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export default function Home() {
    return (
        <main className='min-h-screen'>
            {/* Hero Section */}
            <section className='py-20'>
                <div className='max-w-6xl mx-auto px-4'>
                    <div className='text-center mb-12'>
                        <h1 className='text-6xl md:text-7xl font-bold mb-6 text-[var(--color-text-primary)]'>
                            Brand Influencer
                        </h1>
                        <p className='text-2xl md:text-3xl text-[var(--color-text-secondary)] mb-4 max-w-3xl mx-auto'>
                            Connect construction industry brands with creators, influencers, and tradespeople
                        </p>
                        <p className='text-lg text-[var(--color-text-tertiary)] mb-10 max-w-2xl mx-auto'>
                            The premier platform for authentic partnerships in the construction and building industry
                        </p>
                        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                            <Link href='/auth/register'>
                                <Button variant='primary' size='lg' className='min-w-[160px]'>
                                    Get Started Free
                                </Button>
                            </Link>
                            <Link href='/auth/login'>
                                <Button variant='outline' size='lg' className='min-w-[160px]'>
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className='py-20'>
                <div className='max-w-6xl mx-auto px-4'>
                    <div className='text-center mb-16'>
                        <h2 className='text-4xl font-bold mb-4 text-[var(--color-text-primary)]'>
                            Why Choose Brand Influencer?
                        </h2>
                        <p className='text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto'>
                            A powerful platform designed specifically for the construction industry
                        </p>
                    </div>
                    
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-16'>
                        <Card className='h-full'>
                            <CardHeader>
                                <div className='text-4xl mb-4'>👷</div>
                                <CardTitle className='text-2xl'>For Creators & Tradespeople</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className='space-y-3 text-base text-[var(--color-text-secondary)]'>
                                    <li className='flex items-start'>
                                        <span className='text-[var(--color-success-500)] mr-2 font-bold'>✓</span>
                                        <span>Build a professional profile showcasing your expertise</span>
                                    </li>
                                    <li className='flex items-start'>
                                        <span className='text-[var(--color-success-500)] mr-2 font-bold'>✓</span>
                                        <span>Display your portfolio, work samples, and social accounts</span>
                                    </li>
                                    <li className='flex items-start'>
                                        <span className='text-[var(--color-success-500)] mr-2 font-bold'>✓</span>
                                        <span>Browse and apply to relevant campaign briefs</span>
                                    </li>
                                    <li className='flex items-start'>
                                        <span className='text-[var(--color-success-500)] mr-2 font-bold'>✓</span>
                                        <span>Connect with brands seeking your specific trade skills</span>
                                    </li>
                                    <li className='flex items-start'>
                                        <span className='text-[var(--color-success-500)] mr-2 font-bold'>✓</span>
                                        <span>Grow your following and monetize your expertise</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                        
                        <Card className='h-full'>
                            <CardHeader>
                                <div className='text-4xl mb-4'>🏗️</div>
                                <CardTitle className='text-2xl'>For Brands</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className='space-y-3 text-base text-[var(--color-text-secondary)]'>
                                    <li className='flex items-start'>
                                        <span className='text-[var(--color-success-500)] mr-2 font-bold'>✓</span>
                                        <span>Search and filter creators by trade, location, and expertise</span>
                                    </li>
                                    <li className='flex items-start'>
                                        <span className='text-[var(--color-success-500)] mr-2 font-bold'>✓</span>
                                        <span>Post detailed campaign briefs with requirements</span>
                                    </li>
                                    <li className='flex items-start'>
                                        <span className='text-[var(--color-success-500)] mr-2 font-bold'>✓</span>
                                        <span>Manage applications and review creator portfolios</span>
                                    </li>
                                    <li className='flex items-start'>
                                        <span className='text-[var(--color-success-500)] mr-2 font-bold'>✓</span>
                                        <span>Launch multi-creator campaigns with ease</span>
                                    </li>
                                    <li className='flex items-start'>
                                        <span className='text-[var(--color-success-500)] mr-2 font-bold'>✓</span>
                                        <span>Track campaign performance and ROI</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className='py-20'>
                <div className='max-w-6xl mx-auto px-4'>
                    <div className='text-center mb-16'>
                        <h2 className='text-4xl font-bold mb-4 text-[var(--color-text-primary)]'>
                            How It Works
                        </h2>
                        <p className='text-lg text-[var(--color-text-secondary)]'>
                            Get started in three simple steps
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        <Card>
                            <CardContent className='text-center pt-8'>
                                <div className='w-16 h-16 bg-[var(--color-primary-600)] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4'>
                                    1
                                </div>
                                <h3 className='text-xl font-semibold mb-3 text-[var(--color-text-primary)]'>Sign Up</h3>
                                <p className='text-[var(--color-text-secondary)]'>
                                    Create your account as a creator or brand. Set up your profile with your expertise and requirements.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className='text-center pt-8'>
                                <div className='w-16 h-16 bg-[var(--color-primary-600)] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4'>
                                    2
                                </div>
                                <h3 className='text-xl font-semibold mb-3'>Connect</h3>
                                <p className='text-[var(--color-text-secondary)]'>
                                    Brands post briefs or search creators. Creators browse opportunities and apply to relevant campaigns.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className='text-center pt-8'>
                                <div className='w-16 h-16 bg-[var(--color-primary-600)] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4'>
                                    3
                                </div>
                                <h3 className='text-xl font-semibold mb-3'>Collaborate</h3>
                                <p className='text-[var(--color-text-secondary)]'>
                                    Review applications, select the perfect match, and launch successful campaigns together.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Industry Focus Section */}
            <section className='py-20'>
                <div className='max-w-6xl mx-auto px-4'>
                    <div className='text-center mb-12'>
                        <h2 className='text-4xl font-bold mb-4 text-[var(--color-text-primary)]'>
                            Built for the Construction Industry
                        </h2>
                        <p className='text-lg text-[var(--color-text-secondary)] max-w-3xl mx-auto mb-12'>
                            Our platform understands the unique needs of construction brands and tradespeople. 
                            Whether you're a plumber, electrician, builder, or construction brand, we've got you covered.
                        </p>
                    </div>

                    <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
                        {['Plumbing', 'Electrical', 'Carpentry', 'HVAC', 'Roofing', 'Concrete', 'Landscaping', 'General Building'].map((trade) => (
                            <Card key={trade} className='text-center'>
                                <CardContent className='py-6'>
                                    <div className='text-3xl mb-2'>🔧</div>
                                    <h3 className='font-semibold text-[var(--color-text-primary)]'>{trade}</h3>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className='py-20 relative'>
                <div className='absolute inset-0 bg-gradient-to-r from-[var(--color-primary-600)]/20 to-[var(--color-secondary-600)]/20 blur-3xl'></div>
                <div className='max-w-4xl mx-auto px-4 text-center relative z-10'>
                    <h2 className='text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-6'>
                        Ready to Get Started?
                    </h2>
                    <p className='text-xl text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto'>
                        Join brands and creators already using Brand Influencer to build meaningful partnerships
                    </p>
                    <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                        <Link href='/auth/register'>
                            <Button 
                                variant='primary' 
                                size='lg' 
                                className='min-w-[160px]'
                            >
                                Create Account
                            </Button>
                        </Link>
                        <Link href='/auth/login'>
                            <Button 
                                variant='outline' 
                                size='lg' 
                                className='min-w-[160px]'
                            >
                                Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    )
}
