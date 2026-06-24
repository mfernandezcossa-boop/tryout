-- Remove the public access policy from the base table
-- This ensures email and phone are only accessible to admins/moderators
DROP POLICY IF EXISTS "Anyone can read visible team members basic info" ON public.team_members;