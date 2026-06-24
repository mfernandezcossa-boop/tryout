-- Step 1: Drop the current public read policy that exposes all columns
DROP POLICY IF EXISTS "team_public_read" ON public.team_members;

-- Step 2: Create a new restrictive policy for admins/moderators to view ALL columns
CREATE POLICY "Admins and moderators can view all team members"
ON public.team_members
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Step 3: Create a secure view that only exposes non-sensitive columns
CREATE OR REPLACE VIEW public.team_members_public AS
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

-- Step 4: Grant access to the view for public access
-- The view uses SECURITY INVOKER by default in newer PostgreSQL, 
-- but we'll make it accessible by granting to anon and authenticated roles
GRANT SELECT ON public.team_members_public TO anon, authenticated;

-- Add a comment explaining the purpose
COMMENT ON VIEW public.team_members_public IS 'Public view of team members that excludes sensitive contact information (email, phone). Use this view for public-facing pages.';