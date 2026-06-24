import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileText, Download, Eye, ArrowUpDown, ExternalLink } from "lucide-react";

interface JobApplication {
  id: string;
  created_at: string;
  full_name: string;
  whatsapp: string;
  bachelor_degree: string;
  bachelor_university: string;
  has_masters: boolean;
  masters_degree: string | null;
  masters_university: string | null;
  motivation: string;
  cv_file_path: string;
  cv_file_name: string;
  cv_mime_type: string;
  zip_code: string;
  availability_type: string;
  availability_shift: string | null;
  mobility_cdmx: string;
  english_level: string;
  referral_source: string | null;
  status: string;
}

const STATUS_OPTIONS = [
  { value: "nuevo", label: "Nuevo", color: "bg-blue-100 text-blue-800" },
  { value: "revisado", label: "Revisado", color: "bg-yellow-100 text-yellow-800" },
  { value: "contactado", label: "Contactado", color: "bg-green-100 text-green-800" },
  { value: "descartado", label: "Descartado", color: "bg-red-100 text-red-800" },
];

const statusBadge = (status: string) => {
  const s = STATUS_OPTIONS.find(o => o.value === status) || STATUS_OPTIONS[0];
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.color}`}>{s.label}</span>;
};

const availabilityLabel = (type: string, shift: string | null) => {
  if (type === "tiempo_completo") return "Tiempo completo";
  if (type === "medio_tiempo") return `Medio tiempo (${shift === "manana" ? "Mañana" : "Tarde"})`;
  return type;
};

const mobilityLabel = (v: string) => {
  if (v === "si_sin_problema") return "Sí, sin problema";
  if (v === "solo_ciertas_zonas") return "Solo ciertas zonas";
  return v;
};

export default function JobApplicationsSection() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [sortDesc, setSortDesc] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("job_applications")
      .select("*")
      .order("created_at", { ascending: !sortDesc });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setApplications((data as any[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchApplications(); }, [sortDesc]);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("job_applications")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
      if (selectedApp?.id === id) setSelectedApp(prev => prev ? { ...prev, status: newStatus } : null);
      toast({ title: "Estado actualizado" });
    }
  };

  const getCvUrl = async (path: string): Promise<string | null> => {
    const { data, error } = await supabase.storage
      .from("cv-uploads")
      .createSignedUrl(path, 300); // 5 min
    if (error) {
      toast({ title: "Error", description: "No se pudo generar el enlace del CV.", variant: "destructive" });
      return null;
    }
    return data.signedUrl;
  };

  const openCv = async (path: string) => {
    const url = await getCvUrl(path);
    if (url) window.open(url, "_blank");
  };

  const downloadCv = async (app: JobApplication) => {
    const url = await getCvUrl(app.cv_file_path);
    if (url) {
      const a = document.createElement("a");
      a.href = url;
      a.download = app.cv_file_name;
      a.click();
    }
  };

  const filtered = useMemo(() => {
    let list = applications;
    if (filterStatus !== "all") list = list.filter(a => a.status === filterStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.full_name.toLowerCase().includes(q) ||
        a.whatsapp.toLowerCase().includes(q) ||
        a.bachelor_university.toLowerCase().includes(q)
      );
    }
    return list;
  }, [applications, filterStatus, search]);

  const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="py-2 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
      <div className="text-sm text-foreground mt-0.5">{value || "—"}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Postulaciones</h2>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar nombre, WhatsApp o universidad..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filtrar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {STATUS_OPTIONS.map(s => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">Cargando postulaciones…</div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">No se encontraron postulaciones.</div>
      ) : (
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="hidden md:table-cell">WhatsApp</TableHead>
                <TableHead className="hidden lg:table-cell">Licenciatura</TableHead>
                <TableHead className="hidden lg:table-cell">Universidad</TableHead>
                <TableHead className="hidden md:table-cell">CP</TableHead>
                <TableHead className="hidden xl:table-cell">Disponibilidad</TableHead>
                <TableHead className="hidden xl:table-cell">Inglés</TableHead>
                <TableHead>
                  <button onClick={() => setSortDesc(!sortDesc)} className="flex items-center gap-1 hover:text-foreground">
                    Fecha <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(app => (
                <TableRow key={app.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedApp(app)}>
                  <TableCell className="font-medium">{app.full_name}</TableCell>
                  <TableCell className="hidden md:table-cell">{app.whatsapp}</TableCell>
                  <TableCell className="hidden lg:table-cell">{app.bachelor_degree}</TableCell>
                  <TableCell className="hidden lg:table-cell">{app.bachelor_university}</TableCell>
                  <TableCell className="hidden md:table-cell">{app.zip_code}</TableCell>
                  <TableCell className="hidden xl:table-cell">{availabilityLabel(app.availability_type, app.availability_shift)}</TableCell>
                  <TableCell className="hidden xl:table-cell">{app.english_level}</TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(app.created_at).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
                  </TableCell>
                  <TableCell onClick={e => e.stopPropagation()}>{statusBadge(app.status)}</TableCell>
                  <TableCell onClick={e => e.stopPropagation()}>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" title="Ver CV" onClick={() => openCv(app.cv_file_path)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Descargar CV" onClick={() => downloadCv(app)}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedApp && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between gap-4">
                  <DialogTitle className="text-xl">{selectedApp.full_name}</DialogTitle>
                  {statusBadge(selectedApp.status)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Postulación del {new Date(selectedApp.created_at).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </DialogHeader>

              <div className="space-y-1">
                <DetailRow label="WhatsApp" value={selectedApp.whatsapp} />
                <DetailRow label="Licenciatura" value={selectedApp.bachelor_degree} />
                <DetailRow label="Universidad (Licenciatura)" value={selectedApp.bachelor_university} />
                <DetailRow label="¿Tiene maestría?" value={selectedApp.has_masters ? "Sí" : "No"} />
                {selectedApp.has_masters && (
                  <>
                    <DetailRow label="Maestría / Posgrado" value={selectedApp.masters_degree} />
                    <DetailRow label="Universidad (Maestría)" value={selectedApp.masters_university} />
                  </>
                )}
                <DetailRow label="Código postal" value={selectedApp.zip_code} />
                <DetailRow label="Disponibilidad" value={availabilityLabel(selectedApp.availability_type, selectedApp.availability_shift)} />
                <DetailRow label="Movilidad CDMX" value={mobilityLabel(selectedApp.mobility_cdmx)} />
                <DetailRow label="Nivel de inglés" value={selectedApp.english_level} />
                <DetailRow label="¿Cómo nos conoció?" value={selectedApp.referral_source} />
                <DetailRow
                  label="Motivación"
                  value={<p className="whitespace-pre-wrap">{selectedApp.motivation}</p>}
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                <Button variant="outline" size="sm" onClick={() => openCv(selectedApp.cv_file_path)} className="gap-2">
                  <Eye className="w-4 h-4" /> Ver CV
                </Button>
                <Button variant="outline" size="sm" onClick={() => downloadCv(selectedApp)} className="gap-2">
                  <Download className="w-4 h-4" /> Descargar CV
                </Button>
                <div className="ml-auto">
                  <Select value={selectedApp.status} onValueChange={v => updateStatus(selectedApp.id, v)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
