import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/SEOHead";
import { Shield, Stethoscope, LogOut } from "lucide-react";

export default function RoleSelector() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [isTherapist, setIsTherapist] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth", { replace: true });
        return;
      }

      setUserName(session.user.email?.split("@")[0] || "Usuario");

      const [rolesResult, therapistResult] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", session.user.id),
        supabase.from("therapists").select("id, status").eq("user_id", session.user.id).maybeSingle(),
      ]);

      const roles = rolesResult.data?.map((r) => r.role) || [];
      setIsAdmin(roles.includes("admin"));
      setIsModerator(roles.includes("moderator"));
      setIsTherapist(!!therapistResult.data && therapistResult.data.status === "active");

      const hasAdminAccess = roles.includes("admin") || roles.includes("moderator");
      const hasTherapistAccess = !!therapistResult.data && therapistResult.data.status === "active";
      const isPending = !!therapistResult.data && therapistResult.data.status === "pending";

      // Pending therapists go to waiting page
      if (isPending && !hasAdminAccess) {
        navigate("/pendiente-aprobacion", { replace: true });
        return;
      }

      if (hasAdminAccess && !hasTherapistAccess) {
        navigate("/admin", { replace: true });
        return;
      }
      if (hasTherapistAccess && !hasAdminAccess) {
        navigate("/portal", { replace: true });
        return;
      }
      if (!hasAdminAccess && !hasTherapistAccess) {
        navigate("/", { replace: true });
        return;
      }

      setLoading(false);
    };
    check();
  }, [navigate]);

  const handleSignOut = async () => {
    sessionStorage.removeItem("brilus_session_cache");
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-dvh bg-[#F7F7F8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4686EF]" />
      </div>
    );
  }

  return (
    <>
      <SEOHead title="Seleccionar Portal – Brilus" description="Selecciona tu portal de acceso" noindex />
      <div className="min-h-dvh bg-[#F7F7F8] flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-[#E4E4E4] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/0a327444-85b7-4c66-8131-1bd3175e32ea.png" alt="Brilus" className="h-8" />
            <span className="text-sm text-[#1F1F1F]/50 font-medium">Seleccionar portal</span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm text-[#1F1F1F]/60 hover:text-[#1F1F1F] transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-lg space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-semibold text-[#1F1F1F] tracking-tight">
                Hola, {userName} 👋
              </h1>
              <p className="text-[#1F1F1F]/60 text-sm">
                ¿A dónde quieres ir?
              </p>
            </div>

            <div className="grid gap-4">
              {/* Admin Card */}
              {(isAdmin || isModerator) && (
                <button
                  onClick={() => navigate("/admin")}
                  className="group bg-white rounded-2xl border border-[#E4E4E4] p-6 text-left hover:border-[#4686EF] hover:shadow-lg hover:shadow-[#4686EF]/5 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#4686EF]/10 flex items-center justify-center shrink-0 group-hover:bg-[#4686EF]/15 transition-colors">
                      <Shield className="h-6 w-6 text-[#4686EF]" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-base font-semibold text-[#1F1F1F]">Panel de Administración</h2>
                      <p className="text-sm text-[#1F1F1F]/50">
                        Gestionar contenido, equipo, formularios y configuración general de Brilus.
                      </p>
                    </div>
                  </div>
                </button>
              )}

              {/* Therapist Card */}
              {isTherapist && (
                <button
                  onClick={() => navigate("/portal")}
                  className="group bg-white rounded-2xl border border-[#E4E4E4] p-6 text-left hover:border-[#FC683D] hover:shadow-lg hover:shadow-[#FC683D]/5 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#FC683D]/10 flex items-center justify-center shrink-0 group-hover:bg-[#FC683D]/15 transition-colors">
                      <Stethoscope className="h-6 w-6 text-[#FC683D]" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-base font-semibold text-[#1F1F1F]">Portal de Terapeutas</h2>
                      <p className="text-sm text-[#1F1F1F]/50">
                        Acceder a módulos de inducción, cuestionarios y tu progreso profesional.
                      </p>
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
