import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff, MapPin } from "lucide-react";

interface Location {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  order_index: number | null;
  visible: boolean;
  created_at: string;
}

const CARD_COLORS = [
  "bg-sky-100 dark:bg-sky-900/40",
  "bg-emerald-100 dark:bg-emerald-900/40",
  "bg-amber-100 dark:bg-amber-900/40",
  "bg-violet-100 dark:bg-violet-900/40",
  "bg-rose-100 dark:bg-rose-900/40",
  "bg-teal-100 dark:bg-teal-900/40",
];

export default function LocationsSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", image_url: "", order_index: 100, visible: true });

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ["admin-locations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("locations").select("*").order("order_index", { ascending: true });
      if (error) throw error;
      return data as Location[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      const payload = { name: data.name, description: data.description, image_url: data.image_url || null, order_index: data.order_index, visible: data.visible };
      if (data.id) {
        const { error } = await supabase.from("locations").update({ ...payload, updated_by: user?.id }).eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("locations").insert({ ...payload, created_by: user?.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-locations"] });
      toast({ title: editingId ? "Locación actualizada" : "Locación creada" });
      setDialogOpen(false);
      setEditingId(null);
    },
    onError: () => toast({ title: "Error al guardar", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("locations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-locations"] });
      toast({ title: "Locación eliminada" });
    },
  });

  const toggleVisibility = useMutation({
    mutationFn: async (loc: Location) => {
      const { error } = await supabase.from("locations").update({ visible: !loc.visible }).eq("id", loc.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-locations"] }),
  });

  const openNew = () => { setEditingId(null); setFormData({ name: "", description: "", image_url: "", order_index: 100, visible: true }); setDialogOpen(true); };
  const openEdit = (loc: Location) => { setEditingId(loc.id); setFormData({ name: loc.name, description: loc.description, image_url: loc.image_url || "", order_index: loc.order_index || 100, visible: loc.visible }); setDialogOpen(true); };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Locaciones</h2>
          <p className="text-muted-foreground text-sm mt-1">{locations.length} sedes</p>
        </div>
        <Button size="lg" className="rounded-full shadow-md" onClick={openNew}>
          <Plus className="h-5 w-5 mr-2" /> Nueva locación
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((loc, idx) => (
          <div key={loc.id} className={`${CARD_COLORS[idx % CARD_COLORS.length]} rounded-2xl p-5 flex flex-col justify-between min-h-[160px] transition-all hover:scale-[1.02] hover:shadow-lg ${!loc.visible ? "opacity-60" : ""}`}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 opacity-50" />
                <span className="text-xs font-bold opacity-50 uppercase tracking-wider">Sede</span>
              </div>
              <p className="font-bold text-lg text-foreground">{loc.name}</p>
              <p className="text-sm text-foreground/70 mt-1 line-clamp-2">{loc.description}</p>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs opacity-50">Orden: {loc.order_index}</span>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-foreground/10 hover:bg-foreground/20" onClick={() => toggleVisibility.mutate(loc)}>
                  {loc.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-foreground/10 hover:bg-foreground/20" onClick={() => openEdit(loc)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-foreground/10 hover:bg-destructive/20" onClick={() => { if (confirm("¿Eliminar?")) deleteMutation.mutate(loc.id); }}>
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="rounded-2xl border-2 border-dashed border-muted-foreground/20 p-5 flex flex-col items-center justify-center min-h-[160px] cursor-pointer hover:border-muted-foreground/40 hover:bg-muted/30 transition-all" onClick={openNew}>
          <Plus className="h-8 w-8 text-muted-foreground/40 mb-2" />
          <span className="text-sm text-muted-foreground/60 font-medium">Agregar sede</span>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editingId ? "Editar" : "Nueva"} locación</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Nombre *</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
            <div><Label>Descripción *</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
            <div><Label>URL de imagen</Label><Input type="url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} /></div>
            <div><Label>Orden</Label><Input type="number" value={formData.order_index} onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 100 })} /></div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={formData.visible} onChange={(e) => setFormData({ ...formData, visible: e.target.checked })} className="rounded" />
              <Label>Visible</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={() => saveMutation.mutate({ ...formData, id: editingId || undefined })} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Guardando…" : "Guardar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}