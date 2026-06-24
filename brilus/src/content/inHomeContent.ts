import type { ServicePageContent } from "@/types/service-page";
import { SERVICE_CARDS } from "./serviceCards";

export const inHomeContent: ServicePageContent = {
  seo: {
    title: "Terapia ABA en casa para niños con autismo | Brilus CDMX",
    description:
      "Terapia ABA en el hogar: tu hijo aprende donde vive su vida. Sesiones supervisadas por BCBA, sin traslados, con la familia como parte del equipo.",
    canonical: "/in-home",
  },

  hero: {
    eyebrow: "Terapia ABA en casa:",
    title: "Acompañamos a tu hijo en su propio",
    titleHighlight: "entorno",
    subtitle:
      "Integramos la terapia en el hogar para construir autonomía en el contexto real donde tu hijo vive su vida. Sin traslados ni estrés, transformamos las rutinas cotidianas en oportunidades naturales de aprendizaje y bienestar familiar.",
    primaryCta: { label: "Agendar llamada inicial", href: "/contacto" },
    secondaryCta: { label: "Ver cómo funciona", href: "#como-funciona" },
    images: ["https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/in-home/Hero%20inhome.webp"],
  },

  heroCrossLinks: {
    cards: [SERVICE_CARDS.casa, SERVICE_CARDS.centro],
  },

  testimonial: {
    eyebrow: "Testimonios",
    quote:
      "Por primera vez entendimos claramente qué pasaba con nuestro hijo. Nos otorgaron un plan y acompañamiento real.",
    authorName: "Familia Brilus",
  },

  benefits: {
    title: "Beneficios de la terapia ABA en casa",
    description:
      "La terapia ABA en casa trabaja las habilidades donde tu hijo con autismo realmente las necesita: en el desayuno, en las transiciones, en el juego, en la convivencia familiar.",
    items: [
      {
        icon: "Home",
        title: "En su entorno, con sus rutinas",
        description:
          "El niño aprende donde se siente seguro. La terapia se adapta a las rutinas reales de la familia—no al revés.",
      },
      {
        icon: "Sparkles",
        title: "Lo que aprende, lo aplica",
        description:
          "No hay traslado entre el consultorio y la vida. Las habilidades se generalizan a otros contextos naturalmente.",
      },
      {
        icon: "Users",
        title: "La familia es parte del equipo",
        description:
          "Entrenamos a papás, mamás y cuidadores para reforzar entre sesiones. No tienen que ser terapeutas—sí, aliados.",
      },
      {
        icon: "MapPin",
        title: "Sin traslados",
        description:
          "El terapeuta llega a casa, a casa de familiares, al parque o a la comunidad. Donde el niño vive su vida.",
      },
    ],
  },

  skills: {
    title: "Qué se trabaja en casa",
    description:
      "Trabajamos en el entorno natural de tu hijo con autismo para que cada aprendizaje se aplique directamente en sus actividades cotidianas. ",
    image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/in-home/work%20inhome.webp",
    introLabel: "Con la terapia ABA en casa, tu hijo desarrolla:",
    skills: [
      "Expresar sus necesidades",
      "Regulación emocional",
      "Autonomía en el baño",
      "Adaptarse a los cambios",
      "Manejo de la frustración",
      "Flexibilidad ante el 'no'",
      "Juego y socialización",
      "Vestirse e higiene",
      "Aprender a esperar",
      "Tareas de la casa",
    ],
  },

  sessionSteps: {
    title: "Cómo es una sesión de terapia ABA en casa",
    description: "Nos sumamos a la rutina actual de tu hijo para construir nuevas habilidades.",
    cta: { label: "Agendar llamada inicial", href: "/contacto" },
    steps: [
      {
        number: "01",
        title: "Llegada del terapeuta",
        description:
          "El terapeuta IBT llega al hogar en el horario acordado. La sesión arranca en el espacio donde el niño se siente más seguro.",
        image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/in-home/Work%20inhome%2001.webp",
      },
      {
        number: "02",
        title: "Sesión individual en su entorno",
        description:
          "Se trabajan las metas del programa ABA usando las rutinas, juguetes y espacios reales del niño.",
        image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/in-home/Work%20inschool%2002.webp",
      },
      {
        number: "03",
        title: "Registro de progreso en tiempo real",
        description:
          "El terapeuta toma datos durante la sesión. La supervisora (BCBA® Certificada) revisa los avances y ajusta el programa si es necesario.",
        image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/in-home/Work%20inschool%2003.webp",
      },
      {
        number: "04",
        title: "Participación de la familia",
        description:
          "Uno de los cuidadores se suma a la sesión para observar, practicar estrategias y hacer preguntas al terapeuta.",
        image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/in-home/Work%20inschool%2004.webp",
      },
      {
        number: "05",
        title: "Cierre y devolución a los padres",
        description:
          "Al finalizar, el terapeuta comparte qué se trabajó, cómo respondió el niño y qué reforzar hasta la próxima sesión.",
        image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/in-home/Work%20inschool%2005.webp",
      },
    ],
  },

  howToStart: {
    image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/Servicios/General/progress.webp",
    title: "Cómo iniciar la terapia ABA en casa con Brilus",
    description: "Te decimos qué creemos que es mejor para tu hijo. Tú decides.",
    steps: [
      {
        number: "01",
        title: "Llamada Inicial",
        description:
          "Platicamos para conocer su historia y los retos actuales de tu hijo. Te explicamos cómo diseñaremos un proceso a su medida, con una guía clara de los próximos pasos. Sin costo.",
        cta: { label: "Llenar formulario", href: "/contacto" },
      },
      {
        number: "02",
        title: "Evaluación clínica",
        description:
          "Un Analista del comportamiento (BCBA) evalúa al niño, identifica fortalezas y áreas a trabajar, y diseña un plan personalizado con metas medibles para tu familia.",
      },
      {
        number: "03",
        title: "Comienzo de la terapia",
        description:
          "Asignamos el equipo terapéutico y empezamos las sesiones según el plan. Datos en cada sesión, supervisión semanal del BCBA, reportes mensuales y ajustes continuos.",
      },
    ],
  },

  familySupport: {
    title: "Cómo apoyar la terapia desde casa",
    description:
      "La familia es parte del equipo terapéutico. A través de los entrenamientos a padres, nosotros te iremos guiando. Sin embargo, estas son las cosas concretas que puedes hacer:",
    cards: [
      {
        icon: "ClipboardList",
        title: "Entiende el plan de tu hijo",
        bullets: [
          "Conoce las metas del programa ABA",
          "Pregunta qué puedes reforzar entre sesiones",
          "Anota cuando algo no queda claro",
        ],
      },
      {
        icon: "Repeat",
        title: "Mantén la consistencia",
        bullets: [
          "Las rutinas predecibles reducen ansiedad",
          "Aplica en el día lo que se trabaja en sesión",
          "No necesitas ser terapeuta, alcanza con ser consistente",
        ],
      },
      {
        icon: "Eye",
        title: "Observa y comparte lo que ves",
        bullets: [
          "Tus observaciones ajustan el plan",
          "Anota conductas nuevas o situaciones difíciles",
          "Lo que pasa en el tráfico o en la fiesta también importa",
        ],
      },
      {
        icon: "Heart",
        title: "Cuídate tú también",
        bullets: [
          "El entrenamiento mensual es para ti",
          "No tienes que ser terapeuta 24/7",
          "Brilus acompaña a la familia, no solo al niño",
        ],
      },
    ],
  },

  method: {
    eyebrow: "El Método Brilus",
    title: "Un plan clínico, un equipo coordinado, tres entornos posibles",
    description:
      "En casa, el Terapeuta IBT y la familia son los actores centrales. Diseño y supervisión continua del BCBA, con el respaldo clínico de los especialistas del Hospital Español.",
    diagramImage: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/Servicios/General/General%20Neurodesarrollo%2001.webp",
    features: [
      {
        icon: "Users",
        title: "Enfoque centrado en la familia",
        description: "La familia es co-protagonista del proceso terapéutico.",
      },
      {
        icon: "BarChart3",
        title: "Decisiones basadas en datos",
        description: "Cada ajuste del programa se sustenta en registros clínicos.",
      },
      {
        icon: "Target",
        title: "Intervención temprana personalizada",
        description: "Planes diseñados a la medida de cada niño y cada hogar.",
      },
      {
        icon: "Network",
        title: "Trabajo en equipo multidisciplinario",
        description: "BCBA, IBT, neuropediatría y especialidades en sinergia.",
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
        question: "¿En qué consiste la terapia ABA en casa?",
        answer:
          "Un terapeuta IBT trabaja con tu hijo en su casa siguiendo un plan individualizado diseñado y supervisado por una BCBA®. Aprovechamos las rutinas reales del hogar — comida, juego, baño, transiciones — para enseñar habilidades de comunicación, autonomía y conducta en el entorno donde tu hijo se siente más seguro.",
      },
      {
        question: "¿Para qué diagnósticos es adecuado este enfoque?",
        answer:
          "ABA tiene la evidencia más sólida para autismo, pero también acompañamos a niños con retraso global del desarrollo, TDAH, dificultades de conducta o de comunicación. No es necesario un diagnóstico cerrado para empezar — la evaluación clínica define si es el enfoque indicado.",
      },
      {
        question: "¿Cuántas horas semanales son necesarias?",
        answer:
          "La BCBA® define la intensidad recomendada tras la evaluación inicial, generalmente entre 10 y 25 horas semanales. La intensidad se ajusta según el avance y las metas del programa.",
      },
      {
        question: "¿Qué hace la familia entre sesiones?",
        answer:
          "La familia es parte del equipo. Cada mes hay un entrenamiento con la BCBA® para que apliques en casa lo que se trabaja en sesión. No tienes que ser terapeuta — solo consistente con un par de estrategias clave.",
      },
      {
        question: "¿Cómo es el proceso para empezar?",
        answer:
          "Primero una llamada inicial sin costo para entender el caso. Luego una evaluación clínica con la BCBA® en casa. Con el plan listo, asignamos terapeuta y empezamos las sesiones, con supervisión semanal y reportes mensuales.",
      },
      {
        question: "¿Funciona si mi hijo ya hace terapia en otro lugar?",
        answer:
          "Sí. Coordinamos con el resto del equipo terapéutico (lenguaje, ocupacional, escuela) para que las metas no se contradigan. La consistencia entre entornos acelera el progreso.",
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
    image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/Servicios/General/CTA%20inhome.webp",
  },
};
