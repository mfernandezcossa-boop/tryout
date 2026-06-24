-- Fix team_view_rls_issue: Recreate view with SECURITY DEFINER
-- This allows anonymous users to query the view without needing SELECT on base table

DROP VIEW IF EXISTS public.team_members_public;

CREATE VIEW public.team_members_public 
WITH (security_invoker = off) AS
SELECT 
  id, 
  name, 
  role_title, 
  photo_url, 
  bio_short, 
  order_index, 
  visible, 
  created_at, 
  updated_at
FROM public.team_members
WHERE visible = true;