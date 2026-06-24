-- Fix PUBLIC_DATA_EXPOSURE: Remove public read policies from team_members base table
-- Public access should ONLY be through team_members_public view (which excludes email/phone)

-- Drop the public read policies that expose sensitive columns
DROP POLICY IF EXISTS "team_public_read" ON public.team_members;
DROP POLICY IF EXISTS "Public can read visible team members via view" ON public.team_members;

-- Keep only:
-- - "Admins and moderators can view all team members" (for admin access)
-- - "Admins and moderators can insert team members"
-- - "Admins and moderators can update team members"
-- - "Only admins can delete team members"

-- Public users will access team member data ONLY through team_members_public view
-- which already exists and excludes sensitive columns (email, phone, created_by, updated_by)