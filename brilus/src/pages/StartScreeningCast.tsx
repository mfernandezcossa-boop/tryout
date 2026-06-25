import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import NavbarBrilus from "@/components/NavbarBrilus";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { QuizStep, ClosingStep } from "@/screener/ScreenerFlow";
import { castConfig } from "@/screener/configs/castConfig";

type Phase = "intro" | "quiz" | "closing";

const StartScreeningCast = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { leadId?: string } | null;
  const [phase, setPhase] = useState<Phase>("intro");

  useEffect(() => {
    if (!state?.leadId) {
      navigate("/screening-cast", { replace: true });
    }
  }, [state, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [phase]);

  if (!state?.leadId) return null;

  return (
    <>
      <SEOHead
        title="Iniciar CAST | Brilus"
        description="Comienza el cuestionario CAST para la detección de señales de autismo en edad escolar."
        canonical="/screening-cast/start-cast"
        noindex
      />
      <NavbarBrilus />
      <div className="min-h-screen bg-[#F7F7F7] pt-[76px] md:pt-[92px]">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 md:py-10">
          {phase === "intro" && (
            <div className="rounded-[14px] border border-[rgba(0,0,0,0.1)] bg-white p-6 md:p-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue/10">
                <CheckCircle2 className="h-7 w-7 text-brand-blue" />
              </div>
              <h1 className="text-[28px] md:text-[32px] font-semibold tracking-[-1px] text-[#1F1F1F]">
                ¡Gracias por completar tus datos!
              </h1>
              <p className="mt-4 text-base md:text-[20px] tracking-[-1px] text-[#717182]">
                Cuando estés listo/a, inicia el cuestionario CAST. Toma aproximadamente {castConfig.durationEstimate}.
              </p>
              <Button
                variant="blue"
                size="lg"
                className="mt-8 w-full md:w-auto"
                onClick={() => setPhase("quiz")}
              >
                Iniciar CAST <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <div className="mt-4">
                <Button asChild variant="ghost">
                  <Link to="/">Volver al inicio</Link>
                </Button>
              </div>
            </div>
          )}
          {phase === "quiz" && (
            <QuizStep config={castConfig} leadId={state.leadId} onComplete={() => setPhase("closing")} />
          )}
          {phase === "closing" && <ClosingStep config={castConfig} />}
          {castConfig.footerCopyright && phase !== "intro" && (
            <p className="mt-8 text-center text-xs tracking-[-0.05em] text-[#717182]">
              {castConfig.footerCopyright}
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StartScreeningCast;
