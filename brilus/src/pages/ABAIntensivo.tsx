import { SEOHead } from "@/components/SEOHead";
import { ABANavbar } from "@/components/aba-intensivo/ABANavbar";
import Footer from "@/components/Footer";
import { ABAHeroSection } from "@/components/aba-intensivo/ABAHeroSection";
import { ABAProgramSection } from "@/components/aba-intensivo/ABAProgramSection";
import { ABATargetSection } from "@/components/aba-intensivo/ABATargetSection";
import QuizCTASection from "@/components/QuizCTASection";
import { ABAPricingSection } from "@/components/aba-intensivo/ABAPricingSection";
import { ABAPromoSection } from "@/components/aba-intensivo/ABAPromoSection";
import { ABAProcessSection } from "@/components/aba-intensivo/ABAProcessSection";

import LocationsSection from "@/components/LocationsSection";
import { ABAConditionsSection } from "@/components/aba-intensivo/ABAConditionsSection";
import { ABAFinalCTASection } from "@/components/aba-intensivo/ABAFinalCTASection";
import { ABATestimonialsSection } from "@/components/aba-intensivo/ABATestimonialsSection";
import { ABAFAQsSection } from "@/components/aba-intensivo/ABAFAQsSection";
const ABAIntensivo = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Programa Intensivo Brilus de Desarrollo Integral ABA",
    "provider": {
      "@type": "Organization",
      "name": "Brilus",
      "url": "https://somosbrilus.com"
    },
    "description": "Programa de terapia ABA intensivo con supervisión de expertas BCBA/BCaBA certificadas en EE.UU. 20 horas semanales de intervención en casa o escuela.",
    "areaServed": {
      "@type": "City",
      "name": "Ciudad de México"
    },
    "serviceType": "Terapia ABA",
    "offers": {
      "@type": "Offer",
      "price": "11999",
      "priceCurrency": "MXN",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "11999",
        "priceCurrency": "MXN",
        "unitText": "mes"
      }
    }
  };
  return <>
      <SEOHead title="Programa Intensivo ABA | Terapia en Casa y Escuela | Brilus" description="Programa de terapia ABA intensivo con 20 hrs/semana. Supervisión por expertas BCBA/BCaBA de EE.UU. Intervención en casa o escuela. Back to School: 50% de descuento en valoración inicial." canonical="/aba-intensivo" structuredData={structuredData} />
      <div className="min-h-screen bg-background">
        <ABANavbar />
        <main className="space-y-6 md:space-y-8 lg:space-y-10">
          <ABAHeroSection />
          {/* 1. Qué es */}
          <div id="programa">
            <ABAProgramSection />
          </div>
          {/* 2. Para quiénes */}
          <ABATargetSection />
          {/* 3. Quiz */}
          <div id="quiz">
            <QuizCTASection />
          </div>
          {/* 4. Precios (full width) */}
          <div id="precios">
            <ABAPricingSection />
          </div>
          {/* 5. Descuento */}
          <div id="promo">
            <ABAPromoSection />
          </div>
          {/* 6. Proceso */}
          <div id="proceso">
            <ABAProcessSection />
          </div>
          {/* 8. Dónde operamos */}
          <div id="zonas">
            <LocationsSection />
          </div>
          {/* 9. Condiciones */}
          <ABAConditionsSection />
          {/* 10. Testimonios */}
          <ABATestimonialsSection />
          {/* 11. FAQs */}
          <div id="faqs">
            <ABAFAQsSection />
          </div>
          <ABAFinalCTASection />
        </main>
        <Footer />
      </div>
    </>;
};
export default ABAIntensivo;