
-- Add approval_status to profiles for pending/approved member workflow
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS approval_status text NOT NULL DEFAULT 'approved';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS linkedin_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS website_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS years_experience integer;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;

-- Expand introductions with structured fields
ALTER TABLE public.introductions ADD COLUMN IF NOT EXISTS reason text;
ALTER TABLE public.introductions ADD COLUMN IF NOT EXISTS context text;
ALTER TABLE public.introductions ADD COLUMN IF NOT EXISTS urgency text DEFAULT 'normal';
ALTER TABLE public.introductions ADD COLUMN IF NOT EXISTS admin_notes text;
ALTER TABLE public.introductions ADD COLUMN IF NOT EXISTS target_type text DEFAULT 'member';
ALTER TABLE public.introductions ADD COLUMN IF NOT EXISTS linked_deal_id uuid;
ALTER TABLE public.introductions ADD COLUMN IF NOT EXISTS linked_opportunity_id uuid;

-- Expand referral_opportunities with more fields
ALTER TABLE public.referral_opportunities ADD COLUMN IF NOT EXISTS ideal_counterpart text;
ALTER TABLE public.referral_opportunities ADD COLUMN IF NOT EXISTS budget_range text;
ALTER TABLE public.referral_opportunities ADD COLUMN IF NOT EXISTS urgency text DEFAULT 'normal';
ALTER TABLE public.referral_opportunities ADD COLUMN IF NOT EXISTS status text DEFAULT 'open';
ALTER TABLE public.referral_opportunities ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;

-- Expand partners with more fields
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS markets_served text[];
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS who_they_help text;
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS use_cases text;
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS internal_contact_name text;
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS internal_contact_email text;
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS internal_referral_structure text;
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS internal_notes text;

-- Expand deals with pipeline stages and linking
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS stage text DEFAULT 'New';
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS related_opportunity_id uuid;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS related_intro_id uuid;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS summary text;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS destination_member_id uuid;

-- Create network_updates table for wins and updates
CREATE TABLE IF NOT EXISTS public.network_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'update',
  title text NOT NULL,
  summary text,
  content text,
  markets text[],
  featured_image text,
  published boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.network_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view published updates" ON public.network_updates
  FOR SELECT TO authenticated USING (published = true);

CREATE POLICY "Admins can manage updates" ON public.network_updates
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
