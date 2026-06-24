import { SEOHead } from "@/components/SEOHead";
import NavbarBrilus from "@/components/NavbarBrilus";
import Footer from "@/components/Footer";
import ScreenerFlow from "@/screener/ScreenerFlow";
import { castConfig } from "@/screener/configs/castConfig";

const TestCast = () => (
  <>
    <SEOHead
      title="CAST — Test de detección de autismo | Brilus"
      description="Completa el cuestionario CAST en 5–10 minutos. 39 preguntas para evaluar señales de autismo en niños de 4 a 11 años."
      canonical="/test-cast"
    />
    <NavbarBrilus />
    <main className="bg-background">
      <ScreenerFlow config={castConfig} />
    </main>
    <Footer />
  </>
);

export default TestCast;
