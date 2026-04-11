-- TRN Portal seed data
-- Run with: supabase db seed --file supabase/seed.sql

-- Community links (WhatsApp groups)
INSERT INTO public.community_links (label, description, url, channel_type)
VALUES
  (
    'Free Community WhatsApp',
    'Join our free WhatsApp community for real estate agents worldwide — network, share intel, and explore collaboration.',
    'https://chat.whatsapp.com/Gm1sPJ7B0NcF1HrjXuukXx',
    'whatsapp'
  ),
  (
    'Members WhatsApp Group',
    'Exclusive private WhatsApp group for paid TRN portal members only.',
    'https://chat.whatsapp.com/I0ujof3J8Xe15md9XThwfV',
    'whatsapp'
  )
ON CONFLICT DO NOTHING;
