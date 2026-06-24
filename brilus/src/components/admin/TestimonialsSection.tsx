import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Pencil, Trash2, Plus, EyeOff, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  quote: string;
  author_name: string;
  author_photo_url?: string | null;
  visible: boolean;
  order_index: number;
  display_location: string;
  created_at: string;
}

const DISPLAY_LOCATION_OPTIONS = [
  { value: "all", label: "Ambas páginas" },
  { value: "home", label: "Solo Home" },
  { value: "aba", label: "Solo ABA" },
];

const CARD_COLORS = [
  "bg-rose-100 dark:bg-rose-900/40",
  "bg-amber-100 dark:bg-amber-900/40",
  "bg-teal-100 dark:bg-teal-900/40",
  "bg-violet-100 dark:bg-violet-900/40",
  "bg-sky-100 dark:bg-sky-900/40",
  "bg-lime-100 dark:bg-lime-900/40",
  "bg-pink-100 dark:bg-pink-900/40",
  "bg-orange-100 dark:bg-orange-900/40",
];

export default function TestimonialsSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    quote: "", author_name: "", author_photo_url: "", visible: true, order_index: 100, display_location: "all",
  });

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("testimonials").select("*").order("order_index", { ascending: true });
      if (error) throw error;
      return data as Testimonial[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (data.id) {
        const { error } = await supabase.from("testimonials").update({ ...data, updated_by: user?.id }).eq("id", data.id);
        if (error) throw error;
      } else {
        const { id, ...rest } = data;
        const { error } = await supabase.from("testimonials").insert({ ...rest, created_by: user?.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      toast({ title: editingId ? "Testimonio actualizado" : "Testimonio creado" });
      setDialogOpen(false);
      setEditingId(null);
    },
    onError: () => toast({ title: "Error al guardar", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      toast({ title: "Testimonio eliminado" });
    },
  });

  const openNew = () => {
    setEditingId(null);
    setFormData({ quote: "", author_name: "", author_photo_url: "", visible: true, order_index: 100, display_location: "all" });
    setDialogOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setFormData({ quote: t.quote, author_name: t.author_name, author_photo_url: t.author_photo_url || "", visible: t.visible, order_index: t.order_index, display_location: t.display_location || "all" });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({ ...formData, id: editingId || undefined });
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Testimonios</h2>
          <p className="text-muted-foreground text-sm mt-1">{testimonials.length} testimonios</p>
        </div>
        <Button size="lg" className="rounded-full shadow-md" onClick={openNew}>
          <Plus className="h-5 w-5 mr-2" /> Nuevo testimonio
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((t, idx) => {
          const isExpanded = expandedId === t.id;
          return (
            <div
              key={t.id}
              className={`${CARD_COLORS[idx % CARD_COLORS.length]} rounded-2xl p-5 flex flex-col justify-between min-h-[180px] cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg ${isExpanded ? "sm:col-span-2" : ""} ${!t.visible ? "opacity-60" : ""}`}
              onClick={() => setExpandedId(isExpanded ? null : t.id)}
            >
              <div>
                <Quote className="h-5 w-5 opacity-30 mb-2" />
                <p className={`font-medium text-foreground leading-snug ${isExpanded ? "" : "line-clamp-4"}`}>
                  "{t.quote}"
                </p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold opacity-70">— {t.author_name}</span>
                  {!t.visible && <EyeOff className="h-3 w-3 opacity-50" />}
                </div>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-foreground/10 hover:bg-foreground/20" onClick={() => openEdit(t)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-foreground/10 hover:bg-destructive/20" onClick={() => { if (confirm("¿Eliminar?")) deleteMutation.mutate(t.id); }}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        <div className="rounded-2xl border-2 border-dashed border-muted-foreground/20 p-5 flex flex-col items-center justify-center min-h-[180px] cursor-pointer hover:border-muted-foreground/40 hover:bg-muted/30 transition-all" onClick={openNew}>
          <Plus className="h-8 w-8 text-muted-foreground/40 mb-2" />
          <span className="text-sm text-muted-foreground/60 font-medium">Agregar testimonio</span>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editingId ? "Editar" : "Nuevo"} testimonio</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Testimonio *</Label>
              <Textarea value={formData.quote} onChange={(e) => setFormData({ ...formData, quote: e.target.value })} rows={4} required />
            </div>
            <div className="space-y-2">
              <Label>Nombre del autor *</Label>
              <Input value={formData.author_name} onChange={(e) => setFormData({ ...formData, author_name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>URL foto (opcional)</Label>
              <Input type="url" value={formData.author_photo_url} onChange={(e) => setFormData({ ...formData, author_photo_url: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mostrar en</Label>
                <Select value={formData.display_location} onValueChange={(v) => setFormData({ ...formData, display_location: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{DISPLAY_LOCATION_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Orden</Label>
                <Input type="number" value={formData.order_index} onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.visible} onCheckedChange={(c) => setFormData({ ...formData, visible: c })} />
              <Label>Visible</Label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Guardando…" : editingId ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}