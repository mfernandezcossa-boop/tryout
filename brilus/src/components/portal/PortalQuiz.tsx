import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PortalQuizProps {
  moduleId: string;
  therapistId: string | null;
  onBack: () => void;
  isPreview?: boolean;
}

const PortalQuiz = ({ moduleId, therapistId, onBack, isPreview = false }: PortalQuizProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const queryClient = useQueryClient();

  const { data: questions, isLoading } = useQuery({
    queryKey: ["portal-quiz-questions", moduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("induction_quiz_questions")
        .select("*")
        .eq("module_id", moduleId)
        .order("order_index");
      if (error) throw error;
      return data;
    },
  });

  const { data: mod } = useQuery({
    queryKey: ["portal-module-title", moduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("induction_modules")
        .select("title, module_number")
        .eq("id", moduleId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!questions) throw new Error("No questions");
      const score = questions.filter((q) => answers[q.id] === q.correct_answer).length;
      // In preview mode (admin without therapist profile), skip saving
      if (!isPreview && therapistId) {
        const { error } = await supabase.from("therapist_quiz_attempts").insert({
          therapist_id: therapistId,
          module_id: moduleId,
          score,
          total_questions: questions.length,
          answers: Object.entries(answers).map(([qId, answer]) => ({ question_id: qId, answer })),
        });
        if (error) throw error;
      }
      return score;
    },
    onSuccess: (score) => {
      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["portal-attempts"] });
      queryClient.invalidateQueries({ queryKey: ["portal-progress"] });
      const pct = Math.round((score / (questions?.length || 1)) * 100);
      if (pct >= 80) {
        toast.success(`¡Aprobaste con ${pct}%!`);
      } else {
        toast.error(`Obtuviste ${pct}%. Necesitas 80% para aprobar.`);
      }
    },
    onError: () => toast.error("Error al enviar respuestas"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No hay preguntas para este módulo.</p>
        <Button variant="ghost" onClick={onBack} className="mt-4">Volver</Button>
      </div>
    );
  }

  const allAnswered = questions.every((q) => answers[q.id]);
  const currentQ = questions[currentIndex];

  // Results view
  if (submitted) {
    const score = questions.filter((q) => answers[q.id] === q.correct_answer).length;
    const pct = Math.round((score / questions.length) * 100);
    const passed = pct >= 80;

    return (
      <div>
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" /> Volver al módulo
        </Button>
        <Card className="max-w-xl mx-auto border-border">
          <CardHeader className="text-center">
            {passed ? (
              <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-3" />
            ) : (
              <XCircle className="h-16 w-16 text-destructive mx-auto mb-3" />
            )}
            <CardTitle className="text-xl">
              {passed ? "¡Felicidades, aprobaste!" : "No aprobaste esta vez"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-4xl font-bold" style={{ color: passed ? "hsl(var(--brand-blue, 220 80% 60%))" : "hsl(var(--destructive))" }}>
              {pct}%
            </div>
            <p className="text-muted-foreground">
              {score} de {questions.length} respuestas correctas
            </p>
            <Progress value={pct} className="h-3" />
            <div className="pt-4 space-y-2">
              {questions.map((q, i) => {
                const correct = answers[q.id] === q.correct_answer;
                return (
                  <div key={q.id} className={`flex items-start gap-2 p-3 rounded-lg text-left text-sm ${correct ? "bg-green-50 dark:bg-green-950/20" : "bg-red-50 dark:bg-red-950/20"}`}>
                    {correct ? <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> : <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />}
                    <div>
                      <p className="font-medium">{i + 1}. {q.question_text}</p>
                      {!correct && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Respuesta correcta: {q[q.correct_answer as keyof typeof q] as string}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <Button variant="coral" onClick={onBack} className="mt-4">
              Volver al módulo
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz view
  return (
    <div>
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 gap-2">
        <ArrowLeft className="h-4 w-4" /> Salir del cuestionario
      </Button>

      <Card className="max-w-2xl mx-auto border-border">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {mod ? `Módulo ${mod.module_number}: ${mod.title}` : "Cuestionario"}
            </span>
            <span className="text-sm font-medium text-foreground">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
          <Progress value={((currentIndex + 1) / questions.length) * 100} className="h-2" />
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold text-foreground mb-6">{currentQ.question_text}</h3>

          <RadioGroup
            value={answers[currentQ.id] || ""}
            onValueChange={(val) => setAnswers((prev) => ({ ...prev, [currentQ.id]: val }))}
            className="space-y-3"
          >
            {(["option_a", "option_b", "option_c", "option_d"] as const).map((key) => (
              <div
                key={key}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                  answers[currentQ.id] === key ? "border-brand-blue bg-brand-blue/5" : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <RadioGroupItem value={key} id={`${currentQ.id}-${key}`} />
                <Label htmlFor={`${currentQ.id}-${key}`} className="flex-1 cursor-pointer text-sm">
                  {currentQ[key]}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
            >
              Anterior
            </Button>
            <div className="flex gap-2">
              {currentIndex < questions.length - 1 ? (
                <Button
                  variant="blue"
                  disabled={!answers[currentQ.id]}
                  onClick={() => setCurrentIndex((i) => i + 1)}
                >
                  Siguiente
                </Button>
              ) : (
                <Button
                  variant="coral"
                  disabled={!allAnswered || submitMutation.isPending}
                  onClick={() => submitMutation.mutate()}
                >
                  {submitMutation.isPending ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</>
                  ) : (
                    "Enviar respuestas"
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortalQuiz;
