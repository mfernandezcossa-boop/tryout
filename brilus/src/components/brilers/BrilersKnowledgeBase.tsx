import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

const BrilersKnowledgeBase = () => {
  const { data: articles, isLoading } = useQuery({
    queryKey: ["brilers-knowledge-base"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("knowledge_base_articles")
        .select("*")
        .order("order_index");
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-brand-coral" /></div>;
  }

  const categories = [...new Set(articles?.map((a) => a.category) || [])];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Base de Conocimiento</h1>

      {categories.map((cat) => (
        <div key={cat} className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3 capitalize">{cat}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {articles?.filter((a) => a.category === cat).map((article) => (
              <Card key={article.id} className="border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{article.title}</CardTitle>
                    <Badge variant={article.visible ? "outline" : "destructive"} className="text-xs">
                      {article.visible ? "Visible" : "Oculto"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {article.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{article.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">/{article.slug}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
      {(!articles || articles.length === 0) && (
        <p className="text-center text-muted-foreground py-12">No hay artículos registrados.</p>
      )}
    </div>
  );
};

export default BrilersKnowledgeBase;
