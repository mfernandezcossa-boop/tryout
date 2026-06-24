-- Create FAQs table
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_location TEXT NOT NULL DEFAULT 'aba-intensivo',
  order_index INTEGER DEFAULT 100,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Enable RLS
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Public can read visible FAQs
CREATE POLICY "Anyone can read visible FAQs"
ON public.faqs
FOR SELECT
USING (visible = true);

-- Admins and moderators can view all
CREATE POLICY "Admins and moderators can view all FAQs"
ON public.faqs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Admins and moderators can insert
CREATE POLICY "Admins and moderators can insert FAQs"
ON public.faqs
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Admins and moderators can update
CREATE POLICY "Admins and moderators can update FAQs"
ON public.faqs
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Only admins can delete
CREATE POLICY "Only admins can delete FAQs"
ON public.faqs
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add updated_at trigger
CREATE TRIGGER update_faqs_updated_at
BEFORE UPDATE ON public.faqs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();