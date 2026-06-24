
-- Add new profile fields to team_members table
ALTER TABLE public.team_members
  ADD COLUMN IF NOT EXISTS presentacion_personal text,
  ADD COLUMN IF NOT EXISTS credenciales text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS filosofia text;

-- Add constraint for presentacion_personal length (200-500 chars) via trigger
CREATE OR REPLACE FUNCTION public.validate_team_member_fields()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Validate presentacion_personal length if provided
  IF NEW.presentacion_personal IS NOT NULL AND length(NEW.presentacion_personal) > 0 THEN
    IF length(NEW.presentacion_personal) < 200 THEN
      RAISE EXCEPTION 'La presentación personal debe tener al menos 200 caracteres';
    END IF;
    IF length(NEW.presentacion_personal) > 500 THEN
      RAISE EXCEPTION 'La presentación personal no puede exceder 500 caracteres';
    END IF;
  END IF;

  -- Validate filosofia length if provided
  IF NEW.filosofia IS NOT NULL AND length(NEW.filosofia) > 200 THEN
    RAISE EXCEPTION 'La filosofía no puede exceder 200 caracteres';
  END IF;

  -- Validate credenciales count (max 4)
  IF NEW.credenciales IS NOT NULL AND array_length(NEW.credenciales, 1) > 4 THEN
    RAISE EXCEPTION 'No puedes agregar más de 4 credenciales';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_team_member_before_save
  BEFORE INSERT OR UPDATE ON public.team_members
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_team_member_fields();
