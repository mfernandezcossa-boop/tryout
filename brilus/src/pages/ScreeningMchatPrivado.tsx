import { SEOHead } from "@/components/SEOHead";
import ScreenerFlow from "@/screener/ScreenerFlow";
import { mchatConfig } from "@/screener/configs/mchatConfig";

const ScreeningMchatPrivado = () => {
  return (
    <>
      <SEOHead title="M-CHAT-R" description="Acceso privado al cuestionario M-CHAT-R." noindex />
      <ScreenerFlow config={mchatConfig} privateMode />
    </>
  );
};

export default ScreeningMchatPrivado;
