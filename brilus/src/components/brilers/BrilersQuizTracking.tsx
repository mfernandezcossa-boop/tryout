import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const BrilersQuizTracking = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["brilers-quiz-tracking"],
    queryFn: async () => {
      const [attemptsRes, therapistsRes, modulesRes] = await Promise.all([
        supabase.from("therapist_quiz_attempts").select("*").order("completed_at", { ascending: false }),
        supabase.from("therapists").select("id, full_name"),
        supabase.from("induction_modules").select("id, title, module_number").order("module_number"),
      ]);
      return {
        attempts: attemptsRes.data || [],
        therapists: therapistsRes.data || [],
        modules: modulesRes.data || [],
      };
    },
  });

  if (isLoading) {
    return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-brand-coral" /></div>;
  }

  const { attempts, therapists, modules } = data!;
  const therapistMap = Object.fromEntries(therapists.map((t) => [t.id, t.full_name]));
  const moduleMap = Object.fromEntries(modules.map((m) => [m.id, `M${m.module_number}: ${m.title}`]));

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Quiz Tracking</h1>

      {/* Per-therapist summary */}
      <Card className="border-border mb-6">
        <CardHeader><CardTitle className="text-base">Resumen por terapeuta</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {therapists.map((t) => {
            const tAttempts = attempts.filter((a) => a.therapist_id === t.id);
            const passedModules = new Set(
              tAttempts.filter((a) => (a.score / a.total_questions) * 100 >= 80).map((a) => a.module_id)
            ).size;
            const avg = tAttempts.length > 0
              ? Math.round(tAttempts.reduce((s, a) => s + (a.score / a.total_questions) * 100, 0) / tAttempts.length)
              : 0;
            return (
              <div key={t.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{t.full_name}</p>
                  <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                    <span>{passedModules}/{modules.length} módulos</span>
                    <span>Promedio: {avg}%</span>
                    <span>{tAttempts.length} intentos</span>
                  </div>
                  <Progress value={(passedModules / Math.max(modules.length, 1)) * 100} className="h-1.5 mt-2" />
                </div>
              </div>
            );
          })}
          {therapists.length === 0 && <p className="text-center text-muted-foreground py-4">No hay terapeutas.</p>}
        </CardContent>
      </Card>

      {/* Recent attempts */}
      <Card className="border-border">
        <CardHeader><CardTitle className="text-base">Intentos recientes</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {attempts.slice(0, 30).map((a) => {
            const pct = Math.round((a.score / a.total_questions) * 100);
            const passed = pct >= 80;
            return (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 text-sm">
                <div>
                  <span className="font-medium text-foreground">{therapistMap[a.therapist_id] || "—"}</span>
                  <span className="text-muted-foreground ml-2">{moduleMap[a.module_id] || "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${passed ? "bg-green-600" : "bg-destructive"} text-white text-xs`}>
                    {pct}%
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(a.completed_at), "d MMM, HH:mm", { locale: es })}
                  </span>
                </div>
              </div>
            );
          })}
          {attempts.length === 0 && <p className="text-center text-muted-foreground py-4">No hay intentos registrados.</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default BrilersQuizTracking;
