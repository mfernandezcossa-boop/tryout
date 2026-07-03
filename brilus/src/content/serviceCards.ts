import type { ServiceLinkCard } from "@/types/service-page";

export interface ServiceFlatCard {
  variant: string;
  badge: string;
  title: string;
  subtitle: string;
  image: string;
}

export const SERVICE_CARDS: Record<"casa" | "centro" | "escuela", ServiceLinkCard> = {
  casa: {
    variant: "casa",
    badge: "En casa",
    title: "Terapia ABA en casa",
    subtitle: "Sesiones de terapia para autismo en el entorno familiar del niño",
    ctaLabel: "Ver más",
    href: "/in-home",
    image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/in-home/Hero%20inhome.webp",
  },
  centro: {
    variant: "centro",
    badge: "En el centro",
    title: "Terapia ABA en el centro",
    subtitle: "Terapia para autismo en Ciudad de México — Hospital Español",
    ctaLabel: "Ver más",
    href: "/in-center",
    image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/in-center/Hero%20incenter.webp",
  },
  escuela: {
    variant: "escuela",
    badge: "En la escuela",
    title: "Terapia ABA en la escuela",
    subtitle: "Apoyo terapéutico para niños con autismo en el aula",
    ctaLabel: "Ver más",
    href: "/in-school",
    image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/in-school/Hero%20inschool.webp",
  },
};

export const SERVICE_FLAT_CARDS: Record<"padres" | "acompanamiento", ServiceFlatCard> = {
  padres: {
    variant: "padres",
    badge: "Para la familia",
    title: "Entrenamiento a padres",
    subtitle: "Aprende las herramientas ABA para acompañar a tu hijo con autismo en el día a día",
    image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/in-home/Hero%20inhome.webp",
  },
  acompanamiento: {
    variant: "acompanamiento",
    badge: "Nuevo servicio",
    title: "Acompañamiento Terapéutico",
    subtitle: "Acompañante especializado en neurodesarrollo, presente en el día a día de tu hijo. No es terapia ABA.",
    image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/in-center/Hero%20incenter.webp",
  },
};
