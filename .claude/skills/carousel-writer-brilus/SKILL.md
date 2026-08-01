---
name: carousel-writer-brilus
description: >
  Escribe el copy completo de carruseles de Instagram y LinkedIn para Brilus, adaptado a su tono, pilares de contenido y formatos visuales. Usá esta skill SIEMPRE que Milu diga frases como: "escribime el carrusel", "armá el copy del carrusel", "redactá los slides de este carrusel", "necesito el copy para un carrusel de Brilus", "hacé los textos del carrusel", "qué va en cada slide", "armá el guión del carrusel", "necesito los slides sobre X", "/carousel-writer-sms", "/carousel-writer-brilus", o cualquier variante de querer escribir el texto de un carrusel de Instagram o LinkedIn para Brilus. También activar si menciona un tema de contenido y pide dividirlo en slides, o pide "estructura + copy" para un carrusel. Produce siempre: copy slide a slide con brief visual, caption de post, hashtags y variante de cover. Listo para pasar directamente al generador de imágenes o a Canva.
---

# Brilus Carousel Writer

Genera el copy completo de carruseles para Brilus: texto de cada slide, brief visual, caption y hashtags. Listo para usar directamente en el generador de imágenes `/carousel-maker` o en Canva.

---

## Paso 1: Recopilar información

Si Milu no lo dio en el mensaje inicial, preguntá:

1. **Tema** → ¿De qué trata el carrusel? (ej. "señales tempranas de TDAH", "cómo funciona ABA en casa", "mitos sobre el autismo")
2. **Formato** → elegir uno:
   - `the_list` → "5 cosas que...", "7 señales de..."
   - `myth_bust` → Mito vs. realidad
   - `framework` → Sistema/proceso paso a paso
   - `story_arc` → Narrativa antes/después
3. **Pilar de contenido** → ¿A qué pilar del flywheel pertenece?
   - `educativo` → explicar conceptos ABA/autismo/TDAH para papás
   - `brilus` → mostrar cómo trabaja Brilus, diferenciadores
   - `pop_culture` → conectar temas de actualidad con neurodesarrollo
   - `comunidad` → historias reales, familias, Brilers
4. **Cuenta destino** → Instagram / LinkedIn / Ambas
5. **CTA del carrusel** → ¿qué acción queremos que tome la audiencia? (guardar, comentar, agendar consulta, visitar web)

Si falta alguno, preguntá antes de escribir. Si hay suficiente contexto en el mensaje, asumir los que se puedan inferir y arrancar.

---

## Paso 2: Generar el output completo

Producí siempre **tres bloques**: Parámetros del carrusel + Copy slide a slide + Caption & Hashtags.

---

### BLOQUE 1: Parámetros del carrusel

```
TEMA: [tema del carrusel]
PILAR: [educativo | brilus | pop_culture | comunidad]
FORMATO: [the_list | myth_bust | framework | story_arc]
CUENTA: [Instagram | LinkedIn | Ambas]
CANTIDAD DE SLIDES: [8-10]
OBJETIVO DE ENGAGEMENT: [guardar | comentar | link en bio | DM]
```

---

### BLOQUE 2: Copy slide a slide

Estructura obligatoria por slide:

```
──────────────────────────────────────────
SLIDE [N] — [tipo: cover | contenido | cta]
──────────────────────────────────────────
HEADLINE: [máx 10 palabras, impacto inmediato]
SUBTEXTO: [máx 15 palabras, opcional — solo si aporta]
BRIEF VISUAL: [descripción en 1 línea de qué debería verse: color de fondo, elemento visual, estilo]
SWIPE HINT: [solo en slides de contenido, no en cover ni CTA — ej: "→ deslizá"]
```

**Reglas de copy:**
- Máximo 10 palabras en headline (8 ideal)
- Sin tecnicismos sin explicar — hablarle a Mariana (mamá de 35-45 años, CDMX)
- Tono: empático + experto + cálido. No condescendiente, no clínico frío
- Idioma: **español de México, tuteo (TÚ). NUNCA voseo** ("tú sabes", "guárdalo", no "sabés", "guardalo")
- Usar segunda persona singular: "tu hijo", "tú sabes", "tu familia"
- Cada slide = una sola idea. Si necesita coma, dividir en dos slides
- Prohibido: jerga corporativa, exclamaciones múltiples, MAYÚSCULAS completas
- El cover debe generar suficiente curiosidad para que la persona deslice
- El último slide de contenido siempre prepara el terreno para el CTA

**Estructura por formato:**

`the_list`:
- Slide 1: Cover con número y promesa ("5 señales que...")
- Slides 2-6: Una señal/item por slide, con contexto breve
- Slide 7: Síntesis o insight sorpresa
- Slide 8: CTA

`myth_bust`:
- Slide 1: Cover provocador ("Esto que creés sobre el autismo... está mal")
- Slides 2-6: Mito → Realidad (alternando)
- Slide 7: Cierre con postura de Brilus
- Slide 8: CTA

`framework`:
- Slide 1: Cover con nombre del framework y promesa
- Slides 2-6: Un paso/pilar por slide (numerados)
- Slide 7: Cómo se integra en Brilus
- Slide 8: CTA

`story_arc`:
- Slide 1: Hook emocional ("Esta familia llegó a Brilus sin saber qué esperar...")
- Slides 2-5: Desarrollo de la historia
- Slide 6: El cambio / la transformación
- Slide 7: Qué hizo posible ese cambio
- Slide 8: CTA

---

### BLOQUE 3: Caption & Hashtags

```
CAPTION INSTAGRAM:
[Primera línea: gancho fuerte de 1-2 oraciones que funcione sola en el feed]
[Salto de línea visual con . o ·]
[Desarrollo en 3-5 párrafos cortos: contexto del carrusel, por qué importa]
[CTA final (TÚ mexicano): "Guárdalo 🔖", "Comenta X", "Link en bio 👆", etc.]

CAPTION LINKEDIN:
[Misma lógica pero tono más profesional — hablarle también a colegas, terapeutas, educadores]
[Puede ser más largo: hasta 1300 caracteres]
[Cerrar con pregunta abierta para comentarios]

HASHTAGS INSTAGRAM (15-20):
#brilus #terapiaABA #autismomexico #TDAH #neurodesarrollo [+ específicos del tema]

HASHTAGS LINKEDIN (5-8):
#ABA #autismo #neurodesarrollo #saludinfantil [+ específicos del tema]

COVER ALTERNATIVO:
[Versión B del headline del cover para A/B test visual — misma idea, diferente ángulo]
```

---

## Reglas del tono Brilus

**Voz de marca:**
- Expertos que se comunican como humanos, no como clínicos
- Siempre del lado de la familia, nunca por encima de ella
- Optimistas con evidencia: no falsa esperanza, sí posibilidad real
- Directos sin ser agresivos

**Postura sobre ABA (reencuadre 30/07):**
- El tema NO es que la familia "no sepa qué es ABA". Es que escuchó que ABA "está mal vista" en México.
- Reconocer la controversia de frente → informar con honestidad (ABA ético/actual, cómo lo hace Brilus: juego, asentimiento del niño, calidad de vida, no "normalizar") → **dejar que la familia decida**.
- Tono: informar, no militar ABA ni ponerse a la defensiva. Formato acordado para esto: carrusel `myth_bust` con postura clara + Live (Carla y Pato).

**Persona objetivo: Mariana**
- Mamá de 35-45 años, CDMX o zona metropolitana
- Su hijo recibió diagnóstico reciente o está en proceso de evaluación
- Tiene muchas dudas y poco tiempo para leer
- Confía más en recomendaciones y experiencias reales que en estadísticas
- Consume contenido en el celular, en pausa entre actividades

**Colores y estilo visual (para el brief):**
- Azul: `#4686EF` → slides educativos, headers, fondos principales
- Coral: `#FC683D` → slides de impacto, CTA, acentos
- Blanco: fondo limpio para legibilidad
- Fondo oscuro (`#1F1F1F`): solo para cover cuando se quiere impacto máximo
- Tipografía: Poppins Bold para headlines, Poppins Regular para subtexto
- Estilo general: limpio, moderno, accesible — no médico/clínico

---

## Paso 3: Notas para producción

Al final de cada output, agregar:

```
NOTAS PARA PRODUCCIÓN:
- Generador: pasar a /carousel-maker con estilo "Brilus (azul #4686EF + coral)"
- Formato: 1080×1350px (4:5 Instagram) / 1080×1080px si es para LinkedIn cuadrado
- Fuente slides: Poppins Bold para headline, Poppins Regular para subtexto
- Logo "brilus" al pie de cada slide en color del acento del slide
- Barra coral de 12px al fondo de cada slide
- Swipe hint en slides de contenido: gris claro, Poppins Regular 26px
- Brief visual de cada slide: incorporar al prompt del generador de imágenes
```

---

## Modo de entrega

- Si Milu tiene **borrador previo** → reescribir aplicando todas las reglas. Señalar qué cambios y por qué.
- Si no hay borrador → generar desde cero con los datos recopilados.
- Si el carrusel es para **ambas cuentas** → generar el copy una sola vez (adaptando solo el caption) ya que los slides son los mismos.
- Si pide solo un slide específico → generar solo ese con el mismo formato.
- Al terminar, ofrecer siempre: "¿Pasamos esto al generador de imágenes?"
