import React from "react";
import { Link } from "react-router-dom";
import { SEOHead } from '@/components/SEOHead';
import NavbarBrilus from "@/components/NavbarBrilus";
import Footer from "@/components/Footer";
import { TeamSection } from "./SobreNosotrosTeam";
import ScrollReveal, { ScrollRevealItem } from "@/components/ScrollReveal";

const SobreNosotros: React.FC = () => {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": "https://somosbrilus.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Sobre Nosotros",
      "item": "https://somosbrilus.com/sobre-nosotros"
    }]

  };

  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Sobre Nosotros - Brilus",
    "description": "Conoce el método Brilus: intervención temprana con supervisión BCBA, terapias ABA personalizadas y acompañamiento familiar real en CDMX.",
    "url": "https://somosbrilus.com/sobre-nosotros"
  };

  return (
    <>
      <SEOHead
        title="Sobre Nosotros – Brilus | Método integral para TEA en CDMX"
        description="Conoce el método Brilus: intervención temprana con supervisión BCBA, terapias ABA personalizadas y acompañamiento familiar real. Agenda una llamada hoy."
        canonical="/sobre-nosotros"
        structuredData={[breadcrumbSchema, aboutPageSchema]} />
      
      <div className="min-h-screen bg-brand-white">
        <NavbarBrilus />

        {/* Hero Section — clean, modern */}
        <section className="relative w-full min-h-[60vh] lg:min-h-[720px] flex items-center justify-center overflow-hidden">
          <img
            src="https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/website_assets/heros/hero_background_sobre_nosotros-_1_.webp"
            alt="Equipo Brilus - Intervención personalizada para niños con autismo"
            className="absolute inset-0 w-full h-full object-cover"
            fetchPriority="high"
            width={1920}
            height={720} />
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
          <div className="relative z-10 w-full section-px section-py text-center max-w-[1100px] mx-auto px-[46px]">
            <ScrollReveal variant="fadeIn" delay={0.2}>
              <p className="text-body-sm text-brand-white/80 mb-5 font-medium uppercase tracking-widest">Nuestro método</p>
            </ScrollReveal>
            <ScrollReveal delay={0.35}>
              <h1 className="text-hero text-brand-white mb-6 text-3xl">
                Intervención personalizada, integral y con acompañamiento real
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.5}>
              <p className="text-body-lg text-brand-white/90 mb-10 max-w-[800px] mx-auto text-lg">
                Acompañamos a cada familia con un enfoque terapéutico humano, coordinado y basado en evidencia. Desde el
                primer contacto, cada decisión se toma con apoyo, cada paso tiene sentido.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.65} variant="scaleUp">
              <Link
                to="/contacto"
                className="inline-flex items-center py-3.5 px-10 bg-brand-white text-brand-black text-body-md rounded-full hover:bg-brand-white/90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-white focus-visible:ring-offset-2 text-sm font-bold">
                
                Habla con un especialista hoy
              </Link>
            </ScrollReveal>
          </div>
        </section>

        {/* Nuestros Inicios Section — clean two-column */}
        <section className="w-full section-px py-20 md:py-28 px-48">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center section-container">
            <ScrollReveal variant="fadeLeft">
              <div>
                <p className="text-body-sm text-brand-black/50 mb-3 uppercase tracking-widest font-semibold">
                  Nuestros Inicios
                </p>
                <h2 className="text-h1 text-brand-black mb-8">Un modelo humano y sostenible para el desarrollo infantil</h2>
                <div className="space-y-5">
                  <p className="text-body-lg text-brand-black/70 leading-relaxed">
                    Brilus nace de la convicción de que la intervención temprana en niños y niñas con necesidades especiales
                    debe ir más allá de protocolos rígidos: necesita ser personalizada, integral y con acompañamiento real.
                  </p>
                  <p className="text-body-lg text-brand-black/70 leading-relaxed">
                    Fundada por un equipo con trayectoria en análisis de conducta aplicado (ABA) y terapias del desarrollo, la
                    plataforma integra herramientas visuales, reportes en tiempo real y comunicación continua entre familias,
                    profesionales y supervisores clínicos.
                  </p>
                  <p className="text-body-lg text-brand-black/70 leading-relaxed">
                    Nuestra misión: transformar la experiencia terapéutica en un proceso coordinado, transparente y centrado
                    en las personas, no solo en los diagnósticos.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="fadeRight" delay={0.15}>
              <div className="flex justify-center">
                <div className="w-full rounded-3xl overflow-hidden">
                  <img
                    src="https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/sign/Photos/Nuestro%20metodo/Group.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wNDhkOTJlZC00ODk0LTQzY2UtYjllYy03MzU5ZjgyZTNkZGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQaG90b3MvTnVlc3RybyBtZXRvZG8vR3JvdXAuc3ZnIiwiaWF0IjoxNzYwMzcyMDEzLCJleHAiOjE3OTE5MDgwMTN9.ChrdaVEDPkwz37nsNscQPQpKMugaZSz9cPtstkeUUIo"
                    alt="Infografía del proceso terapéutico integral de Brilus"
                    width={600}
                    height={400}
                    loading="lazy"
                    className="w-full h-auto object-cover" />
                  
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Nuestra Propuesta Section — light subtle background */}
        <section className="w-full section-px py-20 md:py-28 bg-[#F7F8FA] px-48">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center section-container">
            <ScrollReveal variant="fadeLeft" className="order-2 md:order-1">
              <div className="flex justify-center">
                <img
                  src="https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/sign/Photos/Nuestro%20metodo/Image.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wNDhkOTJlZC00ODk0LTQzY2UtYjllYy03MzU5ZjgyZTNkZGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQaG90b3MvTnVlc3RybyBtZXRvZG8vSW1hZ2Uuc3ZnIiwiaWF0IjoxNzYwMzc1MTk5LCJleHAiOjE3OTE5MTExOTl9.WoZYiUZAK2opuOl_NnRTLEJXHUQX1iUiNjf_vJgGMTg"
                  alt="Analista de conducta certificada BCBA supervisando equipo terapéutico"
                  width={800}
                  height={600}
                  loading="lazy"
                  className="w-full h-auto max-w-[700px] object-contain" />
                
              </div>
            </ScrollReveal>
            <ScrollReveal variant="fadeRight" className="order-1 md:order-2">
              <div>
                <p className="text-body-sm text-brand-black/50 mb-3 uppercase tracking-widest font-semibold">
                  Nuestra propuesta
                </p>
                <h2 className="text-h2 text-brand-black mb-8">Lo que nos distingue</h2>
                <ul className="space-y-6 max-w-[820px]">
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 flex-shrink-0 mt-0.5 bg-brand-black rounded-xl flex items-center justify-center p-2">
                      <img
                        src="https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/sign/Photos/Nuestro%20metodo/ni-rocket.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wNDhkOTJlZC00ODk0LTQzY2UtYjllYy03MzU5ZjgyZTNkZGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQaG90b3MvTnVlc3RybyBtZXRvZG8vbmktcm9ja2V0LnN2ZyIsImlhdCI6MTc2MDQ3Njc3NiwiZXhwIjoxNzkyMDEyNzc2fQ.h03AvL3g-Pp_L4AVC53fc8a3jkppeDOraZAXznY65Lg"
                        alt=""
                        className="w-full h-full object-contain invert" />
                      
                    </div>
                    <p className="text-body-lg text-brand-black/80 font-medium leading-snug">
                      Supervisión clínica de equipos terapéuticos y planificación de objetivos.
                    </p>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 flex-shrink-0 mt-0.5 bg-brand-black rounded-xl flex items-center justify-center p-2">
                      <img
                        src="https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/sign/Photos/Nuestro%20metodo/ni-house-laptop.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wNDhkOTJlZC00ODk0LTQzY2UtYjllYy03MzU5ZjgyZTNkZGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQaG90b3MvTnVlc3RybyBtZXRvZG8vbmktaG91c2UtbGFwdG9wLnN2ZyIsImlhdCI6MTc2MDQ3NjczMSwiZXhwIjoxNzkyMDEyNzMxfQ.GcocnvFs7iqwm7Pt1lpbBwl0JNrtN0qFrH2GyDFntgw"
                        alt=""
                        className="w-full h-full object-contain invert" />
                      
                    </div>
                    <p className="text-body-lg text-brand-black/80 font-medium leading-snug">
                      Integración entre enfoques ABA y terapias del desarrollo infantil.
                    </p>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 flex-shrink-0 mt-0.5 bg-brand-black rounded-xl flex items-center justify-center p-2">
                      <img
                        src="https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/sign/Photos/Nuestro%20metodo/ni-link.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wNDhkOTJlZC00ODk0LTQzY2UtYjllYy03MzU5ZjgyZTNkZGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQaG90b3MvTnVlc3RybyBtZXRvZG8vbmktbGluay5zdmciLCJpYXQiOjE3NjA0NzY3NDYsImV4cCI6MTc5MjAxMjc0Nn0.Fy5mf9Ak3Gzayb1iABuuvJUKWMIfcBhtv7BiBKH1Gtg"
                        alt=""
                        className="w-full h-full object-contain invert" />
                      
                    </div>
                    <p className="text-body-lg text-brand-black/80 font-medium leading-snug">
                      Comunicación con familias y coordinación multidisciplinaria.
                    </p>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 flex-shrink-0 mt-0.5 bg-brand-black rounded-xl flex items-center justify-center p-2">
                      <img
                        src="https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/sign/Photos/Nuestro%20metodo/ni-reference.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wNDhkOTJlZC00ODk0LTQzY2UtYjllYy03MzU5ZjgyZTNkZGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQaG90b3MvTnVlc3RybyBtZXRvZG8vbmktcmVmZXJlbmNlLnN2ZyIsImlhdCI6MTc2MDQ3Njc1NCwiZXhwIjoxNzkyMDEyNzU0fQ.UCbfVwlwQbFaMPibp2e7-rcvMDYorGatGLXj2xqNTr4"
                        alt=""
                        className="w-full h-full object-contain invert" />
                      
                    </div>
                    <p className="text-body-lg text-brand-black/80 font-medium leading-snug">
                      Implementación de protocolos basados en evidencia clínica.
                    </p>
                  </li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Nuestra BCBA Section */}
        <section className="w-full section-px py-20 md:py-28 px-48">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center section-container">
            <ScrollReveal variant="fadeLeft">
              <div>
                <p className="text-body-sm text-brand-black/50 mb-3 uppercase tracking-widest font-semibold">
                  Nuestra BCBA
                </p>
                <h2 className="text-h1 text-brand-black mb-8">Liderazgo clínico con experiencia internacional</h2>
                <div className="space-y-5">
                  <p className="text-body-lg text-brand-black/70 leading-relaxed">
                    En Brilus, la calidad de cada intervención está guiada por una Board Certified Behavior Analyst (BCBA) con
                    más de 8 años de experiencia internacional en programas de intervención ABA. Su enfoque une lo mejor de la
                    evidencia científica con una mirada profundamente humana: crear planes terapéuticos que realmente
                    transformen la vida de los niños y sus familias.
                  </p>
                  <p className="text-body-lg text-brand-black/70 leading-relaxed">
                    Acompaña a nuestro equipo y a los padres en cada paso, asegurando que cada objetivo tenga un propósito
                    real: mejorar la calidad de vida, no solo cumplir protocolos.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="fadeRight" delay={0.15}>
              <div className="flex justify-center">
                <div className="w-full rounded-3xl overflow-hidden">
                  <img
                    src="https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/sign/Photos/Nuestro%20metodo/about-our-team.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wNDhkOTJlZC00ODk0LTQzY2UtYjllYy03MzU5ZjgyZTNkZGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQaG90b3MvTnVlc3RybyBtZXRvZG8vYWJvdXQtb3VyLXRlYW0uc3ZnIiwiaWF0IjoxNzYwMzgyNzgwLCJleHAiOjE3OTE5MTg3ODB9.c1BzuixSoLf49f9vGqqGmQtvpMAVRSjaJPWmT1h0FFE"
                    alt="Directora clínica BCBA con 8 años de experiencia internacional"
                    width={600}
                    height={400}
                    loading="lazy"
                    className="w-full h-auto object-cover" />
                  
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Misión y Visión Section — clean cards */}
        <section className="w-full section-px py-20 md:py-28 bg-[#F7F8FA]">
          <div className="section-container">
            <ScrollReveal>
              <div className="text-center mb-14">
                <p className="text-body-sm text-brand-black/50 mb-3 uppercase tracking-widest font-semibold">
                  Nuestra dirección
                </p>
                <h2 className="text-h1 text-brand-black max-w-[700px] mx-auto">
                  Misión y Visión
                </h2>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <ScrollReveal variant="fadeLeft" delay={0.1}>
                <div className="bg-brand-white rounded-3xl p-8 md:p-10 border border-brand-grey px-24 py-48">
                  <div className="w-12 h-12 rounded-2xl bg-brand-coral/10 flex items-center justify-center mb-6">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--brand-coral))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <h3 className="text-h3 text-brand-black mb-4">Nuestra misión</h3>
                  <p className="text-body-lg text-brand-black/70 leading-relaxed">
                    Brilus nace para ofrecer intervención temprana personalizada, integral y con acompañamiento real. Nuestro
                    modelo integra análisis de conducta aplicado (ABA), terapias del desarrollo y supervisión clínica
                    continua, todo centrado en la familia y basado en evidencia científica. Trabajamos para que cada niño y
                    niña alcance su máximo potencial en un entorno de respeto, claridad y coordinación entre profesionales.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fadeRight" delay={0.2}>
                <div className="bg-brand-white rounded-3xl p-8 md:p-10 border border-brand-grey px-24 py-48">
                  <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center mb-6">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--brand-blue))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <h3 className="text-h3 text-brand-black mb-4">Nuestra visión</h3>
                  <p className="text-body-lg text-brand-black/70 leading-relaxed">
                    Queremos ser referente en intervención temprana en Latinoamérica: un ecosistema digital que conecta
                    familias, profesionales y comunidades bajo un modelo claro, humano y sostenible. Visualizamos un futuro
                    donde cada familia tenga acceso a herramientas de calidad, seguimiento continuo y un equipo
                    multidisciplinario coordinado que acompañe cada etapa del desarrollo infantil con empatía y
                    profesionalismo.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Nuestros Principios Section — card style like reference */}
        <section className="w-full section-px py-20 md:py-28">
          <div className="section-container">
            <ScrollReveal>
              <div className="text-center mb-14">
                <p className="text-body-sm text-brand-black/50 mb-3 uppercase tracking-widest font-semibold">
                  Nuestros principios
                </p>
                <h2 className="text-h1 text-brand-black max-w-[900px] mx-auto">
                  Colaboración, Excelencia y Confianza
                </h2>
                <p className="text-body-lg text-brand-black/60 mt-4 max-w-[600px] mx-auto">
                  Los pilares que guían cada paso en Brilus
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="staggerChildren">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <ScrollRevealItem>
                  <div className="text-center">
                    <div className="aspect-[4/3] w-full bg-brand-black rounded-3xl flex items-center justify-center mb-5 overflow-hidden p-4">
                      <img
                        src="https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/sign/Photos/Nuestro%20metodo/Icon.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wNDhkOTJlZC00ODk0LTQzY2UtYjllYy03MzU5ZjgyZTNkZGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQaG90b3MvTnVlc3RybyBtZXRvZG8vSWNvbi5zdmciLCJpYXQiOjE3NjA0NDc1MTAsImV4cCI6MTc5MTk4MzUxMH0.7OJlVRTPXuFgZX7UGNMKogKEmPBADNipd-gikUiMiJs"
                        alt="Ícono colaboración"
                        className="w-3/4 h-3/4 object-contain invert"
                        loading="lazy" />
                    </div>
                    <h3 className="text-h4 text-brand-black mb-2">Colaboración Integral</h3>
                    <p className="text-body-md text-brand-black/60 leading-relaxed">
                      Trabajamos en red: familias, terapeutas, supervisores clínicos y otros profesionales comparten información
                      en tiempo real para tomar decisiones más informadas y coordinadas.
                    </p>
                  </div>
                </ScrollRevealItem>

                <ScrollRevealItem>
                  <div className="text-center">
                    <div className="aspect-[4/3] w-full bg-brand-amber/20 rounded-3xl flex items-center justify-center mb-5 overflow-hidden p-4">
                      <img
                        src="https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/sign/Photos/Nuestro%20metodo/Icon%20-%20Excelencia%20con%20calidez.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wNDhkOTJlZC00ODk0LTQzY2UtYjllYy03MzU5ZjgyZTNkZGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQaG90b3MvTnVlc3RybyBtZXRvZG8vSWNvbiAtIEV4Y2VsZW5jaWEgY29uIGNhbGlkZXouc3ZnIiwiaWF0IjoxNzYwMzcyNzE3LCJleHAiOjE3OTE5MDg3MTd9.kiQ7WkR7dGJfyGl46xMEydYlcVkcMqLPVC127f_NdZ0"
                        alt="Ícono excelencia"
                        className="w-3/4 h-3/4 object-contain"
                        loading="lazy" />
                    </div>
                    <h3 className="text-h4 text-brand-black mb-2">Excelencia en calidad</h3>
                    <p className="text-body-md text-brand-black/60 leading-relaxed">
                      Nuestra plataforma integra herramientas basadas en evidencia científica, con protocolos supervisados por
                      analistas certificados (BCBA) y profesionales con experiencia internacional.
                    </p>
                  </div>
                </ScrollRevealItem>

                <ScrollRevealItem>
                  <div className="text-center">
                    <div className="aspect-[4/3] w-full bg-brand-black rounded-3xl flex items-center justify-center mb-5 overflow-hidden p-4">
                      <img
                        src="https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/sign/Photos/Nuestro%20metodo/Icon%20-%20Confianza%20compartida.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wNDhkOTJlZC00ODk0LTQzY2UtYjllYy03MzU5ZjgyZTNkZGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQaG90b3MvTnVlc3RybyBtZXRvZG8vSWNvbiAtIENvbmZpYW56YSBjb21wYXJ0aWRhLnN2ZyIsImlhdCI6MTc2MDQ0NzQ2NCwiZXhwIjoxNzkxOTgzNDY0fQ.2CUWnivrsEDYGeezcFrqA9oUJIfOXrAuhdX0jTpO-Ko"
                        alt="Ícono confianza"
                        className="w-3/4 h-3/4 object-contain invert"
                        loading="lazy" />
                    </div>
                    <h3 className="text-h4 text-brand-black mb-2">Confianza compartida</h3>
                    <p className="text-body-md text-brand-black/60 leading-relaxed">
                      Mantenemos transparencia en cada etapa del proceso: desde el diagnóstico inicial hasta el seguimiento
                      semanal. Las familias tienen acceso a toda la información clínica y evolutiva de sus hijos en un solo
                      lugar.
                    </p>
                  </div>
                </ScrollRevealItem>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* El Método Brilus CTA — clean split */}
        <section className="w-full section-px py-20 md:py-28 bg-brand-black px-48">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center section-container">
            <ScrollReveal variant="fadeLeft">
              <div>
                <p className="text-body-sm text-brand-white/50 mb-3 uppercase tracking-widest font-semibold">El Método Brilus</p>
                <h2 className="text-h1 text-brand-white mb-6">
                  Explorá el enfoque Brilus: claridad, contención y desarrollo
                </h2>
                <p className="text-body-lg text-brand-white/70 mb-10 leading-relaxed">
                  Nuestro método integra diagnóstico visual, planificación personalizada, seguimiento continuo y
                  comunicación fluida entre todos los actores del proceso terapéutico.
                </p>
                <Link
                  to="/contacto"
                  className="inline-flex items-center px-10 py-3.5 bg-brand-white text-brand-black text-body-md font-semibold rounded-full hover:bg-brand-white/90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-white focus-visible:ring-offset-2">
                  
                  Ver más sobre el método
                </Link>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="fadeRight" delay={0.15}>
              <div className="rounded-3xl overflow-hidden">
                <img
                  src="https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/sign/Photos/Nuestro%20metodo/Images/pexels-ismael-sanchez-200407-16068292.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wNDhkOTJlZC00ODk0LTQzY2UtYjllYy03MzU5ZjgyZTNkZGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQaG90b3MvTnVlc3RybyBtZXRvZG8vSW1hZ2VzL3BleGVscy1pc21hZWwtc2FuY2hlei0yMDA0MDctMTYwNjgyOTIud2VicCIsImlhdCI6MTc2MDM3NDM0NiwiZXhwIjoxNzkxOTEwMzQ2fQ.tWDArknNUQOUOqebR1WZJUE3sDuT6IPRKq6Xmn2t328"
                  alt="Niño en terapia"
                  className="w-full h-full aspect-[4/3] object-cover"
                  loading="lazy" />
                
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Nuestro Equipo Section */}
        <section className="w-full section-px py-20 md:py-28">
          <div className="section-container">
            <ScrollReveal>
              <div className="text-center mb-14">
                <p className="text-body-sm text-brand-black/50 mb-3 uppercase tracking-widest font-semibold">
                  Nuestro equipo
                </p>
                <h2 className="text-h1 text-brand-black mb-4">Nuestro equipo multidisciplinario de profesionales</h2>
                <p className="text-body-lg text-brand-black/60 max-w-[800px] mx-auto">
                  Un grupo de analistas de conducta, terapeutas ocupacionales, fonoaudiólogos y psicopedagogos con experiencia
                  en intervención temprana, todos coordinados bajo supervisión clínica continua.
                </p>
              </div>
            </ScrollReveal>
            <TeamSection />
          </div>
        </section>

        <Footer />
      </div>
    </>);

};
export default SobreNosotros;