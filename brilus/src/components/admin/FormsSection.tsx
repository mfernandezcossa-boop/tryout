import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface FormSubmission {
  id: string;
  form_name: string;
  email: string | null;
  status: string;
  created_at: string;
  payload: any;
}

const statusLabels: Record<string, string> = {
  new: "Nuevo",
  reviewing: "En revisión",
  completed: "Completado",
  spam: "Spam",
};

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  new: "default",
  reviewing: "secondary",
  completed: "outline",
  spam: "destructive",
};

const fieldLabels: Record<string, string> = {
  parent_full_name: "Nombre del padre/madre/tutor",
  child_name: "Nombre del niño/a",
  child_age_band: "Edad del niño/a",
  phone: "Teléfono",
  postal_code: "Código postal",
  concerns: "Señales o preocupaciones",
  referral_source: "¿Cómo nos conoció?",
  consent: "Consentimiento",
};

const referralSourceLabels: Record<string, string> = {
  social_media: "Redes sociales (Instagram, Facebook, TikTok)",
  family_friend: "Recomendación de un familiar o amigo",
  professional: "Recomendación de un profesional (colegio, terapeuta, neuropediatra)",
  google_search: "Búsqueda en Google",
  webinar: "Webinar de Brilus",
  event: "Evento o taller presencial",
  influencer: "Influencer o colaboración de contenido",
  other: "Otro",
};

export const FormsSection = () => {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("form_submissions")
      .select("id, form_name, email, status, created_at, payload")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los formularios",
        variant: "destructive",
      });
    } else {
      setSubmissions(data || []);
    }
    setLoading(false);
  };

  const filteredSubmissions =
    filterStatus === "all"
      ? submissions
      : submissions.filter((sub) => sub.status === filterStatus);

  const getContactName = (submission: FormSubmission) => {
    if (submission.form_name === "contact") {
      return submission.payload?.parent_full_name || "-";
    }
    return "-";
  };

  const handleViewDetails = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
    setDialogOpen(true);
  };

  const renderPayloadContent = (payload: any) => {
    if (!payload) return <p className="text-muted-foreground">No hay datos disponibles</p>;

    const formatValue = (key: string, value: any): string => {
      if (typeof value === 'boolean') return value ? 'Sí' : 'No';
      if (key === 'referral_source' && referralSourceLabels[value]) {
        return referralSourceLabels[value];
      }
      return value?.toString() || '-';
    };

    return (
      <div className="space-y-4">
        {Object.entries(payload).map(([key, value]) => (
          <div key={key} className="border-b pb-3">
            <dt className="font-semibold text-sm text-muted-foreground mb-1">
              {fieldLabels[key] || key.replace(/_/g, ' ')}
            </dt>
            <dd className="text-sm">
              {formatValue(key, value)}
            </dd>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Formularios Recibidos</h2>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="new">Nuevos</SelectItem>
            <SelectItem value="reviewing">En revisión</SelectItem>
            <SelectItem value="completed">Completados</SelectItem>
            <SelectItem value="spam">Spam</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No hay formularios para mostrar.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>
                    {new Date(submission.created_at).toLocaleDateString("es-ES")}
                  </TableCell>
                  <TableCell className="capitalize">
                    {submission.form_name}
                  </TableCell>
                  <TableCell>{getContactName(submission)}</TableCell>
                  <TableCell>{submission.email || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={statusColors[submission.status] || "outline"}>
                      {statusLabels[submission.status] || submission.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleViewDetails(submission)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles del Formulario</DialogTitle>
            <DialogDescription>
              {selectedSubmission && (
                <>
                  Recibido el {new Date(selectedSubmission.created_at).toLocaleDateString("es-ES", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Tipo de formulario</p>
                  <p className="capitalize">{selectedSubmission.form_name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Estado</p>
                  <Badge variant={statusColors[selectedSubmission.status] || "outline"}>
                    {statusLabels[selectedSubmission.status] || selectedSubmission.status}
                  </Badge>
                </div>
                {selectedSubmission.email && (
                  <div className="col-span-2">
                    <p className="text-sm font-semibold text-muted-foreground">Email</p>
                    <p>{selectedSubmission.email}</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-4">Información del Formulario</h3>
                {renderPayloadContent(selectedSubmission.payload)}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
