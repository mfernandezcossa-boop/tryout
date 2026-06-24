import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Mail, Phone, Calendar, CheckCircle2, Target, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface PortalProfileProps {
  therapistId: string | null;
}

const CARD_STYLES = [
  { bg: "bg-sky-50", border: "border-sky-200/60", tag: "bg-sky-100 text-sky-700" },
  { bg: "bg-amber-50", border: "border-amber-200/60", tag: "bg-amber-100 text-amber-700" },
  { bg: "bg-emerald-50", border: "border-emerald-200/60", tag: "bg-emerald-100 text-emerald-700" },
];

const PortalProfile = ({ therapistId }: PortalProfileProps) => {
  const { user, profile } = useAuth();

  const { data: therapist, isLoading: loadingTherapist } = useQuery({
    queryKey: ["portal-profile-therapist", therapistId],
    queryFn: async () => {
      if (!therapistId) return null;
      const { data, error } = await supabase.from("therapists").select("*").eq("id", therapistId).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!therapistId,
  });

  const { data: modules } = useQuery({
    queryKey: ["portal-profile-modules"],
    queryFn: async () => {
      const { data, error } = await supabase.from("induction_modules").select("id, module_number, title").eq("visible", true).order("module_number");
      if (error) throw error;
      return data;
    },
  });

  const { data: attempts } = useQuery({
    queryKey: ["portal-profile-attempts", therapistId],
    queryFn: async () => {
      if (!therapistId) return [];
      const { data, error } = await supabase.from("therapist_quiz_attempts").select("module_id, score, total_questions").eq("therapist_id", therapistId);
      if (error) throw error;
      return data;
    },
    enabled: !!therapistId,
  });

  if (loadingTherapist) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-brand-blue" />
      </div>
    );
  }

  const statusMap: Record<string, { label: string; color: string }> = {
    active: { label: "Activo", color: "bg-emerald-100 text-emerald-700" },
    pending: { label: "Pendiente", color: "bg-amber-100 text-amber-700" },
    inactive: { label: "Inactivo", color: "bg-muted text-muted-foreground" },
  };
  const status = statusMap[therapist?.status || "pending"] || statusMap.pending;

  const totalModules = modules?.length || 0;
  const getModuleBest = (moduleId: string) => {
    if (!attempts) return 0;
    const modAttempts = attempts.filter((a) => a.module_id === moduleId);
    if (modAttempts.length === 0) return 0;
    return Math.max(...modAttempts.map((a) => Math.round((a.score / a.total_questions) * 100)));
  };
  const passedModules = modules?.filter((m) => getModuleBest(m.id) >= 80).length || 0;
  const overallProgress = totalModules > 0 ? Math.round((passedModules / totalModules) * 100) : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Mi Perfil</h1>

      {/* Personal info card */}
      <div className={`${CARD_STYLES[0].bg} border ${CARD_STYLES[0].border} rounded-2xl p-6`}>
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${CARD_STYLES[0].tag}`}>
            Información Personal
          </span>
          <Badge className={`${status.color} text-xs border-0`}>{status.label}</Badge>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start gap-5">

          <div className="flex-1 space-y-3">
            <p className="text-lg font-bold text-foreground">
              {therapist?.full_name || profile?.display_name || "Sin nombre"}
            </p>

            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div className="flex items-center gap-2 text-foreground/70">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate">{therapist?.email || user?.email || "—"}</span>
              </div>
              {therapist?.phone && (
                <div className="flex items-center gap-2 text-foreground/70">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{therapist.phone}</span>
                </div>
              )}
              {therapist?.hire_date && (
                <div className="flex items-center gap-2 text-foreground/70">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span>Desde {format(new Date(therapist.hire_date), "MMMM yyyy", { locale: es })}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress summary card */}
      <div className={`${CARD_STYLES[1].bg} border ${CARD_STYLES[1].border} rounded-2xl p-6`}>
        <div className="flex items-center gap-2 mb-5">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${CARD_STYLES[1].tag}`}>
            Resumen de Progreso
          </span>
        </div>

        {/* Overall progress bar */}
        <div className="mb-5">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-foreground/70">Progreso general</span>
            <span className="font-bold text-foreground">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-3 [&>div]:bg-brand-blue" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="text-center p-3 rounded-xl bg-background/60">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-foreground">{passedModules}/{totalModules}</p>
            <p className="text-xs text-foreground/60">Módulos aprobados</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-background/60">
            <Clock className="h-5 w-5 text-amber-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-foreground">{attempts?.length || 0}</p>
            <p className="text-xs text-foreground/60">Intentos totales</p>
          </div>
        </div>

        {/* Mini module list */}
        {modules && modules.length > 0 && (
          <div className="space-y-1.5">
            {modules.map((mod) => {
              const best = getModuleBest(mod.id);
              const passed = best >= 80;
              return (
                <div key={mod.id} className="flex items-center justify-between py-2 px-3 rounded-xl bg-background/40 text-sm">
                  <span className="text-foreground/70 truncate">
                    {mod.module_number}. {mod.title}
                  </span>
                  {passed ? (
                    <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs shrink-0">{best}%</Badge>
                  ) : best > 0 ? (
                    <span className="text-xs text-foreground/50 shrink-0">{best}%</span>
                  ) : (
                    <span className="text-xs text-foreground/40 shrink-0">—</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortalProfile;
