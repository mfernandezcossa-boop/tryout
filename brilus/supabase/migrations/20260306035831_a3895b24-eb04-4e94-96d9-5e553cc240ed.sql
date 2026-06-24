
-- Create job_applications table
CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  full_name text NOT NULL,
  whatsapp text NOT NULL,
  bachelor_degree text NOT NULL,
  bachelor_university text NOT NULL,
  has_masters boolean NOT NULL DEFAULT false,
  masters_degree text,
  masters_university text,
  motivation text NOT NULL,
  cv_file_path text NOT NULL,
  cv_file_name text NOT NULL,
  cv_mime_type text NOT NULL DEFAULT 'application/pdf',
  zip_code text NOT NULL,
  availability_type text NOT NULL,
  availability_shift text,
  mobility_cdmx text NOT NULL,
  english_level text NOT NULL,
  referral_source text,
  status text NOT NULL DEFAULT 'nuevo'
);

-- Enable RLS
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Public can insert (apply)
CREATE POLICY "Anyone can submit job applications"
  ON public.job_applications FOR INSERT
  WITH CHECK (true);

-- Only admins can read
CREATE POLICY "Admins can view job applications"
  ON public.job_applications FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update (change status)
CREATE POLICY "Admins can update job applications"
  ON public.job_applications FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete
CREATE POLICY "Admins can delete job applications"
  ON public.job_applications FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create private bucket for CVs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('cv-uploads', 'cv-uploads', false, 5242880, ARRAY['application/pdf']);

-- Storage RLS: anyone can upload to cv-uploads
CREATE POLICY "Anyone can upload CVs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'cv-uploads');

-- Only admins can read CVs
CREATE POLICY "Admins can read CVs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cv-uploads' AND has_role(auth.uid(), 'admin'::app_role));
