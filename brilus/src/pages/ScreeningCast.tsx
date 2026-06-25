import { SEOHead } from "@/components/SEOHead";
import NavbarBrilus from "@/components/NavbarBrilus";
import Footer from "@/components/Footer";
import ScreenerFlow from "@/screener/ScreenerFlow";
import { castConfig } from "@/screener/configs/castConfig";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScreeningOptions } from "@/components/diagnostico/ScreeningSelector";
import { diagnosticoFaqs } from "@/content/diagnosticoFaqs";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AlertCircle, ArrowRight, ArrowUpRight } from "lucide-react";
import TestimonialsSection from "@/components/TestimonialsSection";
import { Button } from "@/components/ui/button";

const SCREENER_ANCHOR = "screener-engine";

const ScrollToScreener = ({
  label = "Iniciar CAST",
  variant = "dark",
}: {
  label?: string;
  variant?: "dark" | "white" | "blue";
}) => {
  const classes =
    variant === "white"
      ? "bg-white text-foreground hover:bg-white/90"
      : variant === "blue"
        ? "bg-brand-blue text-white hover:bg-brand-blue/90"
        : "bg-foreground text-background hover:bg-foreground/90";
  return (
    <a
      href={`#${SCREENER_ANCHOR}`}
      className={`inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-brilus h-10 px-6 text-[14px] font-medium tracking-brilus-ui transition-colors sm:w-auto md:h-12 md:px-8 md:text-base md:font-semibold ${classes}`}
    >
      {label}
      <ArrowRight className="h-4 w-4" />
    </a>
  );
};

const scoreRows = [
  {
    range: "0 a 14 puntos",
    risk: "Riesgo bajo",
    desc: "Baja probabilidad de rasgos de autismo.",
    action: "No se requieren más acciones a menos que existan otras inquietudes.",
    chip: "bg-brand-blue-50 text-brand-blue",
  },
  {
    range: "15 a 30 puntos",
    risk: "Riesgo medio",
    desc: "Posibles rasgos de autismo.",
    action: "Hacer un seguimiento con una evaluación profesional de autismo.",
    chip: "bg-brand-amber-25 text-foreground",
  },
  {
    range: "31 puntos o más",
    risk: "Riesgo alto",
    desc: "Alta probabilidad de autismo.",
    action: "Se recomienda una evaluación clínica inmediata.",
    chip: "bg-brand-coral-25 text-foreground",
  },
];

const afterCards = [
  {
    tag: "Paso 1",
    title: "Revisión de los resultados del CAST de tu hijo",
    body: "Dentro de un día hábil, un Asesor de Admisiones de la Clínica (CAA) se pondrá en contacto contigo para revisar los resultados de tu hijo y conversar sobre cualquier inquietud que puedas tener.",
    accent: "bg-brand-blue-50",
  },
  {
    tag: "Paso 2",
    title: "Evaluación integral",
    body: "Si la puntuación del CAST de tu hijo sugiere signos de autismo, es posible que recomendemos una evaluación de seguimiento como el ADOS-2. Enviaremos los resultados de esta evaluación al médico de tu hijo, quien se encargará de realizar el diagnóstico final.",
    accent: "bg-brand-amber-25",
  },
  {
    tag: "Paso 3",
    title: "Plan de atención personalizado para el autismo",
    body: "Si tu hijo es diagnosticado con autismo, te guiaremos a través de los siguientes pasos: verificación de seguro y revisión de beneficios, una reunión con un Analista de Conducta Certificado (BCBA®), y la creación de objetivos de terapia ABA individualizados y adaptados a las necesidades de tu hijo.",
    accent: "bg-brand-coral-25",
  },
];

const howFaqs = [
  {
    q: "¿Qué es el CAST?",
    a: "El CAST (Childhood Autism Spectrum Test) es un cuestionario diseñado para que padres, madres o cuidadores lo completen sobre niños en edad escolar. Su objetivo principal es ayudar a identificar de forma oportuna posibles señales de autismo en niños de entre 4 y 11 años. Es una herramienta científica, sencilla de responder y completamente confidencial.",
  },
  {
    q: "¿Cuánto tiempo toma completarlo?",
    a: "El cuestionario consta de 39 preguntas estructuradas. La mayoría de las familias logran completarlo con calma en un lapso de 5 a 10 minutos.",
  },
  {
    q: "¿Qué tipo de preguntas incluye el CAST?",
    a: "El cuestionario cubre conductas del desarrollo en edad escolar que son clave para la detección del Trastorno del Espectro Autista (autismo). Evalúa aspectos fundamentales como:",
  },
];

const ScreeningCast = () => {
  const [activeAfterCard, setActiveAfterCard] = useState(0);
  const navigate = useNavigate();

  return (
    <>
      <SEOHead
        title="Cuestionario CAST | Detección de autismo en edad escolar | Brilus"
        description="CAST: 39 preguntas para detectar señales de autismo en niños de 4 a 11 años. Toma 5–10 minutos, gratis y confidencial."
        canonical="/screening-cast"
      />
      <NavbarBrilus />

      {/* 1. HERO */}
      <section className="flex flex-col justify-center section-px pb-16 pt-28 md:min-h-[600px] md:pb-24 md:pt-36">
        <div className="mx-auto grid w-full max-w-5xl gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-base font-medium uppercase tracking-brilus-ui text-brand-blue">
              CAST · DETECCIÓN DE AUTISMO EN EDAD ESCOLAR
            </p>
            <h1 className="mt-4 text-[32px] font-semibold leading-[1.15] tracking-brilus-ui md:text-[40px]">
              Evalúa señales de autismo en niños mayores de 4 años
            </h1>
            <p className="mt-4 max-w-lg text-[16px] leading-[1.6] tracking-brilus-ui text-muted-foreground">
              El CAST es un cuestionario de 39 preguntas sobre cómo se relaciona, comunica y se comporta tu hijo en su
              día a día. Considerado una herramienta de referencia para la detección de autismo en edad escolar.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ScrollToScreener variant="blue" />
              <a
                href="#como-funciona"
                className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-brilus border border-black/10 h-10 px-6 text-[14px] font-medium tracking-brilus-ui text-foreground transition-colors hover:bg-black/5 sm:w-auto md:h-12 md:px-8 md:text-base md:font-semibold"
              >
                Cómo funciona
              </a>
            </div>
          </div>

          <div className="md:order-last">
            <div className="h-[240px] w-full overflow-hidden rounded-brilus-card bg-white/90 md:h-[480px]">
              <img
                src="https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/Diagnostico/CAST/Hero%20CAST.webp"
                alt="CAST - Detección de autismo en edad escolar"
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="bg-background">
        {/* 2. ¿ES PARA MI HIJO? */}
        <section className="section-px section-py md:py-20">
          <div className="mx-auto w-full max-w-5xl">
            <div className="rounded-[24px] bg-[#FF6B45] px-8 py-10 md:px-12 md:py-12">
              <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
                <div className="max-w-2xl md:text-left">
                  <h2 className="text-[28px] font-semibold leading-[1.15] tracking-brilus-ui text-white md:text-[32px]">
                    ¿Tu hijo tiene entre 16 meses y 4 años?
                  </h2>
                  <p className="mt-4 text-[16px] leading-[1.6] tracking-brilus-ui text-white/95">
                    Realiza el cuestionario M-CHAT, una herramienta de detección temprana de señales de autismo.
                  </p>
                </div>

                <Button
                  asChild
                  variant="outline"
                  className="h-14 w-full border-white bg-transparent px-8 text-lg text-white hover:bg-white hover:text-[#FF6B45] sm:w-auto"
                >
                  <Link to="/screening-mchat">
                    Realizar M-CHAT
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. TESTIMONIOS */}
        <TestimonialsSection location="screening" />

        {/* 4. ¿CÓMO FUNCIONA? — ACORDEÓN + TABLA */}
        <section id="como-funciona" className="scroll-mt-16 section-px section-py">
          <div className="mx-auto grid w-full max-w-5xl gap-10 md:grid-cols-[0.9fr_1.6fr] md:items-start md:gap-16">
  <div>
    <img
      src="https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/Diagnostico/CAST/CAST%20Explain.webp"
      alt="Cómo funciona el CAST"
      className="hidden aspect-[4/3] w-full rounded-brilus-card object-cover md:block"
    />
  </div>

  <div>
    <h2 className="text-h2 text-foreground">¿Cómo funciona el CAST?</h2>

    <Accordion type="single" collapsible className="mt-8 divide-y divide-black/10">
              {howFaqs.map((f, i) => (
                <AccordionItem key={i} value={`how-${i}`} className="border-0">
                  <AccordionTrigger className="py-6 pr-0 text-left text-h4 text-foreground hover:no-underline [&>svg]:hidden">
                    <div className="flex w-full items-center justify-between gap-6">
                      <span>{f.q}</span>
                      <ArrowUpRight className="h-8 w-8 shrink-0 text-foreground/70" />
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="pb-6 text-body-md text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
        </section>

        {/* 5. RANGO DE PUNTAJE */}
        <section className="section-px section-py md:py-24">
          <div className="mx-auto w-full max-w-5xl">
            <div className="border-t border-black/10 pt-8">
              <h3 className="text-[24px] leading-[1.3] font-semibold tracking-brilus-ui text-foreground">
                Rango de puntaje
              </h3>

              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:items-stretch md:gap-4">
                {scoreRows.map((row) => (
                  <div
                    key={row.range}
                    className="flex h-full flex-col rounded-brilus-card border border-black/10 bg-white p-8 md:p-10"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[14px] font-semibold tracking-brilus-ui text-foreground">{row.range}</span>
                      <span
                        className={`inline-flex items-center rounded-brilus-pill px-3 py-1 text-[12px] font-medium tracking-brilus-ui ${row.chip}`}
                      >
                        {row.risk}
                      </span>
                    </div>

                    <p className="mt-5 text-base tracking-brilus-ui text-foreground">{row.desc}</p>
                    <p className="mt-2 text-base tracking-brilus-ui text-muted-foreground">
                      <span className="font-medium text-foreground">Acción recomendada: </span>
                      {row.action}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. CALLOUT IMPORTANTE */}
        <section className="section-px pb-16 md:pb-20">
          <div className="mx-auto w-full max-w-5xl rounded-brilus-card border border-brand-amber/30 bg-brand-amber-10/40 p-8 md:p-10">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-brilus-inner bg-brand-amber text-foreground">
                <AlertCircle className="h-5 w-5" />
              </span>
              <div>
                <p className="text-base font-semibold tracking-brilus-ui text-foreground">
                  Nota importante para las familias
                </p>
                <p className="mt-2 text-base tracking-brilus-ui text-foreground/85">
                  Es importante tener en cuenta que el CAST es solo una herramienta de detección (o screening), no una
                  prueba que proporcione un diagnóstico. Una puntuación alta no significa que su hijo tenga autismo.
                  Solo significa que podría necesitar una revisión más detallada mediante una evaluación más exhaustiva,
                  como el ADOS-2.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. ¿QUÉ SUCEDE DESPUÉS? */}
        <section className="section-px section-py md:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-[20px] font-semibold leading-[1.2] tracking-brilus-ui text-foreground sm:text-[32px]">
              ¿Qué sucede después de enviar el cuestionario?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-base tracking-brilus-ui text-muted-foreground sm:text-[15px]">
              Una vez que termines el cuestionario, nuestro equipo de especialistas en neurodesarrollo revisará de forma
              confidencial cada una de las respuestas de tu hijo. Nos pondremos en contacto contigo para explicarte
              detalladamente los resultados y guiarte con empatía en los próximos pasos.
            </p>

            <div
              onScroll={(e) => {
                const container = e.currentTarget;
                const cardWidth = container.scrollWidth / afterCards.length;
                setActiveAfterCard(Math.round(container.scrollLeft / cardWidth));
              }}
              className="mt-8 flex items-stretch gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 md:pb-0"
            >
              {afterCards.map((c) => (
                <div
                  key={c.tag}
                  className={`flex h-full min-h-[280px] w-[84vw] max-w-[360px] shrink-0 snap-start flex-col rounded-brilus-card p-7 md:min-h-0 md:w-auto md:max-w-none md:p-8 ${c.accent}`}
                >
                  <p className="text-base font-semibold uppercase tracking-brilus-ui text-foreground/70">{c.tag}</p>
                  <h3 className="mt-2 text-[18px] font-semibold leading-[1.3] tracking-brilus-ui text-foreground sm:text-[18px]">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-base tracking-brilus-ui text-foreground/85">{c.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-center">
              <ScrollToScreener />

              <div className="mt-4 flex justify-center gap-1.5 md:hidden">
                {afterCards.map((_, index) => (
                  <span
                    key={index}
                    className={`h-1.5 w-1.5 rounded-full ${
                      index === activeAfterCard ? "bg-foreground" : "bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 7. MOTOR DEL SCREENER (no modificar) */}
      <section id={SCREENER_ANCHOR} className="scroll-mt-16">
       <ScreenerFlow
         config={castConfig}
         skipIntro
         onLeadSubmitted={(leadId) =>
           navigate("/screening-cast/start-cast", { state: { leadId } })
         }
       />
      </section>

      <main className="bg-background">
        {/* 9. FAQ */}
        <section className="section-px pb-16 md:pb-20">
          <div className="mx-auto w-full max-w-5xl">
            <h2 className="text-[20px] font-semibold tracking-brilus-ui text-foreground sm:text-[30px]">
              Preguntas frecuentes
            </h2>
            <Accordion type="single" collapsible className="mt-6">
              {diagnosticoFaqs.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-[15px] font-semibold tracking-brilus-ui text-foreground">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[14px] tracking-brilus-ui text-muted-foreground">
                    {f.a}
                  </AccordionContent>
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

export default ScreeningCast;
