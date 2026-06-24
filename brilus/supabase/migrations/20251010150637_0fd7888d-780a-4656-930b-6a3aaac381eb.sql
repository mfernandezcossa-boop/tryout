-- Fix INPUT_VALIDATION: Add length and format constraints to contact_requests
ALTER TABLE public.contact_requests 
  ADD CONSTRAINT parent_full_name_length CHECK (char_length(parent_full_name) <= 200),
  ADD CONSTRAINT child_name_length CHECK (char_length(child_name) <= 200),
  ADD CONSTRAINT email_length CHECK (char_length(email) <= 255),
  ADD CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  ADD CONSTRAINT phone_length CHECK (char_length(phone) <= 20),
  ADD CONSTRAINT concerns_length CHECK (char_length(concerns) <= 5000);

-- Fix MISSING_RLS: Create user roles system
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Update contact_requests SELECT policy to only allow admins
DROP POLICY IF EXISTS "Authenticated users can view contact requests" ON public.contact_requests;

CREATE POLICY "Only admins can view contact requests"
  ON public.contact_requests
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));