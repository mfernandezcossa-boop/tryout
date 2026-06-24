import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

const BrilersMetrics = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["brilers-metrics"],
    queryFn: async () => {
      const [therapistsRes, attemptsRes, modulesRes, appsRes] = await Promise.all([
        supabase.from("therapists").select("id, status, hire_date, full_name"),
        supabase.from("therapist_quiz_attempts").select("therapist_id, module_id, score, total_questions, completed_at"),
        supabase.from("induction_modules").select("id, title, module_number").eq("visible", true).order("module_number"),
        supabase.from("job_applications").select("status"),
      ]);
      return {
        therapists: therapistsRes.data || [],
        attempts: attemptsRes.data || [],
        modules: modulesRes.data || [],
        applications: appsRes.data || [],
      };
    },
  });

  if (isLoading) {
    return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-brand-coral" /></div>;
  }

  const { therapists, attempts, modules, applications } = data!;

  // Retention: therapists with >=1 passed module / total
  const therapistsWithProgress = new Set(
    attempts.filter((a) => (a.score / a.total_questions) * 100 >= 80).map((a) => a.therapist_id)
  ).size;
  const retentionRate = therapists.length > 0 ? Math.round((therapistsWithProgress / therapists.length) * 100) : 0;

  // Completion rate per module
  const moduleStats = modules.map((mod) => {
    const modAttempts = attempts.filter((a) => a.module_id === mod.id);
    const passedTherapists = new Set(
      modAttempts.filter((a) => (a.score / a.total_questions) * 100 >= 80).map((a) => a.therapist_id)
    ).size;
    const avgScore = modAttempts.length > 0
      ? Math.round(modAttempts.reduce((s, a) => s + (a.score / a.total_questions) * 100, 0) / modAttempts.length)
      : 0;
    return { ...mod, passedTherapists, avgScore, totalAttempts: modAttempts.length };
  });

  // Application funnel
  const appStatuses = applications.reduce((acc, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Métricas</h1>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card className="border-border">
          <CardContent className="pt-6 text-center">
            <p className="text-4xl font-bold text-brand-blue">{retentionRate}%</p>
            <p className="text-sm text-muted-foreground mt-1">Retención (≥1 módulo aprobado)</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6 text-center">
            <p className="text-4xl font-bold text-brand-coral">{therapists.filter((t) => t.status === "active").length}</p>
            <p className="text-sm text-muted-foreground mt-1">Terapeutas activos</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6 text-center">
            <p className="text-4xl font-bold text-brand-amber">{attempts.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Total intentos de quiz</p>
          </CardContent>
        </Card>
      </div>

      {/* Module completion */}
      <Card className="border-border mb-6">
        <CardHeader><CardTitle className="text-base">Aprobación por módulo</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {moduleStats.map((mod) => {
            const completionRate = therapists.length > 0 ? Math.round((mod.passedTherapists / therapists.length) * 100) : 0;
            return (
              <div key={mod.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground font-medium">M{mod.module_number}: {mod.title}</span>
                  <span className="text-muted-foreground">{mod.passedTherapists}/{therapists.length} · Avg {mod.avgScore}%</span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Application funnel */}
      <Card className="border-border">
        <CardHeader><CardTitle className="text-base">Embudo de postulaciones</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {["nuevo", "revisado", "entrevista", "aceptado", "rechazado"].map((status) => (
              <div key={status} className="text-center p-3 rounded-lg bg-muted/30">
                <p className="text-2xl font-bold text-foreground">{appStatuses[status] || 0}</p>
                <p className="text-xs text-muted-foreground capitalize">{status}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrilersMetrics;
