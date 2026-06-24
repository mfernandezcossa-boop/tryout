
-- Add specialties, languages, and featured_quote to team_members
ALTER TABLE public.team_members
  ADD COLUMN IF NOT EXISTS specialties text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS languages text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS featured_quote text DEFAULT NULL;
