-- Allow anonymous users to insert quiz responses
CREATE POLICY "Anyone can submit quiz responses"
ON public.quiz_responses
FOR INSERT
TO anon
WITH CHECK (true);