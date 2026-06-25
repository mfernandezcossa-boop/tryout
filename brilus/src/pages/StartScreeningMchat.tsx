import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import NavbarBrilus from "@/components/NavbarBrilus";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";

const StartScreeningMchat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { leadId?: string; screener_id?: string } | null;

  useEffect(() => {
    if (!state?.leadId) {
      navigate("/screening-mchat", { replace: true });
    }
  }, [state, navigate]);

  if (!state?.leadId) return null;

  return (
    <>
      <SEOHead
        title="Gracias — M-CHAT-R | Brilus"
        description="Hemos recibido tus datos. En breve te contactaremos con el acceso al cuestionario M-CHAT-R."
        canonical="/screening-mchat/start-mchat"
        noindex
      />
      <NavbarBrilus />
      <div className="min-h-screen bg-[#F7F7F7] pt-[76px] md:pt-[92px]">
        <div className="mx-auto w-full max-w-5xl px-4 py-10 md:py-16">
          <div className="rounded-[14px] border border-[rgba(0,0,0,0.1)] bg-white p-6 md:p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue/10">
              <CheckCircle2 className="h-7 w-7 text-brand-blue" />
            </div>
            <h1 className="text-[28px] md:text-[32px] font-semibold tracking-[-1px] text-[#1F1F1F]">
              ¡Gracias!
            </h1>
            <p className="mt-4 text-base md:text-[20px] tracking-[-1px] text-[#717182]">
              En breve te contactaremos con acceso al cuestionario.
            </p>
            <p className="mt-3 text-sm md:text-base tracking-[-0.05em] text-[#717182]">
              Hemos recibido tus datos correctamente. Nuestro equipo te enviará el enlace al
              cuestionario M-CHAT-R de forma privada por WhatsApp o correo electrónico.
            </p>
            <Button asChild variant="blue" size="lg" className="mt-8 w-full md:w-auto">
              <Link to="/">Volver al inicio</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StartScreeningMchat;
