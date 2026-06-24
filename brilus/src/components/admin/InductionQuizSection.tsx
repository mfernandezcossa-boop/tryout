import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface QuizQuestion {
  id: string;
  module_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  order_index: number | null;
}

interface QuestionForm {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
}

const emptyQuestion: QuestionForm = {
  question_text: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  correct_answer: "a",
};

const CARD_STYLES = [
  { bg: "bg-rose-50 dark:bg-rose-900/30", border: "border-rose-200 dark:border-rose-800", tag: "bg-rose-200 dark:bg-rose-800 text-rose-800 dark:text-rose-200" },
  { bg: "bg-emerald-50 dark:bg-emerald-900/30", border: "border-emerald-200 dark:border-emerald-800", tag: "bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200" },
  { bg: "bg-amber-50 dark:bg-amber-900/30", border: "border-amber-200 dark:border-amber-800", tag: "bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200" },
  { bg: "bg-violet-50 dark:bg-violet-900/30", border: "border-violet-200 dark:border-violet-800", tag: "bg-violet-200 dark:bg-violet-800 text-violet-800 dark:text-violet-200" },
  { bg: "bg-sky-50 dark:bg-sky-900/30", border: "border-sky-200 dark:border-sky-800", tag: "bg-sky-200 dark:bg-sky-800 text-sky-800 dark:text-sky-200" },
  { bg: "bg-orange-50 dark:bg-orange-900/30", border: "border-orange-200 dark:border-orange-800", tag: "bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200" },
  { bg: "bg-teal-50 dark:bg-teal-900/30", border: "border-teal-200 dark:border-teal-800", tag: "bg-teal-200 dark:bg-teal-800 text-teal-800 dark:text-teal-200" },
  { bg: "bg-pink-50 dark:bg-pink-900/30", border: "border-pink-200 dark:border-pink-800", tag: "bg-pink-200 dark:bg-pink-800 text-pink-800 dark:text-pink-200" },
  { bg: "bg-lime-50 dark:bg-lime-900/30", border: "border-lime-200 dark:border-lime-800", tag: "bg-lime-200 dark:bg-lime-800 text-lime-800 dark:text-lime-200" },
  { bg: "bg-indigo-50 dark:bg-indigo-900/30", border: "border-indigo-200 dark:border-indigo-800", tag: "bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200" },
  { bg: "bg-cyan-50 dark:bg-cyan-900/30", border: "border-cyan-200 dark:border-cyan-800", tag: "bg-cyan-200 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-200" },
  { bg: "bg-fuchsia-50 dark:bg-fuchsia-900/30", border: "border-fuchsia-200 dark:border-fuchsia-800", tag: "bg-fuchsia-200 dark:bg-fuchsia-800 text-fuchsia-800 dark:text-fuchsia-200" },
  { bg: "bg-yellow-50 dark:bg-yellow-900/30", border: "border-yellow-200 dark:border-yellow-800", tag: "bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200" },
  { bg: "bg-red-50 dark:bg-red-900/30", border: "border-red-200 dark:border-red-800", tag: "bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200" },
  { bg: "bg-blue-50 dark:bg-blue-900/30", border: "border-blue-200 dark:border-blue-800", tag: "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200" },
];

export function InductionQuizSection() {
  const queryClient = useQueryClient();
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<QuestionForm>(emptyQuestion);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: modules = [] } = useQuery({
    queryKey: ["induction-modules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("induction_modules")
        .select("id, module_number, title")
        .order("module_number");
      if (error) throw error;
      return data;
    },
  });

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["induction-quiz-questions", selectedModuleId],
    queryFn: async () => {
      if (!selectedModuleId) return [];
      const { data, error } = await supabase
        .from("induction_quiz_questions")
        .select("*")
        .eq("module_id", selectedModuleId)
        .order("order_index");
      if (error) throw error;
      return data as QuizQuestion[];
    },
    enabled: !!selectedModuleId,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: QuestionForm & { id?: string }) => {
      const payload = {
        module_id: selectedModuleId,
        question_text: data.question_text,
        option_a: data.option_a,
        option_b: data.option_b,
        option_c: data.option_c,
        option_d: data.option_d,
        correct_answer: data.correct_answer,
        order_index: data.id ? undefined : questions.length,
      };

      if (data.id) {
        const { order_index, ...updatePayload } = payload;
        const { error } = await supabase.from("induction_quiz_questions").update(updatePayload).eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("induction_quiz_questions").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["induction-quiz-questions", selectedModuleId] });
      setDialogOpen(false);
      setEditingId(null);
      setForm(emptyQuestion);
      toast({ title: editingId ? "Pregunta actualizada" : "Pregunta creada" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("induction_quiz_questions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["induction-quiz-questions", selectedModuleId] });
      toast({ title: "Pregunta eliminada" });
    },
  });

  const handleEdit = (q: QuizQuestion) => {
    setEditingId(q.id);
    setForm({
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_answer: q.correct_answer,
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.question_text.trim() || !form.option_a.trim() || !form.option_b.trim() || !form.option_c.trim() || !form.option_d.trim()) {
      toast({ title: "Todos los campos son requeridos", variant: "destructive" });
      return;
    }
    if (!editingId && questions.length >= 15) {
      toast({ title: "Máximo 15 preguntas por módulo", variant: "destructive" });
      return;
    }
    saveMutation.mutate({ ...form, id: editingId || undefined });
  };

  const selectedModule = modules.find((m) => m.id === selectedModuleId);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cuestionarios</h2>
          <p className="text-muted-foreground text-sm mt-1">Gestiona las preguntas de cada módulo (5-15 por módulo)</p>
        </div>
        {selectedModuleId && questions.length < 15 && (
          <Button
            size="lg"
            className="rounded-full shadow-md"
            onClick={() => {
              setEditingId(null);
              setForm(emptyQuestion);
              setDialogOpen(true);
            }}
          >
            <Plus className="h-5 w-5 mr-2" /> Nueva pregunta
          </Button>
        )}
      </div>

      {/* Module cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {modules.map((m, idx) => {
          const style = CARD_STYLES[idx % CARD_STYLES.length];
          const isSelected = selectedModuleId === m.id;
          return (
            <div
              key={m.id}
              className={`${style.bg} border-2 ${isSelected ? "border-foreground shadow-md" : style.border} rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:shadow-md`}
              onClick={() => { setSelectedModuleId(isSelected ? "" : m.id); setExpandedId(null); }}
            >
              <span className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${style.tag}`}>
                Módulo {m.module_number}
              </span>
              <p className="font-semibold text-foreground mt-3 leading-snug">{m.title}</p>
            </div>
          );
        })}
      </div>

      {!selectedModuleId && modules.length > 0 && (
        <div className="text-center py-12 text-muted-foreground">Selecciona un módulo para ver sus preguntas</div>
      )}
      {modules.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">Primero crea módulos en la sección 'Gestionar Módulos'</div>
      )}

      {selectedModuleId && (
        <>
          <div className="flex items-center gap-3 mb-6">
            <Badge variant={questions.length >= 5 ? "default" : "secondary"} className="text-sm px-3 py-1">
              {questions.length}/15 preguntas
            </Badge>
            {questions.length < 5 && <span className="text-sm text-amber-600 font-medium">Mínimo 5 requeridas</span>}
          </div>

          {/* Cards grid — notes style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {questions.map((q, idx) => {
              const style = CARD_STYLES[idx % CARD_STYLES.length];
              const isExpanded = expandedId === q.id;
              return (
                <div
                  key={q.id}
                  className={`${style.bg} border ${style.border} rounded-2xl p-5 flex flex-col cursor-pointer transition-all duration-200 hover:shadow-md ${isExpanded ? "sm:col-span-2 lg:col-span-2" : ""}`}
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                >
                  {/* Top row: title + actions */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${style.tag}`}>
                      Pregunta {idx + 1}
                    </span>
                    <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-foreground/10 transition-colors"
                        onClick={() => handleEdit(q)}
                      >
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                      <button
                        className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-destructive/10 transition-colors"
                        onClick={() => {
                          if (confirm("¿Eliminar esta pregunta?")) deleteMutation.mutate(q.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive/70" />
                      </button>
                    </div>
                  </div>

                  {/* Question text */}
                  <p className={`font-semibold text-foreground leading-snug ${isExpanded ? "" : "line-clamp-3"}`}>
                    {q.question_text}
                  </p>

                  {/* Expanded options */}
                  {isExpanded && (
                    <div className="mt-4 space-y-1.5">
                      {["a", "b", "c", "d"].map((opt) => (
                        <div
                          key={opt}
                          className={`flex items-start gap-2 text-sm rounded-xl px-3 py-2 ${
                            q.correct_answer === opt
                              ? "bg-white/70 dark:bg-white/10 font-semibold"
                              : "opacity-70"
                          }`}
                        >
                          {q.correct_answer === opt && <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-green-600 dark:text-green-400" />}
                          <span className="text-foreground">
                            <span className="uppercase font-mono mr-1.5 text-xs opacity-50">{opt})</span>
                            {(q as any)[`option_${opt}`]}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Footer hint */}
                  {!isExpanded && (
                    <p className="text-xs text-muted-foreground mt-3">
                      Resp. correcta: <span className="font-semibold uppercase">{q.correct_answer}</span> · Click para ver opciones
                    </p>
                  )}
                </div>
              );
            })}

            {/* Add card */}
            {questions.length < 15 && (
              <div
                className="rounded-2xl border-2 border-dashed border-muted-foreground/20 p-5 flex flex-col items-center justify-center min-h-[180px] cursor-pointer hover:border-muted-foreground/40 hover:bg-muted/20 transition-all"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyQuestion);
                  setDialogOpen(true);
                }}
              >
                <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                  <Plus className="h-6 w-6 text-muted-foreground/50" />
                </div>
                <span className="text-sm text-muted-foreground/60 font-medium">Agregar pregunta</span>
              </div>
            )}
          </div>

          {questions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No hay preguntas para este módulo.</div>
          )}
        </>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar pregunta" : "Nueva pregunta"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Pregunta *</Label>
              <Input
                value={form.question_text}
                onChange={(e) => setForm({ ...form, question_text: e.target.value })}
                placeholder="Escribe la pregunta…"
              />
            </div>
            {["a", "b", "c", "d"].map((opt) => (
              <div key={opt}>
                <Label>Opción {opt.toUpperCase()} *</Label>
                <Input
                  value={(form as any)[`option_${opt}`]}
                  onChange={(e) => setForm({ ...form, [`option_${opt}`]: e.target.value })}
                  placeholder={`Opción ${opt.toUpperCase()}`}
                />
              </div>
            ))}
            <div>
              <Label className="mb-2 block">Respuesta correcta</Label>
              <RadioGroup value={form.correct_answer} onValueChange={(v) => setForm({ ...form, correct_answer: v })} className="flex gap-4">
                {["a", "b", "c", "d"].map((opt) => (
                  <div key={opt} className="flex items-center gap-1">
                    <RadioGroupItem value={opt} id={`correct-${opt}`} />
                    <Label htmlFor={`correct-${opt}`} className="uppercase font-mono">
                      {opt}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Guardando…" : editingId ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}