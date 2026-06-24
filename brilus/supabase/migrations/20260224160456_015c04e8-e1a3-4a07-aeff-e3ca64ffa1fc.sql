
-- Add structured credentials column (keeps old credenciales for backward compat)
ALTER TABLE public.team_members
ADD COLUMN IF NOT EXISTS credenciales_detalle jsonb DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN public.team_members.credenciales_detalle IS 'Array of {institution, logo_url, title} objects for structured credentials';
