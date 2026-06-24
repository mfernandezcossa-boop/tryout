-- Agregar columna content_path para posts muy largos
ALTER TABLE public.blog_posts
ADD COLUMN IF NOT EXISTS content_path TEXT;

COMMENT ON COLUMN public.blog_posts.content_path IS 'Ruta al archivo de contenido en Storage (para posts muy largos)';

-- Crear bucket para contenido de blogs
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-content', 'blog-content', false)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage para blog-content: solo admins pueden acceder
CREATE POLICY "Admins can read blog content"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'blog-content' 
  AND (
    has_role(auth.uid(), 'admin'::app_role) 
    OR has_role(auth.uid(), 'moderator'::app_role)
  )
);

CREATE POLICY "Admins can upload blog content"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog-content' 
  AND (
    has_role(auth.uid(), 'admin'::app_role) 
    OR has_role(auth.uid(), 'moderator'::app_role)
  )
);

CREATE POLICY "Admins can update blog content"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'blog-content' 
  AND (
    has_role(auth.uid(), 'admin'::app_role) 
    OR has_role(auth.uid(), 'moderator'::app_role)
  )
);

CREATE POLICY "Admins can delete blog content"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'blog-content' 
  AND (
    has_role(auth.uid(), 'admin'::app_role) 
    OR has_role(auth.uid(), 'moderator'::app_role)
  )
);