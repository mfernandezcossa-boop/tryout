---
name: brilus-produccion-mensual
description: >
  Orquesta la producción de contenido mensual de Brilus a partir de UN Tema Pilar, aplicando la Regla de
  Producción en Batching: 1 tema → base de ideas + reels + carruseles (Instagram) + blog + newsletter/nurturing.
  Usá esta skill SIEMPRE que Milu diga frases como: "armemos el contenido del mes", "producción mensual",
  "batch de contenido", "es último jueves, armemos el mes que viene", "tengo el Tema Pilar del mes",
  "generá el contenido de [mes]", "corré la producción", "/brilus-produccion-mensual", o cualquier variante de
  querer producir en lote el contenido del mes a partir de un tema pilar. Coordina las skills brilus-reel,
  carousel-writer-brilus, brilus-blog y brilus-newsletter, y deja cada pieza cargada en la base
  "🎯 Iniciativas — Brilus" de Notion.
---

# Producción mensual Brilus — Orquestador de batching

Convierte **1 Tema Pilar** en el paquete de contenido del mes y lo deja programado en Notion. Es la
ejecución operativa de tu **Regla de Producción en Batching** (1 → N), extendida a Instagram + blog + newsletter.

> Contexto de marca (persona, voz, pilares, valores, colores, stack): `./contexto-marca.md`. Leerlo antes de producir.

---

## Volumen estándar por mes (editable)

| Canal | Pieza | Cantidad | Skill que la escribe |
|---|---|---|---|
| Instagram | Base de ideas de reels | 1 base (8–12 ideas) | `brilus-reel` (modo base) |
| Instagram | Guiones de reels | **4** | `brilus-reel` |
| Instagram | Conceptos + copy de carruseles | **4** | `carousel-writer-brilus` |
| Blog | Artículos SEO | **2** | `brilus-blog` |
| Newsletter | Emails quincenales (alineados al pilar) | **2** | `brilus-newsletter` |
| Newsletter | Broadcast WhatsApp (copy/audio) | 1 | `brilus-newsletter` (adaptado) |

> Ligero = ~2 reels / 2 carruseles / 1 blog / 2 emails. Intensivo = ~8 reels / 6 carruseles / 4 blogs / newsletter completa + serie de bienvenida. Milu puede pedir el ajuste en el momento.

---

## Paso 0 — Recopilar el brief del mes

Confirmá con Milu (o inferí de estacionalidad si no lo da):

1. **Mes destino** → ¿para qué mes es este contenido? (el batching del último jueves produce el mes siguiente)
2. **Tema Pilar** → 1 solo tema atado a estacionalidad / hito escolar (ej. *Vuelta a clases / derivaciones* para septiembre, *Detección temprana* para el arranque de año).
   - Si Milu no lo tiene, **proponé 3 opciones de Tema Pilar** basadas en el calendario escolar/estacional de México y el momento de Brilus, y que elija.
3. **Volumen** → estándar (default) / ligero / intensivo / custom.
4. **¿Escribir en Notion?** → sí (default, crea las fichas en "🎯 Iniciativas — Brilus") / no (solo devolver en el chat).

No arranques la producción hasta tener Tema Pilar + mes.

---

## Paso 1 — Ángulos: abrir el Tema Pilar en un mapa de piezas

Antes de escribir nada largo, generá el **mapa del mes**: una tabla que reparte el Tema Pilar en ángulos
distintos, sin canibalización, cubriendo los 4 pilares y los 4 valores del flywheel. Esta tabla es el
contrato del batch.

```
MAPA DEL MES — Tema Pilar: [tema] · Mes: [mes/año]

# | Pieza          | Ángulo / Hook                     | Pilar      | Valor flywheel      | CTA
1 | Reel           | ...                               | educativo  | traduccion_clinica  | guardar
2 | Reel           | ...                               | comunidad  | comunidad_brilus    | comentar
3 | Reel           | ...                               | brilus     | mirada_brilus       | agendar
4 | Reel           | ...                               | pop_culture| ecosistema          | compartir
5 | Carrusel       | ...                               | educativo  | traduccion_clinica  | guardar
6 | Carrusel       | ...                               | ...        | ...                 | ...
7 | Carrusel       | ...                               | ...        | ...                 | ...
8 | Carrusel       | ...                               | ...        | ...                 | ...
9 | Blog           | ...  (keyword: ...)               | educativo  | traduccion_clinica  | agendar
10| Blog           | ...  (keyword: ...)               | ...        | ...                 | agendar
11| Newsletter E1  | ...                               | -          | -                   | clic
12| Newsletter E2  | ...                               | -          | -                   | conversion_llamada
13| Broadcast WA   | ...                               | -          | -                   | -
```

**Reglas del mapa:**
- Cuando una pieza toque **ABA / el método**, aplicar la **Postura sobre ABA** de `contexto-marca.md`: reconocer la controversia → informar → dejar decidir. Nunca "explicar qué es ABA" como si la familia fuera ignorante.
- Ningún hook se repite entre piezas.
- Cubrir los 4 pilares y los 4 valores del flywheel al menos una vez cada uno.
- El blog es la pieza "ancla" (más larga y buscable); reels y carruseles pueden derivar de sus subtemas.
- Los emails del mes hablan del mismo pilar que el contenido orgánico (coherencia de flywheel).

Mostrá el mapa a Milu y pedí OK (o ajustes) **antes** de redactar las piezas completas.

---

## Paso 2 — Producir cada pieza (delegar a las skills)

Con el mapa aprobado, generá cada pieza llamando a la skill correspondiente, pasándole el ángulo/pilar/valor
ya asignado (no volver a preguntar los parámetros — ya están en el mapa):

- **Reels** → `brilus-reel`, un guión por fila de reel.
- **Carruseles** → `carousel-writer-brilus`, un carrusel por fila.
- **Blogs** → `brilus-blog`, un artículo por fila (con su metadata de CMS completa).
- **Emails / broadcast** → `brilus-newsletter` (Flujo A por email; adaptar copy/audio para el broadcast WhatsApp).

Producí en tandas y mostrá avances; no vuelques 13 piezas de una sin checkpoints. Sugerencia de orden:
1) los 2 blogs (anclas) → 2) los 4 carruseles → 3) los 4 reels → 4) los 2 emails + broadcast.

---

## Paso 3 — Cargar en Notion ("🎯 Iniciativas — Brilus")

Si Milu dijo que sí, creá **una ficha por pieza** en la base de Iniciativas.

**Data source:** `collection://328697cd-ff2e-4873-b95b-08a7bc74e3c7`
(base "🎯 Iniciativas — Brilus", parent database `a4479d6e-c81f-4da4-8c41-3acccc10425e`)

**Mapeo de propiedades por pieza:**

| Propiedad | Valor a setear |
|---|---|
| `Objetivo` (title) | `[Tipo] [Mes] · [gancho corto]` — ej. `Reel Sep · Berrinche o sobrecarga sensorial` |
| `Frente` | `Orgánicos` para reels/carruseles · `Contenido` para blog y newsletter |
| `Tags` | `Instagram` (reels/carruseles) · `Blog` (blogs) · (emails: sin tag de canal, o `Proyecto`) |
| `Etapa` | `Revisión` (el borrador queda listo para que Milu/Nils aprueben) |
| `Estado` | `En curso` |
| `Vencimiento` | fecha de publicación planeada, repartida a lo largo del mes destino (ver cadencia abajo) |
| `Avances` | `Borrador generado por producción mensual — Tema Pilar: [tema]` |

**Cuerpo de la página:** pegar el output completo de la pieza (guión / copy slide a slide / artículo Markdown / email), tal como lo devolvió la skill. Así la ficha de Notion es autosuficiente para grabar/publicar.

**Cadencia sugerida de `Vencimiento` (mes estándar, ~4 semanas):**
- Semana 1: Blog 1 + Reel 1 + Carrusel 1 + Email E1
- Semana 2: Reel 2 + Carrusel 2 + Broadcast WA
- Semana 3: Blog 2 + Reel 3 + Carrusel 3 + Email E2
- Semana 4: Reel 4 + Carrusel 4

> Usar `notion-create-pages` con `parent` = el data source de arriba, una página por pieza. Confirmar con Milu antes de crear si son muchas fichas. Al terminar, devolvé la lista de URLs de las fichas creadas.

---

## Paso 4 — Cierre

Al terminar, entregá un resumen:
- Tema Pilar y mes.
- Tabla final de piezas con su `Vencimiento` y link a la ficha de Notion.
- Qué queda pendiente de Milu: imágenes destacadas, aprobación de Nils, carga en Flowdesk/Canva, verificación de `[VERIFICAR DATO]` en blogs.
- Recordatorio de flywheel de comunicación: los emails del mes deben cargarse en Brevo/Flowdesk segmentados por etapa (`Bienvenida/Cold/Warm/Active`).

---

## Automatización futura (opcional)

Hoy esto corre **on-demand** (Milu lo dispara cuando tiene el Tema Pilar). Si más adelante quiere que se
dispare solo el **último jueves de cada mes**, se puede crear una Routine que abra la sesión con el prompt
"corré la producción mensual para [mes siguiente], proponeme 3 Temas Pilar" — dejando el mapa listo para
que Milu solo apruebe. No crear la Routine sin que Milu lo pida explícitamente.
