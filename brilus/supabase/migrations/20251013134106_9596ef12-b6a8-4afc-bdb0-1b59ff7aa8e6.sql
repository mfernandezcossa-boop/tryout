-- Fase 1: Crear tabla de blog posts con estructura completa

-- Tabla principal de posts
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  featured_image_url text,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft',
  published_at timestamp with time zone,
  views_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id)
);

-- Índices para mejor rendimiento
CREATE INDEX idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON public.blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

-- Habilitar RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Política: Todo el mundo puede leer posts publicados
CREATE POLICY "Anyone can read published posts"
  ON public.blog_posts
  FOR SELECT
  USING (status = 'published');

-- Política: Editores y admins pueden ver todos los posts
CREATE POLICY "Editors and admins can view all posts"
  ON public.blog_posts
  FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::app_role) OR 
    public.has_role(auth.uid(), 'moderator'::app_role)
  );

-- Política: Editores y admins pueden crear posts
CREATE POLICY "Editors and admins can create posts"
  ON public.blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin'::app_role) OR 
    public.has_role(auth.uid(), 'moderator'::app_role)
  );

-- Política: Editores y admins pueden actualizar posts
CREATE POLICY "Editors and admins can update posts"
  ON public.blog_posts
  FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::app_role) OR 
    public.has_role(auth.uid(), 'moderator'::app_role)
  );

-- Política: Solo admins pueden eliminar posts
CREATE POLICY "Only admins can delete posts"
  ON public.blog_posts
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));