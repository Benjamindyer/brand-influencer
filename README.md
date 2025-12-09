# Brand Influencer Platform

A two-sided marketplace connecting construction-industry brands with creators, influencers, and tradespeople.

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
STRIPE_TIER1_PRICE_ID=your_tier1_price_id
STRIPE_TIER2_PRICE_ID=your_tier2_price_id
STRIPE_TIER3_PRICE_ID=your_tier3_price_id

# Resend (for email notifications)
RESEND_API_KEY=your_resend_api_key
```

### 2. Database Setup

**IMPORTANT: You must run the database migrations before using the application.**

#### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and run it in the SQL Editor
5. Copy the contents of `supabase/migrations/002_seed_data.sql`
6. Paste and run it in the SQL Editor

#### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

## Database Schema

The application uses the following main tables:

- `user_profiles` - User roles and profile data
- `creator_profiles` - Creator-specific profile information
- `brand_profiles` - Brand-specific profile information
- `trades` - List of construction trades
- `social_accounts` - Creator social media accounts
- `featured_content` - Creator featured content/posts
- `briefs` - Campaign briefs posted by brands
- `applications` - Creator applications to briefs
- `subscriptions` - Brand subscription information
- `notifications` - In-app notifications
- `favourites` - Brand favourite creators

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Payments**: Stripe
- **Email**: Resend

## Project Structure

```
app/
  ├── (auth)/          # Authentication pages
  ├── (creator)/       # Creator-specific pages
  ├── (brand)/         # Brand-specific pages
  ├── (admin)/         # Admin pages
  └── api/             # API routes

components/
  ├── ui/              # Reusable UI components
  ├── creator/         # Creator-specific components
  ├── brand/           # Brand-specific components
  └── layout/          # Layout components

lib/
  ├── supabase/        # Supabase client setup
  ├── auth/            # Authentication helpers
  ├── stripe/          # Stripe integration
  └── notifications/   # Notification system

supabase/
  └── migrations/      # Database migration files
```

## Development

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Build
npm run build
```
