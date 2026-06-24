-- Asegurar que el bucket blog-media sea público para imágenes del blog
UPDATE storage.buckets 
SET public = true 
WHERE id = 'blog-media';

-- Crear políticas RLS para blog-media si no existen
DO $$ 
BEGIN
  -- Política para lectura pública
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public read access for blog-media'
  ) THEN
    CREATE POLICY "Public read access for blog-media"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'blog-media');
  END IF;

  -- Política para que usuarios autenticados puedan subir
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can upload to blog-media'
  ) THEN
    CREATE POLICY "Authenticated users can upload to blog-media"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'blog-media' 
      AND auth.role() = 'authenticated'
    );
  END IF;

  -- Política para que usuarios autenticados puedan actualizar
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can update blog-media'
  ) THEN
    CREATE POLICY "Authenticated users can update blog-media"
    ON storage.objects FOR UPDATE
    USING (
      bucket_id = 'blog-media' 
      AND auth.role() = 'authenticated'
    );
  END IF;

  -- Política para que usuarios autenticados puedan eliminar
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can delete from blog-media'
  ) THEN
    CREATE POLICY "Authenticated users can delete from blog-media"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = 'blog-media' 
      AND auth.role() = 'authenticated'
    );
  END IF;
END $$;