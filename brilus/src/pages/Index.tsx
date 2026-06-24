import React from "react";
import { SEOHead } from "@/components/SEOHead";
import NavbarBrilus from "@/components/NavbarBrilus";
import HeroSection from "@/components/HeroSection";
import MethodSection from "@/components/MethodSection";
import WebinarVideoSection from "@/components/WebinarVideoSection";
import SupervisionSection from "@/components/SupervisionSection";
import TherapySection from "@/components/TherapySection";
import CallToActionSection from "@/components/CallToActionSection";
import ServicesSection from "@/components/ServicesSection";
import LocationsSection from "@/components/LocationsSection";
import TestimonialsCarouselContacto from "@/components/TestimonialsCarouselContacto";
import ProcessSection from "@/components/ProcessSection";
import QuizCTASection from "@/components/QuizCTASection";
import TargetAudienceSection from "@/components/TargetAudienceSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import HomeServicesSection from "@/components/HomeServicesSection";
import ScrollReveal from "@/components/ScrollReveal";

const Index: React.FC = () => {
  // Structured Data
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Brilus",
      url: "https://somosbrilus.com",
      logo: "https://somosbrilus.com/brilus-logo.svg",
      description:
        "Brilus ofrece terapias ABA personalizadas y supervisión BCBA para niños con autismo y necesidades especiales en México",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        areaServed: "MX",
        availableLanguage: "Spanish",
      },
      sameAs: ["https://www.facebook.com/brilus", "https://www.instagram.com/brilus"],
    },
    {
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "MedicalBusiness"],
      name: "Brilus",
      image: "https://somosbrilus.com/brilus-logo.svg",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Xola n°301, Departamento 3, Colonia del Valle Norte",
        addressLocality: "Ciudad de México",
        addressRegion: "CDMX",
        postalCode: "03103",
        addressCountry: "MX",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "19.3910",
        longitude: "-99.1651",
      },
      url: "https://somosbrilus.com",
      telephone: "+52 55 6215 1706",
      email: "familias@somosbrilus.com",
      priceRange: "$$",
      areaServed: {
        "@type": "City",
        name: "Ciudad de México",
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Qué es la Terapia ABA?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "La Terapia ABA (Análisis Conductual Aplicado) es el método más reconocido y respaldado científicamente para el tratamiento del autismo. En Brilus aplicamos este enfoque con sensibilidad y precisión, adaptándolo a cada niño y su familia.",
          },
        },
        {
          "@type": "Question",
          name: "¿A qué edades atiende Brilus?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "En Brilus acompañamos a niños desde los 18 meses hasta los 18 años que están atravesando desafíos en su desarrollo.",
          },
        },
        {
          "@type": "Question",
          name: "¿Dónde se realizan las terapias?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Las sesiones comienzan en casa, donde el niño se siente seguro. Son lúdicas, estructuradas y respetan su ritmo.",
          },
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Terapia ABA para Autismo",
      provider: {
        "@type": "Organization",
        name: "Brilus",
      },
      areaServed: {
        "@type": "City",
        name: "Ciudad de México",
      },
      description: "Terapias ABA personalizadas con supervisión BCBA certificada para niños con TEA",
      serviceType: "Análisis de Conducta Aplicado (ABA)",
    },
  ];

  return (
    <>
      <SEOHead
        title="Brilus – Terapias ABA para niños con autismo en CDMX"
        description="Terapias ABA con supervisión BCBA en Ciudad de México. Intervención personalizada, acompañamiento familiar y resultados sostenidos. Agenda tu evaluación gratuita hoy."
        canonical="/"
        structuredData={structuredData}
      />
      <div className="flex flex-col min-h-screen w-full bg-white">
        <NavbarBrilus />
        <main className="flex-1">
          <HeroSection />
          <ScrollReveal>
            <ServicesSection />
          </ScrollReveal>
          <ScrollReveal>
            <MethodSection />
          </ScrollReveal>
          <ScrollReveal>
            <HomeServicesSection />
          </ScrollReveal>
          <ScrollReveal variant="fadeIn">
            <SupervisionSection />
          </ScrollReveal>
          <ScrollReveal>
            <TherapySection />
          </ScrollReveal>
          <ScrollReveal variant="scaleUp">
            <CallToActionSection className="my-0 px-24 py-[56px]" />
          </ScrollReveal>
          <ScrollReveal>
            <TargetAudienceSection />
          </ScrollReveal>
          <ScrollReveal variant="scaleUp">
            <QuizCTASection />
          </ScrollReveal>
          <ScrollReveal>
            <ProcessSection />
          </ScrollReveal>
          <ScrollReveal variant="fadeIn">
            <WebinarVideoSection />
          </ScrollReveal>
          <ScrollReveal variant="fadeIn">
            <TestimonialsCarouselContacto />
          </ScrollReveal>
          <ScrollReveal>
            <LocationsSection />
          </ScrollReveal>
          <ScrollReveal variant="fadeIn">
            <NewsletterSection />
          </ScrollReveal>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
