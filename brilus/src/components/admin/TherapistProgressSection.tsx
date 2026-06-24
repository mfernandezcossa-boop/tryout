import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, XCircle, Users, BookOpen, TrendingUp } from "lucide-react";

const CARD_COLORS = [
  "bg-sky-100 dark:bg-sky-900/40",
  "bg-amber-100 dark:bg-amber-900/40",
  "bg-emerald-100 dark:bg-emerald-900/40",
  "bg-rose-100 dark:bg-rose-900/40",
  "bg-violet-100 dark:bg-violet-900/40",
  "bg-teal-100 dark:bg-teal-900/40",
  "bg-orange-100 dark:bg-orange-900/40",
  "bg-lime-100 dark:bg-lime-900/40",
];

export function TherapistProgressSection() {
  const [selectedTherapistId, setSelectedTherapistId] = useState<string | null>(null);

  const { data: therapists = [] } = useQuery({
    queryKey: ["therapists"],
    queryFn: async () => {
      const { data, error } = await supabase.from("therapists").select("id, full_name, status").order("full_name");
      if (error) throw error;
      return data;
    },
  });

  const { data: modules = [] } = useQuery({
    queryKey: ["induction-modules"],
    queryFn: async () => {
      const { data, error } = await supabase.from("induction_modules").select("id, module_number, title").order("module_number");
      if (error) throw error;
      return data;
    },
  });

  const { data: allAttempts = [] } = useQuery({
    queryKey: ["all-quiz-attempts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("therapist_quiz_attempts").select("*").order("completed_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const summaries = therapists.map((t) => {
    const ta = allAttempts.filter((a) => a.therapist_id === t.id);
    const uniqueModules = new Set(ta.map((a) => a.module_id));
    const totalScore = ta.reduce((s, a) => s + (a.score / a.total_questions) * 100, 0);
    const avgScore = ta.length > 0 ? Math.round(totalScore / ta.length) : 0;
    const lastAttempt = ta.length > 0 ? ta[0].completed_at : null;
    return { id: t.id, full_name: t.full_name, status: t.status, completedModules: uniqueModules.size, totalModules: modules.length, avgScore, lastAttempt };
  });

  // Detail view
  if (selectedTherapistId) {
    const therapist = therapists.find((t) => t.id === selectedTherapistId);
    const tAttempts = allAttempts.filter((a) => a.therapist_id === selectedTherapistId);

    return (
      <div>
        <Button variant="ghost" onClick={() => setSelectedTherapistId(null)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver
        </Button>
        <h2 className="text-3xl font-bold tracking-tight mb-1">{therapist?.full_name}</h2>
        <p className="text-muted-foreground mb-6">Detalle de progreso por módulo</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod, idx) => {
            const modAttempts = tAttempts.filter((a) => a.module_id === mod.id).sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
            const bestAttempt = modAttempts.length > 0 ? modAttempts.reduce((best, a) => (a.score / a.total_questions > best.score / best.total_questions ? a : best)) : null;

            return (
              <div key={mod.id} className={`${CARD_COLORS[idx % CARD_COLORS.length]} rounded-2xl p-5 min-h-[140px] flex flex-col justify-between`}>
                <div className="flex items-start gap-3">
                  {bestAttempt ? <CheckCircle2 className="h-5 w-5 text-green-700 dark:text-green-400 mt-0.5 shrink-0" /> : <XCircle className="h-5 w-5 opacity-30 mt-0.5 shrink-0" />}
                  <div>
                    <p className="font-semibold text-foreground">Módulo {mod.module_number}: {mod.title}</p>
                    {bestAttempt ? (
                      <p className="text-sm opacity-70 mt-1">
                        {bestAttempt.score}/{bestAttempt.total_questions} ({Math.round((bestAttempt.score / bestAttempt.total_questions) * 100)}%) — {modAttempts.length} intento{modAttempts.length > 1 ? "s" : ""}
                      </p>
                    ) : (
                      <p className="text-sm opacity-50 mt-1">Sin intentos</p>
                    )}
                  </div>
                </div>
                {bestAttempt && (
                  <div className="mt-3">
                    <Badge variant={bestAttempt.score / bestAttempt.total_questions >= 0.7 ? "default" : "secondary"}>
                      {Math.round((bestAttempt.score / bestAttempt.total_questions) * 100)}%
                    </Badge>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const avgGeneral = summaries.length > 0 ? Math.round(summaries.reduce((s, t) => s + t.avgScore, 0) / Math.max(summaries.filter((s) => s.avgScore > 0).length, 1)) : 0;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Progreso</h2>
        <p className="text-muted-foreground text-sm mt-1">Vista general del avance en módulos y quizzes</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Users, label: "Terapeutas", value: therapists.length, color: "bg-sky-100 dark:bg-sky-900/40" },
          { icon: BookOpen, label: "Módulos", value: modules.length, color: "bg-amber-100 dark:bg-amber-900/40" },
          { icon: TrendingUp, label: "Promedio", value: `${avgGeneral}%`, color: "bg-emerald-100 dark:bg-emerald-900/40" },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} rounded-2xl p-5 text-center`}>
            <stat.icon className="h-6 w-6 mx-auto mb-2 opacity-50" />
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-sm opacity-60">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Therapist cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {summaries.map((s, idx) => (
          <div
            key={s.id}
            className={`${CARD_COLORS[idx % CARD_COLORS.length]} rounded-2xl p-5 min-h-[160px] cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg flex flex-col justify-between`}
            onClick={() => setSelectedTherapistId(s.id)}
          >
            <div>
              <p className="font-bold text-foreground">{s.full_name}</p>
              <Badge variant={s.status === "active" ? "default" : "secondary"} className="text-xs mt-1">
                {s.status === "active" ? "Activo" : s.status === "inactive" ? "Inactivo" : "Pendiente"}
              </Badge>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Progress value={s.totalModules > 0 ? (s.completedModules / s.totalModules) * 100 : 0} className="h-2 flex-1" />
                <span className="text-xs opacity-60">{s.completedModules}/{s.totalModules}</span>
              </div>
              <div className="flex justify-between text-xs opacity-60">
                <span>Promedio: {s.avgScore > 0 ? `${s.avgScore}%` : "—"}</span>
                <span>{s.lastAttempt ? new Date(s.lastAttempt).toLocaleDateString("es-MX") : "—"}</span>
              </div>
            </div>
          </div>
        ))}
        {summaries.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">No hay terapeutas registrados.</div>
        )}
      </div>
    </div>
  );
}