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
| **Brand template base** | `EAHT4ebU_LY` | Carrusel Brilus 4:5, 7 slides (cover + contenido + CTA). Base reutilizable |
| Skill de copy | `carousel-writer-brilus` | Genera copy slide a slide con la voz de Brilus |
| Colores | Azul `#4686EF`, Coral `#FC683D`, Fondo oscuro `#1F1F1F` | Ver skill para uso por tipo de slide |
| Tipografía | Poppins Bold (headline) / Poppins Regular (subtexto) | |
| Formato IG | 1080×1350 px (4:5) | Cuadrado 1080×1080 si es sólo LinkedIn |
| Contacto en CTA | IG `@somosbrilus` · `familias@somosbrilus.com` · `somosbrilus.com/contacto` | Datos reales de Brilus |
| Cantidad de slides | 7–10 | Cover + contenido + CTA |

> **Camino recomendado (más consistente):** partir de la **brand template base `EAHT4ebU_LY`**,
> instanciarla y reemplazar el texto de cada slide. Mantiene el layout y la marca idénticos cada vez.
> El camino alternativo (generar desde outline con el brand kit) sirve para diseños nuevos, pero la
> IA no siempre respeta colores/formato — ver "Aprendizajes" al final.

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

### Paso 2 — Volcar el copy en Canva

**Ruta A · Recomendada — reusar la brand template base (`EAHT4ebU_LY`)**
Mantiene layout y marca idénticos. Es el modo por defecto:
1. `create-design-from-brand-template` con `brand_template_id: EAHT4ebU_LY` → diseño editable 4:5.
2. `read-design` con `open_transaction: true` → devuelve los `locator_id` de cada texto por slide.
3. `edit-design` con `replace_text` por slide → inyecta headline + subtexto del copy del Paso 1.
4. `edit-design` con `finalize: "commit"` para guardar.
   - Si el carrusel necesita más/menos slides que la base, `add_page` / duplicar o recortar páginas.

**Ruta B · Diseño nuevo desde cero (cuando querés otro layout)**
1. `request-outline-review` → outline en widget para aprobar.
2. Al aprobar, `generate-design-structured` con `design_type: presentation` + `brand_kit_id: kAEoULAX1rY`.
3. `create-design-from-candidate` → diseño editable.
4. `resize-design` a `1080×1350` (la generación sale en 16:9, hay que pasarla a 4:5).
   ⚠️ La IA no siempre respeta la paleta azul/coral — suele salir en blanco/negro. Requiere pase de color manual.

### Paso 3 — Ajuste de marca
- `read-design` para revisar cada página (thumbnails).
- `edit-design` para: limpiar cualquier placeholder de Canva, asegurar datos de contacto Brilus en el CTA,
  barra coral al pie, logo "brilus", swipe hints en slides de contenido.

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
- **Modo autofill con dataset**: la template base `EAHT4ebU_LY` hoy NO tiene campos de dataset
  (por eso se rellena con `replace_text`, no con autofill). Si más adelante se marcan sus textos
  como campos de datos en Canva (app **Bulk create** → conectar cada campo a un texto), se puede
  pasar al modo autofill puro, aún más automático. Mientras tanto, `replace_text` cumple igual.
- **Sólo el copy**: si sólo querés el texto (para pasarlo a `/carousel-maker` o Canva a mano),
  corré nada más el Paso 1.

---

## Aprendizajes / pendientes (de la primera construcción)

- La **template base `EAHT4ebU_LY`** se construyó generando un carrusel real ("Señales tempranas
  de autismo") con el brand kit, pasándolo a 4:5 y limpiando el CTA con datos reales de Brilus.
- ⚠️ **Color**: la base quedó en **blanco/negro + foto**, no en azul `#4686EF` / coral `#FC683D`.
  Es un look limpio y válido, pero si se quiere la paleta de marca hay que hacer un **pase de color**
  (recolorear fondos por rol de slide + agregar barra coral y logo "brilus"). Pendiente.
- ⚠️ **`publish-brand-template` "consume" el diseño**: al publicar, el `design_id` deja de existir
  como diseño y pasa a ser template. Para exportar/editar después, hay que **instanciar** la
  template con `create-design-from-brand-template`.
- Puede haber **lag de propagación** en Canva: un `export`/`read` justo después de resize o publish
  puede dar "not found" un momento; reintentar o instanciar de nuevo.

---

## Resumen de una línea

**Vos:** "carrusel sobre [tema]" → **Claude:** copy Brilus → (aprobás) → diseño en Canva con
brand kit → PDF/PNG listos para publicar.
