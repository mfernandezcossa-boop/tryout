import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  display_location: string;
  order_index: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

interface FAQFormData {
  question: string;
  answer: string;
  display_location: string;
  order_index: number;
  visible: boolean;
}

const DISPLAY_LOCATIONS = [
  { value: "aba-intensivo", label: "ABA Intensivo" },
  { value: "home", label: "Página Principal" },
  { value: "contacto", label: "Contacto" },
];

const CARD_COLORS = [
  "bg-amber-100 dark:bg-amber-900/40",
  "bg-rose-100 dark:bg-rose-900/40",
  "bg-lime-100 dark:bg-lime-900/40",
  "bg-violet-100 dark:bg-violet-900/40",
  "bg-sky-100 dark:bg-sky-900/40",
  "bg-orange-100 dark:bg-orange-900/40",
  "bg-teal-100 dark:bg-teal-900/40",
  "bg-pink-100 dark:bg-pink-900/40",
];

export const FAQsSection = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FAQFormData>({
    question: "",
    answer: "",
    display_location: "aba-intensivo",
    order_index: 100,
    visible: true,
  });

  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ["admin-faqs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .order("display_location")
        .order("order_index", { ascending: true });
      if (error) throw error;
      return data as FAQ[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FAQFormData) => {
      const { data: session } = await supabase.auth.getSession();
      const { error } = await supabase.from("faqs").insert({
        ...data,
        created_by: session.session?.user.id,
        updated_by: session.session?.user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      toast({ title: "FAQ creada correctamente" });
      closeDialog();
    },
    onError: () => {
      toast({ title: "Error al crear la FAQ", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<FAQFormData> }) => {
      const { data: session } = await supabase.auth.getSession();
      const { error } = await supabase
        .from("faqs")
        .update({ ...data, updated_by: session.session?.user.id })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      toast({ title: "FAQ actualizada correctamente" });
      closeDialog();
    },
    onError: () => {
      toast({ title: "Error al actualizar la FAQ", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("faqs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      toast({ title: "FAQ eliminada correctamente" });
    },
    onError: () => {
      toast({ title: "Error al eliminar la FAQ", variant: "destructive" });
    },
  });

  const openCreateDialog = () => {
    setEditingFAQ(null);
    setFormData({ question: "", answer: "", display_location: "aba-intensivo", order_index: 100, visible: true });
    setIsDialogOpen(true);
  };

  const openEditDialog = (faq: FAQ) => {
    setEditingFAQ(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      display_location: faq.display_location,
      order_index: faq.order_index,
      visible: faq.visible,
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingFAQ(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFAQ) {
      updateMutation.mutate({ id: editingFAQ.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Preguntas Frecuentes</h2>
          <p className="text-muted-foreground text-sm mt-1">{faqs.length} FAQs configuradas</p>
        </div>
        <Button size="lg" className="rounded-full shadow-md" onClick={openCreateDialog}>
          <Plus className="h-5 w-5 mr-2" /> Nueva FAQ
        </Button>
      </div>

      {faqs.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          No hay FAQs creadas aún. ¡Crea la primera!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {faqs.map((faq, idx) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className={`${CARD_COLORS[idx % CARD_COLORS.length]} rounded-2xl p-5 flex flex-col justify-between min-h-[160px] cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg ${isExpanded ? "sm:col-span-2 lg:col-span-2" : ""} ${!faq.visible ? "opacity-60" : ""}`}
                onClick={() => setExpandedId(isExpanded ? null : faq.id)}
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold opacity-50 uppercase tracking-wider">
                      {DISPLAY_LOCATIONS.find((l) => l.value === faq.display_location)?.label || faq.display_location}
                    </span>
                    {!faq.visible && <EyeOff className="h-3 w-3 opacity-50" />}
                  </div>
                  <p className="font-semibold text-foreground leading-snug line-clamp-3">
                    {faq.question}
                  </p>
                  {isExpanded && (
                    <p className="mt-3 text-sm text-foreground/80 whitespace-pre-wrap">
                      {faq.answer}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs opacity-50">Orden: {faq.order_index}</span>
                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-foreground/10 hover:bg-foreground/20" onClick={() => openEditDialog(faq)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-foreground/10 hover:bg-destructive/20" onClick={() => { if (confirm("¿Eliminar esta FAQ?")) deleteMutation.mutate(faq.id); }}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          <div
            className="rounded-2xl border-2 border-dashed border-muted-foreground/20 p-5 flex flex-col items-center justify-center min-h-[160px] cursor-pointer hover:border-muted-foreground/40 hover:bg-muted/30 transition-all"
            onClick={openCreateDialog}
          >
            <Plus className="h-8 w-8 text-muted-foreground/40 mb-2" />
            <span className="text-sm text-muted-foreground/60 font-medium">Agregar FAQ</span>
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingFAQ ? "Editar FAQ" : "Nueva FAQ"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">Pregunta *</Label>
              <Input id="question" value={formData.question} onChange={(e) => setFormData({ ...formData, question: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="answer">Respuesta *</Label>
              <Textarea id="answer" value={formData.answer} onChange={(e) => setFormData({ ...formData, answer: e.target.value })} rows={4} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ubicación</Label>
                <Select value={formData.display_location} onValueChange={(v) => setFormData({ ...formData, display_location: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DISPLAY_LOCATIONS.map((loc) => (
                      <SelectItem key={loc.value} value={loc.value}>{loc.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Orden</Label>
                <Input type="number" value={formData.order_index} onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 100 })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.visible} onCheckedChange={(c) => setFormData({ ...formData, visible: c })} />
              <Label>Visible</Label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={closeDialog}>Cancelar</Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingFAQ ? "Guardar" : "Crear"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FAQsSection;