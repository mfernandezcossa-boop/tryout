import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, ClipboardCheck, Briefcase, Loader2 } from "lucide-react";

const BrilersDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["brilers-dashboard-stats"],
    queryFn: async () => {
      const [therapists, modules, attempts, applications] = await Promise.all([
        supabase.from("therapists").select("id, status", { count: "exact" }),
        supabase.from("induction_modules").select("id", { count: "exact", head: true }).eq("visible", true),
        supabase.from("therapist_quiz_attempts").select("id, score, total_questions"),
        supabase.from("job_applications").select("id", { count: "exact", head: true }),
      ]);

      const activeTherapists = therapists.data?.filter((t) => t.status === "active").length || 0;
      const totalTherapists = therapists.count || 0;
      const totalModules = modules.count || 0;
      const totalAttempts = attempts.data?.length || 0;
      const avgScore = totalAttempts > 0
        ? Math.round(attempts.data!.reduce((sum, a) => sum + (a.score / a.total_questions) * 100, 0) / totalAttempts)
        : 0;
      const totalApplications = applications.count || 0;

      return { activeTherapists, totalTherapists, totalModules, totalAttempts, avgScore, totalApplications };
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-brand-coral" />
      </div>
    );
  }

  const cards = [
    { label: "Terapeutas activos", value: `${stats?.activeTherapists}/${stats?.totalTherapists}`, icon: Users, color: "text-brand-blue" },
    { label: "Módulos publicados", value: stats?.totalModules, icon: GraduationCap, color: "text-brand-amber" },
    { label: "Intentos de quiz", value: stats?.totalAttempts, icon: ClipboardCheck, color: "text-brand-coral" },
    { label: "Promedio general", value: `${stats?.avgScore}%`, icon: ClipboardCheck, color: "text-green-600" },
    { label: "Postulaciones", value: stats?.totalApplications, icon: Briefcase, color: "text-purple-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((c) => (
          <Card key={c.label} className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <c.icon className={`h-8 w-8 ${c.color}`} />
              <span className="text-2xl font-bold text-foreground">{c.value}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BrilersDashboard;
