
-- Create introductions table for structured member-to-member introductions
CREATE TABLE public.introductions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL,
  target_id UUID NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create partners table for vetted service providers
CREATE TABLE public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  description TEXT,
  website TEXT,
  contact_info TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.introductions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Introductions policies: users can see intros they're part of
CREATE POLICY "Users can view own introductions" ON public.introductions
  FOR SELECT TO authenticated
  USING (auth.uid() = requester_id OR auth.uid() = target_id);

CREATE POLICY "Users can create introductions" ON public.introductions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update own introductions" ON public.introductions
  FOR UPDATE TO authenticated
  USING (auth.uid() = requester_id OR auth.uid() = target_id);

-- Partners policies: all authenticated can view, admins manage
CREATE POLICY "Authenticated users can view partners" ON public.partners
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can manage partners" ON public.partners
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add updated_at trigger for introductions
CREATE TRIGGER update_introductions_updated_at
  BEFORE UPDATE ON public.introductions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
