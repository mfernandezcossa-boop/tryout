-- Add RLS policies for form_submissions table
-- Allow admins to view all form submissions
CREATE POLICY "Admins can view form submissions"
ON form_submissions FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update form submissions (status, notes, etc.)
CREATE POLICY "Admins can update form submissions"
ON form_submissions FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete form submissions if needed
CREATE POLICY "Admins can delete form submissions"
ON form_submissions FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add RLS policies for team_members admin operations
CREATE POLICY "Admins and moderators can insert team members"
ON team_members FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

CREATE POLICY "Admins and moderators can update team members"
ON team_members FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

CREATE POLICY "Only admins can delete team members"
ON team_members FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add RLS policies for storage buckets

-- blog-media: Allow admins/moderators to upload, public read for published images
CREATE POLICY "Public can view blog media"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-media');

CREATE POLICY "Admins and moderators can upload blog media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog-media' AND
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role))
);

CREATE POLICY "Admins and moderators can update blog media"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'blog-media' AND
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role))
);

CREATE POLICY "Only admins can delete blog media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'blog-media' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- blog-content: Public read, admins/moderators manage
CREATE POLICY "Public can view blog content"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-content');

CREATE POLICY "Admins and moderators can upload blog content"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog-content' AND
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role))
);

CREATE POLICY "Admins and moderators can update blog content"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'blog-content' AND
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role))
);

CREATE POLICY "Only admins can delete blog content"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'blog-content' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Photos: Restrict to admin-only access
CREATE POLICY "Admins can view photos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'Photos' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can upload photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'Photos' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'Photos' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'Photos' AND
  has_role(auth.uid(), 'admin'::app_role)
);