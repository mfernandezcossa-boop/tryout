import { SEOHead } from "@/components/SEOHead";
import NavbarBrilus from "@/components/NavbarBrilus";
import Footer from "@/components/Footer";
import ScreenerFlow from "@/screener/ScreenerFlow";
import { mchatConfig } from "@/screener/configs/mchatConfig";

const TestMchat = () => (
  <>
    <SEOHead
      title="M-CHAT-R — Test de detección de autismo | Brilus"
      description="Completa el cuestionario M-CHAT-R en menos de 5 minutos. 20 preguntas para detectar señales tempranas de autismo en niños de 16 meses a 4 años."
      canonical="/test-mchat"
    />
    <NavbarBrilus />
    <main className="bg-background">
      <ScreenerFlow config={mchatConfig} skipIntro bypassQuiz />
    </main>
    <Footer />
  </>
);

export default TestMchat;
