-- Drop and recreate the view ensuring SECURITY INVOKER is set
DROP VIEW IF EXISTS public.team_members_public;

-- Create view explicitly with security_invoker = true
CREATE VIEW public.team_members_public 
WITH (security_invoker = on) AS
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

-- We need a policy on the base table for the view to work with SECURITY INVOKER
-- Create a policy that only allows reading non-sensitive columns
-- Since PostgreSQL RLS is row-level (not column-level), we need to allow SELECT
-- but the application code should only query through the view
CREATE POLICY "Public can read visible team members via view"
ON public.team_members
FOR SELECT
USING (visible = true);

-- Grant access to the view
GRANT SELECT ON public.team_members_public TO anon, authenticated;

COMMENT ON VIEW public.team_members_public IS 'Public view of team members - excludes email and phone. Always use this view for public pages.';