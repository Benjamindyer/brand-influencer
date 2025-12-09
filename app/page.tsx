import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export default function Home() {
    return (
        <main className='min-h-screen bg-[var(--color-neutral-100)]'>
            {/* Hero Section */}
            <section className='bg-gradient-to-b from-[var(--color-primary-50)] to-white py-20'>
                <div className='max-w-6xl mx-auto px-4'>
                    <div className='text-center mb-12'>
                        <h1 className='text-6xl md:text-7xl font-bold mb-6 text-[var(--color-neutral-900)]'>
                            Brand Influencer
                        </h1>
                        <p className='text-2xl md:text-3xl text-[var(--color-neutral-600)] mb-4 max-w-3xl mx-auto'>
                            Connect construction industry brands with creators, influencers, and tradespeople
                        </p>
                        <p className='text-lg text-[var(--color-neutral-500)] mb-10 max-w-2xl mx-auto'>
                            The premier platform for authentic partnerships in the construction and building industry
                        </p>
                        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                            <Link href='/register'>
                                <Button variant='primary' size='lg' className='min-w-[160px]'>
                                    Get Started Free
                                </Button>
                            </Link>
                            <Link href='/login'>
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
                        <h2 className='text-4xl font-bold mb-4 text-[var(--color-neutral-900)]'>
                            Why Choose Brand Influencer?
                        </h2>
                        <p className='text-lg text-[var(--color-neutral-600)] max-w-2xl mx-auto'>
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
                                <ul className='space-y-3 text-base text-[var(--color-neutral-700)]'>
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
                                <ul className='space-y-3 text-base text-[var(--color-neutral-700)]'>
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
            <section className='bg-white py-20'>
                <div className='max-w-6xl mx-auto px-4'>
                    <div className='text-center mb-16'>
                        <h2 className='text-4xl font-bold mb-4 text-[var(--color-neutral-900)]'>
                            How It Works
                        </h2>
                        <p className='text-lg text-[var(--color-neutral-600)]'>
                            Get started in three simple steps
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        <Card>
                            <CardContent className='text-center pt-8'>
                                <div className='w-16 h-16 bg-[var(--color-primary-600)] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4'>
                                    1
                                </div>
                                <h3 className='text-xl font-semibold mb-3'>Sign Up</h3>
                                <p className='text-[var(--color-neutral-600)]'>
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
                                <p className='text-[var(--color-neutral-600)]'>
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
                                <p className='text-[var(--color-neutral-600)]'>
                                    Review applications, select the perfect match, and launch successful campaigns together.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Industry Focus Section */}
            <section className='py-20 bg-gradient-to-b from-white to-[var(--color-neutral-100)]'>
                <div className='max-w-6xl mx-auto px-4'>
                    <div className='text-center mb-12'>
                        <h2 className='text-4xl font-bold mb-4 text-[var(--color-neutral-900)]'>
                            Built for the Construction Industry
                        </h2>
                        <p className='text-lg text-[var(--color-neutral-600)] max-w-3xl mx-auto mb-12'>
                            Our platform understands the unique needs of construction brands and tradespeople. 
                            Whether you're a plumber, electrician, builder, or construction brand, we've got you covered.
                        </p>
                    </div>

                    <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
                        {['Plumbing', 'Electrical', 'Carpentry', 'HVAC', 'Roofing', 'Concrete', 'Landscaping', 'General Building'].map((trade) => (
                            <Card key={trade} className='text-center'>
                                <CardContent className='py-6'>
                                    <div className='text-3xl mb-2'>🔧</div>
                                    <h3 className='font-semibold text-[var(--color-neutral-800)]'>{trade}</h3>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className='py-20 bg-[var(--color-primary-600)]'>
                <div className='max-w-4xl mx-auto px-4 text-center'>
                    <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
                        Ready to Get Started?
                    </h2>
                    <p className='text-xl text-white/90 mb-10 max-w-2xl mx-auto'>
                        Join brands and creators already using Brand Influencer to build meaningful partnerships
                    </p>
                    <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                        <Link href='/register'>
                            <Button 
                                variant='outline' 
                                size='lg' 
                                className='min-w-[160px] bg-white text-[var(--color-primary-600)] border-white hover:bg-[var(--color-neutral-100)]'
                            >
                                Create Account
                            </Button>
                        </Link>
                        <Link href='/login'>
                            <Button 
                                variant='outline' 
                                size='lg' 
                                className='min-w-[160px] border-white text-white hover:bg-white/10'
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
