-- Create locations table
CREATE TABLE public.locations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  image_url text,
  order_index integer DEFAULT 100,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

-- Enable RLS
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Public read policy for visible locations
CREATE POLICY "Anyone can read visible locations"
  ON public.locations
  FOR SELECT
  USING (visible = true);

-- Admins and moderators can view all locations
CREATE POLICY "Admins and moderators can view all locations"
  ON public.locations
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Admins and moderators can insert locations
CREATE POLICY "Admins and moderators can insert locations"
  ON public.locations
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Admins and moderators can update locations
CREATE POLICY "Admins and moderators can update locations"
  ON public.locations
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Only admins can delete locations
CREATE POLICY "Only admins can delete locations"
  ON public.locations
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON public.locations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();