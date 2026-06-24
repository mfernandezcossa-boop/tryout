
CREATE OR REPLACE FUNCTION public.validate_team_member_fields()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Validate filosofia length if provided
  IF NEW.filosofia IS NOT NULL AND length(NEW.filosofia) > 200 THEN
    RAISE EXCEPTION 'La filosofía no puede exceder 200 caracteres';
  END IF;

  RETURN NEW;
END;
$$;
