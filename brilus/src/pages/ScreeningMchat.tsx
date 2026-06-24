import { SEOHead } from "@/components/SEOHead";
import NavbarBrilus from "@/components/NavbarBrilus";
import Footer from "@/components/Footer";
import ScreenerFlow from "@/screener/ScreenerFlow";
import { mchatConfig } from "@/screener/configs/mchatConfig";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScreeningOptions } from "@/components/diagnostico/ScreeningSelector";
import { diagnosticoFaqs } from "@/content/diagnosticoFaqs";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import TestimonialsSection from "@/components/TestimonialsSection";
import { Button } from "@/components/ui/button";

const SCREENER_ANCHOR = "screener-engine";

const ScrollToScreener = ({
  label = "Iniciar M-CHAT-R",
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
    range: "0 a 2 puntos",
    risk: "Riesgo bajo",
    desc: "Baja probabilidad de señales dentro del espectro.",
    action:
      "No se requiere ninguna acción clínica inmediata, salvo mantener el monitoreo del desarrollo con su pediatra.",
    chip: "bg-brand-blue-50 text-brand-blue",
  },
  {
    range: "3 a 7 puntos",
    risk: "Riesgo medio",
    desc: "Probabilidad media (presencia de posibles señales de alerta).",
    action:
      "Se aconseja una revisión detallada de las respuestas con un especialista para determinar los pasos a seguir.",
    chip: "bg-brand-amber-25 text-foreground",
  },
  {
    range: "8 a 20 puntos",
    risk: "Riesgo alto",
    desc: "Alta probabilidad de indicadores del espectro autista.",
    action:
      "Se recomienda de manera prioritaria una evaluación clínica formal y especializada (como la prueba ADOS-2).",
    chip: "bg-brand-coral-25 text-foreground",
  },
];

const afterCards = [
  {
    tag: "0 a 2 puntos — Puntaje Bajo",
    title: "La mayoría de los niños en este rango no presentan indicadores de autismo.",
    bullets: [
      "Resultado de bajo riesgo",
      "Te enviamos recursos de desarrollo infantil gratuitos",
      "Sigue monitoreando los hitos con tu pediatra",
    ],
    accent: "bg-brand-blue-50",
  },
  {
    tag: "3 a 7 puntos — Puntaje Medio",
    title: "Este resultado sugiere señales que vale la pena revisar con un especialista.",
    bullets: [
      "No es un diagnóstico, pero sí una señal de atención",
      "Un especialista de Brilus te contactará para una llamada de orientación",
      "Si se confirman indicadores, te guiamos hacia una evaluación diagnóstica",
    ],
    accent: "bg-brand-amber-25",
  },
  {
    tag: "8 a 20 puntos — Puntaje Alto",
    title: "Un puntaje alto no confirma autismo, pero indica que tu hijo necesita una evaluación formal.",
    bullets: [
      "El equipo de Brilus te contacta en menos de 24 horas hábiles",
      "Te acompañamos para coordinar una evaluación diagnóstica con especialistas certificados",
    ],
    accent: "bg-brand-coral-25",
  },
];

const howFaqs = [
  {
    q: "¿Qué es el M-CHAT-R?",
    a: "El M-CHAT-R es un cuestionario diseñado para que los padres o cuidadores lo completen desde casa. Su objetivo principal es ayudar a identificar de forma oportuna las primeras señales de autismo en niños pequeños de entre 16 y 30 meses de edad. Es una herramienta científica muy sencilla de responder y completamente confidencial.",
  },
  {
    q: "¿Cuánto tiempo toma completarlo?",
    a: "La gran mayoría de las mamás, papás y cuidadores logran responder el cuestionario completo en menos de 5 minutos.",
  },
  {
    q: "¿Qué tipo de preguntas incluye el M-CHAT-R?",
    a: "El M-CHAT-R evalúa conductas del desarrollo temprano asociadas al autismo, incluyendo: Interacción social (ej. ¿muestra interés en otros niños? ¿responde cuando lo llaman por su nombre?); Comunicación (ej. ¿señala con el dedo para pedir algo? ¿usa gestos para comunicarse?); Atención conjunta (ej. ¿mira hacia donde tú señalas?); Patrones sensoriales (ej. ¿reacciona de forma inusual a ruidos o hace movimientos repetitivos?).",
  },
  {
    q: "¿Cómo se calcula la puntuación del test M-CHAT-R?",
    a: "Cada respuesta se califica con 0 o 1 punto, dependiendo de si el comportamiento descrito corresponde al desarrollo esperado o si representa una señal de alerta. El resultado final se calcula sumando las respuestas que indican riesgo, en un rango total de 0 a 20 puntos.",
  },
];

const ScreeningMchat = () => (
  <>
    <SEOHead
      title="Cuestionario M-CHAT-R | Detección temprana de autismo | Brilus"
      description="M-CHAT-R: 20 preguntas en menos de 5 minutos para detectar señales tempranas de autismo en niños de 16 meses a 4 años. Gratis y confidencial."
      canonical="/screening-mchat"
    />
    <NavbarBrilus />

    {/* 1. HERO */}
    <section className="bg-brand-white flex flex-col justify-center section-px pb-16 pt-28 md:min-h-[600px] md:pb-24 md:pt-36">
      <div className="mx-auto grid w-full max-w-5xl gap-8 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-base font-medium uppercase tracking-brilus-ui text-brand-blue">
            M-CHAT-R · DETECCIÓN TEMPRANA AUTISMO
          </p>
          <h1 className="mt-4 text-[32px] font-semibold leading-[1.15] tracking-brilus-ui md:text-[40px]">
            Detecta señales tempranas de autismo en minutos
          </h1>
          <p className="mt-4 max-w-lg text-[16px] leading-[1.6] tracking-brilus-ui text-muted-foreground">
            El M-CHAT-R es un cuestionario de 20 preguntas sobre cómo se comunica, juega e interactúa tu hijo.
            Considerado como el estándar de referencia para la detección temprana de autismo.
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
              src="https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/Diagnostico/Hero%20M-CHAT%20(2).webp"
              alt="M-CHAT-R - Detección temprana de autismo"
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>

    <main className="bg-background">
      {/* 2. ¿ES PARA MI HIJO? */}
      <section className="section-py">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <div className="rounded-[24px] bg-[#FF6B45] px-8 py-10 md:px-12 md:py-12">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-[28px] font-semibold leading-[1.15] tracking-brilus-ui text-white md:text-[32px]">
                  ¿Tu hijo tiene entre 4 y 11 años?
                </h2>

                <p className="mt-4 text-[16px] leading-[1.6] tracking-brilus-ui text-white/95">
                  Realiza el cuestionario CAST, una herramienta de detección de señales de autismo en edad escolar.
                </p>
              </div>

              <Button
                asChild
                variant="outline"
                className="h-14 border-white bg-transparent px-8 text-lg text-white hover:bg-white hover:text-[#FF6B45]"
              >
                <Link to="/screening-cast">Realizar CAST →</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TESTIMONIOS */}
      <TestimonialsSection location="screening" />

      {/* 4. ¿CÓMO FUNCIONA? — ACORDEÓN + TABLA */}
      <section id="como-funciona" className="scroll-mt-16 section-px py-10 md:section-py">
        <div className="mx-auto grid w-full max-w-5xl gap-8 md:grid-cols-[0.9fr_1.6fr] md:items-start md:gap-16">
          <div className="md:block">
            <h2 className="text-[24px] font-semibold leading-[1.05] tracking-brilus-ui text-foreground md:text-[28px] lg:text-[32px]">
              ¿Cómo funciona el M-CHAT-R?
            </h2>

            <img
              src="https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/Diagnostico/M-CHAT/M-CHAT%20Explain.webp"
              alt="Cómo funciona el M-CHAT-R"
              className="mt-6 hidden aspect-[4/3] w-full rounded-brilus-card object-cover md:block"
            />
          </div>

          <div>
            <Accordion type="single" collapsible className="mt-6 divide-y divide-black/10">
              {howFaqs.map((f, i) => (
                <AccordionItem key={i} value={`how-${i}`} className="border-0">
                  <AccordionTrigger className="py-6 pr-0 text-left text-[16px] font-semibold tracking-brilus-ui text-foreground hover:no-underline [&>svg]:hidden">
                    <div className="flex w-full items-center justify-between gap-6">
                      <span>{f.q}</span>
                      <ArrowUpRight className="h-8 w-8 shrink-0 text-foreground/70" />
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="pb-6 text-[16px] leading-[1.65] tracking-brilus-ui text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Tabla de rango de puntaje */}
      <section className="section-px section-py md:py-24">
        <div className="mx-auto w-full max-w-5xl">
          <div>
            <h3 className="text-[24px] leading-[1.3] font-semibold tracking-brilus-ui text-foreground">
              Rango de puntaje
            </h3>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:items-stretch md:gap-4">
              {scoreRows.map((row) => (
                <div
                  key={row.range}
                  className="flex h-full flex-col rounded-brilus-card border border-black/10 bg-white p-10 md:p-12"
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
          <div className="mt-8 rounded-brilus-card border border-brand-amber/30 bg-brand-amber-10/40 p-8 md:p-10">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-brilus-inner bg-brand-amber text-foreground">
                <AlertCircle className="h-5 w-5" />
              </span>
              <div>
                <p className="text-base font-semibold tracking-brilus-ui text-foreground">
                  Nota importante para las familias
                </p>
                <p className="mt-2 text-base tracking-brilus-ui text-foreground/85">
                  El cuestionario M-CHAT-R es una herramienta médica de detección temprana (screening) de alta
                  confianza, pero no constituye un diagnóstico definitivo de autismo. Un puntaje elevado únicamente
                  señala que el niño se vería ampliamente beneficiado al recibir una valoración profunda y profesional
                  por parte de un equipo especializado en neurodesarrollo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ¿QUÉ SUCEDE DESPUÉS? */}
      <section className="section-px section-py md:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-[28px] md:text-[32px] font-semibold leading-[1.2] tracking-brilus-ui text-foreground">
            ¿Qué sucede después de enviar el cuestionario?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-base tracking-brilus-ui text-muted-foreground sm:text-[15px]">
            Una vez que termines el M-CHAT-R, nuestro equipo de especialistas en neurodesarrollo revisará de forma
            confidencial cada una de las respuestas de tu hijo. Nos pondremos en contacto contigo para explicarte
            detalladamente los resultados y guiarte con empatía en los próximos pasos.
          </p>

          <div className="mt-8 flex items-stretch gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0 md:pb-0">
            {afterCards.map((c) => (
              <div
                key={c.tag}
                className={`flex h-full min-h-[280px] w-[82vw] max-w-[340px] shrink-0 snap-start flex-col rounded-brilus-card p-7 md:min-h-0 md:w-auto md:max-w-none md:p-10 ${c.accent}`}
              >
                <p className="text-base font-semibold uppercase tracking-brilus-ui text-foreground/70">{c.tag}</p>
                <h3 className="mt-2 text-[18px] font-semibold leading-[1.3] tracking-brilus-ui text-foreground sm:text-[18px]">
                  {c.title}
                </h3>
                <ul className="mt-6 space-y-4">
                  {c.bullets.map((b) => (
                    <li key={b} className="text-[16px] tracking-brilus-ui text-foreground/85">
                      • {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <ScrollToScreener />
          </div>
        </div>
      </section>
    </main>

    {/* 7. MOTOR DEL SCREENER (no modificar) */}
    <section id={SCREENER_ANCHOR} className="scroll-mt-16">
      <ScreenerFlow config={mchatConfig} skipIntro bypassQuiz />
    </section>

    <main className="bg-background">
      {/* 9. FAQ */}
      <section className="section-px pb-16 md:pb-20">
        <div className="mx-auto w-full max-w-5xl">
          <h2 className="text-[28px] md:text-[32px] font-semibold tracking-brilus-ui text-foreground">
            Preguntas frecuentes
          </h2>
          <Accordion type="single" collapsible className="mt-10">
            {diagnosticoFaqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left py-7 text-[18px] font-semibold tracking-brilus-ui text-foreground">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-[16px] leading-[1.7] tracking-brilus-ui text-muted-foreground">
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

export default ScreeningMchat;
