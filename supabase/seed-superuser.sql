-- Make ben@powerednow.com a super user with all roles
-- Run this in the Supabase SQL Editor

-- First, get the user ID from auth.users
DO $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Find user by email
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = 'ben@powerednow.com';
    
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User ben@powerednow.com not found. Make sure you have registered first.';
    END IF;
    
    -- Set role to admin (admins can access everything)
    INSERT INTO user_profiles (id, role)
    VALUES (target_user_id, 'admin')
    ON CONFLICT (id) DO UPDATE SET role = 'admin', updated_at = NOW();
    
    -- Create creator profile if not exists
    INSERT INTO creator_profiles (user_id, name, display_name, bio)
    VALUES (
        target_user_id, 
        'Ben Dyer', 
        'Ben', 
        'Platform administrator and test creator account.'
    )
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Create brand profile if not exists
    INSERT INTO brand_profiles (user_id, company_name, description, contact_name, email)
    VALUES (
        target_user_id, 
        'PoweredNow', 
        'Platform administrator and test brand account.',
        'Ben Dyer',
        'ben@powerednow.com'
    )
    ON CONFLICT (user_id) DO NOTHING;
    
    RAISE NOTICE 'Success! ben@powerednow.com is now an admin with creator and brand profiles.';
END $$;

-- Verify the setup
SELECT 
    u.email,
    up.role,
    cp.name as creator_name,
    bp.company_name as brand_name
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.id
LEFT JOIN creator_profiles cp ON u.id = cp.user_id
LEFT JOIN brand_profiles bp ON u.id = bp.user_id
WHERE u.email = 'ben@powerednow.com';

