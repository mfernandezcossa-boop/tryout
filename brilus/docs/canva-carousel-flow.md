# Flujo reutilizable: Carruseles de Brilus con Canva (vía Claude)

Receta para generar un carrusel de Instagram/LinkedIn de Brilus de punta a punta:
**tema → copy con voz de marca → diseño en Canva con brand kit → export listo para publicar.**

El objetivo es que cada vez sólo tengas que dar el **tema** (y opcionalmente el formato/pilar/CTA)
y el resto salga con mínimo esfuerzo.

---

## Recursos fijos (ya configurados)

| Recurso | Valor | Nota |
|---|---|---|
| Brand kit Brilus | `kAEoULAX1rY` | Colores y tipografías de marca en Canva |
| Skill de copy | `carousel-writer-brilus` | Genera copy slide a slide con la voz de Brilus |
| Colores | Azul `#4686EF`, Coral `#FC683D`, Fondo oscuro `#1F1F1F` | Ver skill para uso por tipo de slide |
| Tipografía | Poppins Bold (headline) / Poppins Regular (subtexto) | |
| Formato IG | 1080×1350 px (4:5) | Cuadrado 1080×1080 si es sólo LinkedIn |
| Cantidad de slides | 8–10 | Cover + contenido + CTA |

> No hay brand templates guardadas en la cuenta, por eso el diseño se **genera** aplicando el
> brand kit, no se autollena una plantilla. Si en el futuro guardás una brand template en Canva,
> se puede cambiar al modo "autofill" (ver sección Variantes).

---

## Qué le decís a Claude cada vez

Basta con una frase, por ejemplo:

> "Armá un carrusel sobre **[tema]**"

Si querés controlar más, agregá cualquiera de estos (si no, se infieren):

- **Formato:** `the_list` · `myth_bust` · `framework` · `story_arc`
- **Pilar:** `educativo` · `brilus` · `pop_culture` · `comunidad`
- **Cuenta:** Instagram · LinkedIn · Ambas
- **CTA:** guardar · comentar · agendar consulta · link en bio

---

## Los 4 pasos (lo que hace Claude)

### Paso 1 — Copy con voz de marca
Corre la skill **`carousel-writer-brilus`** con el tema.
Produce: parámetros del carrusel + copy slide a slide (headline, subtexto, brief visual,
swipe hint) + caption IG/LinkedIn + hashtags + cover alternativo A/B.
→ Punto de revisión: aprobás el copy antes de pasar a diseño.

### Paso 2 — Generar el diseño en Canva
El carrusel es una **presentación multi-slide** en Canva. Claude usa:

1. `request-outline-review` → arma el outline (1 slide por item del copy) y te lo muestra
   en un widget para aprobar.
2. Al aprobar, `generate-design-structured` con:
   - `design_type: presentation`
   - `brand_kit_id: kAEoULAX1rY`
   - `style`: "limpio, moderno, accesible — azul #4686EF y coral #FC683D, Poppins"
   - `presentation_outlines`: un objeto `{title, description}` por slide, tomados del copy del Paso 1
3. `create-design-from-candidate` para dejar el diseño editable en tu cuenta.

### Paso 3 — Ajuste de marca (opcional pero recomendado)
- `read-design` para revisar cada página.
- `edit-design` para corregir textos que el generador haya reformulado, y asegurar:
  barra coral al pie, logo "brilus", swipe hints en slides de contenido.
- Si hace falta el ratio 4:5 exacto de IG, `resize-design`.

### Paso 4 — Export y entrega
- `get-export-formats` (obligatorio antes de exportar) → confirma formatos soportados.
- `export-design`:
  - **PDF** → subir carrusel a Instagram/LinkedIn (multipágina).
  - **PNG** por página (1080×1350) → si querés cada slide suelto.
- Claude te pasa los links de descarga + el link editable del diseño en Canva.

---

## Checklist de calidad (antes de publicar)

- [ ] Cover genera curiosidad suficiente para deslizar
- [ ] Máx ~10 palabras por headline, una idea por slide
- [ ] Segunda persona ("tu hijo", "tu familia"), tono empático-experto
- [ ] Sin tecnicismos sin explicar, sin MAYÚSCULAS completas ni "!!!"
- [ ] Último slide de contenido prepara el CTA
- [ ] Colores de marca correctos por tipo de slide
- [ ] Logo "brilus" + barra coral al pie de cada slide
- [ ] Caption con gancho en la primera línea + CTA claro
- [ ] Hashtags: 15–20 en IG / 5–8 en LinkedIn

---

## Variantes

- **Slides como imágenes sueltas** (sin presentación): generar cada slide con
  `generate-design` (`design_type: instagram_post`, 1080×1350) usando el `brand_kit_id`.
  Más control por slide, pero más pasos.
- **Modo autofill con brand template**: si guardás una brand template en Canva con campos de
  dataset, se puede pasar a `search-brand-templates (dataset: non_empty)` + autofill para que el
  copy entre en placeholders fijos. Es el modo más consistente visualmente. Hoy no hay ninguna
  guardada, por eso usamos generación.
- **Sólo el copy**: si sólo querés el texto (para pasarlo a `/carousel-maker` o Canva a mano),
  corré nada más el Paso 1.

---

## Resumen de una línea

**Vos:** "carrusel sobre [tema]" → **Claude:** copy Brilus → (aprobás) → diseño en Canva con
brand kit → PDF/PNG listos para publicar.
