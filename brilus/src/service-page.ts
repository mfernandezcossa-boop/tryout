export interface HeroContent {
  eyebrow?: string;              // "Terapia ABA en casa:"
  title: string;                 // puede incluir markup con <u> en el contenido (frontend lo maneja)
  titleHighlight?: string;       // palabra destacada (ej: "casa") si se separa
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  images: string[];              // 1-3 imágenes para collage del hero
}

export interface ServiceLinkCard {
  variant: "casa" | "centro" | "escuela";
  badge: string;                 // "En casa" / "en el centro" / "en la escuela"
  title: string;
  subtitle: string;
  ctaLabel: string;
  href: string;
  image: string;
}

export interface ServiceCrossLinksContent {
  title?: string;                // ej. "Seguir explorando" (opcional en hero)
  cards: ServiceLinkCard[];      // 2 cards en hero, 3 en sección final
}

export interface TestimonialBannerContent {
  eyebrow?: string;              // "Testimonios"
  quote: string;
  authorName: string;
}

export interface BenefitItem {
  icon?: string;                 // nombre Lucide
  title: string;
  description: string;
}
export interface BenefitsHighlight {
  icon?: string;
  title: string;
  description: string;
}
export interface BenefitsContent {
  eyebrow?: string;
  title: string;
  description?: string;
  items: BenefitItem[];          // 4 items en in-home
  highlight?: BenefitsHighlight; // bloque destacado al final (opcional)
}

export interface SkillsContent {
  title: string;                 // "Qué se trabaja en casa"
  description?: string;
  introLabel?: string;           // "En casa, tu hijo aprende a:"
  image?: string;
  skills: string[];              // pills/tags
}

export interface SessionStep {
  number: string;                // "01"
  title: string;
  description: string;
  image?: string;
}
export interface SessionStepsContent {
  title: string;
  description?: string;
  cta?: { label: string; href: string };
  steps: SessionStep[];
}

export interface HowToStartStep {
  number: string;
  title: string;
  description: string;
  cta?: { label: string; href: string };
}
export interface HowToStartContent {
  title: string;
  description?: string;
  image?: string;
  steps: HowToStartStep[];       // 3 pasos
}

export interface FamilySupportCard {
  icon?: string;
  title: string;
  bullets: string[];
}
export interface FamilySupportContent {
  eyebrow?: string;
  title: string;
  description?: string;
  cards: FamilySupportCard[];    // 4 cards
}

export interface MethodFeature {
  icon?: string;
  title: string;
  description: string;
}
export interface MethodContent {
  eyebrow?: string;              // "El Método Brilus"
  title: string;
  description?: string;
  diagramImage?: string;         // imagen del diagrama circular
  features: MethodFeature[];     // 4 features (enfoque, decisiones, intervención, equipo)
}

export interface AllianceContent {
  eyebrow?: string;
  title: string;                 // "Unidad de Neurodesarrollo • Hospital Español"
  description: string;
  specialties: string[];         // pills: Neuropediatras, Paidopsiquiatras...
  image?: string;
}

export interface FAQItem { question: string; answer: string; }
export interface FAQContent {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
  items: FAQItem[];
}

export interface FinalCtaContent {
  title: string;
  description?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };  // WhatsApp
  image?: string;
}

export interface ServicePageSEO {
  title: string;
  description: string;
  canonical: string;
}

export interface ServicePageContent {
  seo: ServicePageSEO;
  hero: HeroContent;
  heroCrossLinks?: ServiceCrossLinksContent;       // cards bajo el hero (2 cards)
  testimonial?: TestimonialBannerContent;
  benefits?: BenefitsContent;
  skills?: SkillsContent;
  sessionSteps?: SessionStepsContent;
  howToStart?: HowToStartContent;
  familySupport?: FamilySupportContent;
  method?: MethodContent;
  alliance?: AllianceContent;
  faq?: FAQContent;
  exploreMore?: ServiceCrossLinksContent;          // "Seguir explorando" (3 cards)
  finalCta?: FinalCtaContent;
}
