-- Remove the role column from users_profiles with CASCADE
-- This will drop all dependent policies (which we already replaced)
ALTER TABLE public.users_profiles DROP COLUMN role CASCADE;