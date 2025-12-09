-- Seed data for Brand Influencer Platform
-- Trades list and subscription tier definitions

-- Insert construction industry trades
INSERT INTO trades (name, slug) VALUES
    ('Electrician', 'electrician'),
    ('Plumber', 'plumber'),
    ('Carpenter', 'carpenter'),
    ('Roofer', 'roofer'),
    ('Painter', 'painter'),
    ('HVAC Technician', 'hvac-technician'),
    ('General Contractor', 'general-contractor'),
    ('Flooring Specialist', 'flooring-specialist'),
    ('Drywall Installer', 'drywall-installer'),
    ('Tile Installer', 'tile-installer'),
    ('Landscaper', 'landscaper'),
    ('Concrete Worker', 'concrete-worker'),
    ('Welder', 'welder'),
    ('Mason', 'mason'),
    ('Insulation Installer', 'insulation-installer'),
    ('Window Installer', 'window-installer'),
    ('Door Installer', 'door-installer'),
    ('Kitchen Remodeler', 'kitchen-remodeler'),
    ('Bathroom Remodeler', 'bathroom-remodeler'),
    ('Handyman', 'handyman')
ON CONFLICT (slug) DO NOTHING;

-- Note: Subscription tiers are managed in the application code
-- The tiers are:
-- Tier 1: 3 campaigns/year
-- Tier 2: 6 campaigns/year
-- Tier 3: 12 campaigns/year
-- These are assigned when a brand subscribes via Stripe

