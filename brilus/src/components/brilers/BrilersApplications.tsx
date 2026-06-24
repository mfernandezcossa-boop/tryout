import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Download } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { useState } from "react";

const statusColors: Record<string, string> = {
  nuevo: "bg-brand-blue",
  revisado: "bg-brand-amber",
  entrevista: "bg-purple-600",
  aceptado: "bg-green-600",
  rechazado: "bg-destructive",
};

const BrilersApplications = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: applications, isLoading } = useQuery({
    queryKey: ["brilers-applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_applications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("job_applications").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brilers-applications"] });
      toast.success("Estado actualizado");
    },
  });

  if (isLoading) {
    return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-brand-coral" /></div>;
  }

  const filtered = statusFilter === "all" ? applications : applications?.filter((a) => a.status === statusFilter);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground">Postulaciones</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="nuevo">Nuevo</SelectItem>
            <SelectItem value="revisado">Revisado</SelectItem>
            <SelectItem value="entrevista">Entrevista</SelectItem>
            <SelectItem value="aceptado">Aceptado</SelectItem>
            <SelectItem value="rechazado">Rechazado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered?.map((app) => (
          <Card key={app.id} className="border-border">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">{app.full_name}</h3>
                    <Badge className={`${statusColors[app.status] || "bg-muted"} text-white text-xs`}>
                      {app.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-0.5">
                    <p>{app.bachelor_degree} — {app.bachelor_university}</p>
                    <p>WhatsApp: {app.whatsapp} · Inglés: {app.english_level}</p>
                    <p className="text-xs">{format(new Date(app.created_at), "d MMM yyyy, HH:mm", { locale: es })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={app.status}
                    onValueChange={(val) => updateStatus.mutate({ id: app.id, status: val })}
                  >
                    <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nuevo">Nuevo</SelectItem>
                      <SelectItem value="revisado">Revisado</SelectItem>
                      <SelectItem value="entrevista">Entrevista</SelectItem>
                      <SelectItem value="aceptado">Aceptado</SelectItem>
                      <SelectItem value="rechazado">Rechazado</SelectItem>
                    </SelectContent>
                  </Select>
                  {app.cv_file_path && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const { data } = supabase.storage.from("cv-uploads").getPublicUrl(app.cv_file_path);
                        window.open(data.publicUrl, "_blank");
                      }}
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!filtered || filtered.length === 0) && (
          <p className="text-center text-muted-foreground py-12">No hay postulaciones.</p>
        )}
      </div>
    </div>
  );
};

export default BrilersApplications;
