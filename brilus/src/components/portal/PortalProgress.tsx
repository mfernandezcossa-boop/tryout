import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Target, Loader2 } from "lucide-react";

interface PortalProgressProps {
  therapistId: string | null;
}

const CARD_STYLES = [
  { bg: "bg-sky-50", border: "border-sky-200/60", tag: "bg-sky-100 text-sky-700" },
  { bg: "bg-emerald-50", border: "border-emerald-200/60", tag: "bg-emerald-100 text-emerald-700" },
  { bg: "bg-amber-50", border: "border-amber-200/60", tag: "bg-amber-100 text-amber-700" },
];

const PortalProgress = ({ therapistId }: PortalProgressProps) => {
  const { data: modules } = useQuery({
    queryKey: ["portal-modules"],
    queryFn: async () => {
      const { data, error } = await supabase.from("induction_modules").select("*").eq("visible", true).order("module_number");
      if (error) throw error;
      return data;
    },
  });

  const { data: attempts, isLoading } = useQuery({
    queryKey: ["portal-progress", therapistId],
    queryFn: async () => {
      if (!therapistId) return [];
      const { data, error } = await supabase.from("therapist_quiz_attempts").select("*").eq("therapist_id", therapistId).order("completed_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!therapistId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-brand-blue" />
      </div>
    );
  }

  const getModuleStats = (moduleId: string) => {
    if (!attempts) return { best: 0, attempts: 0, passed: false };
    const moduleAttempts = attempts.filter((a) => a.module_id === moduleId);
    if (moduleAttempts.length === 0) return { best: 0, attempts: 0, passed: false };
    const best = Math.max(...moduleAttempts.map((a) => Math.round((a.score / a.total_questions) * 100)));
    return { best, attempts: moduleAttempts.length, passed: best >= 80 };
  };

  const totalModules = modules?.length || 0;
  const passedModules = modules?.filter((m) => getModuleStats(m.id).passed).length || 0;
  const overallProgress = totalModules > 0 ? Math.round((passedModules / totalModules) * 100) : 0;
  const totalAttempts = attempts?.length || 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Mi Progreso</h1>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {[
          { icon: Target, value: `${overallProgress}%`, label: "Progreso general", style: CARD_STYLES[0], iconColor: "text-sky-600" },
          { icon: CheckCircle2, value: `${passedModules}/${totalModules}`, label: "Módulos aprobados", style: CARD_STYLES[1], iconColor: "text-emerald-600" },
          { icon: Clock, value: `${totalAttempts}`, label: "Intentos totales", style: CARD_STYLES[2], iconColor: "text-amber-600" },
        ].map((card, i) => (
          <div key={i} className={`${card.style.bg} border ${card.style.border} rounded-2xl p-5 text-center`}>
            <card.icon className={`h-7 w-7 ${card.iconColor} mx-auto mb-2`} />
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
            <p className="text-xs text-foreground/60 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Module progress list */}
      <div className="bg-background border border-border/50 rounded-2xl p-6">
        <p className="text-sm font-bold text-foreground mb-4">Detalle por módulo</p>
        <div className="space-y-3">
          {modules?.map((mod, idx) => {
            const stats = getModuleStats(mod.id);
            const modStyle = CARD_STYLES[idx % CARD_STYLES.length];
            return (
              <div key={mod.id} className={`${modStyle.bg} border ${modStyle.border} rounded-xl p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-foreground truncate">
                    Módulo {mod.module_number}: {mod.title}
                  </span>
                  {stats.passed && (
                    <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs shrink-0">Aprobado</Badge>
                  )}
                </div>
                <Progress value={stats.best} className="h-2 [&>div]:bg-brand-blue" />
                <div className="flex justify-between mt-1.5">
                  <span className="text-xs text-foreground/50">{stats.attempts} intento(s)</span>
                  <span className={`text-xs font-semibold ${stats.passed ? "text-emerald-600" : "text-foreground/60"}`}>
                    {stats.best}%
                  </span>
                </div>
              </div>
            );
          })}
          {(!modules || modules.length === 0) && (
            <p className="text-center text-muted-foreground py-4">No hay módulos disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortalProgress;
