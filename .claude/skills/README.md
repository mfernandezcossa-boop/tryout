# Sistema de producción de contenido — Brilus

Motor para automatizar la producción de contenido **mes a mes** a partir de la Regla de Producción
en Batching del flywheel de contenido: **1 Tema Pilar → base de ideas + reels + carruseles + blog + newsletter**.

## Cómo se usa (on-demand)

Cuando tengas el Tema Pilar del mes, decí algo como:
> "Corramos la producción mensual para septiembre, el Tema Pilar es *vuelta a clases / derivaciones*."

Eso dispara **`brilus-produccion-mensual`**, que:
1. Abre el tema en un **mapa del mes** (una tabla de piezas con ángulo / pilar / valor / CTA).
2. Te pide OK.
3. Redacta cada pieza delegando a la skill especializada.
4. Deja cada pieza como ficha en la base **🎯 Iniciativas — Brilus** de Notion (Etapa: Revisión).

Si no tenés Tema Pilar, pedíselo y te propone 3 opciones según el calendario escolar.

## Las skills del sistema

| Skill | Qué hace | Estado |
|---|---|---|
| `brilus-produccion-mensual` | Orquestador mensual (1 Tema Pilar → todo el paquete) | **nueva** |
| `brilus-reel` | Guiones de Reels + base de ideas de reels | **nueva** |
| `brilus-blog` | Artículos de blog alineados al CMS del sitio (Markdown + metadata SEO) | **nueva** |
| `carousel-writer-brilus` | Concepto + copy slide a slide de carruseles | existente |
| `brilus-newsletter` | Newsletter semanal + serie de bienvenida (Brevo/Flowdesk) | existente |

Todas comparten el mismo contexto de marca:
**`brilus-produccion-mensual/contexto-marca.md`** (persona Mariana, voz, 4 pilares, 4 Valores de
Contenido, segmentos, colores, stack). Es la fuente única de verdad: si cambia la marca, se edita ahí.

## Volumen estándar por mes

4 reels · 4 carruseles · 2 blogs · 2 emails quincenales · 1 broadcast WhatsApp.
(Ajustable a *ligero* o *intensivo* en el momento.)

## Destino en Notion

Base **🎯 Iniciativas — Brilus** (`collection://328697cd-ff2e-4873-b95b-08a7bc74e3c7`). Una ficha por
pieza, con el guión/copy/artículo completo en el cuerpo, `Frente` y `Tags` correctos, y `Vencimiento`
repartido a lo largo del mes. Vistas Calendar y Gantt del board lo muestran como calendario editorial.
