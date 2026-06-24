-- Agregar campos SEO a la tabla blog_posts
ALTER TABLE public.blog_posts
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT;