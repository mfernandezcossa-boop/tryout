-- Fix overly permissive blog-media storage policies
-- Restrict write operations to admin and moderator roles only

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Authenticated users can upload to blog-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update blog-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete from blog-media" ON storage.objects;

-- Create restrictive policies for admins and moderators only
CREATE POLICY "Admins and moderators can upload to blog-media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog-media' 
  AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role))
);

CREATE POLICY "Admins and moderators can update blog-media"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'blog-media' 
  AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role))
);

CREATE POLICY "Admins and moderators can delete from blog-media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'blog-media' 
  AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role))
);