-- Create contact_requests table
CREATE TABLE public.contact_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_full_name TEXT NOT NULL,
  child_name TEXT NOT NULL,
  child_age_band TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  concerns TEXT NOT NULL,
  consent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert contact requests (public form)
CREATE POLICY "Anyone can submit contact requests" 
ON public.contact_requests 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow authenticated users to view all requests (for admin purposes)
CREATE POLICY "Authenticated users can view contact requests" 
ON public.contact_requests 
FOR SELECT 
USING (auth.role() = 'authenticated');