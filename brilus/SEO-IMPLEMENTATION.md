# Implementación de SEO y Prerender en Brilus

## ✅ Cambios Implementados

### 1. Meta Tags Dinámicos por Página

Se ha creado el componente `SEOHead` que gestiona automáticamente:
- Title tags únicos por página
- Meta descriptions optimizadas
- Canonical links
- Open Graph tags (og:title, og:description, og:image, og:url)
- Twitter Card tags
- Robots meta tags (noindex para admin/auth)
- Structured data (JSON-LD) cuando sea necesario

**Páginas con SEO implementado:**
- ✅ `/` - Home con keywords principales
- ✅ `/sobre-nosotros` - Sobre Nosotros
- ✅ `/contacto` - Contacto
- ✅ `/nuestros-blogs` - Listado de blogs
- ✅ `/nuestros-blogs/:slug` - Posts individuales (dinámico)
- ✅ `/auth` - Con noindex
- ✅ `/admin` - Con noindex y noarchive

### 2. Exclusión Completa del Admin del SEO

**Implementaciones:**

#### a) Meta Robots Tags
- Todas las páginas admin tienen `<meta name="robots" content="noindex, nofollow, noarchive">`
- También incluyen `<meta http-equiv="X-Robots-Tag" content="noindex, nofollow, noarchive">`

#### b) HTTP Headers
Archivo `public/_headers` configurado para Vercel/Netlify:
```
/admin/*
  X-Robots-Tag: noindex, nofollow, noarchive

/auth
  X-Robots-Tag: noindex, nofollow, noarchive
```

#### c) robots.txt
```
User-agent: *
Disallow: /admin/
Disallow: /admin
Disallow: /auth
Allow: /

Sitemap: https://somosbrilus.com/sitemap.xml
```

### 3. Sitemap.xml Dinámico

**Ubicación:** `public/sitemap.xml`

**Contenido:**
- Páginas estáticas: /, /sobre-nosotros, /contacto, /nuestros-blogs
- Posts de blog dinámicos (solo publicados)
- Excluye completamente /admin y /auth

**Script de Generación:** `scripts/generate-sitemap.ts`

#### Cómo Generar el Sitemap

```bash
# Instalar dependencias si es necesario
npm install tsx @supabase/supabase-js

# Generar sitemap
npx tsx scripts/generate-sitemap.ts
```

**Cuándo regenerar:**
- Antes de cada deploy a producción
- Después de publicar nuevos posts de blog
- Si se agregan nuevas páginas públicas

### 4. Canonical Links

Todas las páginas públicas incluyen:
```html
<link rel="canonical" href="https://somosbrilus.com/ruta" />
```

### 5. Semántica HTML

Todas las páginas usan:
- ✅ Un único `<h1>` por página
- ✅ Jerarquía correcta de headings (h2, h3, h4)
- ✅ Elementos semánticos (`<header>`, `<main>`, `<footer>`, `<section>`, `<article>`)
- ✅ Atributos alt descriptivos en todas las imágenes
- ✅ Atributos `lang="es"` en el HTML

### 6. Edge Function de Revalidación

**Archivo:** `supabase/functions/revalidate-site/index.ts`

Esta función permite disparar rebuilds automáticos cuando se publican posts.

#### Configuración

1. **Agregar Secret en Supabase:**
   - Ve a: https://supabase.com/dashboard/project/dozlintkzvgtfjlflkyp/settings/functions
   - Agrega: `VERCEL_DEPLOY_HOOK` con tu Vercel Deploy Hook URL

2. **Crear Deploy Hook en Vercel:**
   - Ve a: Project Settings → Git → Deploy Hooks
   - Crea un nuevo hook (ej: "Supabase Blog Update")
   - Copia la URL generada

3. **Crear Trigger en Supabase (Opcional):**
   ```sql
   CREATE OR REPLACE FUNCTION notify_post_change()
   RETURNS TRIGGER AS $$
   BEGIN
     PERFORM http_post(
       'https://dozlintkzvgtfjlflkyp.supabase.co/functions/v1/revalidate-site',
       json_build_object(
         'slug', NEW.slug,
         'action', TG_OP
       )::text,
       'application/json'
     );
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;

   CREATE TRIGGER post_published_trigger
   AFTER INSERT OR UPDATE ON blog_posts
   FOR EACH ROW
   WHEN (NEW.status = 'published')
   EXECUTE FUNCTION notify_post_change();
   ```

## 🚀 Próximos Pasos

### Para Mejorar el SEO

1. **Prerender Estático (Recomendado):**
   - Considerar usar servicios como Prerender.io o Netlify Prerendering
   - O migrar a Next.js para SSR/ISR nativo

2. **Generar Sitemap Automáticamente:**
   - Agregar el script `generate-sitemap.ts` a tu pipeline de build
   - En `package.json`:
     ```json
     {
       "scripts": {
         "build": "vite build && tsx scripts/generate-sitemap.ts"
       }
     }
     ```

3. **Structured Data (JSON-LD):**
   - Agregar schema.org para artículos de blog
   - Agregar Organization schema en el home
   - Agregar BreadcrumbList para navegación

4. **Performance:**
   - Lazy loading de imágenes (ya implementado)
   - Defer scripts no críticos
   - Optimizar tamaño de imágenes

### Para Producción

1. **Verificar en Google Search Console:**
   - Enviar sitemap.xml
   - Verificar que /admin no aparece en índice
   - Monitorear Core Web Vitals

2. **Validar robots.txt:**
   - https://somosbrilus.com/robots.txt
   - Usar Google's Robots Testing Tool

3. **Verificar Meta Tags:**
   - Usar herramientas como:
     - Meta Tags Validator
     - Twitter Card Validator
     - Facebook Sharing Debugger

4. **Test de Prerender:**
   - Deshabilitar JavaScript en el navegador
   - El contenido principal debe ser visible (actualmente NO, requiere SSR)
   - Para SSR real, considerar Next.js

## 📋 Checklist de QA

- [x] Title tags únicos en todas las páginas públicas
- [x] Meta descriptions en todas las páginas públicas
- [x] Canonical links implementados
- [x] OG tags para redes sociales
- [x] Un solo H1 por página
- [x] Jerarquía de headings correcta
- [x] Alt text en todas las imágenes
- [x] robots.txt configurado
- [x] Sitemap.xml generado
- [x] /admin con noindex
- [x] /auth con noindex
- [x] X-Robots-Tag headers configurados
- [ ] SSR/Prerender implementado (requiere Next.js o servicio externo)
- [ ] Structured data (JSON-LD) implementado
- [ ] Sitemap automático en build

## ⚠️ Limitaciones Actuales

**Vite + React SPA:**
- El proyecto actual es una SPA (Single Page Application)
- El contenido se renderiza client-side con JavaScript
- Los crawlers ven un HTML vacío con `<div id="root"></div>`
- **Para SEO óptimo se requiere SSR/SSG:**
  - Opción 1: Migrar a Next.js (recomendado)
  - Opción 2: Usar servicio de prerender (Prerender.io, Netlify Prerendering)
  - Opción 3: Implementar Vite SSR (complejo)

**Sin embargo:**
- ✅ Los meta tags están implementados correctamente
- ✅ Google puede ejecutar JavaScript (pero es menos eficiente)
- ✅ El sitemap ayuda a la indexación
- ✅ El admin está completamente excluido

## 📚 Recursos

- [Documentación SEO de Google](https://developers.google.com/search/docs)
- [Meta Tags Testing Tool](https://metatags.io/)
- [Schema.org Documentation](https://schema.org/)
- [React Helmet Async](https://github.com/staylor/react-helmet-async)
