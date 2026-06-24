-- Permitir NULL en la columna content para soportar contenido almacenado en Storage
ALTER TABLE blog_posts 
ALTER COLUMN content DROP NOT NULL;

-- Agregar constraint para validar que al menos uno esté presente
ALTER TABLE blog_posts
ADD CONSTRAINT content_or_path_required 
CHECK (content IS NOT NULL OR content_path IS NOT NULL);