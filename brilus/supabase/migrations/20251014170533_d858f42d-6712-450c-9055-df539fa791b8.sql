-- Remove public INSERT policy on contact_requests table
-- Only the submit-form Edge Function should be able to insert contact requests

DROP POLICY IF EXISTS "Anyone can submit contact requests" ON contact_requests;

-- Contact requests should only be created via the submit-form Edge Function
-- which validates Turnstile tokens server-side
