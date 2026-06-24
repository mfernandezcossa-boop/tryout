-- Agregar campos para autor visible y tags a blog_posts
ALTER TABLE public.blog_posts
ADD COLUMN IF NOT EXISTS author_name TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Crear índice para búsqueda por tags
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON public.blog_posts USING GIN(tags);

-- Comentarios para documentación
COMMENT ON COLUMN public.blog_posts.author_name IS 'Nombre visible del autor del blog';
COMMENT ON COLUMN public.blog_posts.tags IS 'Etiquetas/categorías del post para filtrado y búsqueda';