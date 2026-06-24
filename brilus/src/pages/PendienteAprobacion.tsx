import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/SEOHead";
import { LogOut, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PendienteAprobacion() {
  const navigate = useNavigate();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const checkStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth", { replace: true });
        return;
      }

      const { data } = await supabase
        .from("therapists")
        .select("status")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (data?.status === "active") {
        navigate("/portal", { replace: true });
      }
    };

    checkStatus();
    interval = setInterval(checkStatus, 5000); // Poll every 5s

    return () => clearInterval(interval);
  }, [navigate]);

  const handleSignOut = async () => {
    sessionStorage.removeItem("brilus_session_cache");
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <>
      <SEOHead title="Solicitud en revisión – Brilus" description="Tu solicitud está siendo revisada" noindex />
      <div className="min-h-dvh bg-[#F7F7F8] flex flex-col">
        <header className="bg-white border-b border-[#E4E4E4] px-6 py-4 flex items-center justify-between">
          <img src="/lovable-uploads/0a327444-85b7-4c66-8131-1bd3175e32ea.png" alt="Brilus" className="h-8" />
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm text-[#1F1F1F]/60 hover:text-[#1F1F1F] transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#FF9C1D]/10 flex items-center justify-center mx-auto">
              <Clock className="h-8 w-8 text-[#FF9C1D]" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-[#1F1F1F] tracking-tight">
                Tu solicitud está en revisión
              </h1>
              <p className="text-[#1F1F1F]/60 text-sm leading-relaxed">
                Hemos recibido tu registro correctamente. Nuestro equipo revisará tu solicitud
                y te notificaremos cuando sea aprobada para que puedas acceder al portal.
              </p>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </main>
      </div>
    </>
  );
}
