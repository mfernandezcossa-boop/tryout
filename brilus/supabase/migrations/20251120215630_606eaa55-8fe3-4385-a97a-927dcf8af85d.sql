-- Primero, eliminar la política existente si existe
DROP POLICY IF EXISTS "Anyone can submit quiz responses" ON public.quiz_responses;

-- Recrear la política con el permiso correcto
CREATE POLICY "Anyone can submit quiz responses"
ON public.quiz_responses
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Asegurar que RLS está habilitado
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;