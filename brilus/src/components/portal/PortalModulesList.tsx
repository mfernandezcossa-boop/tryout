import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle2, Loader2 } from "lucide-react";

interface PortalModulesListProps {
  therapistId: string | null;
  onSelectModule: (moduleId: string) => void;
}

const CARD_STYLES = [
  { bg: "bg-sky-50", border: "border-sky-200/60", tag: "bg-sky-100 text-sky-700" },
  { bg: "bg-amber-50", border: "border-amber-200/60", tag: "bg-amber-100 text-amber-700" },
  { bg: "bg-emerald-50", border: "border-emerald-200/60", tag: "bg-emerald-100 text-emerald-700" },
  { bg: "bg-rose-50", border: "border-rose-200/60", tag: "bg-rose-100 text-rose-700" },
  { bg: "bg-violet-50", border: "border-violet-200/60", tag: "bg-violet-100 text-violet-700" },
  { bg: "bg-orange-50", border: "border-orange-200/60", tag: "bg-orange-100 text-orange-700" },
  { bg: "bg-teal-50", border: "border-teal-200/60", tag: "bg-teal-100 text-teal-700" },
  { bg: "bg-pink-50", border: "border-pink-200/60", tag: "bg-pink-100 text-pink-700" },
];

const PortalModulesList = ({ therapistId, onSelectModule }: PortalModulesListProps) => {
  const { data: modules, isLoading: modulesLoading } = useQuery({
    queryKey: ["portal-modules"],
    queryFn: async () => {
      const { data, error } = await supabase.from("induction_modules").select("*").eq("visible", true).order("module_number");
      if (error) throw error;
      return data;
    },
  });

  const { data: attempts } = useQuery({
    queryKey: ["portal-attempts", therapistId],
    queryFn: async () => {
      if (!therapistId) return [];
      const { data, error } = await supabase.from("therapist_quiz_attempts").select("module_id, score, total_questions").eq("therapist_id", therapistId);
      if (error) throw error;
      return data;
    },
    enabled: !!therapistId,
  });

  if (modulesLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-brand-blue" />
      </div>
    );
  }

  const getBestScore = (moduleId: string) => {
    if (!attempts) return null;
    const moduleAttempts = attempts.filter((a) => a.module_id === moduleId);
    if (moduleAttempts.length === 0) return null;
    return Math.max(...moduleAttempts.map((a) => Math.round((a.score / a.total_questions) * 100)));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Módulos de Inducción</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules?.map((mod, idx) => {
          const best = getBestScore(mod.id);
          const passed = best !== null && best >= 80;
          const style = CARD_STYLES[idx % CARD_STYLES.length];
          return (
            <div
              key={mod.id}
              className={`${style.bg} border ${style.border} rounded-2xl p-5 cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:shadow-md flex flex-col justify-between min-h-[180px]`}
              onClick={() => onSelectModule(mod.id)}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${style.tag}`}>
                    Módulo {mod.module_number}
                  </span>
                  {passed && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                </div>
                <p className="font-bold text-foreground leading-snug">{mod.title}</p>
                {mod.description && (
                  <p className="text-sm text-foreground/60 mt-1.5 line-clamp-2">{mod.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground/50 mt-4">
                <BookOpen className="h-3.5 w-3.5" />
                {best !== null ? (
                  <span>Mejor puntaje: <strong className={passed ? "text-emerald-600" : "text-foreground/70"}>{best}%</strong></span>
                ) : (
                  <span>Sin intentos</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {(!modules || modules.length === 0) && (
        <p className="text-center text-muted-foreground py-12">No hay módulos disponibles aún.</p>
      )}
    </div>
  );
};

export default PortalModulesList;
