import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, PlayCircle, Presentation, Loader2, Download, Headphones } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PortalModuleContentProps {
  moduleId: string;
  onBack: () => void;
  onStartQuiz: () => void;
  therapistId?: string | null;
  canAccessQuiz?: boolean;
}

const PortalModuleContent = ({ moduleId, onBack, onStartQuiz, therapistId, canAccessQuiz }: PortalModuleContentProps) => {
  const { data: mod, isLoading } = useQuery({
    queryKey: ["portal-module", moduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("induction_modules")
        .select("*")
        .eq("id", moduleId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: questionCount } = useQuery({
    queryKey: ["portal-question-count", moduleId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("induction_quiz_questions")
        .select("id", { count: "exact", head: true })
        .eq("module_id", moduleId);
      if (error) throw error;
      return count || 0;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (!mod) return null;

  const hasVideo = !!mod.youtube_url;
  const hasSlides = !!mod.slides_url;
  const hasPdf = !!mod.pdf_url;
  const hasPodcast = !!(mod as any).podcast_url;

  const getYouTubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  const getSlidesEmbedUrl = (url: string) => {
    if (url.includes("/pub")) return url;
    return url.replace(/\/edit.*$/, "/embed?start=false&loop=false&delayms=3000");
  };

  const defaultTab = hasVideo ? "video" : hasSlides ? "slides" : hasPdf ? "pdf" : hasPodcast ? "podcast" : "pdf";

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 gap-2">
        <ArrowLeft className="h-4 w-4" /> Volver a módulos
      </Button>

      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            Módulo {mod.module_number}
          </div>
          <CardTitle className="text-xl">{mod.title}</CardTitle>
          {mod.description && <p className="text-sm text-muted-foreground mt-2">{mod.description}</p>}
        </CardHeader>
        <CardContent>
          {(hasVideo || hasSlides || hasPdf || hasPodcast) ? (
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="mb-4">
                {hasVideo && (
                  <TabsTrigger value="video" className="gap-1.5">
                    <PlayCircle className="h-3.5 w-3.5" /> Video
                  </TabsTrigger>
                )}
                {hasSlides && (
                  <TabsTrigger value="slides" className="gap-1.5">
                    <Presentation className="h-3.5 w-3.5" /> Slides
                  </TabsTrigger>
                )}
                {hasPdf && (
                  <TabsTrigger value="pdf" className="gap-1.5">
                    <FileText className="h-3.5 w-3.5" /> PDF
                  </TabsTrigger>
                )}
                {hasPodcast && (
                  <TabsTrigger value="podcast" className="gap-1.5">
                    <Headphones className="h-3.5 w-3.5" /> Podcast
                  </TabsTrigger>
                )}
              </TabsList>

              {hasVideo && (
                <TabsContent value="video">
                  <div className="aspect-video rounded-lg overflow-hidden bg-black">
                    <iframe
                      src={getYouTubeEmbedUrl(mod.youtube_url!)}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={mod.title}
                    />
                  </div>
                </TabsContent>
              )}

              {hasSlides && (
                <TabsContent value="slides">
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      src={getSlidesEmbedUrl(mod.slides_url!)}
                      className="w-full h-full border-0"
                      allowFullScreen
                      title={`${mod.title} - Slides`}
                    />
                  </div>
                </TabsContent>
              )}

              {hasPdf && (
                <TabsContent value="pdf">
                  <div className="aspect-[3/4] max-h-[70vh] rounded-lg overflow-hidden">
                    <iframe
                      src={mod.pdf_url!}
                      className="w-full h-full border-0"
                      title={`${mod.title} - PDF`}
                    />
                  </div>
                  <div className="mt-3 flex justify-center">
                    <a href={mod.pdf_url!} target="_blank" rel="noopener noreferrer" download>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" /> Descargar PDF
                      </Button>
                    </a>
                  </div>
                </TabsContent>
              )}

              {hasPodcast && (
                <TabsContent value="podcast">
                  <div className="p-6 bg-muted/30 rounded-lg flex flex-col items-center gap-4">
                    <Headphones className="h-12 w-12 text-brand-coral" />
                    <p className="font-medium text-foreground">Escucha el podcast del módulo</p>
                    <audio controls className="w-full max-w-lg" preload="metadata">
                      <source src={(mod as any).podcast_url} />
                      Tu navegador no soporta el reproductor de audio.
                    </audio>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No hay contenido disponible para este módulo aún.
            </p>
          )}

          {/* Quiz CTA */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-medium text-foreground">Cuestionario del módulo</p>
              <p className="text-sm text-muted-foreground">
                {questionCount
                  ? `${questionCount} preguntas · Aprobatorio: 80%`
                  : "No hay preguntas disponibles"}
              </p>
            </div>
            <Button
              variant="coral"
              onClick={onStartQuiz}
              disabled={!canAccessQuiz || !questionCount || questionCount === 0}
            >
              Iniciar cuestionario
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortalModuleContent;
