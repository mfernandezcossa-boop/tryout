import type { ServicePageContent } from "@/types/service-page";
import { SERVICE_CARDS } from "./serviceCards";

export const inSchoolContent: ServicePageContent = {
  seo: {
    title: "Terapia ABA en la escuela para niños con autismo | Brilus CDMX",
    description:
      "Acompañamiento ABA en el aula real: nuestro equipo integra a tu hijo a la dinámica escolar con apoyo del docente y supervisión BCBA continua.",
    canonical: "/in-school",
  },

  hero: {
    eyebrow: "Terapia ABA en la escuela:",
    title: "Tu hijo no necesita una monitora escolar. Necesita una Sombra Terapéutica ABA.",
    titleHighlight: "",
    subtitle:
      "Porque no es lo mismo estar al lado de tu hijo que trabajar con él. Cada sesión en el aula responde a un plan individualizado: lenguaje, conducta, habilidades sociales — donde de verdad ocurren.",
    primaryCta: { label: "Agendar llamada inicial", href: "/contacto" },
    secondaryCta: { label: "Ver cómo funciona", href: "#como-funciona" },
    images: ["https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/in-school/Hero%20inschool.webp"],
  },

  heroCrossLinks: {
    cards: [SERVICE_CARDS.escuela, SERVICE_CARDS.casa],
  },

  testimonial: {
    eyebrow: "Testimonios",
    quote:
      "El acompañamiento en la escuela cambió todo. Mi hijo dejó de sentirse fuera de lugar y empezó a participar de verdad.",
    authorName: "Familia Brilus",
  },

  benefits: {
    eyebrow: "Beneficios",
    title: "Beneficios de la terapia ABA en la escuela",
    items: [
      {
        icon: "Clock",
        title: "Apoyo en tiempo real",
        description:
          "Tu hijo recibe el apoyo en el momento exacto en que lo necesita, permitiéndole aplicar cada avance de forma natural mientras convive y aprende con sus compañeros.",
      },
      {
        icon: "Handshake",
        title: "Coordinación en equipo",
        description:
          "Nos coordinamos directamente con el equipo docente y directivo para que las estrategias terapéuticas y las metas escolares vayan de la mano, creando un entorno de apoyo unificado.",
      },
      {
        icon: "BookOpen",
        title: "Menos interrupciones, más aprendizaje",
        description:
          "Identificamos y reducimos conductas que interrumpen la clase — para tu hijo y para el resto del grupo. Un aula más tranquila beneficia a todos.",
      },
      {
        icon: "Target",
        title: "El objetivo siempre es la independencia",
        description:
          "El terapeuta se retira gradualmente. Desde el día uno, el plan tiene fecha de salida. El éxito es cuando tu hijo ya no nos necesita en el aula.",
      },
    ],
    highlight: {
      icon: "MonitorSmartphone",
      title: "No es un acompañante, es intervención ABA dentro del aula.",
      description:
        "Nos diferenciamos del acompañamiento tradicional porque trabajamos con planes adaptados, metas medibles y supervisión constante. No solo estamos presentes: aplicamos el enfoque de ABA Moderna de forma natural para impulsar el progreso y la autonomía de tu hijo día a día dentro de su jornada escolar.",
    },
  },


  skills: {
    title: "Qué se trabaja en la escuela",
    description:
      "La intervención dentro de la escuela es práctica, integrada y real. Cada sesión ocurre en el aula, el recreo y las transiciones donde tu hijo con autismo enfrenta los desafíos reales del entorno escolar. ",
    image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/in-school/work%20inschool.webp",
    introLabel: "Con la intervención en el aula, tu hijo desarrolla:",
    skills: [
      "Seguir instrucciones del docente",
      "Permanecer en su lugar",
      "Participar en clase",
      "Interactuar con pares",
      "Jugar en el recreo",
      "Manejar transiciones",
      "Pedir ayuda",
      "Trabajar en equipo",
      "Tolerar el ruido del aula",
      "Cumplir rutinas escolares",
    ],
  },

  sessionSteps: {
    title: "Cómo es una sesión de terapia ABA en la escuela",
    description:
      "Nos sumamos a la jornada escolar de tu hijo para construir nuevas habilidades en contexto real.",
    cta: { label: "Agendar llamada inicial", href: "/contacto" },
    steps: [
      {
        number: "01",
        title: "Llegada y coordinación con la maestra",
        description:
          "El terapeuta IBT coordina directamente con la maestra qué se trabajará en la sesión y cómo responder a las situaciones que puedan surgir.",
        image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/in-school/Work%20inschool%2001.webp",
      },
      {
        number: "02",
        title: "Acompañamiento en el aula",
        description:
          "Se trabajan las metas del programa ABA en clase, recreo y transiciones, según el plan del niño.",
        image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/in-school/work%20inscholl%2002.webp",
      },
      {
        number: "03",
        title: "Recreo y momentos no estructurados",
        description:
          "El recreo es uno de los momentos más difíciles y más importantes. El IBT trabaja interacción con pares, manejo de la frustración y autonomía.",
        image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/in-school/work%20inschool%2003%20(2).webp",
      },
      {
        number: "04",
        title: "Registro de datos en cada momento",
        description:
          "El terapeuta registra respuestas, conductas y avances durante toda la sesión. Sin datos no hay ajuste.",
        image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/in-school/work%20inschool%2004.webp",
      },
      {
        number: "05",
        title: "Reporte diario a los padres",
        description:
          "Al finalizar la sesión, la familia recibe un reporte de lo que se trabajó, cómo respondió el hijo y qué reforzar en casa.",
        image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/in-school/work%20inschool%20p5.webp",
      },
    ],
  },

  howToStart: {
    image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/Servicios/General/progress.webp",
    title: "Cómo iniciar la terapia ABA en la escuela con Brilus",
    description: "Te decimos qué creemos que es mejor para tu hijo. Tú decides.",
    steps: [
      {
        number: "01",
        title: "Llamada Inicial",
        description:
          "Platicamos para conocer su historia, su escuela y los retos actuales. Te explicamos el proceso. Sin costo.",
        cta: { label: "Llenar formulario", href: "/contacto" },
      },
      {
        number: "02",
        title: "Coordinación con la escuela y evaluación clínica",
        description:
          "Un BCBA evalúa al niño y coordinamos con la escuela los términos del acompañamiento.",
      },
      {
        number: "03",
        title: "Comienzo de la terapia",
        description:
          "Asignamos terapeuta y empezamos las sesiones en la escuela. Datos en cada sesión, supervisión semanal del BCBA y reportes mensuales.",
      },
    ],
  },

  familySupport: {
    title: "Cómo apoyar en casa los avances de la escuela",
    description:
      "La familia es parte del equipo terapéutico. Lo que tu hijo con autismo o TDAH trabaja en el aula se afianza cuando se refuerza en casa. A través de los entrenamientos a padres te vamos guiando, pero estas son cosas concretas que podés hacer:",
    cards: [
      {
        icon: "Users",
        title: "Refuerza las habilidades sociales",
        bullets: [
          "Propicia juego compartido y momentos grupales fuera de la escuela.",
          "Platica con él sobre cómo le fue con sus compañeros.",
          "Practiquen esperar turnos y compartir en casa.",
        ],
      },
      {
        icon: "ShieldCheck",
        title: "Acompaña la autorregulación",
        bullets: [
          "Anticipa las transiciones y los cambios de rutina.",
          "Mantén rutinas predecibles: reducen la ansiedad.",
          "Cuando se frustra, ayúdalo a nombrar lo que siente.",
        ],
      },
      {
        icon: "GraduationCap",
        title: "Mantén el canal con la escuela",
        bullets: [
          "Avísanos si notas cambios de conducta en casa.",
          "Cuéntanos qué pasó en el día: todo dato ajusta el plan.",
          "Si la maestra te comparte algo, hazlo llegar al equipo.",
        ],
      },
      {
        icon: "Rocket",
        title: "Apunta a la independencia",
        bullets: [
          "Deja que lo intente solo antes de ayudarlo.",
          "Celebra los avances, por pequeños que parezcan.",
          "Lo que aprende en la escuela, dale espacio para usarlo en casa.",
        ],
      },
    ],
  },


  method: {
    eyebrow: "El Método Brilus",
    title: "Un plan clínico, un equipo coordinado, tres entornos posibles",
    description:
      "En la escuela, el Terapeuta IBT trabaja codo a codo con docentes y la familia. Diseño y supervisión continua del BCBA, con el respaldo clínico de los especialistas del Hospital Español.",
    diagramImage: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/Servicios/General/General%20Neurodesarrollo%2001.webp",
    features: [
      {
        icon: "Users",
        title: "Enfoque centrado en la familia",
        description: "La familia y la escuela son co-protagonistas del proceso.",
      },
      {
        icon: "BarChart3",
        title: "Decisiones basadas en datos",
        description: "Cada ajuste del programa se sustenta en registros clínicos.",
      },
      {
        icon: "School",
        title: "Integración escolar real",
        description: "Acompañamiento en aula, recreo y transiciones de la jornada.",
      },
      {
        icon: "Network",
        title: "Trabajo en equipo multidisciplinario",
        description: "BCBA, IBT, docentes y especialidades en sinergia.",
      },
    ],
  },

  alliance: {
    title: "Hospital Español",
    description:
      "No es una alianza con una institución— es una alianza con cada uno de los profesionales independientes que conforman la Unidad. En un solo lugar, tu hijo tiene acceso a:",
    specialties: ["Neuropediatras", "Paidopsiquiatras", "Genetistas", "Neuropsicólogos", "y más..."],
    image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/Servicios/General/General%20Neurodesarrollo%2002.webp",
  },

  faq: {
    eyebrow: "Preguntas frecuentes",
    image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/Servicios/General/FAQS.webp",
    title: "Todo lo que quieres saber antes de empezar",
    description:
      "Si no encontraste tu pregunta acá, escríbenos por WhatsApp— respondemos el mismo día.",
    items: [
      {
        question: "¿En qué consiste la terapia ABA en la escuela?",
        answer:
          "Un terapeuta IBT acompaña a tu hijo dentro de su aula con un plan individualizado diseñado y supervisado por una BCBA®. Trabajamos metas concretas de comunicación, conducta, juego y autonomía en el contexto real donde tu hijo pasa la mayor parte del día.",
      },
      {
        question: "¿La escuela tiene que aprobar el acompañamiento?",
        answer:
          "Sí. Coordinamos directamente con la dirección y el equipo docente para presentar el plan, alinear expectativas y firmar un acuerdo de colaboración. Nuestra experiencia con escuelas en CDMX nos permite hacer este proceso ágil y respetuoso con sus protocolos.",
      },
      {
        question: "¿Cuántas horas semanales son necesarias?",
        answer:
          "Depende del perfil de tu hijo y de las metas. La BCBA® define la intensidad recomendada tras la evaluación inicial — generalmente entre 10 y 20 horas semanales dentro de la jornada escolar. Ajustamos según el avance.",
      },
      {
        question: "¿Cómo se coordina con los docentes?",
        answer:
          "El terapeuta comparte estrategias breves con la maestra cada semana, y la BCBA® sostiene juntas periódicas con el equipo escolar. Buscamos que las estrategias se mantengan cuando el terapeuta no está presente, no sustituirlas.",
      },
      {
        question: "¿Cómo es el proceso para empezar?",
        answer:
          "Primero una llamada inicial sin costo para entender el caso. Luego coordinamos con la escuela y hacemos una evaluación clínica con la BCBA®. Con el plan listo, asignamos terapeuta y empezamos las sesiones en el aula.",
      },
      {
        question: "¿Funciona si mi hijo ya hace terapia en otro lugar?",
        answer:
          "Sí. Coordinamos con el equipo terapéutico externo para que las metas no se contradigan y todos remen en la misma dirección. La consistencia entre entornos acelera el progreso de tu hijo.",
      },
      {
        question: "¿El seguro médico cubre las sesiones?",
        answer:
          "Algunos seguros con cobertura ampliada de salud mental o neurodesarrollo (o por medio del Hospital Español) reembolsan parte del costo. Emitimos factura y documentación clínica para que puedas tramitar el reembolso con tu aseguradora.",
      },
    ],
  },

  exploreMore: {
    title: "Seguir explorando",
    cards: [SERVICE_CARDS.casa, SERVICE_CARDS.centro, SERVICE_CARDS.escuela],
  },

  finalCta: {
    title: "¿No sabes por dónde empezar?",
    description:
      "El primer paso es una conversación para entender qué necesita tu hijo y si Brilus es el lugar indicado.",
    primaryCta: { label: "Llena nuestro formulario", href: "/contacto" },
    secondaryCta: { label: "WhatsApp", href: "https://wa.me/525562151706" },
    image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/Servicios/General/CTA%20inschool.webp",
  },
};
