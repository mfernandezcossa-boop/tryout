import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Upload, FileText, ExternalLink, Youtube, BookOpen, Headphones } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface InductionModule {
  id: string;
  module_number: number;
  title: string;
  description: string | null;
  slides_url: string | null;
  youtube_url: string | null;
  pdf_url: string | null;
  podcast_url: string | null;
  visible: boolean;
  order_index: number | null;
  created_at: string;
  updated_at: string;
}

interface ModuleFormData {
  module_number: number;
  title: string;
  description: string;
  slides_url: string;
  youtube_url: string;
  podcast_url: string;
  visible: boolean;
}

const emptyForm: ModuleFormData = { module_number: 1, title: "", description: "", slides_url: "", youtube_url: "", podcast_url: "", visible: true };

const CARD_COLORS = [
  "bg-sky-100 dark:bg-sky-900/40",
  "bg-amber-100 dark:bg-amber-900/40",
  "bg-emerald-100 dark:bg-emerald-900/40",
  "bg-rose-100 dark:bg-rose-900/40",
  "bg-violet-100 dark:bg-violet-900/40",
  "bg-orange-100 dark:bg-orange-900/40",
  "bg-teal-100 dark:bg-teal-900/40",
  "bg-pink-100 dark:bg-pink-900/40",
];

export function InductionModulesSection() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ModuleFormData>(emptyForm);
  const [uploading, setUploading] = useState(false);

  const { data: modules = [], isLoading } = useQuery({
    queryKey: ["induction-modules"],
    queryFn: async () => {
      const { data, error } = await supabase.from("induction_modules").select("*").order("module_number", { ascending: true });
      if (error) throw error;
      return data as InductionModule[];
    },
  });

  const usedNumbers = modules.map((m) => m.module_number);
  const availableNumbers = [1, 2, 3, 4, 5, 6, 7, 8].filter(
    (n) => !usedNumbers.includes(n) || (editingId && modules.find((m) => m.id === editingId)?.module_number === n)
  );

  const saveMutation = useMutation({
    mutationFn: async (data: ModuleFormData & { id?: string; pdf_url?: string }) => {
      const payload = { module_number: data.module_number, title: data.title, description: data.description || null, slides_url: data.slides_url || null, youtube_url: data.youtube_url || null, podcast_url: data.podcast_url || null, visible: data.visible, ...(data.pdf_url !== undefined ? { pdf_url: data.pdf_url } : {}) };
      if (data.id) { const { error } = await supabase.from("induction_modules").update(payload).eq("id", data.id); if (error) throw error; }
      else { const { error } = await supabase.from("induction_modules").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["induction-modules"] }); setDialogOpen(false); setEditingId(null); setForm(emptyForm); toast({ title: editingId ? "Módulo actualizado" : "Módulo creado" }); },
    onError: (err: any) => { toast({ title: "Error", description: err.message, variant: "destructive" }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("induction_modules").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["induction-modules"] }); toast({ title: "Módulo eliminado" }); },
  });

  const handleEdit = (mod: InductionModule) => { setEditingId(mod.id); setForm({ module_number: mod.module_number, title: mod.title, description: mod.description || "", slides_url: mod.slides_url || "", youtube_url: mod.youtube_url || "", podcast_url: mod.podcast_url || "", visible: mod.visible }); setDialogOpen(true); };
  const handleNew = () => { setEditingId(null); const nextNumber = availableNumbers.length > 0 ? Math.min(...availableNumbers.filter((n) => !usedNumbers.includes(n))) : 1; setForm({ ...emptyForm, module_number: nextNumber || 1 }); setDialogOpen(true); };

  const handleUploadAudio = async (moduleId: string, file: File) => {
    setUploading(true);
    try {
      const mod = modules.find((m) => m.id === moduleId);
      const path = `modulo-${mod?.module_number || "x"}-audio.mp3`;
      const { error: uploadError } = await supabase.storage.from("modulos-pdfs").upload(path, file, { upsert: true, contentType: file.type });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("modulos-pdfs").getPublicUrl(path);
      const { error: updateError } = await supabase.from("induction_modules").update({ podcast_url: urlData.publicUrl }).eq("id", moduleId);
      if (updateError) throw updateError;
      queryClient.invalidateQueries({ queryKey: ["induction-modules"] });
      toast({ title: "Audio subido exitosamente" });
    } catch (err: any) { toast({ title: "Error al subir audio", description: err.message, variant: "destructive" }); }
    finally { setUploading(false); }
  };

  const handleUploadPdf = async (moduleId: string, file: File) => {
    setUploading(true);
    try {
      const mod = modules.find((m) => m.id === moduleId);
      const path = `modulo-${mod?.module_number || "x"}.pdf`;
      const { error: uploadError } = await supabase.storage.from("modulos-pdfs").upload(path, file, { upsert: true, contentType: "application/pdf" });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("modulos-pdfs").getPublicUrl(path);
      const { error: updateError } = await supabase.from("induction_modules").update({ pdf_url: urlData.publicUrl }).eq("id", moduleId);
      if (updateError) throw updateError;
      queryClient.invalidateQueries({ queryKey: ["induction-modules"] });
      toast({ title: "PDF subido exitosamente" });
    } catch (err: any) { toast({ title: "Error al subir PDF", description: err.message, variant: "destructive" }); }
    finally { setUploading(false); }
  };

  if (isLoading) return <div className="py-12 text-center text-muted-foreground">Cargando módulos…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Módulos de Inducción</h2>
          <p className="text-muted-foreground text-sm mt-1">{modules.length}/8 módulos</p>
        </div>
        {modules.length < 8 && (
          <Button size="lg" className="rounded-full shadow-md" onClick={handleNew}>
            <Plus className="h-5 w-5 mr-2" /> Nuevo módulo
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((mod, idx) => (
          <div key={mod.id} className={`${CARD_COLORS[idx % CARD_COLORS.length]} rounded-2xl p-5 flex flex-col justify-between min-h-[200px] transition-all hover:scale-[1.02] hover:shadow-lg ${!mod.visible ? "opacity-60" : ""}`}>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center text-sm font-bold">{mod.module_number}</span>
                <span className="text-xs font-bold opacity-50 uppercase tracking-wider">Módulo</span>
                {!mod.visible && <Badge variant="secondary" className="text-xs ml-auto">Oculto</Badge>}
              </div>
              <p className="font-bold text-lg text-foreground leading-snug">{mod.title}</p>
              {mod.description && <p className="text-sm text-foreground/70 mt-1 line-clamp-2">{mod.description}</p>}

              <div className="flex flex-wrap gap-2 mt-3">
                {mod.slides_url && (
                  <a href={mod.slides_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors">
                    <ExternalLink className="h-3 w-3" /> Slides
                  </a>
                )}
                {mod.youtube_url && (
                  <a href={mod.youtube_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors">
                    <Youtube className="h-3 w-3" /> Video
                  </a>
                )}
                {mod.pdf_url ? (
                  <a href={mod.pdf_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors">
                    <FileText className="h-3 w-3" /> PDF
                  </a>
                ) : (
                  <label className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors cursor-pointer">
                    <Upload className="h-3 w-3" /> {uploading ? "Subiendo…" : "PDF"}
                    <input type="file" accept="application/pdf" className="hidden" disabled={uploading} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadPdf(mod.id, f); }} />
                  </label>
                )}
                {mod.podcast_url ? (
                  <a href={mod.podcast_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors">
                    <Headphones className="h-3 w-3" /> Audio
                  </a>
                ) : (
                  <label className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors cursor-pointer">
                    <Headphones className="h-3 w-3" /> {uploading ? "Subiendo…" : "Audio"}
                    <input type="file" accept="audio/*" className="hidden" disabled={uploading} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadAudio(mod.id, f); }} />
                  </label>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end mt-4 gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-foreground/10 hover:bg-foreground/20" onClick={() => handleEdit(mod)}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-foreground/10 hover:bg-destructive/20" onClick={() => { if (confirm("¿Eliminar?")) deleteMutation.mutate(mod.id); }}>
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </div>
          </div>
        ))}

        {modules.length < 8 && (
          <div className="rounded-2xl border-2 border-dashed border-muted-foreground/20 p-5 flex flex-col items-center justify-center min-h-[200px] cursor-pointer hover:border-muted-foreground/40 hover:bg-muted/30 transition-all" onClick={handleNew}>
            <Plus className="h-8 w-8 text-muted-foreground/40 mb-2" />
            <span className="text-sm text-muted-foreground/60 font-medium">Nuevo módulo</span>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editingId ? "Editar" : "Nuevo"} módulo</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Número</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.module_number} onChange={(e) => setForm({ ...form, module_number: Number(e.target.value) })}>
                {availableNumbers.map((n) => <option key={n} value={n}>Módulo {n}</option>)}
              </select>
            </div>
            <div><Label>Título *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Descripción</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
            <div><Label>URL Google Slides</Label><Input value={form.slides_url} onChange={(e) => setForm({ ...form, slides_url: e.target.value })} /></div>
            <div><Label>URL YouTube</Label><Input value={form.youtube_url} onChange={(e) => setForm({ ...form, youtube_url: e.target.value })} /></div>
            <div><Label>URL Podcast / Audio</Label><Input value={form.podcast_url} onChange={(e) => setForm({ ...form, podcast_url: e.target.value })} placeholder="https://..." /></div>
            <div className="flex items-center gap-2"><Switch checked={form.visible} onCheckedChange={(v) => setForm({ ...form, visible: v })} /><Label>Visible</Label></div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={() => { if (!form.title.trim()) { toast({ title: "Título requerido", variant: "destructive" }); return; } saveMutation.mutate({ ...form, id: editingId || undefined }); }} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Guardando…" : "Guardar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}