import type { ServicePageContent } from "@/types/service-page";
import { SERVICE_CARDS } from "./serviceCards";

export const inCenterContent: ServicePageContent = {
  seo: {
    title: "Terapia ABA en centro clínico para niños con autismo | Brilus CDMX",
    description:
      "Terapia ABA en nuestra alianza con el Hospital Español: un entorno preparado, equipo multidisciplinario y supervisión BCBA en cada sesión.",
    canonical: "/in-center",
  },

  hero: {
    eyebrow: "Terapia ABA en el centro:",
    title: "Un centro diseñado para",
    titleHighlight: "ellos",
    subtitle:
      "Terapia ABA para niños con autismo en el centro de la Unidad de Neurodesarrollo del Hospital Español, CDMX. Sesiones intensivas, socialización y respaldo clínico. Agendá tu llamada sin costo.",
    primaryCta: { label: "Agendar llamada inicial", href: "/contacto" },
    secondaryCta: { label: "Ver cómo funciona", href: "#como-funciona" },
    images: ["https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/in-center/Hero%20incenter.webp"],
  },


  testimonial: {
    eyebrow: "Testimonios",
    quote:
      "El centro nos dio una estructura que en casa no podíamos lograr. Vimos cambios en pocas semanas.",
    authorName: "Familia Brilus",
  },

  benefits: {
    title: "Beneficios de la terapia ABA en el centro",
    description:
      "El centro ofrece un espacio neutro, libre de distracciones y diseñado para que tu hijo con autismo o TDAH se concentre en aprender nuevas habilidades.",
    items: [
      {
        icon: "Zap",
        title: "Mayor intensidad terapéutica",
        description:
          "Ambiente estructurado, menos distracciones, materiales especializados. Diseñado para acelerar el aprendizaje.",
      },
      {
        icon: "Users",
        title: "Socialización en tiempo real",
        description:
          "Tu hijo interactúa con otros niños en contexto terapéutico. Las habilidades sociales se practican donde ocurren.",
      },
      {
        icon: "ShieldCheck",
        title: "Respaldo institucional único",
        description:
          "Brilus opera dentro de la Unidad de Desarrollo de uno de los hospitales privados más reconocidos de México. El respaldo clínico está integrado desde el primer día.",
      },
    ],
  },

  skills: {
    title: "Qué se trabaja en el centro",
    description:
      "La intervención en el centro es intensiva, estructurada y diseñada para tu hijo con autismo. Cada sesión ocurre en un espacio especializado dentro del Hospital Español, pensado para acelerar el aprendizaje.",
    image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/in-center/work%20incenter%2001.webp",
    introLabel: "En las sesiones del Hospital Español, tu hijo aprende a:",
    skills: [
      "Atención sostenida",
      "Seguimiento de instrucciones",
      "Trabajo en mesa",
      "Habilidades académicas",
      "Juego con pares",
      "Tolerancia a la espera",
      "Manejo de transiciones",
      "Comunicación funcional",
      "Habilidades pre-académicas",
      "Conducta adaptativa",
    ],
  },

  sessionSteps: {
    title: "Cómo es una sesión de terapia ABA en el centro",
    description: "Una sesión estructurada en un espacio diseñado para el aprendizaje.",
    cta: { label: "Agendar llamada inicial", href: "/contacto" },
    steps: [
      {
        number: "01",
        title: "Recepción en el centro",
        description:
          "El niño llega al centro. El espacio está diseñado para que la transición sea predecible y segura.",
        image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/in-center/work%20incenter%2001.webp",
      },
      {
        number: "02",
        title: "Sesión individual o grupal con materiales clínicos",
        description:
          "El terapeuta IBT trabaja las metas del programa usando materiales especializados y situaciones estructuradas.",
        image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/in-center/work%20incenter%2002.webp",
      },
      {
        number: "03",
        title: "Registro de progreso en tiempo real",
        description:
          "El terapeuta registra cada respuesta. El BCBA revisa los datos semanalmente",
        image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/in-center/work%20incenter%2003.webp",
      },
      {
        number: "04",
        title: "Hora de salida",
        description:
          "Al finalizar la sesión, el niño es entregado al cuidador autorizado. La seguridad es nuestra prioridad — requerimos identificación a cualquier persona que retire al niño",
        image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/in-home/work%20inhome.webp",
      },
    ],
  },

  howToStart: {
    image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/Servicios/General/progress.webp",
    title: "Cómo iniciar la terapia ABA en el centro con Brilus",
    description: "Te decimos qué creemos que es mejor para tu hijo. Tú decides.",
    steps: [
      {
        number: "01",
        title: "Llamada Inicial",
        description:
          "Platicamos para conocer su historia y los retos actuales. Te explicamos el proceso a medida. Sin costo.",
        cta: { label: "Llenar formulario", href: "/contacto" },
      },
      {
        number: "02",
        title: "Evaluación clínica",
        description:
          "Un BCBA evalúa al niño en el centro, identifica fortalezas y áreas a trabajar, y diseña un plan personalizado.",
      },
      {
        number: "03",
        title: "Comienzo de la terapia",
        description:
          "Asignamos equipo y horarios fijos en el centro. Supervisión semanal BCBA, reportes mensuales y ajustes continuos.",
      },
    ],
  },

  familySupport: {
    title: "Cómo acompañar la terapia de tu hijo en el centro",
    description:
      "La familia es parte del equipo terapéutico. A través de los entrenamientos a padres, nosotros te iremos guiando. Sin embargo, estas son las cosas concretas que puedes hacer:",
    cards: [
      {
        icon: "CalendarCheck",
        title: "Asistencia constante",
        bullets: [
          "La regularidad es parte del tratamiento.",
          "Coordiná horarios con anticipación.",
          "Avisá si algo cambia antes de la sesión.",
        ],
      },
      {
        icon: "Workflow",
        title: "Los especialistas se coordinan solos",
        bullets: [
          "Brilus envía reportes al neuropediatra mensualmente.",
          "Si cambia la medicación, avisanos.",
          "No tenés que ser el intermediario.",
        ],
      },
      {
        icon: "ArrowLeftRight",
        title: "Apoyá las transiciones",
        bullets: [
          "Avisá si hubo cambios en la rutina.",
          "Las transiciones centro–casa son parte del plan.",
          "No hace falta que llegue \"preparado\".",
        ],
      },
      {
        icon: "MessageCircle",
        title: "Comunicación abierta",
        bullets: [
          "Reuniones de seguimiento regulares con el BCBA.",
          "Canal directo para dudas entre sesiones.",
          "El equipo te actualiza — no esperamos que preguntes.",
        ],
      },
    ],
  },

  method: {
    eyebrow: "El Método Brilus",
    title: "Un plan clínico, un equipo coordinado, tres entornos posibles",
    description:
      "En el centro, el equipo terapéutico trabaja en el entorno clínico del Hospital Español, con acceso directo a especialidades médicas y de salud mental.",
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
        icon: "Hospital",
        title: "Entorno clínico especializado",
        description: "Espacios, materiales y profesionales preparados para cada meta.",
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
        question: "¿En qué consiste la terapia ABA en el centro?",
        answer:
          "Tu hijo asiste a nuestro centro clínico donde un terapeuta IBT trabaja con él en un entorno preparado, con materiales y áreas diseñadas para potenciar el aprendizaje. El plan es individualizado y está supervisado por una BCBA®, con espacios para trabajo en mesa, juego, autonomía y socialización con pares.",
      },
      {
        question: "¿Dónde está ubicado el centro?",
        answer:
          "Nuestro centro está en CDMX. Te compartimos la dirección exacta y opciones de acceso en la llamada inicial. El espacio está diseñado específicamente para terapia ABA, con cámaras de observación para padres y áreas separadas por edad y objetivo.",
      },
      {
        question: "¿Cuántas horas semanales son necesarias?",
        answer:
          "La BCBA® define la intensidad recomendada tras la evaluación inicial, generalmente entre 10 y 25 horas semanales. La intensidad se ajusta según el avance y las metas del programa.",
      },
      {
        question: "¿Puedo combinar centro con casa?",
        answer:
          "Sí. Muchas familias combinan sesiones en el centro (para trabajo estructurado y socialización con pares) con sesiones en casa (para generalizar a rutinas reales). La BCBA® diseña la mezcla óptima según las metas de tu hijo.",
      },
      {
        question: "¿Cómo es el proceso para empezar?",
        answer:
          "Primero una llamada inicial sin costo para entender el caso. Luego una evaluación clínica con la BCBA® en el centro. Con el plan listo, asignamos terapeuta y empezamos las sesiones, con supervisión semanal y reportes mensuales.",
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
    image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/Servicios/General/CTA%20incenter.webp",
  },
};
