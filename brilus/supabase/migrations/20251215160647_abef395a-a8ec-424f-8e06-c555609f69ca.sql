-- Drop the current view and recreate with SECURITY INVOKER
DROP VIEW IF EXISTS public.team_members_public;

-- Recreate view with explicit SECURITY INVOKER
CREATE VIEW public.team_members_public 
WITH (security_invoker = true) AS
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

-- Since SECURITY INVOKER means the view uses the caller's permissions,
-- we need a policy that allows public read of only these columns.
-- We'll create a specific policy for public read that only allows visible members
CREATE POLICY "Anyone can read visible team members basic info"
ON public.team_members
FOR SELECT
USING (visible = true);

-- Grant access to the view
GRANT SELECT ON public.team_members_public TO anon, authenticated;

COMMENT ON VIEW public.team_members_public IS 'Public view of team members that excludes sensitive contact information (email, phone). Use this view for public-facing pages.';