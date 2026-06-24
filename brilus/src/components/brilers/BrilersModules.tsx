import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

const BrilersModules = () => {
  const { data: modules, isLoading } = useQuery({
    queryKey: ["brilers-modules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("induction_modules")
        .select("*")
        .order("module_number");
      if (error) throw error;
      return data;
    },
  });

  const { data: questionCounts } = useQuery({
    queryKey: ["brilers-question-counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("induction_quiz_questions")
        .select("module_id");
      if (error) throw error;
      const counts: Record<string, number> = {};
      data.forEach((q) => { counts[q.module_id] = (counts[q.module_id] || 0) + 1; });
      return counts;
    },
  });

  if (isLoading) {
    return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-brand-coral" /></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Módulos de Inducción</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules?.map((mod) => (
          <Card key={mod.id} className="border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant={mod.visible ? "default" : "secondary"}>
                  Módulo {mod.module_number}
                </Badge>
                <Badge variant={mod.visible ? "outline" : "destructive"} className="text-xs">
                  {mod.visible ? "Visible" : "Oculto"}
                </Badge>
              </div>
              <CardTitle className="text-base mt-2">{mod.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {mod.description && <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{mod.description}</p>}
              <div className="flex gap-3 text-xs text-muted-foreground">
                <span>{questionCounts?.[mod.id] || 0} preguntas</span>
                <span>{mod.youtube_url ? "📹" : ""} {mod.slides_url ? "📊" : ""} {mod.pdf_url ? "📄" : ""}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {(!modules || modules.length === 0) && (
        <p className="text-center text-muted-foreground py-12">No hay módulos registrados.</p>
      )}
    </div>
  );
};

export default BrilersModules;
