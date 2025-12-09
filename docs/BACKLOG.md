# Product Backlog — Brand Influencer Platform

## Epic 1: Database Schema & Infrastructure

### DB-001: Supabase Database Schema Setup
**Priority:** Critical  
**Status:** Not Started  
**Dependencies:** None

**Description:** Create all database tables, relationships, and Row Level Security (RLS) policies.

**Acceptance Criteria:**
- [ ] Users table with role-based access (creator, brand, admin)
- [ ] Creator profiles table
- [ ] Brand profiles table
- [ ] Social accounts table (linked to creators)
- [ ] Featured content table
- [ ] Trades list table
- [ ] Briefs table (supports both standard and multi-creator)
- [ ] Applications table
- [ ] Subscriptions table
- [ ] Campaign credits tracking
- [ ] Notifications table
- [ ] All foreign key relationships defined
- [ ] RLS policies for data security
- [ ] Database indexes for performance

---

### DB-002: Database Seed Data
**Priority:** High  
**Status:** Not Started  
**Dependencies:** DB-001

**Description:** Populate initial data (trades list, subscription tiers).

**Acceptance Criteria:**
- [ ] Trades list populated with construction industry trades
- [ ] Subscription tiers defined in database
- [ ] Default admin user created

---

## Epic 2: Authentication & Authorization

### AUTH-001: User Registration & Login
**Priority:** Critical  
**Status:** Not Started  
**Dependencies:** DB-001

**Description:** Email/password authentication with role selection.

**Acceptance Criteria:**
- [ ] Registration form (email, password, role selection)
- [ ] Login form
- [ ] Email verification flow
- [ ] Password reset functionality
- [ ] Role-based session management
- [ ] Protected route middleware

---

### AUTH-002: Social Login (Optional for MVP)
**Priority:** Low  
**Status:** Not Started  
**Dependencies:** AUTH-001

**Description:** OAuth login with Google/GitHub (optional).

**Acceptance Criteria:**
- [ ] Google OAuth integration
- [ ] GitHub OAuth integration
- [ ] Social account linking to existing accounts

---

### AUTH-003: Role-Based Access Control
**Priority:** Critical  
**Status:** Not Started  
**Dependencies:** AUTH-001

**Description:** Enforce permissions based on user roles.

**Acceptance Criteria:**
- [ ] Creator-only routes
- [ ] Brand-only routes
- [ ] Admin-only routes
- [ ] API route protection
- [ ] UI elements hidden based on role

---

## Epic 3: Creator Features

### CREATOR-001: Creator Profile Creation
**Priority:** Critical  
**Status:** Not Started  
**Dependencies:** AUTH-001, DB-001

**Description:** Allow creators to create and edit their profile.

**Acceptance Criteria:**
- [ ] Profile creation form with all fields:
  - Name/Display Name
  - Profile photo upload
  - Location (city, country)
  - Primary trade (single select)
  - Additional trades (multi-select)
  - Short bio
- [ ] Image upload functionality
- [ ] Form validation
- [ ] Profile saved to database
- [ ] Profile preview

---

### CREATOR-002: Social Account Linking
**Priority:** High  
**Status:** Not Started  
**Dependencies:** CREATOR-001

**Description:** Creators can add/remove social media accounts.

**Acceptance Criteria:**
- [ ] Add social account form (platform, URL, follower count)
- [ ] Support platforms: Instagram, TikTok, YouTube, Facebook, Other
- [ ] Manual follower count input
- [ ] Manual engagement rate input
- [ ] Manual average reach input
- [ ] List of linked accounts
- [ ] Remove account functionality
- [ ] Edit account details

---

### CREATOR-003: Featured Content Management
**Priority:** High  
**Status:** Not Started  
**Dependencies:** CREATOR-001

**Description:** Creators can upload and manage featured content examples.

**Acceptance Criteria:**
- [ ] Add featured content form:
  - Thumbnail image upload
  - Post URL
  - Platform selection
  - Optional: Likes, views
- [ ] Display featured content gallery
- [ ] Edit featured content
- [ ] Delete featured content
- [ ] Image upload to Supabase storage

---

### CREATOR-004: Browse Briefs
**Priority:** High  
**Status:** Not Started  
**Dependencies:** BRIEF-001

**Description:** Creators can view available briefs.

**Acceptance Criteria:**
- [ ] Brief listing page
- [ ] Filter briefs by trade, platform, location
- [ ] Brief detail view
- [ ] Distinguish between standard and multi-creator briefs
- [ ] Show application deadline
- [ ] Show compensation type

---

### CREATOR-005: Apply to Briefs
**Priority:** Critical  
**Status:** Not Started  
**Dependencies:** CREATOR-004, BRIEF-001

**Description:** Creators can apply to briefs with a message and links.

**Acceptance Criteria:**
- [ ] Application form (message + optional links)
- [ ] Submit application
- [ ] Prevent duplicate applications
- [ ] Show application status (pending, accepted, rejected)
- [ ] Application confirmation notification

---

### CREATOR-006: Application Status Tracking
**Priority:** Medium  
**Status:** Not Started  
**Dependencies:** CREATOR-005

**Description:** Creators can view all their applications and statuses.

**Acceptance Criteria:**
- [ ] Applications dashboard
- [ ] List all applications with status
- [ ] Filter by status (pending, accepted, rejected)
- [ ] View brief details from application
- [ ] Status updates trigger notifications

---

## Epic 4: Brand Features

### BRAND-001: Brand Profile Creation
**Priority:** Critical  
**Status:** Not Started  
**Dependencies:** AUTH-001, DB-001

**Description:** Brands can create and edit company profiles.

**Acceptance Criteria:**
- [ ] Profile creation form:
  - Company name
  - Logo upload
  - Industry segment
  - Website
  - Company description
  - Contact name
  - Email
  - Optional phone
- [ ] Image upload functionality
- [ ] Form validation
- [ ] Profile saved to database

---

### BRAND-002: Creator Search & Filters
**Priority:** Critical  
**Status:** Not Started  
**Dependencies:** CREATOR-001, CREATOR-002

**Description:** Brands can search and filter creators.

**Acceptance Criteria:**
- [ ] Search interface with filters:
  - Primary trade
  - Additional trades (multi-select)
  - Social platforms (multi-select)
  - Follower count (per platform, total)
  - Engagement rate (min/max)
  - Average reach (min/max)
  - Location
  - Keyword search
- [ ] Search results display:
  - Profile image
  - Name
  - Primary trade
  - Key social platforms
  - Total followers
  - Engagement rate
  - "View Profile" CTA
- [ ] Pagination for results
- [ ] Save search preferences

---

### BRAND-003: Creator Profile View (Full)
**Priority:** High  
**Status:** Not Started  
**Dependencies:** BRAND-002

**Description:** Brands can view detailed creator profiles.

**Acceptance Criteria:**
- [ ] Full profile view with all creator data
- [ ] All linked social accounts with stats
- [ ] Featured content gallery
- [ ] Save creator to favourites
- [ ] Contact creator option (future)

---

### BRAND-004: Favourites Management
**Priority:** Medium  
**Status:** Not Started  
**Dependencies:** BRAND-003

**Description:** Brands can save and manage favourite creators.

**Acceptance Criteria:**
- [ ] Save creator to favourites
- [ ] Remove from favourites
- [ ] View favourites list
- [ ] Filter favourites

---

### BRAND-005: Post Standard Brief
**Priority:** Critical  
**Status:** Not Started  
**Dependencies:** BRAND-001, SUBSCRIPTION-001

**Description:** Brands can post standard (single-creator) briefs.

**Acceptance Criteria:**
- [ ] Brief creation form:
  - Title
  - Campaign description
  - Deliverables
  - Compensation type (fee, product-only, negotiable)
  - Fee amount (if applicable)
  - Timeline
  - Application deadline
  - Targeting filters:
    - Trades
    - Platforms
    - Minimum followers
    - Minimum engagement
    - Optional: Location
- [ ] Form validation
- [ ] Brief saved to database
- [ ] Targeted creators notified
- [ ] Brief visible in creator browse

---

### BRAND-006: Post Multi-Creator Brief
**Priority:** High  
**Status:** Not Started  
**Dependencies:** BRAND-005, SUBSCRIPTION-002

**Description:** Brands can post multi-creator briefs (requires campaign credit).

**Acceptance Criteria:**
- [ ] Brief creation form (extends standard):
  - Number of creators required
  - Deliverables per creator
  - Compensation model (per creator or total budget)
  - Product details (optional)
  - Campaign description
  - Guidelines
  - Timeline
  - Application deadline
  - Targeting filters
- [ ] Check campaign credits before posting
- [ ] Deduct credit on successful post
- [ ] Block posting if credits = 0
- [ ] Show upgrade/checkout button if no credits
- [ ] Track "X of Y slots filled"
- [ ] Brief marked "Full" when all slots filled

---

### BRAND-007: Application Management
**Priority:** Critical  
**Status:** Not Started  
**Dependencies:** BRAND-005, CREATOR-005

**Description:** Brands can review and accept/reject applications.

**Acceptance Criteria:**
- [ ] Applications dashboard
- [ ] List all applications for brand's briefs
- [ ] Filter by brief
- [ ] Filter by status
- [ ] View application details (message, links, creator profile)
- [ ] Accept application
- [ ] Reject application
- [ ] For multi-creator: show slots filled
- [ ] Notifications sent on accept/reject
- [ ] Brief marked completed when creator selected (standard)
- [ ] Brief marked full when all slots filled (multi-creator)

---

## Epic 5: Subscription & Monetization

### SUBSCRIPTION-001: Stripe Integration Setup
**Priority:** Critical  
**Status:** Not Started  
**Dependencies:** DB-001

**Description:** Integrate Stripe for subscription payments.

**Acceptance Criteria:**
- [ ] Stripe account connected
- [ ] Stripe products/tiers created
- [ ] Webhook endpoint for payment events
- [ ] Subscription status tracking in database
- [ ] Handle payment success/failure

---

### SUBSCRIPTION-002: Subscription Tiers & Checkout
**Priority:** Critical  
**Status:** Not Started  
**Dependencies:** SUBSCRIPTION-001, BRAND-001

**Description:** Brands can subscribe to tiers with campaign credits.

**Acceptance Criteria:**
- [ ] Subscription tiers defined:
  - Tier 1: 3 campaigns/year
  - Tier 2: 6 campaigns/year
  - Tier 3: 12 campaigns/year
- [ ] Checkout flow
- [ ] Subscription status in brand dashboard
- [ ] Campaign credits assigned based on tier
- [ ] Credit tracking in database

---

### SUBSCRIPTION-003: Campaign Credit Management
**Priority:** High  
**Status:** Not Started  
**Dependencies:** SUBSCRIPTION-002, BRAND-006

**Description:** Track and manage campaign credits for brands.

**Acceptance Criteria:**
- [ ] Display credits remaining in brand dashboard
- [ ] Deduct credit on multi-creator brief post
- [ ] Prevent posting if credits = 0
- [ ] Show upgrade options
- [ ] Purchase additional credits (optional)

---

### SUBSCRIPTION-004: Subscription Management
**Priority:** Medium  
**Status:** Not Started  
**Dependencies:** SUBSCRIPTION-002

**Description:** Brands can manage their subscription.

**Acceptance Criteria:**
- [ ] View current tier
- [ ] Upgrade tier
- [ ] Cancel subscription
- [ ] View billing history
- [ ] Update payment method

---

## Epic 6: Admin Panel

### ADMIN-001: User Management
**Priority:** High  
**Status:** Not Started  
**Dependencies:** AUTH-001

**Description:** Admin can manage all users.

**Acceptance Criteria:**
- [ ] View all creators
- [ ] View all brands
- [ ] Search/filter users
- [ ] Suspend user account
- [ ] Ban user account
- [ ] Reactivate account
- [ ] View user details

---

### ADMIN-002: Content Moderation
**Priority:** High  
**Status:** Not Started  
**Dependencies:** CREATOR-001, BRAND-001

**Description:** Admin can edit/remove any content.

**Acceptance Criteria:**
- [ ] Edit creator profiles
- [ ] Edit brand profiles
- [ ] Remove featured content
- [ ] Remove social accounts
- [ ] Edit/remove briefs
- [ ] Edit/remove applications

---

### ADMIN-003: Trades Management
**Priority:** Medium  
**Status:** Not Started  
**Dependencies:** DB-001

**Description:** Admin can manage the trades list.

**Acceptance Criteria:**
- [ ] View all trades
- [ ] Add new trade
- [ ] Edit trade name
- [ ] Remove trade
- [ ] Reorder trades

---

### ADMIN-004: Subscription & Credits Management
**Priority:** Medium  
**Status:** Not Started  
**Dependencies:** SUBSCRIPTION-002

**Description:** Admin can manage subscription tiers and adjust credits.

**Acceptance Criteria:**
- [ ] Edit subscription tiers
- [ ] Adjust campaign credits for specific brands
- [ ] View all subscriptions
- [ ] View credit usage statistics

---

### ADMIN-005: Platform Analytics Dashboard
**Priority:** Medium  
**Status:** Not Started  
**Dependencies:** All core features

**Description:** Admin can view platform KPIs and metrics.

**Acceptance Criteria:**
- [ ] User count (creators, brands)
- [ ] Briefs posted (standard, multi-creator)
- [ ] Applications received
- [ ] Campaign completions
- [ ] Subscription revenue
- [ ] Active subscriptions
- [ ] Charts/graphs for trends

---

## Epic 7: Notifications

### NOTIF-001: Email Notifications (Resend)
**Priority:** High  
**Status:** Not Started  
**Dependencies:** Resend setup, Core features

**Description:** Send email notifications for key events.

**Acceptance Criteria:**
- [ ] Email templates created
- [ ] Brief matches notification (to creators)
- [ ] Application accepted notification
- [ ] Application rejected notification
- [ ] Campaign updates
- [ ] Subscription confirmations
- [ ] Password reset emails

---

### NOTIF-002: In-App Notifications
**Priority:** High  
**Status:** Not Started  
**Dependencies:** DB-001, Core features

**Description:** In-app notification system.

**Acceptance Criteria:**
- [ ] Notification bell/indicator
- [ ] Notification list/dropdown
- [ ] Mark as read functionality
- [ ] Notification types:
  - Brief matches
  - Application accepted/rejected
  - Campaign updates
  - New applications (brands)
- [ ] Real-time updates (optional for MVP)

---

## Epic 8: UI/UX & Polish

### UI-001: Design System & Components
**Priority:** High  
**Status:** Not Started  
**Dependencies:** None

**Description:** Create reusable UI components and design system.

**Acceptance Criteria:**
- [ ] Color palette defined
- [ ] Typography system
- [ ] Button components
- [ ] Form components
- [ ] Card components
- [ ] Modal components
- [ ] Responsive design

---

### UI-002: Creator Dashboard
**Priority:** High  
**Status:** Not Started  
**Dependencies:** CREATOR-001, CREATOR-002, CREATOR-003

**Description:** Main dashboard for creators.

**Acceptance Criteria:**
- [ ] Profile completion indicator
- [ ] Quick stats (applications, accepted, etc.)
- [ ] Recent activity
- [ ] Navigation to all creator features

---

### UI-003: Brand Dashboard
**Priority:** High  
**Status:** Not Started  
**Dependencies:** BRAND-001, SUBSCRIPTION-002

**Description:** Main dashboard for brands.

**Acceptance Criteria:**
- [ ] Subscription tier display
- [ ] Campaign credits remaining
- [ ] Recent briefs
- [ ] Pending applications count
- [ ] Quick actions
- [ ] Navigation to all brand features

---

### UI-004: Admin Dashboard
**Priority:** Medium  
**Status:** Not Started  
**Dependencies:** ADMIN-005

**Description:** Main dashboard for admins.

**Acceptance Criteria:**
- [ ] Platform overview metrics
- [ ] Recent activity
- [ ] Quick actions
- [ ] Navigation to all admin features

---

### UI-005: Responsive Design
**Priority:** High  
**Status:** Not Started  
**Dependencies:** All UI features

**Description:** Ensure all pages work on mobile, tablet, desktop.

**Acceptance Criteria:**
- [ ] Mobile-responsive layouts
- [ ] Touch-friendly interactions
- [ ] Tablet optimization
- [ ] Desktop optimization

---

## Epic 9: Testing & Quality Assurance

### QA-001: Unit Tests
**Priority:** Medium  
**Status:** Not Started  
**Dependencies:** Core features

**Description:** Write unit tests for critical functions.

**Acceptance Criteria:**
- [ ] Test utilities and helpers
- [ ] Test authentication flows
- [ ] Test data validation
- [ ] Test business logic

---

### QA-002: Integration Tests
**Priority:** Medium  
**Status:** Not Started  
**Dependencies:** Core features

**Description:** Test integration between components.

**Acceptance Criteria:**
- [ ] Test API routes
- [ ] Test database operations
- [ ] Test Stripe webhooks
- [ ] Test notification flows

---

### QA-003: E2E Testing
**Priority:** Low  
**Status:** Not Started  
**Dependencies:** All features

**Description:** End-to-end testing of key user flows.

**Acceptance Criteria:**
- [ ] Creator registration → profile → application flow
- [ ] Brand registration → subscription → brief → accept flow
- [ ] Admin management flows

---

## Epic 10: Deployment & DevOps

### DEPLOY-001: Vercel Configuration
**Priority:** High  
**Status:** Not Started  
**Dependencies:** Core features

**Description:** Configure Vercel deployment.

**Acceptance Criteria:**
- [ ] Environment variables configured
- [ ] Build settings optimized
- [ ] Preview deployments working
- [ ] Production deployment tested

---

### DEPLOY-002: Database Migrations
**Priority:** High  
**Status:** Not Started  
**Dependencies:** DB-001

**Description:** Set up database migration system.

**Acceptance Criteria:**
- [ ] Migration scripts created
- [ ] Migration rollback capability
- [ ] Production migration process

---

### DEPLOY-003: Monitoring & Error Tracking
**Priority:** Medium  
**Status:** Not Started  
**Dependencies:** Deployment

**Description:** Set up error tracking and monitoring.

**Acceptance Criteria:**
- [ ] Error tracking (Sentry or similar)
- [ ] Performance monitoring
- [ ] Uptime monitoring

---

## Priority Legend

- **Critical**: Must have for MVP
- **High**: Important for MVP
- **Medium**: Nice to have for MVP
- **Low**: Post-MVP

## Status Legend

- **Not Started**: Not yet begun
- **In Progress**: Currently being worked on
- **Review**: Completed, awaiting review
- **Done**: Completed and verified

---

## Notes

- All features should follow the coding standards defined in the project rules
- Each feature should be developed in a feature branch
- Type checking and linting must pass before merging
- Features should be tested manually before marking as done

