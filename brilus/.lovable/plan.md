# Agregar video de testimonio debajo del formulario en `/contacto`

## Ubicación
Archivo: `src/pages/Contacto.tsx`. Insertar el bloque **debajo del formulario** (fuera del grid de 2 columnas, como sección full-width centrada antes del footer/siguiente sección).

```text
[Grid: Texto+Testimonio | Formulario]
[Video Testimonial]   <-- NUEVO, full-width, centrado
```

## Componente nuevo: `VideoTestimonialSection`
Ruta: `src/components/VideoTestimonialSection.tsx`

- Sección full-width con `section-py` y `section-px`, contenedor `max-w-3xl mx-auto` para mantener foco.
- Header centrado:
  - Badge pill coral (`bg-brand-coral-50 text-brand-coral`) con ícono Play: "Testimonio".
  - Título `text-h3` brand-black: "Escucha a una familia Brilus" (editable).
- Contenedor de video:
  - `rounded-brilus-card` (14px), `shadow-brilus-2`, overflow-hidden.
  - Aspect ratio configurable: `16/9` (horizontal) o `9/16` (vertical, max-w más angosto).
  - Soporta YouTube (iframe `youtube-nocookie`, `loading="lazy"`) o MP4 nativo (`<video controls playsInline preload="metadata" poster>`).
- Pie: nombre del autor (Medium 14px brand-black) + relación ("Mamá de Lucas, 6 años") en muted.
- Wrapper `ScrollReveal variant="fadeIn"` para coherencia con el resto del sitio.

Props:
```ts
{
  source: 'youtube' | 'mp4';
  videoId?: string;
  videoUrl?: string;
  posterUrl?: string;
  authorName: string;
  authorRole?: string;
  aspect?: '16/9' | '9/16';
  title?: string;
}
```

## Datos a confirmar
1. **Fuente del video**: ¿URL de YouTube o MP4 en Supabase Storage?
2. **Nombre y relación** del testimoniante.
3. **Orientación**: horizontal (16/9) o vertical tipo reel (9/16).

Si no me los pasas ahora, dejo un placeholder editable con el webinar actual y lo cambias después.

## Archivos afectados
- **Crear**: `src/components/VideoTestimonialSection.tsx`
- **Modificar**: `src/pages/Contacto.tsx` (import + render debajo del grid del formulario)
