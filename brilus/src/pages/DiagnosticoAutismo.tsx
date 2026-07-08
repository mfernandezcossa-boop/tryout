import React, { useState, useRef, useEffect } from "react";
import { SEOHead } from "@/components/SEOHead";
import NavbarBrilus from "@/components/NavbarBrilus";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ScreeningSelector, { ScreeningOptions } from "@/components/diagnostico/ScreeningSelector";
import TestimonialBlock from "@/components/TestimonialBlock";
import { Check, X, ArrowUpRight, Trophy, Gamepad2, FileText, Building2 } from "lucide-react";
import { diagnosticoFaqs as faqs } from "@/content/diagnosticoFaqs";

const ScreeningCTA = ({
  label = "Haz el screening gratuito",
  variant = "dark",
}: {
  label?: string;
  variant?: "dark" | "white";
}) => (
  <ScreeningSelector
    trigger={
      <button
        type="button"
        className={
          variant === "dark"
            ? "inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-brilus bg-foreground h-10 px-6 text-[14px] font-medium tracking-brilus-ui text-background transition-colors hover:bg-foreground/90 sm:w-auto md:h-12 md:px-8 md:text-base md:font-semibold"
            : "inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-brilus bg-white h-10 px-6 text-[14px] font-medium tracking-brilus-ui text-foreground transition-colors hover:bg-white/90 sm:w-auto md:h-12 md:px-8 md:text-base md:font-semibold"
        }
      >
        {label}
      </button>
    }
  />
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-center text-h2 leading-[1.2] text-foreground">{children}</h2>
);

const ChecklistItem = ({ text }: { text: string }) => (
  <li className="flex items-start gap-2 text-body-md text-foreground">
    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" strokeWidth={2.5} />
    <span>{text}</span>
  </li>
);

const milestoneTabs = {
  "12 meses": {
    intro: "A esta edad los bebés empiezan a balbucear y reconocer su nombre.",
    items: [
      "Responder a su nombre",
      "Balbucear con entonación",
      "Imitar sonidos y gestos simples",
      "Mostrar interés por las personas",
    ],
  },
  "18 meses": {
    intro: "A esta edad los bebés ya usan gestos simples y vocalizan para comunicarse.",
    items: [
      'Decir "mamá" o "papá"',
      "Señalar cosas para pedirlas o mostrarlas",
      "Responder cuando lo llaman por su nombre",
      "Usar gestos simples como decir adiós con la mano",
    ],
  },
  "2 años": {
    intro: "A esta edad los niños combinan palabras y juegan de forma simbólica.",
    items: [
      "Combinar dos palabras (ej. 'más agua')",
      "Imitar acciones de los adultos",
      "Señalar partes del cuerpo cuando se le pide",
      "Jugar de forma simbólica (ej. dar de comer a un muñeco)",
    ],
  },
} as const;
type TabKey = keyof typeof milestoneTabs;

const tabColors: Record<TabKey, string> = {
  "12 meses": "bg-brand-blue-25",
  "18 meses": "bg-brand-coral-25",
  "2 años": "bg-brand-amber-25",
};

const comparisonRows = [
  "Continuidad diagnóstico → terapia",
  "Equipo multidisciplinario en un solo lugar",
  "Instrumentos diagnósticos de referencia mundial",
  "Sin coordinar tú solo entre múltiples proveedores",
  "Avalado por una institución de primer nivel",
];

const conventionalValues = ["A veces", "x", "A veces", "x", "x"];

const adosCards = [
  {
    icon: Trophy,
    title: "Estándar de referencia mundial",
    text: "El ADOS-2 cuenta con décadas de investigación y es utilizado internacionalmente para apoyar evaluaciones diagnósticas precisas y basadas en evidencia.",
  },
  {
    icon: Gamepad2,
    title: "Basado en el juego",
    text: "No es un examen tradicional. A través de actividades y juegos adaptados a la edad del niño, los especialistas observan habilidades sociales, comunicación y comportamiento.",
  },
  {
    icon: FileText,
    title: "Resultados claros",
    text: "Recibirás un informe detallado que ayuda a comprender mejor las fortalezas y desafíos de tu hijo, y orienta los próximos pasos de intervención y apoyo.",
  },
];

const ImagePlaceholder = ({ className = "" }: { className?: string }) => (
  <div className={`w-full rounded-brilus-card bg-[#D9D9D9] ${className}`} />
);

const DiagnosticoAutismo = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("18 meses");
  const tab = milestoneTabs[activeTab];
  const adosScrollRef = useRef<HTMLDivElement>(null);
  const [adosActiveIndex, setAdosActiveIndex] = useState(0);

  useEffect(() => {
    const container = adosScrollRef.current;
    if (!container) return;
    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      let closest = 0;
      let minDist = Infinity;
      Array.from(container.children).forEach((child, i) => {
        const cRect = (child as HTMLElement).getBoundingClientRect();
        const cCenter = cRect.left + cRect.width / 2;
        const dist = Math.abs(cCenter - center);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });
      setAdosActiveIndex(closest);
    };
    handleScroll();
    container.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <>
      <SEOHead
        title="Diagnóstico de Autismo en CDMX | Brilus"
        description="Diagnóstico de autismo con ADOS-2 y ADI-R en la Unidad de Neurodesarrollo del Hospital Español, CDMX. Empieza con un screening gratuito."
        canonical="/diagnostico-autismo"
      />
      <NavbarBrilus />

      {/* 1. HERO */}
      <section className="bg-brand-white flex flex-col justify-center section-px pb-16 pt-28 sm:pt-32 md:min-h-[600px] md:pb-24 md:pt-36">
        <div className="mx-auto grid h-full max-w-5xl grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-10">
          <div className="text-foreground">
            <span className="inline-flex items-center rounded-brilus-pill bg-brand-blue-50 px-3 py-1 text-[12px] font-medium uppercase tracking-brilus-ui text-brand-blue">
              Brilus — Unidad de Neurodesarrollo del Hospital Español
            </span>

            <h1 className="mt-3 text-[24px] font-bold leading-[1.15] text-foreground md:text-hero">
              ¿Tienes dudas sobre el desarrollo de tu hijo?
            </h1>
            <p className="mt-5 max-w-md text-body-md text-muted-foreground">
              Si notas que el desarrollo de tu hijo va por otro camino, no estás solo. Un diagnóstico no es un
              veredicto: es el comienzo de un camino con respuestas y más claridad.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ScreeningCTA />
              <a
                href="#proceso-diagnostico"
                className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-brilus border border-black/10 h-10 px-6 text-[14px] font-medium tracking-brilus-ui text-foreground transition-colors hover:bg-black/5 sm:w-auto md:h-12 md:px-8 md:text-base md:font-semibold"
              >
                Cómo funciona
              </a>
            </div>
          </div>
          <div className="md:order-last">
            <img
              src="https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/Diagnostico/Hero%20Diagnostico.webp"
              alt="Diagnóstico de autismo en Brilus"
              className="min-h-[320px] w-full rounded-brilus-card object-cover md:min-h-[420px] md:max-h-[420px]"
            />
          </div>
        </div>
      </section>

      <main className="bg-background">
        {/* 2. HITOS */}
        <section className="section-px section-py">
          <div className="mx-auto max-w-5xl">
            <SectionHeading>¿Tu hijo está alcanzando sus primeros hitos?</SectionHeading>
            <p className="mx-auto mt-3 max-w-md text-center text-body-md text-muted-foreground">
              Conocer los hitos del desarrollo te ayuda a saber cuándo vale la pena pedir una segunda opinión.
            </p>

            <div className="mt-6 rounded-brilus-card bg-brand-blue-50/60 p-4">
              <div className="flex justify-center gap-2">
                {(Object.keys(milestoneTabs) as TabKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`rounded-brilus-pill px-4 py-1.5 text-[13px] tracking-brilus-ui text-foreground transition-all ${tabColors[key]} ${
                      activeTab === key ? "font-bold" : "font-medium"
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-brilus-inner bg-white p-5">
                <p className="text-body-md text-foreground">{tab.intro}</p>
                <ul className="mt-4 space-y-2.5">
                  {tab.items.map((i) => (
                    <ChecklistItem key={i} text={i} />
                  ))}
                </ul>
              </div>

              <div className="mt-5 flex flex-row items-center justify-center gap-4">
                <ScreeningCTA />
                <a
                  href="#proceso-diagnostico"
                  className="text-body-md font-medium text-brand-blue underline-offset-4 hover:underline"
                >
                  Ver más información
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 4. SEÑALES + SCREENING SELECTOR (embedded) */}
        <section id="screening-selector" className="section-px pb-14">
          <div className="mx-auto max-w-5xl rounded-brilus-card bg-brand-blue-50/60 p-4 sm:p-8 md:p-12">
            <p className="text-center text-body-md font-medium text-foreground/70">Señales de autismo:</p>
            <h2 className="mx-auto mt-2 max-w-md text-center text-h2 text-foreground">
              Elige el screening adecuado para tu hijo
            </h2>
            <p className="mx-auto mt-4 max-w-xs text-center text-body-md leading-relaxed text-muted-foreground sm:max-w-sm">
              Elige la evaluación de autismo según la edad de tu hijo. Son los mismos cuestionarios que usan pediatras y
              neuropediatras para detectar señales de autismo de forma temprana.
            </p>

            <div className="mt-6 -mx-1 sm:mx-0">
              <ScreeningOptions />
            </div>

            <div className="mt-6 rounded-brilus-inner bg-foreground p-5 text-background">
              <p className="text-body-md font-semibold">Esto es gratis y orientativo, no es un diagnóstico.</p>
              <p className="mt-1 text-body-md text-background/80">
                Detecta señales; no etiqueta a tu hijo. Es confidencial.
              </p>
            </div>
          </div>
        </section>

        {/* 5. ¿QUÉ ES UN SCREENING? */}
        <section className="section-px section-py">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
              <div className="md:flex-1">
                <h2 className="text-[32px] font-semibold leading-[1.08] tracking-brilus-ui text-foreground md:text-h2">
                  ¿Qué es un screening?
                </h2>
                <p className="mt-4 text-body-md text-muted-foreground">
                  Un screening es un cuestionario breve que detecta señales tempranas. No diagnostica: te dice si vale
                  la pena avanzar a una evaluación profesional. Te ahorra avanzar a ciegas.
                </p>

                <div className="mt-6 rounded-brilus-card bg-brand-blue-50/60 p-5">
                  <ul className="space-y-3">
                    <li className="text-body-md text-foreground">
                      <span className="font-semibold">El screening no reemplaza el diagnóstico — lo precede.</span>
                    </li>
                    <li className="text-body-md text-foreground">
                      Es gratis, toma pocos minutos y lo hacés desde casa.
                    </li>
                  </ul>
                </div>
              </div>
              <div className="md:flex-1">
                <img
                  src="https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/Diagnostico/que%20es%20un%20screening.webp"
                  alt="Qué es un screening de autismo"
                  className="aspect-[4/3] w-full rounded-brilus-card object-cover md:aspect-auto md:h-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 6. PROCESO */}
        <section id="proceso-diagnostico" className="section-px section-py">
          <div className="mx-auto max-w-5xl">
            <h2 className="mx-auto max-w-3xl text-center text-[34px] font-semibold leading-[1.05] tracking-brilus-ui text-foreground md:text-[48px]">
              ¿Por qué hacer el diagnóstico de autismo con Brilus?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-center text-body-md text-muted-foreground">
              Brilus opera dentro de la Unidad de Neurodesarrollo del Hospital Español — el único lugar en México donde
              el screening, el diagnóstico y el inicio de terapia ABA ocurren bajo el mismo techo hospitalario.
            </p>

            <div className="mt-10">
              <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
                {[
                  {
                    n: "01",
                    t: "Screening inicial",
                    d: "Empiezas desde casa con un cuestionario online de 5 minutos. Detecta señales de autismo según la edad de tu hijo y te orienta sobre si vale la pena avanzar.",
                    icon: FileText,
                  },
                  {
                    n: "02",
                    t: "Evaluación profesional",
                    d: "Si el screening indica riesgo, el siguiente paso es una evaluación presencial con herramientas como ADOS-2 y entrevista clínica a los padres.",
                    icon: Building2,
                  },
                  {
                    n: "03",
                    t: "Resultados y plan",
                    d: "Integramos los resultados, la historia del desarrollo y las observaciones clínicas para darte claridad y definir los siguientes pasos.",
                    icon: Trophy,
                  },
                ].map((s) => {
                  const Icon = s.icon;

                  return (
                    <div
                      key={s.n}
                      className="flex min-h-[360px] w-[82vw] max-w-[320px] shrink-0 snap-center flex-col rounded-brilus-card bg-white p-7 shadow-sm md:w-auto md:max-w-none md:min-h-[390px] md:p-8"
                    >
                      <Icon className="mb-10 h-12 w-12 text-foreground" />

                      <p className="text-[28px] font-semibold leading-none tracking-brilus-ui text-foreground">{s.n}</p>

                      <h3 className="mt-4 text-[24px] font-semibold leading-tight tracking-brilus-ui text-foreground">
                        {s.t}
                      </h3>

                      <p className="mt-4 text-body-md leading-relaxed text-muted-foreground">{s.d}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex justify-center gap-2 md:hidden">
                <span className="h-2 w-2 rounded-full bg-brand-blue" />
                <span className="h-2 w-2 rounded-full bg-brand-blue/25" />
                <span className="h-2 w-2 rounded-full bg-brand-blue/25" />
              </div>
            </div>
          </div>
        </section>

        {/* 7. POR QUÉ BRILUS — TABLA COMPARATIVA */}
        <section className="section-px section-py">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-[32px] font-semibold leading-[1.08] tracking-brilus-ui text-foreground md:text-[44px]">
              ¿Por qué hacer el diagnóstico de autismo con Brilus?
            </h2>
            <p className="mt-3 text-body-md text-muted-foreground">
              La evaluación de autismo en Brilus integra neuropediatría y terapia ABA en un solo lugar — dentro de la
              Unidad de Neurodesarrollo del Hospital Español, CDMX.
            </p>

            <div className="mt-6 overflow-hidden rounded-brilus-card border border-black/10">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-3 text-body-md font-medium text-foreground/70"></th>
                    <th className="px-4 py-3 text-center text-body-md font-semibold text-brand-blue">Brilus</th>
                    <th className="px-4 py-3 text-center text-body-md font-medium text-foreground/70">Otros</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, idx) => (
                    <tr key={row} className={idx % 2 === 0 ? "bg-white" : "bg-brand-coral-50/20"}>
                      <td className="px-4 py-4 text-body-md text-foreground">{row}</td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-brilus-pill bg-brand-blue text-white">
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center text-body-md text-muted-foreground">
                        {conventionalValues[idx] === "x" ? (
                          <X className="mx-auto h-4 w-4 text-muted-foreground" />
                        ) : (
                          conventionalValues[idx]
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 8. ALIANZA INSTITUCIONAL */}
        <section className="section-py !pb-8 px-5 md:px-8 lg:px-10 md:!pb-12">
          <div className="mx-auto max-w-5xl rounded-brilus-card bg-[#0F1B2D] p-8 text-white sm:p-10 md:p-10 lg:p-12">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
              <div className="md:flex-1">
                <p className="text-base font-medium uppercase tracking-brilus-ui text-white/70">
                  Alianza institucional
                </p>
                <div className="mt-2 flex items-start gap-3">
                  <Building2 className="mt-1 h-6 w-6 text-brand-blue" />
                  <h3 className="text-h3 text-white">Unidad de Neurodesarrollo Hospital Español</h3>
                </div>
                <p className="mt-3 text-body-md text-white/85">
                  Brilus opera dentro del hospital — no como clínica externa. Accedes a toda la infraestructura médica
                  desde el primer día.
                </p>
                <div className="mt-5">{/* mismo botón "Haz el screening gratuito" que ya tenías acá */}</div>
              </div>
              <div className="md:flex-1">
                <img
                  src="https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/in-home/work%20inhome.webp"
                  alt="Unidad de Neurodesarrollo Hospital Español"
                  className="aspect-[16/9] w-full rounded-brilus-card object-cover md:aspect-auto md:h-[260px]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 9. ADOS-2 + ADI-R + JUNTOS — ACORDEÓN */}
        <section className="section-px section-py !pt-8 md:!pt-12">
          <div className="mx-auto grid max-w-5xl gap-10 px-2 md:grid-cols-[0.9fr_1.4fr] md:items-start md:gap-16 md:px-0">
            <div className="hidden md:block">
              <img
                src="https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/Diagnostico/Que%20es%20el%20Ados.webp"
                alt="Evaluación ADOS-2"
                className="aspect-[4/3] w-full rounded-brilus-card object-cover"
              />
            </div>

            <Accordion type="single" collapsible className="min-w-0">
              <AccordionItem value="ados-2">
                <AccordionTrigger className="py-4 text-left !text-[24px] font-semibold leading-[1.12] tracking-brilus-ui text-foreground hover:no-underline md:!text-[32px]">
                  ¿Qué es el ADOS-2?
                </AccordionTrigger>
                <AccordionContent className="overflow-visible">
                  <div className="min-w-0 pb-2">
                    <p className="text-[22px] font-semibold leading-[1.15] tracking-brilus-ui text-foreground md:text-[24px]">
                      El estándar de referencia mundial para la evaluación del autismo en niños
                    </p>
                    <p className="mt-3 max-w-2xl text-body-md text-muted-foreground">
                      El ADOS-2 es una evaluación estandarizada y basada en el juego que ayuda a identificar
                      características asociadas al autismo. Es considerado el instrumento de referencia internacional
                      utilizado por profesionales de todo el mundo como parte del proceso diagnóstico.
                    </p>

                    <div className="mt-8 flex max-w-full snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-4 pr-4 md:pr-0">
                      {adosCards.map(({ icon: Icon, title, text }) => (
                        <div
                          key={title}
                          className="flex h-[320px] w-[76vw] max-w-[260px] shrink-0 snap-center flex-col rounded-brilus-card bg-brand-blue-50/60 p-6 md:w-[320px] md:max-w-none"
                        >
                          <span className="inline-flex h-12 w-12 items-center justify-center rounded-brilus-inner bg-white text-brand-blue">
                            <Icon className="h-6 w-6" />
                          </span>
                          <h3 className="mt-4 text-[20px] font-semibold leading-tight tracking-brilus-ui text-foreground md:text-[22px]">
                            {title}
                          </h3>
                          <p className="mt-2 text-body-md text-muted-foreground">{text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="adi-r">
                <AccordionTrigger className="py-4 text-left !text-[24px] font-semibold leading-[1.12] tracking-brilus-ui text-foreground hover:no-underline md:!text-[32px]">
                  ¿Qué es el ADI-R?
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pb-2">
                    <p className="max-w-2xl text-body-md text-muted-foreground">
                      Una entrevista estructurada contigo sobre el desarrollo de tu hijo desde el primer año de vida.
                      Complementa lo que se observa en la sesión.
                    </p>

                    <div className="mt-6 rounded-brilus-card border border-brand-blue/20 bg-brand-blue-50/60 p-6">
                      <div className="flex items-start justify-between">
                        <h3 className="text-[22px] font-semibold leading-tight tracking-brilus-ui text-foreground md:text-[24px]">
                          Estándar de referencia mundial
                        </h3>
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/10 bg-white text-foreground">
                          <ArrowUpRight className="h-5 w-5" />
                        </span>
                      </div>
                      <p className="mt-3 text-body-md text-muted-foreground">
                        El ADI-R cuenta con décadas de investigación y es utilizado internacionalmente para apoyar
                        evaluaciones diagnósticas precisas y basadas en evidencia.
                      </p>

                      <p className="mt-5 text-[22px] font-semibold leading-tight tracking-brilus-ui text-foreground md:text-[24px]">
                        ¿Qué cubre?
                      </p>
                      <ul className="mt-3 space-y-2.5">
                        {[
                          "Historia del lenguaje y comunicación",
                          "Comportamiento social en el tiempo",
                          "Patrones repetitivos o sensoriales",
                          "Hitos del desarrollo",
                        ].map((t) => (
                          <li key={t} className="flex items-start gap-2 text-body-md text-foreground">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" strokeWidth={2.5} />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="juntos">
                <AccordionTrigger className="py-4 text-left !text-[24px] font-semibold leading-[1.12] tracking-brilus-ui text-foreground hover:no-underline md:!text-[32px]">
                  ¿Por qué el ADOS-2 y el ADI-R juntos?
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pb-2">
                    <p className="mt-3 max-w-2xl text-body-md text-muted-foreground">
                      El ADOS-2 muestra cómo está tu hijo hoy. El ADI-R muestra cómo llegó hasta acá. Un diagnóstico
                      basado en un solo instrumento puede pasar por alto señales importantes. La combinación ADOS-2 +
                      ADI-R es el estándar de referencia internacional recomendado por la comunidad científica.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* 11. DETRÁS DE CADA DIAGNÓSTICO */}
        <section className="bg-brand-blue section-px section-py">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col gap-8 md:flex-row md:items-stretch md:gap-12">
              <div className="md:flex-1">
                <h2 className="text-h2 text-white">Detrás de cada diagnóstico hay un futuro más amplio</h2>
                <p className="mt-3 text-body-md text-white/90">
                  La plasticidad cerebral es mayor en los primeros años, y la intervención temprana aprovecha
                  exactamente eso.
                </p>
                <p className="mt-5 text-body-md font-semibold text-white">Actuar hoy le da a tu hijo:</p>
                <ul className="mt-3 space-y-2.5">
                  {[
                    "Avances más rápidos en lenguaje, comunicación y autonomía",
                    "Mayor respuesta a la terapia en la etapa de mayor plasticidad cerebral",
                    "Un plan claro en lugar de esperar a ver cómo evoluciona",
                    "La mayoría de los niños con diagnóstico temprano logran integrarse a la escuela regular",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2 text-body-md text-white">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-white" strokeWidth={2.5} />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <ScreeningCTA variant="white" />
                </div>
              </div>
              <div className="md:flex-1">
                <img
                  src="https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/Diagnostico/Futuro%20de%20Diag.webp"
                  alt="Futuro del diagnóstico"
                  className="aspect-[16/9] w-full rounded-xl object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 12. FAQ */}
        <section className="section-px section-py">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-h2 text-foreground">Preguntas frecuentes</h2>
            <Accordion type="single" collapsible className="mt-6">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-body-md font-semibold text-foreground">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-body-md text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default DiagnosticoAutismo;
