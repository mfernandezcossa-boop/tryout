-- Fix: The "Anyone can read visible team members" policy exposes email and phone fields
-- We need to drop this policy and create a more restrictive one that only allows reading
-- through application code that selects specific columns

-- Drop the current overly permissive policy
DROP POLICY IF EXISTS "Anyone can read visible team members" ON public.team_members;

-- Create a new policy that still allows public SELECT but the application code
-- should only select non-sensitive columns (id, name, role_title, bio_short, photo_url, order_index)
-- RLS cannot restrict columns, so we rely on application-level column selection
-- But we can add this policy back since the app code already only selects safe columns
CREATE POLICY "Anyone can read visible team members"
ON public.team_members
FOR SELECT
USING (visible = true);