import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, BookOpen, ArrowLeft, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import brilusLogo from "@/assets/brilus-logo.svg";

interface ArticleSection {
  id: string;
  title: string;
  content: string;
}

interface Article {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  content: ArticleSection[];
  visible: boolean;
}

const KnowledgeBase = () => {
  const { slug } = useParams<{ slug?: string }>();

  // Fetch article by slug or list all articles
  const { data: article, isLoading: articleLoading } = useQuery({
    queryKey: ["kb-article", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from("knowledge_base_articles")
        .select("*")
        .eq("slug", slug)
        .eq("visible", true)
        .single();

      if (error) throw error;
      
      // Parse content from JSONB
      const parsedContent = typeof data.content === 'string' 
        ? JSON.parse(data.content) 
        : data.content;
      
      return { ...data, content: parsedContent } as Article;
    },
    enabled: !!slug,
  });

  const { data: articles, isLoading: articlesLoading } = useQuery({
    queryKey: ["kb-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("knowledge_base_articles")
        .select("id, slug, title, description, category")
        .eq("visible", true)
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !slug,
  });

  // Group articles by category
  const groupedArticles = React.useMemo(() => {
    if (!articles) return {};
    return articles.reduce((acc, article) => {
      const category = article.category || "general";
      if (!acc[category]) acc[category] = [];
      acc[category].push(article);
      return acc;
    }, {} as Record<string, typeof articles>);
  }, [articles]);

  const categoryLabels: Record<string, string> = {
    manuales: "Manuales y Guías",
    general: "Recursos Generales",
    herramientas: "Herramientas",
  };

  if (slug && articleLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead
          title="Cargando... | Base de Conocimiento Brilus"
          description="Base de conocimiento para familias Brilus"
          noindex={true}
        />
        <div className="section-px section-py">
          <div className="section-container">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <Skeleton className="h-40 w-full mb-4" />
            <Skeleton className="h-40 w-full mb-4" />
          </div>
        </div>
      </div>
    );
  }

  // Article detail view
  if (slug && article) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead
          title={`${article.title} | Base de Conocimiento Brilus`}
          description={article.description || "Guía para familias Brilus"}
          noindex={true}
        />

        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-50">
          <div className="section-px py-4">
            <div className="section-container flex items-center justify-between">
              <Link to="/familias" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-body-sm">Volver</span>
              </Link>
              <img src={brilusLogo} alt="Brilus" className="h-8" />
            </div>
          </div>
        </header>

        {/* Article Content */}
        <main className="section-px section-py">
          <div className="section-container max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-body-sm text-muted-foreground mb-6">
              <Link to="/familias" className="hover:text-foreground transition-colors">
                Base de Conocimiento
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">{article.title}</span>
            </nav>

            {/* Title */}
            <h1 className="text-h1 text-foreground mb-4">{article.title}</h1>
            {article.description && (
              <p className="text-body-lg text-muted-foreground mb-8">
                {article.description}
              </p>
            )}

            {/* Table of Contents */}
            <div className="bg-card rounded-xl p-6 mb-10 border border-border">
              <h2 className="text-h5 text-foreground mb-4">Contenido</h2>
              <nav className="space-y-2">
                {article.content.map((section: ArticleSection, index: number) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-3 text-body-md text-muted-foreground hover:text-foreground transition-colors py-1"
                  >
                    <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-body-sm">
                      {index + 1}
                    </span>
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>

            {/* Sections */}
            <div className="space-y-12">
              {article.content.map((section: ArticleSection) => (
                <section key={section.id} id={section.id} className="scroll-mt-24">
                  <h2 className="text-h3 text-foreground mb-6 pb-3 border-b border-border">
                    {section.title}
                  </h2>
                  <div className="prose prose-lg max-w-none text-foreground">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => (
                          <p className="text-body-md text-foreground leading-relaxed mb-4">
                            {children}
                          </p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-foreground">{children}</strong>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-h5 text-foreground mt-6 mb-3">{children}</h3>
                        ),
                        ul: ({ children }) => (
                          <ul className="space-y-2 my-4">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="space-y-2 my-4 list-decimal list-inside">{children}</ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-body-md text-foreground pl-2">
                            {children}
                          </li>
                        ),
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[hsl(var(--brand-blue))] hover:underline inline-flex items-center gap-1"
                          >
                            {children}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ),
                      }}
                    >
                      {section.content}
                    </ReactMarkdown>
                  </div>
                </section>
              ))}
            </div>

            {/* Footer */}
            <footer className="mt-16 pt-8 border-t border-border">
              <div className="bg-muted/50 rounded-xl p-6 text-center">
                <p className="text-body-md text-muted-foreground mb-2">
                  ¿Tienes alguna duda sobre este contenido?
                </p>
                <p className="text-body-md text-foreground">
                  No dudes en contactar a tu terapeuta o al equipo de Brilus.
                </p>
              </div>
            </footer>
          </div>
        </main>
      </div>
    );
  }

  // Articles list view
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Base de Conocimiento | Brilus"
        description="Recursos y guías para familias Brilus"
        noindex={true}
      />

      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="section-px py-6">
          <div className="section-container flex items-center justify-center">
            <img src={brilusLogo} alt="Brilus" className="h-10" />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="section-px py-12 md:py-16 bg-gradient-to-b from-card to-background">
        <div className="section-container text-center max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-full mb-6">
            <BookOpen className="h-4 w-4 text-[hsl(var(--brand-blue))]" />
            <span className="text-body-sm text-muted-foreground">Base de Conocimiento</span>
          </div>
          <h1 className="text-h1 text-foreground mb-4">
            Recursos para Familias
          </h1>
          <p className="text-body-lg text-muted-foreground">
            Guías prácticas y manuales para acompañarte en el proceso terapéutico de tu hijo(a).
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="section-px section-py">
        <div className="section-container max-w-4xl">
          {articlesLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : Object.keys(groupedArticles).length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-body-lg text-muted-foreground">
                No hay recursos disponibles por el momento.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {Object.entries(groupedArticles).map(([category, categoryArticles]) => (
                <div key={category}>
                  <h2 className="text-h4 text-foreground mb-4">
                    {categoryLabels[category] || category}
                  </h2>
                  <div className="grid gap-4">
                    {categoryArticles.map((article) => (
                      <Link
                        key={article.id}
                        to={`/familias/${article.slug}`}
                        className="bg-card rounded-xl p-6 border border-border hover:border-[hsl(var(--brand-blue))] hover:shadow-brilus-2 transition-all group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-h5 text-foreground group-hover:text-[hsl(var(--brand-blue))] transition-colors mb-2">
                              {article.title}
                            </h3>
                            {article.description && (
                              <p className="text-body-md text-muted-foreground">
                                {article.description}
                              </p>
                            )}
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-[hsl(var(--brand-blue))] transition-colors flex-shrink-0 mt-1" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="section-px py-8 border-t border-border">
        <div className="section-container text-center">
          <p className="text-body-sm text-muted-foreground">
            Esta información es exclusiva para familias Brilus.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default KnowledgeBase;
