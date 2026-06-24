import type { ServiceLinkCard } from "@/types/service-page";

export const SERVICE_CARDS: Record<"casa" | "centro" | "escuela", ServiceLinkCard> = {
  casa: {
    variant: "casa",
    badge: "En casa",
    title: "Terapia en casa",
    subtitle: "En su entorno, con su familia",
    ctaLabel: "Ver más",
    href: "/in-home",
    image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/in-home/Hero%20inhome.webp",
  },
  centro: {
    variant: "centro",
    badge: "en el centro",
    title: "Terapia en el centro",
    subtitle: "Hospital Español",
    ctaLabel: "Ver más",
    href: "/in-center",
    image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/in-center/Hero%20incenter.webp",
  },
  escuela: {
    variant: "escuela",
    badge: "en la escuela",
    title: "Terapia en la escuela",
    subtitle: "Integración en el aula real",
    ctaLabel: "Ver más",
    href: "/in-school",
    image: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/in-school/Hero%20inschool.webp",
  },
};
