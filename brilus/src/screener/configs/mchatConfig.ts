import type { ScreenerConfig } from "../screenerTypes";

export const mchatConfig: ScreenerConfig = {
  id: "mchat-r",
  title: "M-CHAT-R — Screening de Autismo",
  description:
    "El M-CHAT-R (Modified Checklist for Autism in Toddlers) es un cuestionario de detección temprana de autismo, validado internacionalmente y utilizado por pediatras de todo el mundo. En solo 20 preguntas y unos 5 minutos, te ayuda a identificar señales tempranas en cómo tu hijo se comunica, juega e interactúa — un primer paso simple y confiable para entender mejor su desarrollo y, si hace falta, buscar acompañamiento a tiempo.",
  durationEstimate: "~5 minutos",
  ageRangeMonths: { min: 16, max: 48 },
  footerCopyright: "© 2009 Diana Robins, Deborah Fein, & Marianne Barton",
  redirects: {
    tooYoung: {
      message: "Aún es pronto para el M-CHAT-R. Te recomendamos hablar con tu pediatra sobre los hitos del desarrollo.",
    },
    tooOld: {
      message: "Este cuestionario es más apropiado para niños menores de 4 años.",
      ctaLabel: "Ir al CAST",
      ctaUrl: "/screening-cast",
    },
  },
  privacyNoticeText:
    "Acepto el Aviso de Privacidad. Consiento que mis datos sean tratados de forma confidencial por Brilus y la Unidad de Neurodesarrollo del Hospital Español.",
  questions: [
    {
      id: 1,
      section: "main",
      type: "yesno",
      text: "¿Si usted señala un objeto del otro lado del cuarto, su hijo/a lo mira? (POR EJEMPLO, si usted señala un juguete o un animal, ¿su hijo/a mira al juguete o al animal?)",
    },
    { id: 2, section: "main", type: "yesno", text: "¿Alguna vez se ha preguntado si su hijo/a es sordo/a?" },
    {
      id: 3,
      section: "main",
      type: "yesno",
      text: "¿Su hijo/a juega juegos de fantasía o imaginación? (POR EJEMPLO, finge beber de una taza vacía, finge hablar por teléfono o finge darle de comer a una muñeca o un peluche)",
    },
    {
      id: 4,
      section: "main",
      type: "yesno",
      text: "¿A su hijo/a le gusta treparse a las cosas? (POR EJEMPLO, muebles, escaleras o juegos infantiles)",
    },
    {
      id: 5,
      section: "main",
      type: "yesno",
      text: "¿Su hijo/a hace movimientos inusuales con los dedos cerca de sus ojos? (POR EJEMPLO, ¿mueve sus dedos cerca de sus ojos de manera inusual?)",
    },
    {
      id: 6,
      section: "main",
      type: "yesno",
      text: "¿Su hijo/a apunta o señala con un dedo cuando quiere pedir algo o pedir ayuda? (POR EJEMPLO, señala un juguete o algo para comer que está fuera de su alcance)",
    },
    {
      id: 7,
      section: "main",
      type: "yesno",
      text: "¿Su hijo/a apunta o señala con un dedo cuando quiere mostrarle algo interesante? (POR EJEMPLO, señala un avión en el cielo o un camión grande en el camino)",
    },
    {
      id: 8,
      section: "main",
      type: "yesno",
      text: "¿Su hijo/a muestra interés en otros niños? (POR EJEMPLO, ¿mira con atención a otros niños, les sonríe o se les acerca?)",
    },
    {
      id: 9,
      section: "main",
      type: "yesno",
      text: "¿Su hijo/a le muestra cosas acercándoselas a usted o levantándolas para que usted las vea — no para pedir ayuda sino para compartirlas con usted? (POR EJEMPLO, le muestra una flor, un peluche o un camión/carro de juguete)",
    },
    {
      id: 10,
      section: "main",
      type: "yesno",
      text: "¿Su hijo/a responde cuando usted le llama por su nombre? (POR EJEMPLO, cuando usted lo llama por su nombre: lo mira a usted, habla, balbucea, o deja de hacer lo que estaba haciendo)",
    },
    {
      id: 11,
      section: "main",
      type: "yesno",
      text: "¿Cuando usted le sonríe a su hijo/a, él o ella le devuelve la sonrisa?",
    },
    {
      id: 12,
      section: "main",
      type: "yesno",
      text: "¿A su hijo/a le molestan los ruidos cotidianos? (POR EJEMPLO, ¿llora o grita cuando escucha la aspiradora o música muy fuerte?)",
    },
    { id: 13, section: "main", type: "yesno", text: "¿Su hijo/a camina?" },
    {
      id: 14,
      section: "main",
      type: "yesno",
      text: "¿Su hijo/a le mira a los ojos cuando usted le habla, juega con él/ella o lo/la viste?",
    },
    {
      id: 15,
      section: "main",
      type: "yesno",
      text: "¿Su hijo/a trata de imitar sus movimientos? (POR EJEMPLO, decir adiós con la mano, aplaudir o algún ruido chistoso que usted haga)",
    },
    {
      id: 16,
      section: "main",
      type: "yesno",
      text: "¿Si usted se voltea a ver algo, su hijo/a trata de ver qué es lo que usted está mirando?",
    },
    {
      id: 17,
      section: "main",
      type: "yesno",
      text: '¿Su hijo/a trata que usted lo mire? (POR EJEMPLO, ¿busca que usted lo halague, o dice "mírame"?)',
    },
    {
      id: 18,
      section: "main",
      type: "yesno",
      text: '¿Su hijo/a le entiende cuando usted le dice que haga algo? (POR EJEMPLO, ¿su hijo/a entiende "pon el libro en la silla" o "tráeme la cobija" sin que usted haga señas?)',
    },
    {
      id: 19,
      section: "main",
      type: "yesno",
      text: "¿Si algo nuevo ocurre, su hijo/a lo mira a la cara para ver cómo se siente usted al respecto? (POR EJEMPLO, ¿si oye un ruido extraño o ve un juguete nuevo, se voltearía a ver su cara?)",
    },
    {
      id: 20,
      section: "main",
      type: "yesno",
      text: "¿A su hijo/a le gustan las actividades con movimiento? (POR EJEMPLO, le gusta que lo mezan/columpien, o que lo haga saltar en sus rodillas)",
    },
    {
      id: 21,
      section: "info",
      type: "yesno_with_text",
      text: "¿Algún pediatra o profesional de salud ha expresado alguna preocupación sobre el desarrollo de su hijo/a?",
      conditionalTextLabel: "Si es sí, especifique detalle y nombre del pediatra",
    },
    {
      id: 22,
      section: "info",
      type: "yesno_subitems",
      text: "¿En algún momento se le ha diagnosticado alguno de los siguientes?",
      subitems: [
        { id: "lenguaje", label: "Retraso del lenguaje" },
        { id: "motor", label: "Retraso motor" },
        { id: "genetica", label: "Alguna condición genética" },
        { id: "visual_auditivo", label: "Alteraciones visuales o auditivas" },
        { id: "otro", label: "Otra condición (especificar)", hasConditionalText: true },
      ],
    },
  ],
  scoringRules: {
    yesRiskIds: [2, 5, 12],
    noRiskIds: [1, 3, 4, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20],
    nonScoredIds: [21, 22],
    maxScore: 20,
    riskLevels: [
      { label: "Bajo Riesgo", min: 0, max: 2 },
      { label: "Riesgo Medio", min: 3, max: 7 },
      { label: "Alto Riesgo", min: 8, max: 20 },
    ],
  },
  closingPage: {
    title: "¡Gracias por completar el cuestionario!",
    thankYouMessage: "Hemos recibido tus respuestas correctamente.",
    nextStepsMessage: "Nuestro equipo te contactará para orientarte sobre los próximos pasos.",
    resourceLinks: [{ label: "Blog de desarrollo infantil", url: "/nuestros-blogs" }],
  },
};
