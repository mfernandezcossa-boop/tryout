-- Add RLS policy to allow anyone to read visible team members
CREATE POLICY "Anyone can read visible team members"
ON public.team_members
FOR SELECT
USING (visible = true);

-- Drop the SECURITY DEFINER view that causes the security alert
DROP VIEW IF EXISTS public.team_members_public;