-- =============================================================
-- TRN Portal — Test Data Seed
-- Purpose : Populate every dashboard page with 3–4 items for
--           web app testing before handover.
-- Run via : Supabase Dashboard → SQL Editor (run as postgres)
--           OR: psql $DATABASE_URL -f supabase/seed-test.sql
-- Teardown: supabase/seed-test-teardown.sql
-- NOTE    : All test user UUIDs share the prefix aaaaaaaa-0000-
--           which makes them easy to identify and bulk-delete.
-- =============================================================

BEGIN;

-- =============================================================
-- 1. AUTH USERS  (triggers auto-create profiles + member roles)
-- =============================================================
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  is_super_admin,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) VALUES
  (
    'aaaaaaaa-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'jake@therealty-network.com',
    crypt('TestPass123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Jake Morrison"}',
    now(), now(), false, '', '', '', ''
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'sofia.test@trn-test.com',
    crypt('TestPass123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Sofia Reyes"}',
    now(), now(), false, '', '', '', ''
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'marcus.test@trn-test.com',
    crypt('TestPass123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Marcus Webb"}',
    now(), now(), false, '', '', '', ''
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'priya.test@trn-test.com',
    crypt('TestPass123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Priya Nair"}',
    now(), now(), false, '', '', '', ''
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'tunmarkx@gmail.com',
    crypt('trnTunmark2026!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Tunmark"}',
    now(), now(), false, '', '', '', ''
  )
ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- 2. PROFILES  (update rows auto-created by trigger)
-- =============================================================
UPDATE public.profiles SET
  full_name        = 'Jake Morrison',
  email            = 'jake@therealty-network.com',
  title            = 'Founding Member & Broker',
  city             = 'London',
  country          = 'United Kingdom',
  agency           = 'Morrison Property Group',
  role             = 'Broker',
  niche            = ARRAY['Luxury Residential','Commercial','Off-Plan'],
  languages        = ARRAY['English','French'],
  bio              = 'International broker with 15 years experience across UK, UAE and Europe. Specialist in luxury residential and cross-border investment deals.',
  can_help_with    = 'Buyer introductions in London, UAE deal sourcing, luxury off-plan',
  looking_for      = 'Agents with HNW buyer mandates in Europe and Asia',
  years_experience = 15,
  instagram        = '@jakemorrison_property',
  linkedin_url     = 'https://linkedin.com/in/jakemorrison',
  approval_status  = 'approved',
  latitude         = 51.5074,
  longitude        = -0.1278
WHERE user_id = 'aaaaaaaa-0000-0000-0000-000000000001';

UPDATE public.profiles SET
  full_name        = 'Sofia Reyes',
  email            = 'sofia.test@trn-test.com',
  title            = 'Senior Real Estate Agent',
  city             = 'Madrid',
  country          = 'Spain',
  agency           = 'Reyes Inmobiliaria',
  role             = 'Agent',
  niche            = ARRAY['Residential','Investment','Holiday Homes'],
  languages        = ARRAY['Spanish','English','Portuguese'],
  bio              = 'Madrid-based agent with deep knowledge of Spanish coastal and city markets. Connecting international buyers with premium properties.',
  can_help_with    = 'Spain property search, buyer representation, market analysis',
  looking_for      = 'Investors seeking Spanish residency via Golden Visa, holiday home buyers',
  years_experience = 8,
  instagram        = '@sofiareyes_homes',
  linkedin_url     = 'https://linkedin.com/in/sofiareyes',
  approval_status  = 'approved',
  latitude         = 40.4168,
  longitude        = -3.7038
WHERE user_id = 'aaaaaaaa-0000-0000-0000-000000000002';

UPDATE public.profiles SET
  full_name        = 'Marcus Webb',
  email            = 'marcus.test@trn-test.com',
  title            = 'Property Investor & Syndicator',
  city             = 'Dubai',
  country          = 'United Arab Emirates',
  agency           = 'Webb Capital Real Estate',
  role             = 'Investor',
  niche            = ARRAY['Off-Plan','Commercial','Short-Term Rentals'],
  languages        = ARRAY['English','Arabic'],
  bio              = 'Dubai-based investor running a private syndicate focused on GCC off-plan and short-term rental yields. Active deal flow across UAE and KSA.',
  can_help_with    = 'GCC deal sourcing, co-investment, off-plan access, Dubai market intel',
  looking_for      = 'Agents with off-market luxury listings, JV partners for short-term rental conversions',
  years_experience = 10,
  instagram        = '@marcuswebb_invest',
  linkedin_url     = 'https://linkedin.com/in/marcuswebb',
  approval_status  = 'approved',
  latitude         = 25.2048,
  longitude        = 55.2708
WHERE user_id = 'aaaaaaaa-0000-0000-0000-000000000003';

UPDATE public.profiles SET
  full_name        = 'Priya Nair',
  email            = 'priya.test@trn-test.com',
  title            = 'Real Estate Developer',
  city             = 'Mumbai',
  country          = 'India',
  agency           = 'Nair Developments',
  role             = 'Developer',
  niche            = ARRAY['Residential Development','Land Acquisition','Off-Plan'],
  languages        = ARRAY['English','Hindi','Malayalam'],
  bio              = 'Developer with active projects across Mumbai and Goa. Seeking international partners for co-development and off-plan presales to the diaspora market.',
  can_help_with    = 'India market access, presale allocations, co-development JVs',
  looking_for      = 'Agents with NRI buyer networks in UK, Canada and UAE',
  years_experience = 12,
  instagram        = '@priyanair_dev',
  linkedin_url     = 'https://linkedin.com/in/priyanair',
  approval_status  = 'approved',
  latitude         = 19.0760,
  longitude        = 72.8777
WHERE user_id = 'aaaaaaaa-0000-0000-0000-000000000004';

UPDATE public.profiles SET
  full_name        = 'Tunmark',
  email            = 'tunmarkx@gmail.com',
  title            = 'Member',
  approval_status  = 'approved'
WHERE user_id = 'aaaaaaaa-0000-0000-0000-000000000005';


-- =============================================================
-- 3. USER ROLES  (promote Jake to admin; others already member)
-- =============================================================
-- The trigger inserted member roles for all 5 — upgrade Jake
UPDATE public.user_roles
  SET role = 'admin'
WHERE user_id = 'aaaaaaaa-0000-0000-0000-000000000001';


-- =============================================================
-- 4. ANNOUNCEMENTS  (pinned — shows on Dashboard banner)
-- =============================================================
INSERT INTO public.announcements (id, title, body, pinned) VALUES
  (
    'bbbbbbbb-0000-0000-0000-000000000001',
    'Welcome to The Realty Network Portal',
    'Your private members portal is live. Complete your profile to unlock the full directory, deal board, and introduction system. Questions? Reach us on the members WhatsApp group.',
    true
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000002',
    'Monthly Members Huddle — Register Now',
    'Our next live Zoom call is this Thursday at 6 PM GMT. We''ll cover active deal flow, a market update from Dubai, and an open floor for introductions. Link in the Events section.',
    true
  )
ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- 5. REFERRAL OPPORTUNITIES  (status=open — Opportunities board)
-- =============================================================
INSERT INTO public.referral_opportunities
  (id, title, opportunity_type, description, market_country, market_city,
   ideal_counterpart, budget_range, urgency, status, featured, posted_by)
VALUES
  (
    'cccccccc-0000-0000-0000-000000000001',
    'HNW Buyer Seeking Luxury London Penthouse',
    'Buyer Requirement',
    'Client is a UAE national with a £4M–£6M budget looking for a Central London penthouse. Pre-approved funds, ready to move within 60 days. Preference for Mayfair, Knightsbridge or Kensington.',
    'United Kingdom', 'London',
    'London broker with off-market luxury stock',
    '£4,000,000 – £6,000,000',
    'high',
    'open', true,
    'aaaaaaaa-0000-0000-0000-000000000003'
  ),
  (
    'cccccccc-0000-0000-0000-000000000002',
    'Off-Plan Presale Allocations Available — Mumbai Waterfront',
    'Off Market Deal',
    'Offering exclusive presale access to a 120-unit luxury waterfront project in Mumbai launching Q3. Targeting NRI buyers in UK and UAE. 8% projected yield on short-term rentals.',
    'India', 'Mumbai',
    'Agents with NRI buyer databases in UK, UAE or Canada',
    '$150,000 – $500,000 per unit',
    'normal',
    'open', false,
    'aaaaaaaa-0000-0000-0000-000000000004'
  ),
  (
    'cccccccc-0000-0000-0000-000000000003',
    'Cross-Border Referral — Spanish Golden Visa Buyer',
    'Cross Border Referral Need',
    'Client (UK passport) wants a €550K+ property in Spain to secure Golden Visa residency. Flexible on location but prefers Marbella or Valencia coast. Needs bilingual legal support.',
    'Spain', 'Marbella',
    'Spanish agent with Golden Visa experience and legal contacts',
    '€550,000 – €900,000',
    'normal',
    'open', false,
    'aaaaaaaa-0000-0000-0000-000000000001'
  ),
  (
    'cccccccc-0000-0000-0000-000000000004',
    'Seeking Dubai Short-Term Rental JV Partner',
    'Seller Requirement',
    'Owner of 3 furnished apartments in JBR looking to convert to STR model. Seeking an operator/partner to manage the listings on Airbnb and Booking.com. Revenue split open to negotiation.',
    'United Arab Emirates', 'Dubai',
    'STR operator or property management company in Dubai',
    'Revenue share deal — no upfront cost',
    'low',
    'open', false,
    'aaaaaaaa-0000-0000-0000-000000000002'
  )
ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- 6. INVESTMENT LISTINGS  (deal_status=Active — Investments board)
-- =============================================================
INSERT INTO public.investment_listings
  (id, title, investment_type, category, description, summary, city, country,
   asking_price, roi_potential, deal_status, featured, posted_by)
VALUES
  (
    'dddddddd-0000-0000-0000-000000000001',
    'Luxury Boutique Hotel — Algarve, Portugal',
    'Off-Market Listing',
    'Hospitality',
    'A 24-room boutique hotel on the Algarve coastline with full planning permissions. Operating at 78% occupancy. Owner is retiring and seeking a full exit. Fully staffed.',
    'Rare off-market hospitality asset with immediate cash flow. Ideal for investor-operator or brand acquisition.',
    'Albufeira', 'Portugal',
    '€3,200,000', '11–14% gross yield',
    'Active', true,
    'aaaaaaaa-0000-0000-0000-000000000001'
  ),
  (
    'dddddddd-0000-0000-0000-000000000002',
    'Pre-Launch Off-Plan Block Deal — Dubai Marina',
    'Development Opportunity',
    'Residential',
    'Block purchase opportunity for 10 units in a new Dubai Marina tower at 15% below public launch price. Developer is offering a 3-year post-handover payment plan.',
    'Discounted block allocation in prime Dubai location with strong capital appreciation history.',
    'Dubai', 'United Arab Emirates',
    'AED 1,800,000 per unit (10 units)', '20–25% projected capital gain by handover',
    'Active', true,
    'aaaaaaaa-0000-0000-0000-000000000003'
  ),
  (
    'dddddddd-0000-0000-0000-000000000003',
    'Mumbai Land Plot — Approved Residential Planning',
    'Land Opportunity',
    'Development',
    'A 4,500 sq ft land plot in Bandra West, Mumbai with approved planning permission for a 12-unit residential building. All environmental clearances in place.',
    'Shovel-ready development site in one of Mumbai''s most sought-after postcodes. JV or full acquisition welcome.',
    'Mumbai', 'India',
    '₹18,00,00,000 (~$2.1M)', '35–40% margin on development',
    'Active', false,
    'aaaaaaaa-0000-0000-0000-000000000004'
  ),
  (
    'dddddddd-0000-0000-0000-000000000004',
    'HMO Portfolio — 4 Properties, Birmingham',
    'Rental/Yield Play',
    'Residential',
    '4 fully tenanted HMO properties in Birmingham generating £8,400/month combined gross rental. All properties recently refurbished with 10-year structural warranty.',
    'Stable high-yield portfolio ready for hands-off investor. Management company in place.',
    'Birmingham', 'United Kingdom',
    '£1,100,000', '9.2% gross yield',
    'Active', false,
    'aaaaaaaa-0000-0000-0000-000000000001'
  )
ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- 7. EVENTS
-- =============================================================
INSERT INTO public.events
  (id, title, event_date, event_type, speaker, description, summary,
   join_link, recording_url, timezone, target_audience)
VALUES
  (
    'eeeeeeee-0000-0000-0000-000000000001',
    'Monthly Members Huddle — April 2026',
    (now() + interval '4 days')::timestamptz,
    'Members Huddle',
    'Jake Morrison',
    'Open floor for active deal sharing, introductions, and a live Q&A on the Dubai market. All members welcome. Bring your pipeline.',
    'Monthly call to connect, share deals and discuss market updates.',
    'https://zoom.us/j/test-trn-huddle',
    NULL,
    'Europe/London',
    'all'
  ),
  (
    'eeeeeeee-0000-0000-0000-000000000002',
    'Masterclass: Structuring Cross-Border Referrals',
    (now() + interval '11 days')::timestamptz,
    'Masterclass',
    'Marcus Webb',
    'A deep-dive session on how to correctly document and close cross-border referral fees — covering the legal structure, payment mechanics, and tax treatment in key markets.',
    'Learn how to protect and collect your referral fees across international deals.',
    'https://zoom.us/j/test-trn-masterclass',
    NULL,
    'Europe/London',
    'all'
  ),
  (
    'eeeeeeee-0000-0000-0000-000000000003',
    'Guest Speaker: Dubai Market Outlook 2026',
    (now() - interval '10 days')::timestamptz,
    'Guest Speaker',
    'Sarah Al-Farsi, CBRE Dubai',
    'CBRE''s head of residential research shared data on Dubai transaction volumes, price trajectories and the top areas for off-plan investment in 2026.',
    'Key takeaway: Palm Jebel Ali remains the standout opportunity with 18-month horizon.',
    NULL,
    'https://youtu.be/dQw4w9WgXcQ',
    'Asia/Dubai',
    'all'
  ),
  (
    'eeeeeeee-0000-0000-0000-000000000004',
    'Roundtable: Spain Golden Visa — What''s Changed',
    (now() - interval '21 days')::timestamptz,
    'Roundtable',
    'Sofia Reyes & Legal Panel',
    'A roundtable covering the 2025 changes to Spain''s Golden Visa programme and what they mean for UK and UAE buyers looking to secure EU residency through property.',
    'Programme still viable via €500K+ purchase; key is correct property classification.',
    NULL,
    'https://youtu.be/dQw4w9WgXcQ',
    'Europe/Madrid',
    'all'
  )
ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- 8. EVENT RSVPs
-- =============================================================
INSERT INTO public.event_rsvps (id, event_id, user_id, status) VALUES
  ('ffffffff-0000-0000-0000-000000000001', 'eeeeeeee-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'going'),
  ('ffffffff-0000-0000-0000-000000000002', 'eeeeeeee-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000002', 'going'),
  ('ffffffff-0000-0000-0000-000000000003', 'eeeeeeee-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000003', 'maybe'),
  ('ffffffff-0000-0000-0000-000000000004', 'eeeeeeee-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000004', 'not_going')
ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- 9. DEALS  (created_by = Jake — visible to Jake when logged in)
-- =============================================================
INSERT INTO public.deals
  (id, created_by, title, city, country, deal_type, stage, status,
   estimated_value, referral_fee_percent, summary, notes)
VALUES
  (
    '11111111-aaaa-0000-0000-000000000001',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'Mayfair Penthouse — UAE Buyer Intro',
    'London', 'United Kingdom',
    'Sale', 'Negotiating', 'Active',
    5200000, 1.5,
    'UAE national client introduced by Marcus Webb. Viewing completed, offer expected this week.',
    'Client prefers 4-bed with terrace. Shortlisted 2 Mayfair properties.'
  ),
  (
    '11111111-aaaa-0000-0000-000000000002',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'Mumbai Presale Referral — NRI Client',
    'Mumbai', 'India',
    'Referral', 'Active', 'Active',
    320000, 2.0,
    'Referred UK-based NRI client to Priya Nair for Mumbai waterfront unit. Deposit paid.',
    'Referral fee agreement signed. Commission due on completion.'
  ),
  (
    '11111111-aaaa-0000-0000-000000000003',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'Birmingham HMO Portfolio Acquisition',
    'Birmingham', 'United Kingdom',
    'Purchase', 'Under Contract', 'Under Contract',
    1100000, 0,
    'Acting as buyer''s agent for a family office purchasing the 4-property HMO portfolio.',
    'Surveys complete. Solicitors exchanging contracts next week.'
  ),
  (
    '11111111-aaaa-0000-0000-000000000004',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'Algarve Hotel — Investor Intro Closed',
    'Albufeira', 'Portugal',
    'Investment', 'Closed', 'Closed',
    3200000, 1.0,
    'Successfully connected a Hong Kong family office with the Algarve hotel listing. Deal completed.',
    'Referral fee of €32,000 collected. Excellent outcome.'
  )
ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- 10. INTRODUCTIONS
-- =============================================================
INSERT INTO public.introductions
  (id, requester_id, target_id, message, status, reason, context, urgency)
VALUES
  (
    '22222222-0000-0000-0000-000000000001',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'aaaaaaaa-0000-0000-0000-000000000004',
    'Hi Priya, I have a UK-based NRI client actively looking for Mumbai presale allocations with a $300K budget. Would love to connect you both.',
    'accepted',
    'Client referral — NRI buyer seeking Mumbai investment',
    'Client is pre-approved with funds in UK account. Ready to transact.',
    'high'
  ),
  (
    '22222222-0000-0000-0000-000000000002',
    'aaaaaaaa-0000-0000-0000-000000000003',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'Jake, I have a client looking for off-market London luxury properties. Your market knowledge would be a great fit.',
    'pending',
    'Buyer mandate — luxury London search',
    'Client is a GCC-based HNW individual with £5M+ budget and flexible timeline.',
    'normal'
  ),
  (
    '22222222-0000-0000-0000-000000000003',
    'aaaaaaaa-0000-0000-0000-000000000002',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'Jake, can you introduce me to your legal contacts in London? My client needs a conveyancer who handles international buyers.',
    'pending',
    'Professional referral — legal contact needed',
    'Client is Spanish national buying first UK property. Needs bilingual support.',
    'normal'
  ),
  (
    '22222222-0000-0000-0000-000000000004',
    'aaaaaaaa-0000-0000-0000-000000000004',
    'aaaaaaaa-0000-0000-0000-000000000003',
    'Marcus, I''d like to explore co-investment on the Bandra land plot. Your GCC network could be ideal for the presale phase.',
    'declined',
    'JV / co-investment exploration',
    'Priya is seeking a co-investor or presale distribution partner for the Mumbai development.',
    'low'
  )
ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- 11. PARTNERS
-- =============================================================
INSERT INTO public.partners
  (id, name, category, description, website, contact_info,
   markets_served, who_they_help, use_cases,
   internal_contact_name, internal_contact_email)
VALUES
  (
    '33333333-0000-0000-0000-000000000001',
    'CurrencyFair Pro',
    'FX/Currency',
    'Specialist FX broker offering preferential exchange rates for real estate transactions. No transfer fees for TRN members on transfers above £50K.',
    'https://currencyfairpro.com',
    'partner@currencyfairpro.com',
    ARRAY['United Kingdom','United Arab Emirates','Spain','Global'],
    'International buyers and sellers transferring funds across borders for property purchases',
    'Currency exchange for completions, deposit transfers, rental income repatriation',
    'James Holt',
    'james@currencyfairpro.com'
  ),
  (
    '33333333-0000-0000-0000-000000000002',
    'Global Residency Law',
    'Legal',
    'Boutique law firm specialising in property acquisition, Golden Visa applications and cross-border estate planning across EU, UAE and Asia.',
    'https://globalresidencylaw.com',
    'enquiries@globalresidencylaw.com',
    ARRAY['Spain','Portugal','UAE','Singapore'],
    'Investors seeking residency-by-investment, buyers needing international legal support',
    'Property due diligence, Golden Visa applications, contract review, tax structuring',
    'Ana Costa',
    'ana@globalresidencylaw.com'
  ),
  (
    '33333333-0000-0000-0000-000000000003',
    'ReloExpat Services',
    'Relocation',
    'Full relocation management for high-net-worth individuals and families moving internationally. Covers schooling, shipping, settling-in and ongoing lifestyle concierge.',
    'https://reloexpat.com',
    'hello@reloexpat.com',
    ARRAY['United Arab Emirates','United Kingdom','Spain','Portugal'],
    'Buyers who are also relocating, expats, family moves',
    'End-to-end relocation, school search, temporary accommodation, settling-in packages',
    'Rachel Dunne',
    'rachel@reloexpat.com'
  ),
  (
    '33333333-0000-0000-0000-000000000004',
    'Bridgepoint International Finance',
    'Finance',
    'Specialist lender offering international mortgages for non-resident buyers in UK, Spain, Portugal and UAE. Fast decisions, competitive rates.',
    'https://bridgepointfinance.com',
    'apply@bridgepointfinance.com',
    ARRAY['United Kingdom','Spain','Portugal','United Arab Emirates'],
    'Foreign national buyers needing mortgage finance, expats, overseas investors',
    'International mortgages, bridging finance, portfolio refinancing',
    'Tom Whitfield',
    'tom@bridgepointfinance.com'
  )
ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- 12. KNOWLEDGE RESOURCES  (Education Hub)
-- =============================================================
INSERT INTO public.knowledge_resources (id, title, category, content, link, author) VALUES
  (
    '44444444-0000-0000-0000-000000000001',
    'How to Structure a Cross-Border Referral Fee Agreement',
    'Guides',
    'A step-by-step guide covering the key clauses in a referral fee agreement, what law governs the contract, how to ensure enforceability, and how to handle currency and tax. Includes a template checklist.',
    'https://drive.google.com/file/d/test-referral-guide',
    'Jake Morrison'
  ),
  (
    '44444444-0000-0000-0000-000000000002',
    'Spain Golden Visa 2025 — Updated Threshold Guide',
    'Market Reports',
    'Following the 2025 regulatory review, this report covers current qualifying property values, processing timelines, family inclusion rules, and the regions seeing the most international buyer activity.',
    'https://drive.google.com/file/d/test-spain-gv-report',
    'Sofia Reyes'
  ),
  (
    '44444444-0000-0000-0000-000000000003',
    'UAE Property Ownership for Foreigners — Legal Overview',
    'Legal',
    'An overview of freehold vs leasehold ownership in the UAE, designated freehold zones, off-plan purchase protections under RERA, and common pitfalls for international buyers.',
    'https://drive.google.com/file/d/test-uae-legal-overview',
    'Marcus Webb'
  ),
  (
    '44444444-0000-0000-0000-000000000004',
    'Introduction Email Templates for Member-to-Member Referrals',
    'Scripts',
    'A set of 6 email and WhatsApp message templates for making warm introductions between members — covering buyer referrals, seller introductions, JV partner approaches, and service provider intros.',
    'https://drive.google.com/file/d/test-intro-scripts',
    'Jake Morrison'
  )
ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- 13. REFERRAL TEMPLATES
-- =============================================================
INSERT INTO public.referral_templates (id, name, type, version, description, download_link) VALUES
  (
    '55555555-0000-0000-0000-000000000001',
    'TRN Residential Referral Agreement',
    'Residential',
    'v2.1',
    'Standard referral fee agreement for residential property transactions. Covers fee percentage, payment trigger, governing law and dispute resolution. UK-law default with international addendum.',
    'https://drive.google.com/file/d/test-residential-template'
  ),
  (
    '55555555-0000-0000-0000-000000000002',
    'TRN Commercial Referral Agreement',
    'Commercial',
    'v1.4',
    'Referral fee agreement tailored for commercial and investment property transactions. Includes success fee structures, exclusivity clauses, and multi-party split provisions.',
    'https://drive.google.com/file/d/test-commercial-template'
  ),
  (
    '55555555-0000-0000-0000-000000000003',
    'TRN Ambassador Collaboration Agreement',
    'Ambassador Collaboration',
    'v1.0',
    'Collaboration agreement for TRN ambassadors working together on a shared deal or client. Defines roles, responsibilities, fee splits and confidentiality obligations.',
    'https://drive.google.com/file/d/test-ambassador-template'
  ),
  (
    '55555555-0000-0000-0000-000000000004',
    'TRN Off-Plan Developer Referral Agreement',
    'Off-Plan Developer',
    'v1.2',
    'Agreement specifically for off-plan developer partnerships. Covers presale allocations, per-unit commission, clawback provisions and payment timelines post-completion.',
    'https://drive.google.com/file/d/test-offplan-template'
  )
ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- 14. VIDEOS  (Video Library)
-- =============================================================
INSERT INTO public.videos (id, title, category, youtube_url, description) VALUES
  (
    '66666666-0000-0000-0000-000000000001',
    'How to Win a Cross-Border Deal in 5 Steps',
    'Deal Structuring',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'Jake Morrison walks through the five-step process he uses to take a cross-border lead from introduction to fee collection, with real deal examples.'
  ),
  (
    '66666666-0000-0000-0000-000000000002',
    'Understanding RERA — Off-Plan Buyer Protections in Dubai',
    'Legal',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'A concise breakdown of Dubai''s RERA regulations, what protections they give off-plan buyers, and how agents should advise clients purchasing pre-completion.'
  ),
  (
    '66666666-0000-0000-0000-000000000003',
    'Dubai vs Spain — Where is the Better Investment in 2026?',
    'Market Intelligence',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'Marcus Webb and Sofia Reyes debate the investment case for Dubai versus the Spanish coast — covering yields, capital growth, liquidity and lifestyle buyer trends.'
  ),
  (
    '66666666-0000-0000-0000-000000000004',
    'How to Approach a Potential JV Partner',
    'Guest Speaker',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'Guest session with a seasoned syndicator on how to identify, approach and structure a joint venture with a co-investor or development partner you meet through TRN.'
  )
ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- 15. SOP LIBRARY  (Admin only)
-- =============================================================
INSERT INTO public.sop_library (id, title, category, content) VALUES
  (
    '77777777-0000-0000-0000-000000000001',
    'New Member Onboarding — Admin Steps',
    'Onboarding',
    E'## New Member Onboarding SOP\n\n**Trigger:** Stripe payment confirmed via n8n\n\n1. n8n creates Supabase auth user and sends welcome email with password reset link (?welcome=true)\n2. Admin verifies profile is auto-created in Supabase (profiles table)\n3. Confirm approval_status = ''approved'' on the profile\n4. Add member to paid WhatsApp group manually\n5. Send personal welcome message from Jake within 24h\n6. Check member has completed profile (>50% completion bar)\n7. Tag in first Members Huddle as new joiner'
  ),
  (
    '77777777-0000-0000-0000-000000000002',
    'How to Post a Deal or Opportunity',
    'Deals',
    E'## Posting a Deal or Opportunity SOP\n\n**Purpose:** Ensure all deal postings are clear, complete and actionable.\n\n1. Navigate to Opportunities or Investments board\n2. Click "Post Opportunity" / "List Investment"\n3. Fill all required fields — title must be specific, not generic\n4. Budget range is mandatory — vague listings are removed\n5. Set urgency correctly: only use ''high'' if client is transacting within 30 days\n6. Admin reviews flagged listings within 48h\n7. Featured listings require Jake''s approval before publishing'
  ),
  (
    '77777777-0000-0000-0000-000000000003',
    'Managing Member Introductions',
    'Introductions',
    E'## Introduction Management SOP\n\n**Purpose:** Ensure introductions are handled promptly and professionally.\n\n1. Requester submits introduction via portal with full context\n2. Target member receives notification and has 72h to accept/decline\n3. If accepted: both parties receive each other''s direct contact\n4. Admin monitors for unanswered intros >72h and follows up on WhatsApp\n5. If declined: requester is notified with no reason required\n6. All intros are logged in the portal for deal tracking purposes\n7. Outcome (deal/no deal) should be updated in the Deals tracker'
  ),
  (
    '77777777-0000-0000-0000-000000000004',
    'Running a Members Huddle Call',
    'Events',
    E'## Members Huddle SOP\n\n**Frequency:** Monthly (first Thursday, 6 PM GMT)\n\n**Pre-call (48h before):**\n1. Create event in portal with correct date, join link and description\n2. Pin announcement on dashboard\n3. Send reminder to paid WhatsApp group\n\n**During call:**\n1. Open with quick wins / member shoutouts (5 min)\n2. Active deal board review (15 min)\n3. Open floor introductions (10 min)\n4. Market intel update (10 min)\n5. Close with any announcements\n\n**Post-call:**\n1. Upload recording to Video Library\n2. Update event record with recording_url and summary\n3. Unpin the announcement'
  )
ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- 16. NETWORK UPDATES  (Dashboard win banner + Admin Updates tab)
-- =============================================================
INSERT INTO public.network_updates (id, type, title, summary, content, markets, published) VALUES
  (
    '88888888-0000-0000-0000-000000000001',
    'win',
    'Member Closes £5.2M London Referral Deal',
    'Jake Morrison successfully closed a £5.2M Mayfair penthouse sale for a UAE buyer introduced through the TRN network — generating a £78K referral fee.',
    'The deal originated from a cross-border introduction made at last month''s Members Huddle. The buyer''s agent was Marcus Webb (Dubai) and the selling agent was Jake Morrison (London). Full close-to-completion timeline: 47 days.',
    ARRAY['United Kingdom','United Arab Emirates'],
    true
  ),
  (
    '88888888-0000-0000-0000-000000000002',
    'update',
    'Dubai Market Intel — Q1 2026 Summary',
    'Transaction volumes in Dubai are up 22% YoY in Q1 2026. Off-plan continues to dominate with 67% of all sales. Palm Jebel Ali emerging as the standout area for international buyers.',
    'Key data points: Average price per sq ft in Dubai Marina up 8% QoQ. Off-plan payment plans averaging 40/60 (40% during construction, 60% on handover). Top buying nationalities: Indian, British, Russian, Chinese.',
    ARRAY['United Arab Emirates'],
    true
  ),
  (
    '88888888-0000-0000-0000-000000000003',
    'update',
    'New Partner: Bridgepoint International Finance',
    'TRN has partnered with Bridgepoint International Finance to offer members access to international mortgage products across UK, Spain, Portugal and UAE at preferential rates.',
    'Members can now access international mortgage pre-approvals directly through our Partners section. Bridgepoint is offering TRN members a 0.25% rate reduction and no arrangement fee on first application.',
    ARRAY['United Kingdom','Spain','Portugal','United Arab Emirates'],
    true
  )
ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- 17. COMMUNITY MEMBERS  (Admin → Community tab)
-- =============================================================
INSERT INTO public.community_members
  (id, first_name, last_name, email, whatsapp, country, city, role,
   instagram, linkedin, how_did_you_hear, status, form_submitted_at)
VALUES
  (
    '99999999-0000-0000-0000-000000000001',
    'David', 'Okafor',
    'david.okafor@example.com',
    '+44 7911 000001',
    'United Kingdom', 'Manchester',
    'Agent',
    '@davidokafor_homes',
    'https://linkedin.com/in/davidokafor',
    'Instagram',
    'active',
    now() - interval '5 days'
  ),
  (
    '99999999-0000-0000-0000-000000000002',
    'Yuki', 'Tanaka',
    'yuki.tanaka@example.com',
    '+81 90 0000 1234',
    'Japan', 'Tokyo',
    'Investor',
    '@yukitanaka_invest',
    'https://linkedin.com/in/yukitanaka',
    'Referred by a member',
    'active',
    now() - interval '3 days'
  ),
  (
    '99999999-0000-0000-0000-000000000003',
    'Amara', 'Diallo',
    'amara.diallo@example.com',
    '+33 6 00 00 12 34',
    'France', 'Paris',
    'Agent',
    '@amaradiallo_re',
    NULL,
    'Google Search',
    'active',
    now() - interval '1 day'
  ),
  (
    '99999999-0000-0000-0000-000000000004',
    'Carlos', 'Mendez',
    'carlos.mendez@example.com',
    '+34 600 000 001',
    'Spain', 'Barcelona',
    'Broker',
    NULL,
    'https://linkedin.com/in/carlosmendez',
    'WhatsApp group',
    'removed',
    now() - interval '14 days'
  )
ON CONFLICT (id) DO NOTHING;


COMMIT;

-- =============================================================
-- Test credentials:
--   jake@therealty-network.com / TestPass123!    (admin)
--   sofia.test@trn-test.com  / TestPass123!      (member)
--   marcus.test@trn-test.com / TestPass123!      (member)
--   priya.test@trn-test.com  / TestPass123!      (member)
--   tunmarkx@gmail.com       / trnTunmark2026!   (member)
-- =============================================================
