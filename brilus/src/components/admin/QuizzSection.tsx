import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface QuizResponse {
  id: string;
  created_at: string;
  full_name: string;
  child_name: string;
  phone: string;
  postal_code: string;
  role: string;
  age_range: string;
  q1_diagnosis: boolean;
  q2_difficulties: boolean;
  q3_behaviors: boolean;
  q4_skills_help: boolean;
  q5_family_commitment: boolean;
  score: number;
  segment: string;
  consent: boolean;
}

const QuizzSection = () => {
  const [responses, setResponses] = useState<QuizResponse[]>([]);
  const [filteredResponses, setFilteredResponses] = useState<QuizResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState<QuizResponse | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    dateFrom: "",
    dateTo: "",
    ageRange: "",
    minScore: "",
    maxScore: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchResponses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, responses]);

  const fetchResponses = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("quiz_responses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setResponses(data || []);
    } catch (error) {
      console.error("Error fetching quiz responses:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las respuestas del quiz.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...responses];

    if (filters.name) {
      const searchLower = filters.name.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.full_name.toLowerCase().includes(searchLower) ||
          r.child_name.toLowerCase().includes(searchLower)
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(
        (r) => new Date(r.created_at) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(
        (r) => new Date(r.created_at) <= new Date(filters.dateTo)
      );
    }

    if (filters.ageRange) {
      filtered = filtered.filter((r) => r.age_range === filters.ageRange);
    }

    if (filters.minScore) {
      filtered = filtered.filter((r) => r.score >= parseInt(filters.minScore));
    }

    if (filters.maxScore) {
      filtered = filtered.filter((r) => r.score <= parseInt(filters.maxScore));
    }

    setFilteredResponses(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta respuesta?")) return;

    try {
      const { error } = await supabase.from("quiz_responses").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Respuesta eliminada",
        description: "La respuesta fue eliminada exitosamente.",
      });

      fetchResponses();
    } catch (error) {
      console.error("Error deleting response:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la respuesta.",
        variant: "destructive",
      });
    }
  };

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      mother_father: "Madre/Padre",
      family: "Familiar",
      school: "Escuela/Colegio",
      other: "Otro",
    };
    return roles[role] || role;
  };

  const getSegmentLabel = (segment: string) => {
    const segments: Record<string, string> = {
      "19_plus": "19+ años",
      "0_yes": "0 respuestas Sí",
      "1_2_yes": "1-2 respuestas Sí",
      "3_5_yes": "3-5 respuestas Sí",
    };
    return segments[segment] || segment;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Respuestas del Quiz ABA</h2>
        <p className="text-muted-foreground mt-2">
          Total de respuestas: {filteredResponses.length}
        </p>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="filter-name">Nombre</Label>
            <Input
              id="filter-name"
              placeholder="Buscar por nombre..."
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="filter-dateFrom">Desde</Label>
            <Input
              id="filter-dateFrom"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="filter-dateTo">Hasta</Label>
            <Input
              id="filter-dateTo"
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="filter-age">Rango de edad</Label>
            <select
              id="filter-age"
              value={filters.ageRange}
              onChange={(e) => setFilters({ ...filters, ageRange: e.target.value })}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="">Todos</option>
              <option value="0–2">0–2 años</option>
              <option value="3–5">3–5 años</option>
              <option value="6–12">6–12 años</option>
              <option value="13–18">13–18 años</option>
              <option value="19+">19+ años</option>
            </select>
          </div>

          <div>
            <Label htmlFor="filter-minScore">Score mínimo</Label>
            <Input
              id="filter-minScore"
              type="number"
              min="0"
              max="5"
              placeholder="0"
              value={filters.minScore}
              onChange={(e) => setFilters({ ...filters, minScore: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="filter-maxScore">Score máximo</Label>
            <Input
              id="filter-maxScore"
              type="number"
              min="0"
              max="5"
              placeholder="5"
              value={filters.maxScore}
              onChange={(e) => setFilters({ ...filters, maxScore: e.target.value })}
            />
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() =>
            setFilters({
              name: "",
              dateFrom: "",
              dateTo: "",
              ageRange: "",
              minScore: "",
              maxScore: "",
            })
          }
          className="mt-4"
        >
          Limpiar filtros
        </Button>
      </Card>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Nombre contacto</TableHead>
              <TableHead>Nombre niño/a</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Edad</TableHead>
              <TableHead>Score</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResponses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No hay respuestas que coincidan con los filtros.
                </TableCell>
              </TableRow>
            ) : (
              filteredResponses.map((response) => (
                <TableRow key={response.id}>
                  <TableCell>
                    {format(new Date(response.created_at), "dd MMM yyyy", { locale: es })}
                  </TableCell>
                  <TableCell className="font-medium">{response.full_name}</TableCell>
                  <TableCell>{response.child_name}</TableCell>
                  <TableCell>{response.phone}</TableCell>
                  <TableCell>{response.age_range}</TableCell>
                  <TableCell>
                    <span className="font-bold">{response.score}/5</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedResponse(response);
                          setDetailDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(response.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle de respuesta</DialogTitle>
          </DialogHeader>

          {selectedResponse && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Fecha</p>
                  <p>
                    {format(new Date(selectedResponse.created_at), "dd MMMM yyyy, HH:mm", {
                      locale: es,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Score</p>
                  <p className="text-lg font-bold">{selectedResponse.score}/5</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Datos de contacto</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Nombre contacto</p>
                    <p>{selectedResponse.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Nombre niño/a</p>
                    <p>{selectedResponse.child_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Teléfono</p>
                    <p>{selectedResponse.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Código postal</p>
                    <p>{selectedResponse.postal_code}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Rol</p>
                    <p>{getRoleLabel(selectedResponse.role)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Edad</p>
                    <p>{selectedResponse.age_range} años</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Respuestas del quiz</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Diagnóstico/sospecha de TEA:</span>
                    <span className="font-semibold">
                      {selectedResponse.q1_diagnosis ? "Sí" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dificultades significativas:</span>
                    <span className="font-semibold">
                      {selectedResponse.q2_difficulties ? "Sí" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Comportamientos difíciles:</span>
                    <span className="font-semibold">
                      {selectedResponse.q3_behaviors ? "Sí" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Necesita ayuda con habilidades:</span>
                    <span className="font-semibold">
                      {selectedResponse.q4_skills_help ? "Sí" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compromiso familiar:</span>
                    <span className="font-semibold">
                      {selectedResponse.q5_family_commitment ? "Sí" : "No"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Segmento</p>
                    <p>{getSegmentLabel(selectedResponse.segment)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Consentimiento</p>
                    <p>{selectedResponse.consent ? "✓ Aceptado" : "✗ No aceptado"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizzSection;
