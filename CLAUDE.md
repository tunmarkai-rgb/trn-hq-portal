# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
The Realty Network (TRN) — private membership portal for international real estate professionals.
- **Live URL**: https://trn-hq-portal.vercel.app
- **Supabase Project**: https://qebihjqqcbovmdwzhwrj.supabase.co
- **GitHub**: https://github.com/tunmarkai-rgb/trn-hq-portal

## Development Commands

```bash
npm run dev          # Start Vite dev server (http://localhost:8080)
npm run build        # Production build (tsc + vite build)
npm run lint         # ESLint check
npm run preview      # Preview production build locally
npm run test         # Run tests once (vitest run)
npm run test:watch   # Run tests in watch mode
```

Tests use Vitest + @testing-library/react. Test files live in `src/test/`. There are currently only placeholder tests — no Supabase mocking is set up.

Supabase env vars needed in `.env`:
```
VITE_SUPABASE_URL=https://qebihjqqcbovmdwzhwrj.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_nBCK9IpRl-SPXvmMKPIWnA_XUaLPhhd
```

## E2E Testing

### Running Tests
```bash
python setup_test_users.py   # Create test accounts + seed QA event (run once)
python trn_full_test.py      # Full 4-persona Playwright test suite
```

Requires: `pip install playwright` + `playwright install chromium`
Dev server must be running at `http://localhost:8080`.

### Test Personas
| Persona | Email | Password |
|---------|-------|----------|
| Admin | jake@therealty-network.com | TRNn8npass |
| Agent (member) | tunmark25@gmail.com | TRN-Test-2024! |
| Investor | tunmarkx@gmail.com | TRN-Test-2024! |
| Ambassador | tunmarky@gmail.com | TRN-Test-2024! |

### Latest Test Results (2026-04-15)
**74 PASS | 0 FAIL | 5 PARTIAL** (partials are data/timing gaps, not bugs)

## Tech Stack
- React 18 + Vite + TypeScript
- Tailwind CSS v3 with shadcn/ui (Radix UI primitives)
- Supabase (database + auth + storage + edge functions)
- React Router DOM v6
- TanStack Query v5 (data fetching)
- React Hook Form + Zod (forms)
- Framer Motion (animations)
- Leaflet + React Leaflet (network map)
- next-themes (dark/light mode)
- Lucide React (icons)
- Sonner (toast notifications)

## Brand & Design Tokens
- Gold: `hsl(43, 100%, 50%)` — use `text-gold` / `var(--gold)`
- Navy: `hsl(220, 40%, 13%)` — var(--navy)
- Background dark: `hsl(220, 25%, 7%)`
- Card dark: `hsl(220, 25%, 10%)`
- Heading font: Playfair Display — use `font-display` class
- Body font: Inter — use `font-body` class
- Light/dark theme via next-themes and `.dark` class

## App Architecture

### Provider Stack (main.tsx → App.tsx)
`ThemeProvider` → `QueryClientProvider` → `TooltipProvider` → `BrowserRouter` → `AuthProvider`

### Route Pattern
All dashboard routes use a `DashboardRoute` wrapper that composes `ProtectedRoute` + `DashboardLayout`:
```tsx
<ProtectedRoute><DashboardLayout>{children}</DashboardLayout></ProtectedRoute>
```

### Layout
- `DashboardLayout` — sidebar (w-56) + sticky header with `NotificationBell` and `ThemeToggle`
- Sidebar collapses to overlay on mobile (hamburger menu, `md:` breakpoint)
- Main content: `p-4 sm:p-6` (responsive)
- Header: `px-4 sm:px-6` (responsive)

### Auth
- `AuthContext` (src/contexts/AuthContext.tsx) provides: `session`, `user`, `loading`, `signOut`
- Always use `useAuth()` hook — never call `supabase.auth` directly in components
- Admin check via Supabase RPC: `has_role(user.id, 'admin')`
- `ProtectedRoute` redirects unauthenticated users to `/login`
- Admin: jake@therealty-network.com

### Supabase Client
Import as: `import { supabase } from "@/integrations/supabase/client"`
Types generated at `src/integrations/supabase/types.ts` — do not edit manually.

### Edge Functions
- `supabase/functions/create-member/` — creates Supabase auth users with `email_confirm: true`; called by `AdminMembers.tsx`. Deploy with: `npx supabase functions deploy create-member --project-ref qebihjqqcbovmdwzhwrj`

## Routes

### Public
- `/` → redirects to dashboard (or login if unauthed)
- `/login` → Login page
- `/reset-password` → Password reset (supports `?welcome=true` for n8n new-member flow)
- `/join` → Free community signup (writes to `community_members`, fires n8n webhook TRN-01)

### Protected (`/dashboard/*`)
- `/dashboard` → Dashboard (pinned announcements banner + stats)
- `/dashboard/directory` → Members directory
- `/dashboard/member/:userId` → Member profile view
- `/dashboard/map` → Network map (Leaflet)
- `/dashboard/opportunities` → Referral opportunities
- `/dashboard/investments` → Investment board
- `/dashboard/introductions` → Member introductions
- `/dashboard/deals` → My deals tracker
- `/dashboard/events` → Calls & events (with RSVP)
- `/dashboard/partners` → Partners directory
- `/dashboard/profile` → My profile (with completion bar)
- `/dashboard/videos` → Video library
- `/dashboard/referral-templates` → Referral templates
- `/dashboard/education` → Education hub
- `/dashboard/admin` → Admin panel (admin only)
- `/dashboard/sop` → SOP Library (admin only)

## Supabase Database Schema

### profiles
`user_id` (FK auth.users), `full_name`, `email`, `avatar_url`, `city`, `country`, `agency`, `niche` (text[]), `languages` (text[]), `role`, `instagram`, `linkedin_url`, `website_url`, `can_help_with`, `looking_for`, `bio`, `title`, `years_experience`, `approval_status` (pending/approved), `latitude`, `longitude`

Auto-created via `handle_new_user()` trigger on `auth.users` insert.

### user_roles
`user_id` (FK), `role` (app_role enum: admin/member)

### deals
`created_by` (FK), `partner_id` (FK), `title`, `property_address`, `deal_type`, `status` (Active/Under Contract/Closed/Lost), `estimated_value`, `referral_fee_percent`, `notes`, `city`, `country`, `stage`, `related_opportunity_id`, `related_intro_id`, `summary`, `destination_member_id`

### referral_opportunities
`title`, `opportunity_type`, `description`, `market_country`, `market_city`, `posted_by` (FK), `ideal_counterpart`, `budget_range`, `urgency`, `status` (open/closed), `featured` (boolean)

### investment_listings
`title`, `investment_type`, `category`, `description`, `summary`, `city`, `country`, `asking_price`, `roi_potential`, `deal_status` (Active/Closed/Under Offer), `featured` (boolean), `posted_by` (FK)

### collaboration_requests
`listing_id` (FK investment_listings), `requester_id` (FK), `reason`, `what_they_bring`, `market_relevance`, `status`

### events
`title`, `event_date`, `event_type`, `speaker`, `description`, `recording_url`, `summary`, `join_link`, `timezone`, `target_audience`

### event_rsvps
`event_id` (FK events), `user_id` (FK auth.users), `status` (going/maybe/not_going)

### introductions
`requester_id` (FK), `target_id` (FK), `message`, `status`, `reason`, `context`, `urgency`, `admin_notes`, `target_type`, `linked_deal_id`, `linked_opportunity_id`

### partners
`name`, `category`, `description`, `website`, `contact_info`, `logo_url`, `markets_served` (text[]), `who_they_help`, `use_cases`, `internal_contact_name`, `internal_contact_email`, `internal_referral_structure`, `internal_notes`

### announcements
`title`, `body`, `pinned` (boolean)

### knowledge_resources
`title`, `category`, `content`, `link`, `author`
Categories: General / Market Reports / Legal / Finance / Guides / Scripts

### community_links
`label`, `description`, `url`, `channel_type`
Seed with: `supabase db seed --file supabase/seed.sql`

### network_updates
`type`, `title`, `summary`, `content`, `markets` (text[]), `featured_image`, `published` (boolean)

### notifications
`user_id` (FK), `type`, `title`, `message`, `link`, `read` (boolean)

### members (GHL integration)
`full_name`, `email`, `whatsapp`, `country`, `city`, `agency`, `role`, `niche` (text[]), `languages` (text[]), `can_help_with`, `looking_for`, `instagram`, `linkedin`, `bio`, `notes`, `avatar_url`, `status` (pending/approved/suspended/cancelled), `member_type` (lead/member/ambassador/investor), `referred_by`, `stripe_customer_id`

### community_members (free tier — written by /join)
`first_name`, `last_name`, `email`, `whatsapp`, `country`, `city`, `role`, `instagram`, `linkedin`, `how_did_you_hear`, `status` (active/removed), `form_submitted_at`, `removal_scheduled_at`, `notes`

### sop_library (admin only)
`title`, `category` (free text), `content` (text)

### videos
`title`, `category`, `youtube_url`, `description`
Categories: Deal Structuring / Legal / Market Intelligence / Referral / Mindset / Guest Speaker / General

### referral_templates
`name`, `type`, `version`, `download_link`, `description`
Types: Residential / Commercial / Ambassador Collaboration / Off-Plan Developer

## Supabase Check Constraints
- `members.role`: Agent, Broker, Investor, Developer, Founder, Other
- `members.status`: pending, approved, suspended, cancelled
- `members.member_type`: lead, member, ambassador, investor
- `deals.stage`: Lead, Prospect, Active, Negotiating, Under Contract, Closed, Commission Collected, Completed, Dead
- `deals.property_type`: Residential, Commercial, Off-Plan, Luxury, Industrial
- `videos.category`: Deal Structuring, Legal, Market Intelligence, Referral, Mindset, Guest Speaker, General
- `referral_templates.type`: Residential, Commercial, Ambassador Collaboration, Off-Plan Developer
- `events.event_type`: Masterclass, Roundtable, Guest Speaker, Members Huddle, Ambassador Only
- `community_members.status`: active, removed

## GHL + n8n Integration
- GHL Location ID: ECficOs9AXqkczzM8LD9
- n8n: https://n8n.therealty-network.com
- **TRN-01** webhook: fired by `CommunityJoin.tsx` after `community_members` insert
  - URL: `https://n8n.therealty-network.com/webhook/trn-new-application`
  - Payload: `first_name, last_name, whatsapp, email, country, city, role, instagram, linkedin, how_did_you_hear, source="trn_community_join_form"`
- **TRN-02** webhook: fired by `AdminMembers.tsx` when `approval_status` changes TO `"approved"`
  - URL: `https://n8n.therealty-network.com/webhook/trn-accepted-member`
  - Payload: `email, first_name, last_name, full_name, country, city, agency, role`
  - Only fires on first approval (`originalApprovalStatus !== "approved"`)
- Webhook calls are non-blocking — Supabase writes succeed even if webhook fails
- n8n creates Supabase auth users on Stripe payment confirmation; profiles auto-created via DB trigger
- n8n should append `?welcome=true` to Supabase password reset URLs it sends to new members

## Two-Tier Membership
**Tier 1 — Free WhatsApp Community:** Sign up at `/join` → `community_members` table → free WhatsApp group (https://chat.whatsapp.com/Gm1sPJ7B0NcF1HrjXuukXx). No portal access.

**Tier 2 — Paid Portal Members:** Apply via GHL → Stripe payment (€500/year) → n8n creates auth user → full portal access → paid WhatsApp group (https://chat.whatsapp.com/I0ujof3J8Xe15md9XThwfV).

## Key UI Behaviours
- **Announcements banner**: `Dashboard.tsx` queries `announcements` where `pinned=true`; each banner is dismissible (IDs stored in `localStorage` under `"trn_dismissed_announcements"`)
- **Profile completion bar**: `Profile.tsx` tracks 13 fields (`full_name, city, country, agency, role, niche, languages, can_help_with, looking_for, bio, avatar_url, instagram, linkedin_url`); bar turns `emerald-400` at 100%
- **Notification bell**: `NotificationBell.tsx` in `DashboardLayout` header; reads `notifications` table for current user; opening popover marks all as read; popover is `max-w-[calc(100vw-2rem)]` to prevent mobile overflow
- **Admin panel** (`/dashboard/admin`): 10 tabs — Members, Opportunities, Investments, Collaborations, Intros, Deals, Calls, Partners, Updates, Community. **Important:** `setData([])` is called on every tab switch to prevent stale data crashing tab components.
- **Collaborate button**: on Investment listings — only appears when `user.id !== listing.posted_by`

## Development Rules
- TypeScript only — no `.jsx` files
- Use shadcn/ui components, not raw HTML elements
- Use Tailwind classes, not inline styles
- `font-display` for headings, `font-body` for body text, `text-gold` for gold accents
- Mobile first always — use `p-4 sm:p-6` pattern, never hardcode `p-6` alone on containers
- All data from Supabase — no hardcoded content
- Every data fetch needs error state and loading state
- `useAuth()` for user context — never call `supabase.auth` directly in components
- Dialog widths: always add `w-[calc(100vw-2rem)] sm:w-auto max-w-lg` for mobile safety
- Select/filter widths: use `w-full sm:w-[Xpx]` pattern, never fixed `w-[Xpx]` alone

## Known Limitations
- `supabase/functions/create-member` edge function must be deployed separately via CLI — it is not auto-deployed with the frontend
- Role system is binary (admin/member) — member sub-types (Agent/Investor/Ambassador) are stored as free-text `profiles.role`, not enforced at DB or RLS level
- No page-level guard on `/dashboard/sop` — only hidden in sidebar for non-admins
