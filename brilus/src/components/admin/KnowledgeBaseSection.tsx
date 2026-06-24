import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { Plus, Trash2, Eye, EyeOff, ExternalLink, Pencil, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ArticleSection { id: string; title: string; content: string; }
interface Article { id: string; slug: string; title: string; description: string | null; category: string; content: ArticleSection[]; visible: boolean; order_index: number; }

const CARD_COLORS = [
  "bg-indigo-100 dark:bg-indigo-900/40",
  "bg-emerald-100 dark:bg-emerald-900/40",
  "bg-amber-100 dark:bg-amber-900/40",
  "bg-rose-100 dark:bg-rose-900/40",
  "bg-violet-100 dark:bg-violet-900/40",
  "bg-teal-100 dark:bg-teal-900/40",
];

const KnowledgeBaseSection = () => {
  const queryClient = useQueryClient();
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: articles, isLoading } = useQuery({
    queryKey: ["admin-kb-articles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("knowledge_base_articles").select("*").order("order_index", { ascending: true });
      if (error) throw error;
      return data.map((a) => ({ ...a, content: typeof a.content === "string" ? JSON.parse(a.content) : a.content })) as Article[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (article: Partial<Article> & { id: string }) => {
      const { id, ...updates } = article;
      const { error } = await supabase.from("knowledge_base_articles").update({ ...updates, content: JSON.stringify(updates.content), updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-kb-articles"] }); toast.success("Artículo actualizado"); setIsDialogOpen(false); setEditingArticle(null); },
    onError: (error) => toast.error("Error: " + error.message),
  });

  const toggleVisibility = async (article: Article) => {
    const { error } = await supabase.from("knowledge_base_articles").update({ visible: !article.visible }).eq("id", article.id);
    if (error) { toast.error("Error: " + error.message); return; }
    queryClient.invalidateQueries({ queryKey: ["admin-kb-articles"] });
    toast.success(article.visible ? "Ocultado" : "Visible");
  };

  const handleEditSection = (idx: number, field: keyof ArticleSection, value: string) => {
    if (!editingArticle) return;
    const newContent = [...editingArticle.content];
    newContent[idx] = { ...newContent[idx], [field]: value };
    setEditingArticle({ ...editingArticle, content: newContent });
  };

  const handleAddSection = () => {
    if (!editingArticle) return;
    setEditingArticle({ ...editingArticle, content: [...editingArticle.content, { id: `section-${Date.now()}`, title: "Nueva sección", content: "" }] });
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-64" /><Skeleton className="h-32 w-full" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Base de Conocimiento</h2>
          <p className="text-muted-foreground text-sm mt-1">Artículos y guías para familias</p>
        </div>
        <Button variant="outline" asChild>
          <a href="/familias" target="_blank" rel="noopener noreferrer" className="gap-2">
            <ExternalLink className="h-4 w-4" /> Ver página
          </a>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles?.map((article, idx) => (
          <div key={article.id} className={`${CARD_COLORS[idx % CARD_COLORS.length]} rounded-2xl p-5 flex flex-col justify-between min-h-[180px] transition-all hover:scale-[1.02] hover:shadow-lg ${!article.visible ? "opacity-60" : ""}`}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 opacity-50" />
                <span className="text-xs font-bold opacity-50 uppercase tracking-wider">{article.content.length} secciones</span>
              </div>
              <p className="font-bold text-lg text-foreground leading-snug">{article.title}</p>
              {article.description && <p className="text-sm text-foreground/70 mt-1 line-clamp-2">{article.description}</p>}
              <div className="flex flex-wrap gap-1 mt-3">
                {article.content.slice(0, 3).map((s) => (
                  <span key={s.id} className="text-xs px-2 py-0.5 rounded-full bg-foreground/10">{s.title}</span>
                ))}
                {article.content.length > 3 && <span className="text-xs px-2 py-0.5 rounded-full bg-foreground/10">+{article.content.length - 3}</span>}
              </div>
            </div>
            <div className="flex items-center justify-end mt-4 gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-foreground/10 hover:bg-foreground/20" onClick={() => toggleVisibility(article)}>
                {article.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-foreground/10 hover:bg-foreground/20" onClick={() => { setEditingArticle(article); setIsDialogOpen(true); }}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingArticle(null); }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Editar artículo</DialogTitle></DialogHeader>
          {editingArticle && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input value={editingArticle.title} onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Slug (URL)</Label>
                  <Input value={editingArticle.slug} onChange={(e) => setEditingArticle({ ...editingArticle, slug: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea value={editingArticle.description || ""} onChange={(e) => setEditingArticle({ ...editingArticle, description: e.target.value })} rows={2} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={editingArticle.visible} onCheckedChange={(c) => setEditingArticle({ ...editingArticle, visible: c })} />
                <Label>Visible</Label>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Secciones</Label>
                  <Button variant="outline" size="sm" onClick={handleAddSection}><Plus className="h-4 w-4 mr-2" /> Añadir</Button>
                </div>
                <Accordion type="single" collapsible>
                  {editingArticle.content.map((section, index) => (
                    <AccordionItem key={section.id} value={section.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">{index + 1}</span>
                          <span>{section.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <div><Label>Título</Label><Input value={section.title} onChange={(e) => handleEditSection(index, "title", e.target.value)} /></div>
                        <div><Label>Contenido (Markdown)</Label><Textarea value={section.content} onChange={(e) => handleEditSection(index, "content", e.target.value)} rows={10} className="font-mono text-sm" /></div>
                        <Button variant="destructive" size="sm" onClick={() => setEditingArticle({ ...editingArticle, content: editingArticle.content.filter((_, i) => i !== index) })}>
                          <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button onClick={() => updateMutation.mutate(editingArticle)} disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Guardando…" : "Guardar"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KnowledgeBaseSection;