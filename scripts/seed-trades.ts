// TypeScript script to seed trades (if needed for programmatic seeding)
// This is a reference - actual seeding is done via SQL migration

export const trades = [
    { name: 'Electrician', slug: 'electrician' },
    { name: 'Plumber', slug: 'plumber' },
    { name: 'Carpenter', slug: 'carpenter' },
    { name: 'Roofer', slug: 'roofer' },
    { name: 'Painter', slug: 'painter' },
    { name: 'HVAC Technician', slug: 'hvac-technician' },
    { name: 'General Contractor', slug: 'general-contractor' },
    { name: 'Flooring Specialist', slug: 'flooring-specialist' },
    { name: 'Drywall Installer', slug: 'drywall-installer' },
    { name: 'Tile Installer', slug: 'tile-installer' },
    { name: 'Landscaper', slug: 'landscaper' },
    { name: 'Concrete Worker', slug: 'concrete-worker' },
    { name: 'Welder', slug: 'welder' },
    { name: 'Mason', slug: 'mason' },
    { name: 'Insulation Installer', slug: 'insulation-installer' },
    { name: 'Window Installer', slug: 'window-installer' },
    { name: 'Door Installer', slug: 'door-installer' },
    { name: 'Kitchen Remodeler', slug: 'kitchen-remodeler' },
    { name: 'Bathroom Remodeler', slug: 'bathroom-remodeler' },
    { name: 'Handyman', slug: 'handyman' },
] as const

export type TradeSlug = typeof trades[number]['slug']

