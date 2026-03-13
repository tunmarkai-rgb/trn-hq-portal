
-- Announcements table
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view announcements" ON public.announcements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage announcements" ON public.announcements FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Referral Opportunities table (different from referrals - this is a public feed)
CREATE TABLE public.referral_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  opportunity_type TEXT NOT NULL DEFAULT 'Investment',
  description TEXT,
  market_country TEXT,
  market_city TEXT,
  posted_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.referral_opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view opportunities" ON public.referral_opportunities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create opportunities" ON public.referral_opportunities FOR INSERT TO authenticated WITH CHECK (auth.uid() = posted_by);
CREATE POLICY "Users can update own opportunities" ON public.referral_opportunities FOR UPDATE TO authenticated USING (auth.uid() = posted_by);
CREATE POLICY "Users can delete own opportunities" ON public.referral_opportunities FOR DELETE TO authenticated USING (auth.uid() = posted_by);

-- Events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'Call',
  speaker TEXT,
  description TEXT,
  recording_url TEXT,
  summary TEXT,
  join_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view events" ON public.events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage events" ON public.events FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Knowledge Resources table
CREATE TABLE public.knowledge_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  content TEXT,
  link TEXT,
  author TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.knowledge_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view knowledge resources" ON public.knowledge_resources FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage knowledge resources" ON public.knowledge_resources FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Community Links table
CREATE TABLE public.community_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  channel_type TEXT NOT NULL DEFAULT 'WhatsApp',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.community_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view community links" ON public.community_links FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage community links" ON public.community_links FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Add lat/lng to profiles for map
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
