-- Drop the public SELECT policy on team_members to prevent accidental exposure of email/phone
-- Public access should only go through the team_members_public view which excludes sensitive fields
DROP POLICY IF EXISTS "Public can read visible team members via view" ON public.team_members;