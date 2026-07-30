---
name: brilus-blog
description: >
  Escribe artículos de blog para el sitio de Brilus, afinados a su voz, sus Valores de Contenido y
  optimizados para SEO y para el CMS propio (campos: title, slug, excerpt, category, tags, seo_title,
  seo_description, contenido en Markdown con headings ##). Usá esta skill SIEMPRE que Milu diga frases como:
  "escribime el blog", "armá el artículo", "necesito un post de blog sobre X", "redactá el blog",
  "artículo para la web", "post SEO", "hacé el blog del mes", "/brilus-blog", o cualquier variante de querer
  un artículo de blog para Brilus. Produce siempre: metadata completa del CMS + artículo en Markdown listo
  para pegar en el editor del admin, con estructura optimizada para índice (TOC) y lectura mobile.
---

# Brilus Blog Writer

Genera artículos de blog para el sitio de Brilus listos para el CMS. El contenido se guarda como **Markdown** (el editor lo convierte); el índice/TOC del sitio se arma con los headings `##` (H2), así que **la estructura de H2 es obligatoria y significativa**.

> Contexto de marca completo: ver `../brilus-produccion-mensual/contexto-marca.md`. Esenciales abajo.

---

## Paso 1: Recopilar información

Si Milu no lo dio, preguntá (o inferí):

1. **Tema / keyword principal** → sobre qué es el artículo y con qué término lo buscaría un papá (ej. "señales de autismo en niños de 2 años", "qué es la terapia ABA", "diferencia entre autismo y TDAH")
2. **Intención de búsqueda** → `informacional` (explicar/educar) | `comparativa` (X vs Y) | `decisional` (elegir/contratar servicio)
3. **Valor del flywheel** (al menos uno) → `traduccion_clinica` | `mirada_brilus` | `comunidad_brilus` | `ecosistema`
4. **Categoría** → texto libre del CMS. Usar consistente: `Autismo` · `TDAH` · `Terapia ABA` · `Crianza` · `Escuela e inclusión` · `Diagnóstico` (o la que corresponda al tema)
5. **Extensión** → `corto` (600–900) | `estándar` (1000–1400) | `pilar/guía` (1800–2500 palabras)
6. **Autor** → por defecto equipo Brilus o terapeuta específico (para author_name / author_bio)

Si falta lo crítico (tema + keyword), preguntá. Si hay contexto, arrancá.

---

## Paso 2: Generar el output completo

Producí **dos bloques**: Metadata del CMS + Artículo en Markdown.

### BLOQUE 1: Metadata del CMS

Estos campos mapean 1:1 con el editor de blog del admin. Devolvelos todos:

```
title:            [título del artículo — claro, con la keyword, 50-65 caracteres]
slug:             [en-minusculas-con-guiones-sin-tildes]
excerpt:          [resumen de 1-2 oraciones, 120-160 caracteres — lo que se ve en la card del blog]
category:         [Autismo | TDAH | Terapia ABA | Crianza | Escuela e inclusión | Diagnóstico | ...]
tags:             [tag1, tag2, tag3, tag4]   (3-6 tags, keywords relacionadas)
seo_title:        [55-60 caracteres, keyword al inicio; puede diferir del title]
seo_description:  [150-160 caracteres, con keyword y un beneficio/gancho claro]
featured_image_url: [dejar vacío — Milu lo carga; incluir sugerencia de imagen en NOTAS]
author_name:      [equipo Brilus | nombre terapeuta]
author_bio:       [1 línea de credibilidad, si aplica]
```

**Reglas SEO:**
- Keyword principal en: title, H1 (= title), primer párrafo, al menos un H2, slug, seo_title, seo_description.
- Slug: sin tildes ni ñ (usar n), sin stopwords innecesarias, corto.
- No keyword stuffing: densidad natural, sinónimos y variantes semánticas.

### BLOQUE 2: Artículo en Markdown

Estructura obligatoria (los `##` alimentan el índice del sitio):

```markdown
[PÁRRAFO DE ENTRADA — 2-3 oraciones]
Responde de una vez la promesa del título y conecta con la situación real de la familia.
Nada de "En este artículo hablaremos de...". Entrar directo al dolor o la duda.

## [H2 con subtema 1 — idealmente incluye la keyword o una variante]
Párrafos de 2-4 líneas (mobile-first). Una idea por párrafo. Traducir todo tecnicismo.

## [H2 subtema 2]
Usar listas solo cuando aportan (señales, pasos). Ejemplos concretos y cotidianos
(la casa, el aula, la fiesta, el tráfico — el niño no vive en el consultorio).

## [H2 subtema 3]
...

## Cuándo buscar ayuda profesional   ← (o H2 equivalente de cierre útil)
Puente natural hacia Brilus sin vender de más: qué hace un profesional, qué esperar.

## Preguntas frecuentes
**¿[Pregunta real que busca la gente]?**
Respuesta breve y directa. (3-5 FAQs — ayudan a SEO y a resolver objeciones.)
```

**Reglas de estructura y voz:**
- H1 = el `title` (no repetir dentro del cuerpo).
- 3–7 H2 según extensión. Subtítulos descriptivos y escaneables, no ingeniosos-vacíos.
- Primer párrafo = "answer-first": resolvé la duda arriba, desarrollá abajo.
- Cierre con un CTA suave y honesto: agendar consulta gratuita, descargar guía, o leer artículo relacionado. Un solo CTA principal.
- Prohibido: promesas de cura, alarmismo, jerga sin traducir, relleno.
- Optimista con evidencia. Del lado de la familia. Experto que habla como humano.
- E-E-A-T: cuando afirmes algo clínico, anclalo ("según la evaluación diagnóstica", "en terapia ABA se trabaja...") sin inventar estadísticas ni fuentes falsas. Si hace falta un dato, marcarlo como `[VERIFICAR DATO]` para que Milu lo complete.

---

## Voz y persona (esenciales)

**Persona — Mariana:** mamá 35–45, CDMX. Hijo con diagnóstico reciente o en evaluación. Busca en Google respuestas claras, tiene miedo y poco tiempo. Quiere entender y saber qué hacer hoy.

**Voz Brilus:** expertos que hablan como humanos, del lado de la familia, optimistas con evidencia, directos sin agresividad. Terreno: autismo, TDAH, ABA, neurodesarrollo, crianza, escuela/inclusión, diagnóstico. Marca ligada al Hospital Español (CDMX).

---

## Paso 3: Notas para publicación

Al final agregar:

```
NOTAS PARA EL CMS:
- Pegar el BLOQUE 2 en el editor de contenido (guarda Markdown); verificar que los ## queden como H2.
- Imagen destacada sugerida: [descripción concreta para banco de imágenes / generador]
- Enlazado interno: sugerir 1-2 artículos/páginas de servicio de Brilus para linkear desde este post.
- Antes de publicar: revisar [VERIFICAR DATO] si los hay, y que author_* estén completos.
- Difusión: este post puede alimentar 1 newsletter (brilus-newsletter) y 1 carrusel (carousel-writer-brilus) del mismo Tema Pilar.
```

---

## Modo de entrega

- Si Milu tiene **borrador previo** → reescribir aplicando estructura, SEO y voz. Señalar cambios clave.
- Si pide **solo un outline** → devolver title + los H2 propuestos + ángulo de cada sección, sin redactar.
- Si el blog es parte de la **producción mensual** (viene del orquestador con Tema Pilar) → alinear keyword y ángulo al pilar del mes, y evitar canibalizar otros posts del batch (cada blog, su intención de búsqueda propia).
