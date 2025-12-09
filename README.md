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

