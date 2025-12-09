import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function UnauthorizedPage() {
    return (
        <div className='min-h-screen flex items-center justify-center bg-[var(--color-neutral-100)] p-4'>
            <Card className='w-full max-w-md'>
                <CardHeader>
                    <CardTitle>Unauthorized</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <p className='text-[var(--color-neutral-600)]'>
                        You don't have permission to access this page.
                    </p>
                    <Link href='/'>
                        <Button variant='primary' className='w-full'>
                            Go Home
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}

