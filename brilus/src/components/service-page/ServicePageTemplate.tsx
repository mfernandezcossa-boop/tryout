import React, { useRef } from "react";

const HOSPITAL_LOGOS = [
  "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/Servicios/General/Logo%20Hospital.webp",
  "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/Servicios/General/Logo%20Unidad%20.webp",
];

const HospitalLogos: React.FC = () => (
  <div className="mt-6 flex items-center gap-4">
    {HOSPITAL_LOGOS.map((src, i) => (
      <div
        key={i}
        className="h-20 w-20 rounded-md bg-background border border-border flex items-center justify-center overflow-hidden"
      >
        <img src={src} alt={`Logo ${i + 1}`} className="max-h-full max-w-full object-contain p-2" />
      </div>
    ))}
  </div>
);
import { Sprout, Plus, type LucideIcon, icons as lucideIcons } from "lucide-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import NavbarBrilus from "@/components/NavbarBrilus";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import type { ServicePageContent, ServiceCrossLinksContent } from "@/types/service-page";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ScrollReveal from "@/components/ScrollReveal";
import ScrollIndicator from "@/components/service-page/ScrollIndicator";
import { useGlobalFaqs } from "@/hooks/useGlobalFaqs";

const resolveIcon = (name?: string): LucideIcon => {
  if (name && name in lucideIcons) return (lucideIcons as Record<string, LucideIcon>)[name];
  return Sprout;
};

const ImagePlaceholder: React.FC<{ className?: string; label?: string }> = ({
  className = "",
  label = "Imagen",
}) => (
  <div
    className={`flex items-center justify-center bg-muted text-foreground/40 text-body-sm ${className}`}
  >
    {label}
  </div>
);

interface ServicePageTemplateProps {
  content: ServicePageContent;
}

const Section: React.FC<{ title?: string; eyebrow?: string; children?: React.ReactNode; className?: string }> = ({
  title,
  eyebrow,
  children,
  className = "",
}) => (
  <section className={`w-full section-py section-px ${className}`}>
    <div className="section-container">
      <ScrollReveal>
        {eyebrow && <p className="text-body-sm uppercase text-foreground/60 mb-2">{eyebrow}</p>}
        {title && <h2 className="text-h2 font-semibold text-foreground mb-6">{title}</h2>}
        {children}
      </ScrollReveal>
    </div>
  </section>
);

const CrossLinks: React.FC<{ data: ServiceCrossLinksContent }> = ({ data }) => {
  const currentPath = typeof window !== "undefined" ? window.location.pathname.replace(/\/$/, "") : "";
  const cards = data.cards.filter((c) => {
    const href = (c.href || "").replace(/\/$/, "");
    return href !== currentPath;
  });
  if (cards.length === 0) return null;
  return (
  <section className="w-full section-py section-px">
    <div className="section-container">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          {data.title && <h2 className="text-h2 font-semibold text-foreground mb-6">{data.title}</h2>}
          <div className={`grid gap-6 ${cards.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {cards.map((c, i) => (
              <a
                key={i}
                href={c.href}
                className="group relative block rounded-2xl overflow-hidden aspect-square hover:shadow-lg transition"
              >
                {c.image ? (
                  <img src={c.image} alt={c.title} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <ImagePlaceholder className="absolute inset-0 w-full h-full rounded-none" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full bg-white/90 text-foreground text-body-sm font-medium uppercase tracking-tight">
                  {c.badge}
                </span>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-h4 font-semibold">{c.title}</h3>
                  <p className="text-body-lg text-white/85 mt-1">{c.subtitle}</p>
                  <span className="inline-flex items-center mt-4 px-4 py-2 rounded-full bg-white/90 text-foreground text-body-md font-medium">
                    {c.ctaLabel}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>
  );
};


const ServicePageTemplate: React.FC<ServicePageTemplateProps> = ({ content }) => {
  const {
    seo, hero, heroCrossLinks, testimonial, benefits, skills, sessionSteps,
    howToStart, familySupport, method, alliance, faq, exploreMore, finalCta,
  } = content;

  const { data: globalFaqs = [] } = useGlobalFaqs();
  const faqItems = globalFaqs.length > 0
    ? globalFaqs.map(f => ({ question: f.question, answer: f.answer }))
    : (faq?.items ?? []);

  const benefitsRef = useRef<HTMLUListElement>(null);
  const howToStartRef = useRef<HTMLOListElement>(null);
  const familySupportRef = useRef<HTMLDivElement>(null);
  const methodFeaturesRef = useRef<HTMLDivElement>(null);



  return (
    <>
      <SEOHead title={seo.title} description={seo.description} canonical={seo.canonical} />
      <NavbarBrilus />

      {/* Hero */}
      <section className="relative w-full section-px pt-28 md:pt-32 pb-12 md:pb-20 bg-secondary">
        <div className="section-container grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <ScrollReveal variant="fadeRight" className="flex flex-col">
            {hero.eyebrow && (
              <p className="text-body-sm md:text-body-md text-foreground/70 mb-3">{hero.eyebrow}</p>
            )}
            <h1 className="text-[24px] leading-[1.15] sm:text-[48px] sm:leading-[52px] md:text-[64px] md:leading-[68px] lg:text-hero font-semibold tracking-[-1px] text-foreground mb-5 break-words">
              {hero.title}{" "}
              {hero.titleHighlight && <span className="underline decoration-brand-coral">{hero.titleHighlight}</span>}
            </h1>
            <p className="text-base leading-[1.5] text-foreground/80 mb-8">{hero.subtitle}</p>
            <div className="flex flex-row flex-wrap gap-3">
              <a href={hero.primaryCta.href} className="inline-flex items-center justify-center whitespace-nowrap px-6 py-3 bg-foreground text-background rounded-brilus">
                {hero.primaryCta.label}
              </a>
              {hero.secondaryCta && (
                <a href={hero.secondaryCta.href} className="inline-flex items-center justify-center whitespace-nowrap px-6 py-3 border rounded-brilus">
                  {hero.secondaryCta.label}
                </a>
              )}
            </div>
          </ScrollReveal>
          <ScrollReveal variant="fadeLeft" delay={0.1} className="grid grid-cols-2 gap-3">
            {(hero.images && hero.images.length > 0
              ? hero.images
              : [null, null, null]
            ).map((src, i) => {
              const isSingle = hero.images && hero.images.length === 1;
              const cls = `w-full rounded-2xl ${i === 0 ? `col-span-2 ${isSingle ? "aspect-[5/6] md:aspect-[4/5]" : "aspect-[4/3]"}` : "aspect-square"}`;
              return src ? (
                <img key={i} src={src} alt="" className={`${cls} object-cover`} />
              ) : (
                <ImagePlaceholder key={i} className={cls} />
              );
            })}
          </ScrollReveal>
        </div>
      </section>


      

      {testimonial && (
        <section className="w-full section-px section-py bg-brand-amber">
          <ScrollReveal variant="scaleUp" className="container mx-auto max-w-4xl text-center space-y-4">
            {testimonial.eyebrow && <p className="text-body-sm uppercase">{testimonial.eyebrow}</p>}
            <blockquote className="text-h4 font-medium">"{testimonial.quote}"</blockquote>
            <p className="text-body-md">— {testimonial.authorName}</p>
          </ScrollReveal>
        </section>
      )}

      {benefits && (
        <section className="w-full section-py section-px">
          <div className="section-container">
            <ScrollReveal className="max-w-2xl mb-12 md:mb-16">
              {benefits.eyebrow && (
                <p className="text-body-sm text-foreground/60 mb-3">{benefits.eyebrow}</p>
              )}
              <h2 className="text-h2 md:text-h1 font-semibold text-foreground leading-[1.2]">
                {benefits.title}
              </h2>
              {benefits.description && (
                <p className="text-body-md md:text-body-lg text-foreground/70 mt-5">
                  {benefits.description}
                </p>
              )}
            </ScrollReveal>
            <ul
              ref={benefitsRef}
              role="region"
              aria-roledescription="carousel"
              aria-label="Beneficios"
              tabIndex={0}
              className="flex md:grid md:grid-cols-3 gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 scrollbar-hide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 rounded-[14px]"
            >
              {benefits.items.map((b, i) => {
                const Icon = resolveIcon(b.icon);
                const isLastOfFour = benefits.items.length === 4 && i === 3;
                return (
                  <ScrollReveal
                    key={i}
                    delay={i * 0.08}
                    className={`snap-start shrink-0 w-full md:w-auto bg-muted rounded-[14px] p-6 md:px-[49px] flex flex-col ${isLastOfFour ? "md:col-span-3" : ""}`}
                  >
                    <li
                      role="group"
                      aria-roledescription="slide"
                      aria-label={`${i + 1} de ${benefits.items.length}`}
                      className="h-full"
                    >
                      <div className="w-10 h-10 rounded-[10px] bg-background border border-border flex items-center justify-center">
                        <Icon className="w-4 h-4 text-foreground" strokeWidth={1.33} />
                      </div>
                      <h3 className="text-h4 font-semibold text-foreground mt-5 leading-[1.3]">
                        {b.title}
                      </h3>
                      <p className="text-body-sm text-foreground/60 mt-3 leading-[1.5] text-base">
                        {b.description}
                      </p>
                    </li>
                  </ScrollReveal>
                );
              })}
            </ul>
            <ScrollIndicator scrollRef={benefitsRef} count={benefits.items.length} />

            {benefits.highlight && (() => {
              const Icon = resolveIcon(benefits.highlight.icon);
              return (
                <ScrollReveal delay={0.2} className="mt-5">
                  <div className="p-7 md:p-10 bg-brand-blue/15 rounded-[14px] flex flex-col md:flex-row gap-6 md:gap-8 md:items-center">
                    <div className="w-14 h-14 rounded-[10px] bg-background border border-border flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-foreground" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-h4 font-semibold text-foreground leading-[1.3]">
                        {benefits.highlight.title}
                      </h3>
                      <p className="text-body-sm md:text-body-md text-foreground/70 mt-3 leading-[1.5]">
                        {benefits.highlight.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })()}
          </div>
        </section>
      )}


      {skills && (
        <Section title={skills.title}>
          {skills.description && <p className="text-body-md text-foreground/70 mb-10 max-w-3xl text-base">{skills.description}</p>}
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
            {skills.image ? (
              <img src={skills.image} alt="" className="w-full rounded-2xl aspect-[4/3] object-cover" />
            ) : (
              <ImagePlaceholder className="w-full rounded-2xl aspect-[4/3]" />
            )}
            <div>
              {skills.introLabel && <p className="text-body-md font-medium mb-4">{skills.introLabel}</p>}
              <ul className="flex flex-wrap gap-2">
                {skills.skills.map((s, i) => (
                  <li key={i} className="px-4 py-2 rounded-full bg-brand-blue/10 text-foreground text-body-sm">{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      )}

      {sessionSteps && (
        <section id="como-funciona" className="w-full section-py section-px scroll-mt-24">
          <div className="section-container">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
              {/* Left column: sticky title + description + CTA */}
              <ScrollReveal className="md:sticky md:top-24">
                <h2 className="text-h2 md:text-h1 font-semibold text-foreground leading-[1.2] tracking-[-1px]">
                  {sessionSteps.title}
                </h2>
                {sessionSteps.description && (
                  <p className="text-body-md text-foreground/70 mt-5 max-w-md text-base">
                    {sessionSteps.description}
                  </p>
                )}
                {sessionSteps.cta && (
                  <a
                    href={sessionSteps.cta.href}
                    className="inline-flex items-center justify-center mt-8 px-6 py-3 bg-foreground text-background rounded-brilus text-body-md font-medium"
                  >
                    {sessionSteps.cta.label}
                  </a>
                )}
              </ScrollReveal>

              {/* Right column: compact grid of steps */}
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-7">
                {sessionSteps.steps.map((s, i) => (
                  <ScrollReveal key={i} delay={Math.min(i, 3) * 0.05} className="h-full">
                    <li className="h-full flex flex-col gap-4 p-5 rounded-[14px] border border-border bg-background">
                      {s.image ? (
                        <img
                          src={s.image}
                          alt=""
                          loading="lazy"
                          className="w-full aspect-[4/3] object-cover rounded-[10px]"
                        />
                      ) : (
                        <ImagePlaceholder className="w-full aspect-[4/3] rounded-[10px]" />
                      )}
                      <div className="grid grid-cols-[auto,1fr] gap-3 items-start">
                        <span className="text-h4 font-semibold text-brand-blue tracking-[-1px] leading-none">
                          {s.number}.
                        </span>
                        <div>
                          <h3 className="text-h5 font-semibold text-foreground tracking-[-1px]">
                            {s.title}
                          </h3>
                          <p className="text-body-sm text-foreground/60 mt-1.5 leading-[1.5]">
                            {s.description}
                          </p>
                        </div>
                      </div>
                    </li>
                  </ScrollReveal>
                ))}
              </ol>

            </div>
          </div>
        </section>
      )}

      {howToStart && (
        <section className="w-full section-py section-px">
          <div className="section-container">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
              {/* Left: sticky image */}
              <ScrollReveal className="md:sticky md:top-24">
                {howToStart.image ? (
                  <img
                    src={howToStart.image}
                    alt=""
                    className="w-full aspect-[4/3] object-cover rounded-[14px]"
                  />
                ) : (
                  <ImagePlaceholder className="w-full aspect-[4/3] rounded-[14px]" />
                )}
              </ScrollReveal>

              {/* Right: title + steps */}
              <div className="min-w-0 pl-[32px]">

                <ScrollReveal>
                  <h2 className="text-h2 md:text-h1 font-semibold text-foreground leading-[1.2] tracking-[-1px]">
                    {howToStart.title}
                  </h2>
                  {howToStart.description && (
                    <p className="text-body-md text-foreground/70 mt-5 max-w-md text-base">
                      {howToStart.description}
                    </p>
                  )}
                </ScrollReveal>
                <ol
                  ref={howToStartRef}
                  role="region"
                  aria-roledescription="carousel"
                  aria-label="Cómo iniciar"
                  tabIndex={0}
                  className="flex md:block md:space-y-5 mt-8 gap-5 md:gap-0 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 scrollbar-hide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 rounded-[14px]"
                >
                  {howToStart.steps.map((s, i) => (
                    <ScrollReveal key={i} delay={i * 0.08} className="snap-start shrink-0 w-full md:w-auto">
                      <li
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${i + 1} de ${howToStart.steps.length}`}
                        className="p-7 md:p-8 border border-border rounded-[14px] bg-background h-full px-[47px]"
                      >
                        <span className="text-h3 font-semibold text-foreground tracking-[-1px] leading-none">
                          {s.number}
                        </span>
                        <h3 className="text-h5 font-semibold text-foreground mt-5 leading-[1.3]">
                          {s.title}
                        </h3>
                        <p className="text-body-sm text-foreground/60 mt-3 leading-[1.5] text-base">
                          {s.description}
                        </p>
                        {s.cta && (
                          <a
                            href={s.cta.href}
                            className="inline-flex mt-5 px-5 py-2.5 bg-foreground text-background rounded-full text-body-sm font-medium hover:opacity-90 transition-opacity"
                          >
                            {s.cta.label}
                          </a>
                        )}
                      </li>
                    </ScrollReveal>
                  ))}
                </ol>
                <ScrollIndicator scrollRef={howToStartRef} count={howToStart.steps.length} />
              </div>
            </div>
          </div>
        </section>
      )}


      {familySupport && (
        <Section eyebrow={familySupport.eyebrow} title={familySupport.title}>
          {familySupport.description && <p className="text-body-md text-foreground/70 mb-8 max-w-3xl">{familySupport.description}</p>}
          <div
            ref={familySupportRef}
            role="region"
            aria-roledescription="carousel"
            aria-label={familySupport.title}
            tabIndex={0}
            className="flex md:grid md:grid-cols-2 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 scrollbar-hide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 rounded-[14px]"
          >
            {familySupport.cards.map((c, i) => (
              <article
                key={i}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} de ${familySupport.cards.length}`}
                className="snap-start shrink-0 w-full md:w-auto p-6 border rounded-2xl"
              >
                <h3 className="text-h5 font-semibold mb-3">{c.title}</h3>
                <ul className="space-y-2 text-body-md text-foreground/70 list-disc pl-5">
                  {c.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              </article>
            ))}
          </div>
          <ScrollIndicator scrollRef={familySupportRef} count={familySupport.cards.length} />
        </Section>
      )}

      {method && (
        <section className="w-full section-py section-px">
          <div className="section-container space-y-10 md:space-y-12">
            {/* Row 1: Title + top image */}
            <div className="grid lg:grid-cols-2 gap-10 md:gap-12 items-start">
              <ScrollReveal>
                {method.eyebrow && (
                  <p className="text-body-sm text-foreground/60 mb-3">{method.eyebrow}</p>
                )}
                <h2 className="text-h2 md:text-h1 font-semibold text-foreground leading-[1.2]">
                  {method.title}
                </h2>
                {method.description && (
                  <p className="text-body-sm md:text-body-md text-foreground/70 mt-4 max-w-md">
                    {method.description}
                  </p>
                )}
              </ScrollReveal>
              <ScrollReveal variant="fadeLeft" delay={0.1} className="w-full aspect-[16/10] rounded-[14px] bg-muted overflow-hidden flex items-center justify-center">
                {method.diagramImage ? (
                  <img src={method.diagramImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-body-sm text-foreground/40">Imagen</span>
                )}
              </ScrollReveal>
            </div>

            {/* Row 2: Orbital diagram + 2x2 features */}
            <ScrollReveal className="grid lg:grid-cols-2 gap-10 md:gap-12 items-stretch [&>*]:min-w-0">
              <div
                className="relative aspect-square rounded-[14px] bg-background overflow-hidden"
                style={{ containerType: "inline-size" }}
              >
                {/* Concentric dashed rings */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="absolute w-[88%] h-[88%] rounded-full border border-dashed border-border" />
                  <div className="absolute w-[62%] h-[62%] rounded-full border border-dashed border-border" />
                  <div className="absolute w-[34%] h-[34%] rounded-full border border-dashed border-border" />
                </div>

                {/* Dashed connector: Neuropediatra → Hospital tag */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <line
                    x1="56" y1="16" x2="68" y2="11"
                    stroke="hsl(var(--border))"
                    strokeWidth="0.3"
                    strokeDasharray="1 1"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                {/* Center node — Pacientes */}
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-coral flex flex-col items-center justify-center text-background shadow-sm"
                  style={{ width: "22cqw", height: "22cqw" }}
                >
                  {(() => {
                    const I = resolveIcon("Heart");
                    return <I style={{ width: "5cqw", height: "5cqw" }} strokeWidth={2} fill="currentColor" />;
                  })()}
                  <span className="font-semibold tracking-[-0.02em]" style={{ fontSize: "clamp(11px, 3.2cqw, 18px)", marginTop: "0.8cqw" }}>
                    Pacientes
                  </span>
                </div>

                {/* Orbiting nodes — circle center sits on middle ring (62%) */}
                {[
                  { label: "Neuropediatra", icon: "Stethoscope", bg: "bg-brand-amber", fg: "text-foreground", cx: 50, cy: 19 },
                  { label: "Supervisora\nClínica - BCBA", icon: "BookOpen", bg: "bg-brand-blue", fg: "text-background", cx: 81, cy: 50 },
                  { label: "Terapeuta IBT", icon: "Users", bg: "bg-brand-blue", fg: "text-background", cx: 50, cy: 81 },
                  { label: "Padres", icon: "Home", bg: "bg-brand-coral", fg: "text-background", cx: 19, cy: 50 },
                ].map((n, i) => {
                  const I = resolveIcon(n.icon);
                  return (
                    <div
                      key={i}
                      className="absolute flex flex-col items-center text-center"
                      style={{
                        left: `${n.cx}%`,
                        top: `${n.cy}%`,
                        width: "26cqw",
                        transform: "translate(-50%, -7cqw)",
                      }}
                    >
                      <div
                        className={`rounded-full ${n.bg} ${n.fg} flex items-center justify-center shadow-sm`}
                        style={{ width: "14cqw", height: "14cqw" }}
                      >
                        <I style={{ width: "5cqw", height: "5cqw" }} strokeWidth={2} />
                      </div>
                      <span
                        className="text-foreground whitespace-pre-line leading-[1.2] tracking-[-0.02em]"
                        style={{ fontSize: "clamp(10px, 3cqw, 16px)", marginTop: "1.6cqw" }}
                      >
                        {n.label}
                      </span>
                    </div>
                  );
                })}

                {/* Hospital Español tag (top-right, linked to Neuropediatra) */}
                <div
                  className="absolute text-left"
                  style={{ top: "5%", right: "6%", maxWidth: "32cqw" }}
                >
                  <p className="text-foreground/60 leading-[1.5] tracking-[-0.02em]" style={{ fontSize: "clamp(8px, 2.2cqw, 12px)" }}>
                    Unidad de
                  </p>
                  <p className="font-semibold text-foreground leading-[1.5] tracking-[-0.02em]" style={{ fontSize: "clamp(10px, 3cqw, 14px)", marginTop: "0.4cqw" }}>
                    Neurodesarrollo
                  </p>
                  <p className="text-foreground/60 leading-[1.5] tracking-[-0.02em]" style={{ fontSize: "clamp(9px, 2.4cqw, 13px)" }}>
                    Hospital Español
                  </p>
                </div>
              </div>


              <div className="min-w-0">
                <div
                  ref={methodFeaturesRef}
                  role="region"
                  aria-roledescription="carousel"
                  aria-label="Características del método"
                  tabIndex={0}
                  className="flex md:grid md:grid-cols-2 gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 scrollbar-hide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 rounded-[14px]"
                >
                  {method.features.map((f, i) => {
                    const Icon = resolveIcon(f.icon);
                    return (
                      <div
                        key={i}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${i + 1} de ${method.features.length}`}
                        className="snap-start shrink-0 w-full md:w-auto md:max-w-none bg-muted rounded-[14px] p-6 flex flex-col"
                      >
                        <div className="w-10 h-10 rounded-[10px] bg-background border border-border flex items-center justify-center">
                          <Icon className="w-4 h-4 text-foreground" strokeWidth={1.33} />
                        </div>
                        <h3 className="text-h5 font-semibold text-foreground mt-4 leading-[1.3]">{f.title}</h3>
                        <p className="text-body-sm text-foreground/60 mt-2 leading-[1.5] text-base">{f.description}</p>
                      </div>
                    );
                  })}
                </div>
                <ScrollIndicator scrollRef={methodFeaturesRef} count={method.features.length} />
              </div>
            </ScrollReveal>

            {/* Row 3: Alliance image + card */}
            {alliance && (
              <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-stretch">
                <ScrollReveal variant="fadeRight" className="w-full aspect-[4/3] rounded-[14px] bg-muted overflow-hidden flex items-center justify-center">
                  {alliance.image ? (
                    <img src={alliance.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-body-sm text-foreground/40">Imagen</span>
                  )}
                </ScrollReveal>
                <ScrollReveal variant="fadeLeft" delay={0.1} className="bg-muted rounded-[14px] p-8 md:p-10 flex flex-col justify-center">
                  {alliance.eyebrow && (
                    <p className="text-body-sm text-foreground/60 mb-3">{alliance.eyebrow}</p>
                  )}
                  <h3 className="text-h2 font-semibold text-foreground leading-[1.3]">{alliance.title}</h3>
                  <p className="text-body-sm md:text-body-md text-foreground/70 mt-4">{alliance.description}</p>
                  <ul className="flex flex-wrap gap-2 mt-5">
                    {alliance.specialties.map((s, i) => (
                      <li key={i} className="px-4 py-2 rounded-full bg-brand-blue/10 text-foreground text-body-sm">{s}</li>
                    ))}
                  </ul>
                  <HospitalLogos />
                </ScrollReveal>
              </div>
            )}
          </div>
        </section>
      )}


      {faq && (
        <section className="w-full section-py section-px">
          <div className="section-container">
            <ScrollReveal>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
                <div className="order-2 md:order-1">
                  {faq.image ? (
                    <img
                      src={faq.image}
                      alt={faq.title}
                      className="w-full aspect-square object-cover rounded-2xl"
                    />
                  ) : (
                    <ImagePlaceholder className="w-full aspect-square rounded-2xl" />
                  )}
                </div>
                <div className="order-1 md:order-2">
                  {faq.eyebrow && (
                    <p className="text-body-sm uppercase text-foreground/60 mb-2">{faq.eyebrow}</p>
                  )}
                  <h2 className="text-h2 font-semibold text-foreground mb-4">{faq.title}</h2>
                  {faq.description && (
                    <p className="text-body-md text-foreground/70 mb-8">{faq.description}</p>
                  )}
                  <Accordion type="single" collapsible className="w-full">
                    {faqItems.map((f, i) => (
                      <AccordionPrimitive.Item
                        key={i}
                        value={`faq-${i}`}
                        className="border-b border-border last:border-b-0"
                      >
                        <AccordionPrimitive.Header className="flex">
                          <AccordionPrimitive.Trigger className="group flex flex-1 items-center justify-between gap-4 py-6 text-left text-body-md md:text-h5 font-semibold transition-all">
                            <span>{f.question}</span>
                            <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue transition-transform duration-200 group-data-[state=open]:rotate-45">
                              <Plus className="h-4 w-4" strokeWidth={2} />
                            </span>
                          </AccordionPrimitive.Trigger>
                        </AccordionPrimitive.Header>
                        <AccordionPrimitive.Content className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                          <p className="text-body-md text-foreground/70 pb-6 pr-12">{f.answer}</p>
                        </AccordionPrimitive.Content>
                      </AccordionPrimitive.Item>
                    ))}
                  </Accordion>

                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {exploreMore && <CrossLinks data={exploreMore} />}

      {finalCta && (
        <Section>
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <h2 className="text-h2 font-semibold">{finalCta.title}</h2>
              {finalCta.description && <p className="text-body-md text-foreground/70">{finalCta.description}</p>}
            </div>
            <div className="flex flex-row flex-wrap gap-3 md:shrink-0">
              <a href={finalCta.primaryCta.href} className="inline-flex items-center justify-center whitespace-nowrap px-6 py-3 bg-foreground text-background rounded-full">
                {finalCta.primaryCta.label}
              </a>
              {finalCta.secondaryCta && (
                <a href={finalCta.secondaryCta.href} className="inline-flex items-center justify-center whitespace-nowrap px-6 py-3 border border-border rounded-full">
                  {finalCta.secondaryCta.label}
                </a>
              )}
            </div>
          </div>
        </Section>
      )}

      <Footer />
    </>
  );
};

export default ServicePageTemplate;
