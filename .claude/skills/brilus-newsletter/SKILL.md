---
name: brilus-newsletter
description: >
  Redacta y optimiza newsletters de email marketing y series de bienvenida para Brilus siguiendo el Manual de Estándares Operativos interno.
  Usá esta skill SIEMPRE que Milu diga frases como: "escribime el newsletter", "armá el email de esta semana",
  "redactá el newsletter sobre X", "hacé el email para los prospectos", "quiero mandar un newsletter",
  "optimizá este borrador de newsletter", "tengo el tema del flywheel, escribime el email",
  "armá la serie de bienvenida", "necesito los emails de onboarding", "hacé el flujo de bienvenida para leads",
  o cualquier variante de querer crear o mejorar un email de nurturing o automatización para Brilus.
  También activar si menciona un tema de contenido semanal y un segmento de audiencia (leads, prospectos, clientes).
  Produce siempre: parámetros técnicos completos (asunto, pre-encabezado, UTMs, segmento) + cuerpo del email
  listo para Flowdesk, con tono conversacional y estructura optimizada para bandeja principal de Gmail.
---

# Brilus Newsletter Skill

Este skill cubre dos flujos:
- **Flujo A — Newsletter semanal**: un email puntual basado en el tema del flywheel de contenido
- **Flujo B — Serie de bienvenida**: secuencia de 4 emails automatizada para leads nuevos de ads

Genera newsletters de email marketing para Brilus que cumplan el Manual de Estándares Operativos: entregabilidad máxima, tono conversacional, UTMs correctos, y CTA único orientado al objetivo de conversión.

---

## Paso 1: Recopilar información necesaria

Antes de escribir, confirmá con Milu estos datos (si no los dio en el mensaje inicial):

1. **Tema del flywheel** → ¿De qué trató el contenido de esta semana? (ej. señales tempranas de TDAH, rutinas en casa, qué esperar de la evaluación inicial)
2. **Segmento de audiencia** →
   - `leads_historicos` → base antigua, tono reactivador, alta educación
   - `prospectos_ads` → leads recientes de Meta/Google, alta intención, menos fricción
   - `clientes_activos` → familias en proceso terapéutico, tono de acompañamiento
3. **Objetivo del email** →
   - `apertura` → priorizar asunto + curiosidad, CTA suave
   - `clic` → cuerpo educativo con CTA a recurso descargable o artículo
   - `conversion_llamada` → CTA directo a agendar consulta gratuita
4. **Mes y año** → para el UTM de campaña (ej. 2025_04)
5. **¿Tiene borrador previo?** → Si sí, optimizarlo; si no, crear desde cero

Si falta alguno de estos datos, preguntáselos antes de continuar.

---

## Paso 2: Generar el output completo

Producí siempre **dos bloques**: Parámetros Técnicos + Cuerpo del Email.

---

### BLOQUE 1: Parámetros Técnicos

```
SEGMENTO: [leads_historicos | prospectos_ads | clientes_activos]
OBJETIVO: [apertura | clic | conversion_llamada]

ASUNTO (40-50 caracteres):
[Opción A]: [asunto principal]
[Opción B]: [variante para A/B test]

PRE-ENCABEZADO (80-100 caracteres):
[Complemento directo que refuerza el asunto sin repetirlo]

REMITENTE SUGERIDO: Brilus + nombre de terapeuta o "el equipo Brilus"

UTMs PARA LINKS:
- CTA principal: ?utm_source=newsletter_brilus&utm_medium=email&utm_campaign=YYYY_MM_[tema_slug]&utm_content=cta_principal
- Link secundario (si aplica): ?utm_source=newsletter_brilus&utm_medium=email&utm_campaign=YYYY_MM_[tema_slug]&utm_content=text_link_body

HORARIO SUGERIDO DE ENVÍO: [según segmento - ver reglas abajo]
```

**Reglas de horario por segmento:**
- `leads_historicos` → Martes o miércoles, 9:00–10:00 AM
- `prospectos_ads` → Lunes, 8:30 AM (capturar intención de inicio de semana)
- `clientes_activos` → Jueves, 10:00 AM (mitad de semana terapéutica)

---

### BLOQUE 2: Cuerpo del Email

Estructura obligatoria según el Manual de Estándares Operativos:

```
[SALUDO PERSONALIZADO]
Hola [Nombre],

[APERTURA PERSONAL — 1-2 oraciones]
Frase que conecte con la experiencia real del padre/madre. Sin "Estamos emocionados de...".
Ejemplos válidos: "Esta semana en nuestras sesiones vimos algo que se repite mucho..." / 
"Preparé esto para vos porque sé que esta semana fue de esas que..."

[CUERPO EDUCATIVO — 3-5 párrafos cortos]
- Desarrollar el tema del flywheel con lenguaje técnico pero accesible
- Párrafos de 2-4 líneas máximo (mobile-first, patrón F)
- Una sola idea por párrafo
- Datos o ejemplos concretos cuando sea posible
- Sin bullets excesivos; preferir prosa fluida

[TRANSICIÓN AL CTA — 1 oración]
Frase puente que conecte el contenido educativo con la acción.

[CTA ÚNICO]
→ [Verbo de acción] + [beneficio concreto]
Ejemplos: "Agendá tu consulta gratuita aquí" / "Descargá la guía completa" / "Escribinos y te respondemos hoy"

[CIERRE HUMANO — 2-3 líneas]
Firma cálida, sin formalidad corporativa. Puede incluir nombre del terapeuta o del equipo.

[PIE DE EMAIL]
Si no quieres recibir más correos, puedes darte de baja aquí → [link de baja]
```

---

## Template real de Brilus (voz + diseño) — aplicar SIEMPRE

Basado en las campañas realmente enviadas por Brevo. Esto manda sobre cualquier ejemplo genérico de arriba.

**Idioma:** español de **México, tuteo (TÚ)**. NUNCA voseo. Correcto: *tienes, puedes, Descarga, responde,
No te preocupes, contigo, cuéntame*. Prohibido: *tenés, podés, descargá, respondé, contanos, vos*.
Vocabulario mexicano ("coche", no "auto").

**Voz:** cálida y **sororal** — de mamá a mamá. **Valida antes de informar.** Frases marca de la casa:
*"no estás exagerando: estás cuidando"*, *"el siguiente paso no lo das sola"*, *"lo vemos juntas"*, *"Te leo"*.

**Estructura de la campaña (patrón observado):**
- Saludo: **"¡Hola, {{ contact.FIRSTNAME }}!"**
- Apertura personal cálida (1-2 líneas), a veces con un aparte entre paréntesis.
- Secciones con **etiqueta resaltada en amarillo** (ej. "Foco del Webinar", "Tu regalo") + título serif en negrita.
- Cuerpo educativo concreto, con lead-ins en negrita para listas ("0–6 meses.", "1️⃣ …").
- CTA en **botón azul marino** ("Ver Webinar", "Descarga tu guía aquí").
- Cierre validante + invitación a responder: *"El siguiente paso no lo das sola — responde a este correo y lo vemos juntas."*
- Firma: **"Te leo,\n[Emi | Miluli] de Brilus"** (confirmar quién firma).
- Footer azul marino: wordmark **brilus**, boilerplate (*"Somos un centro de intervención temprana
  especializado en autismo y TDAH… en México"*), íconos sociales (FB/IG/web), Unsubscribe.

**Diseño (notas para Flowdesk):** fondo lavanda `#EAECFB`, tipografía **serif** (no Poppins), resaltador
amarillo `#FCE94F` en frases/etiquetas clave, botón CTA azul marino `#1F3A5F`, imágenes cutout B&N halftone
con trazos amarillos, foto del remitente como recorte con contorno azul + destellos ✨.

**Merge tags de Brevo:** `{{ contact.FIRSTNAME }}`, `{{ contact.EMAIL }}`.

---

## Reglas del Manual que se aplican siempre

**Tono y lenguaje:**
- ❌ Prohibido: "Estamos emocionados de anunciar", "Oferta limitada", "¡Compra ya!", MAYÚSCULAS, "!!!", **voseo**
- ✅ Obligatorio: apertura personal, lenguaje conversacional, empatía técnica, **tuteo mexicano**

**Estructura:**
- Layout una sola columna (indicarlo en notas para Flowdesk)
- Máximo 1-3 links en todo el email
- CTA único y claro, al final del mensaje principal
- Asunto entre 40-50 caracteres

**UTMs:**
- Solo minúsculas
- Sin espacios (usar `_`)
- Sin tildes ni caracteres especiales
- Formato campaña: `YYYY_MM_tema_slug`

**Segmentación:**
- Nunca enviar a `leads_historicos` sin campaña de reactivación previa si llevan +6 meses sin abrir
- Indicar si el segmento requiere verificación de higiene de lista antes del envío

---

## Paso 3: Notas para implementación en Flowdesk

Al final de cada output, agregar un bloque de notas operativas:

```
NOTAS PARA FLOWDESK:
- Template: una sola columna, sin sidebar
- Tipografía cuerpo: mínimo 16px
- Botón CTA: mínimo 44px de altura, con padding lateral generoso
- Alt-text obligatorio en todas las imágenes
- [Si clientes_activos]: excluir etiqueta "en_espera" del envío
- [Si leads_historicos con +6 meses inactivos]: verificar higiene de lista antes de enviar
```

---

---

## FLUJO B — Serie de Bienvenida (Leads nuevos de ads)

### Contexto
4 emails automatizados en Flowdesk para leads captados via Meta Ads o Google Ads.
Cadencia: Día 0 → Día 3 → Día 7 → Día 10.
Objetivos duales: que el lead conozca Brilus + agendar consulta gratuita.

---

### Arquitectura de la serie

| Email | Día | Tema | Objetivo | CTA |
|-------|-----|------|----------|-----|
| E1 | 0 | Bienvenida + qué es Brilus | Confianza inicial | Conocé cómo trabajamos |
| E2 | 3 | El proceso terapéutico ABA explicado | Educación / reducir miedos | Leé la guía completa |
| E3 | 7 | Historia real / testimonio de familia | Prueba social / conexión emocional | Agendá tu consulta |
| E4 | 10 | Última oportunidad + respuesta a objeciones comunes | Conversión directa | Agendá tu consulta gratuita |

---

### Generación de cada email

Cuando Milu pide la serie completa, generá los 4 emails en secuencia usando el mismo formato del Flujo A (Bloque 1 + Bloque 2 + Notas Flowdesk), aplicando la lógica narrativa de cada email según la tabla de arriba.

Si pide un email específico de la serie (ej. "escribime el E3"), generá solo ese.

#### Lógica narrativa por email

**E1 — Día 0: Bienvenida**
- Tono: cálido, humano, sin abrumar con información
- Apertura: reconocer que dar el primer paso es difícil
- Cuerpo: qué es Brilus en 3-4 párrafos simples (qué hacemos, cómo lo hacemos, para quién)
- CTA suave: invitar a conocer más, no a comprar todavía
- Sin mencionar precios ni proceso de agendamiento aún

**E2 — Día 3: Educación ABA**
- Tono: técnico pero accesible, posición de autoridad empática
- Apertura: conectar con una duda frecuente de los papás ("¿Qué es exactamente la terapia ABA?")
- Cuerpo: desmitificar ABA, explicar cómo funciona en casa, qué rol tiene la familia
- CTA: recurso educativo (guía, artículo, video) — no agendar todavía
- UTM utm_content: `text_link_guia_aba`

**E3 — Día 7: Testimonio**
- Tono: narrativo, emocional, en primera persona del testimonio
- Apertura: introducir a "una familia como la tuya"
- Cuerpo: historia breve de un caso real o representativo (sin datos identificatorios)
- Transición: de la historia al CTA de consulta
- CTA: primera vez que aparece el link de agendamiento
- UTM utm_content: `cta_agendar_testimonio`

**E4 — Día 10: Conversión**
- Tono: directo, urgente pero no agresivo
- Apertura: reconocer que quizás todavía tienen dudas
- Cuerpo: responder las 3 objeciones más comunes (precio, tiempo, si realmente funciona)
- CTA: el más directo de toda la serie — "Agendá tu consulta gratuita, sin compromiso"
- UTM utm_content: `cta_agendar_final`

---

### UTMs para la serie de bienvenida

Formato base: `?utm_source=newsletter_brilus&utm_medium=email&utm_campaign=bienvenida_ads&utm_content=[identificador]`

Identificadores por email:
- E1: `cta_conoce_brilus`
- E2: `text_link_guia_aba`
- E3: `cta_agendar_testimonio`
- E4: `cta_agendar_final`

---

### Notas para Flowdesk — Serie de Bienvenida

```
CONFIGURACIÓN DEL FLUJO EN FLOWDESK:
- Trigger: nuevo contacto con etiqueta "prospectos_ads"
- Delay E1→E2: 3 días
- Delay E2→E3: 4 días (día 7 desde E1)
- Delay E3→E4: 3 días (día 10 desde E1)
- Condición de salida: si el contacto agenda consulta → salir del flujo y mover a etiqueta "consulta_agendada"
- Excluir: contactos con etiqueta "clientes_activos"
```

---

## Sobre el modo de entrega

- Si Milu tiene un **borrador previo** → reescribir respetando su estructura pero aplicando todas las reglas del Manual. Señalar qué cambios se hicieron y por qué.
- Si no hay borrador → generar desde cero con los datos recopilados.
- Si el objetivo es `apertura` → generar siempre **dos variantes de asunto** para A/B test en Flowdesk.
- Si el objetivo es `conversion_llamada` → el CTA debe incluir el link de agendamiento con UTMs completos.
