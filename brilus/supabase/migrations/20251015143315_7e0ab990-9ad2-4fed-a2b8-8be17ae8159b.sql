-- Añadir campos faltantes a blog_posts sin romper datos existentes
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS author_bio TEXT,
ADD COLUMN IF NOT EXISTS author_link TEXT,
ADD COLUMN IF NOT EXISTS author_avatar_url TEXT;

-- Comentarios para documentación
COMMENT ON COLUMN blog_posts.category IS 'Categoría del artículo (ej: Educación, Terapia, etc.)';
COMMENT ON COLUMN blog_posts.author_bio IS 'Biografía breve del autor para mostrar en el artículo';
COMMENT ON COLUMN blog_posts.author_link IS 'URL del perfil o sitio del autor';
COMMENT ON COLUMN blog_posts.author_avatar_url IS 'URL del avatar del autor';