# Brand Influencer

Connect brands with influencers.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase
- **Email**: Resend
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

4. Fill in your environment variables:
   - Supabase URL and keys (from your Supabase project)
   - Resend API key (from Resend dashboard)
   - App URL

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Environment Variables

See `.env.example` for required environment variables.

### Required Environment Variables

The following environment variables must be configured:

#### Supabase (Required)
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL (found in Project Settings > API)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key (found in Project Settings > API)
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (found in Project Settings > API, keep this secret!)

#### Optional
- `RESEND_API_KEY` - Resend API key for sending emails
- `NEXT_PUBLIC_APP_URL` - Your application URL (e.g., `http://localhost:3000` for local, or your Vercel URL for production)
- `STRIPE_SECRET_KEY` - Stripe secret key for payments
- `STRIPE_TIER1_PRICE_ID`, `STRIPE_TIER2_PRICE_ID`, `STRIPE_TIER3_PRICE_ID` - Stripe price IDs for subscription tiers

### Setting Up Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add each environment variable:
   - Click **Add New**
   - Enter the variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - Enter the value
   - Select the environments where it applies (Production, Preview, Development)
   - Click **Save**
4. **Important**: After adding environment variables, you need to redeploy your application:
   - Go to **Deployments**
   - Click the three dots (⋯) on your latest deployment
   - Select **Redeploy**

### Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Go to **Project Settings** > **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret - never expose in client-side code)

## Project Structure

```
├── app/              # Next.js App Router pages
├── components/       # React components
├── lib/              # Utility functions and configurations
│   ├── supabase/    # Supabase client setup
│   └── resend.ts    # Resend email setup
├── types/            # TypeScript type definitions
└── public/           # Static assets
```

## Git Workflow

- Never push directly to `main`
- Use feature branches
- Write clear commit messages: `type: description`
- Run `npm run typecheck` and `npm run lint` before pushing

## License

Private project

