-- Add display_location column to testimonials
-- Values: 'all' (both pages), 'home' (only home), 'aba' (only ABA landing)
ALTER TABLE public.testimonials 
ADD COLUMN display_location text NOT NULL DEFAULT 'all';

-- Add check constraint to ensure valid values
ALTER TABLE public.testimonials 
ADD CONSTRAINT testimonials_display_location_check 
CHECK (display_location IN ('all', 'home', 'aba'));