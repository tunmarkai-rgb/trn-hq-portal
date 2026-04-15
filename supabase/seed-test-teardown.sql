-- =============================================================
-- TRN Portal — Test Data Teardown
-- Purpose : Remove all test seed data before handover.
-- Run via : Supabase Dashboard → SQL Editor (run as postgres)
--           OR: psql $DATABASE_URL -f supabase/seed-test-teardown.sql
-- NOTE    : Only deletes rows whose IDs start with the test
--           UUID prefixes used in seed-test.sql. Real data is
--           untouched.
-- =============================================================

BEGIN;

-- Community members
DELETE FROM public.community_members
  WHERE id::text LIKE '99999999-0000-0000-0000-%';

-- Network updates
DELETE FROM public.network_updates
  WHERE id::text LIKE '88888888-0000-0000-0000-%';

-- SOP library
DELETE FROM public.sop_library
  WHERE id::text LIKE '77777777-0000-0000-0000-%';

-- Videos
DELETE FROM public.videos
  WHERE id::text LIKE '66666666-0000-0000-0000-%';

-- Referral templates
DELETE FROM public.referral_templates
  WHERE id::text LIKE '55555555-0000-0000-0000-%';

-- Knowledge resources
DELETE FROM public.knowledge_resources
  WHERE id::text LIKE '44444444-0000-0000-0000-%';

-- Partners
DELETE FROM public.partners
  WHERE id::text LIKE '33333333-0000-0000-0000-%';

-- Introductions
DELETE FROM public.introductions
  WHERE id::text LIKE '22222222-0000-0000-0000-%';

-- Deals
DELETE FROM public.deals
  WHERE id::text LIKE '11111111-aaaa-0000-0000-%';

-- Event RSVPs
DELETE FROM public.event_rsvps
  WHERE id::text LIKE 'ffffffff-0000-0000-0000-%';

-- Events
DELETE FROM public.events
  WHERE id::text LIKE 'eeeeeeee-0000-0000-0000-%';

-- Investment listings
DELETE FROM public.investment_listings
  WHERE id::text LIKE 'dddddddd-0000-0000-0000-%';

-- Referral opportunities
DELETE FROM public.referral_opportunities
  WHERE id::text LIKE 'cccccccc-0000-0000-0000-%';

-- Announcements
DELETE FROM public.announcements
  WHERE id::text LIKE 'bbbbbbbb-0000-0000-0000-%';

-- Profiles (cascade handled by auth.users delete, but clean up explicitly)
DELETE FROM public.profiles
  WHERE user_id::text LIKE 'aaaaaaaa-0000-0000-0000-%';

-- User roles
DELETE FROM public.user_roles
  WHERE user_id::text LIKE 'aaaaaaaa-0000-0000-0000-%';

-- Auth users (must be last — cascades to profiles and user_roles)
DELETE FROM auth.users
  WHERE id::text LIKE 'aaaaaaaa-0000-0000-0000-%';

COMMIT;
