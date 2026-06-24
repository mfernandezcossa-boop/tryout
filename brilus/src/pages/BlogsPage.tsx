import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Calendar, Eye, Search, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/SEOHead";
import NavbarBrilus from "@/components/NavbarBrilus";
import Footer from "@/components/Footer";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  featured_image_url: string | null;
  published_at: string;
  views_count: number;
  author_name: string | null;
  author_avatar_url: string | null;
}

function BlogCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <Skeleton className="aspect-video w-full rounded-t-lg rounded-b-none" />
      <CardContent className="p-6 space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center gap-4 pt-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-12" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function BlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://somosbrilus.com/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://somosbrilus.com/nuestros-blogs" },
    ],
  };

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog Brilus",
    description: "Artículos, guías y recursos sobre terapias ABA, autismo infantil y desarrollo con evidencia científica.",
    url: "https://somosbrilus.com/nuestros-blogs",
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, category, featured_image_url, published_at, views_count, author_name, author_avatar_url")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const cats = posts
      .map((p) => p.category)
      .filter((c): c is string => !!c);
    return [...new Set(cats)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q))
      );
    }
    return result;
  }, [posts, activeCategory, searchQuery]);

  return (
    <>
      <SEOHead
        title="Nuestros Blogs – Brilus | Guías sobre autismo y terapias ABA en CDMX"
        description="Artículos y guías sobre terapias ABA, autismo infantil y desarrollo. Contenido respaldado por especialistas BCBA. Lee más y contacta hoy."
        canonical="/nuestros-blogs"
        structuredData={[breadcrumbSchema, blogSchema]}
      />
      <div className="min-h-screen flex flex-col">
        <NavbarBrilus />

        <main className="flex-1 pt-20 sm:pt-24 lg:pt-28">
          {/* Hero */}
          <section className="w-full bg-neutral-100 py-16 sm:py-20 lg:py-28" aria-labelledby="blog-hero-title">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
              <div className="mx-auto mb-6 h-24 w-24 sm:h-28 sm:w-28 text-neutral-900">
                <img
                  src="https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/sign/Photos/Blog/nc-newsletter.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wNDhkOTJlZC00ODk0LTQzY2UtYjllYy03MzU5ZjgyZTNkZGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQaG90b3MvQmxvZy9uYy1uZXdzbGV0dGVyLnN2ZyIsImlhdCI6MTc2MDQ1MDcwMywiZXhwIjoxNzkxOTg2NzAzfQ.-oOL0YsomCDXdDdbHAAY2txt4qLD5Fz6jAoP17av_kw"
                  alt="Ícono de newsletter"
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="text-sm tracking-wide uppercase text-muted-foreground">Blog Brilus</p>
              <h1
                id="blog-hero-title"
                className="mt-2 font-semibold text-foreground text-3xl sm:text-4xl md:text-5xl leading-tight"
              >
                Estamos aquí para acompañarte
                <br className="hidden sm:block" />
                en cada paso
              </h1>
            </div>
          </section>

          {/* Filters & Search */}
          <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-border">
            <div className="max-w-6xl mx-auto space-y-5">
              {/* Search */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar artículos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 bg-card"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Category chips */}
              {categories.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Badge
                    variant={activeCategory === null ? "default" : "outline"}
                    className="cursor-pointer select-none"
                    onClick={() => setActiveCategory(null)}
                  >
                    Todos
                  </Badge>
                  {categories.map((cat) => (
                    <Badge
                      key={cat}
                      variant={activeCategory === cat ? "default" : "outline"}
                      className="cursor-pointer select-none"
                      onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Posts Grid */}
          <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <BlogCardSkeleton key={i} />
                  ))}
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-20 space-y-3">
                  <p className="text-muted-foreground text-lg">
                    {searchQuery || activeCategory
                      ? "No se encontraron artículos con esos criterios."
                      : "Pronto publicaremos nuevos artículos. ¡Vuelve pronto!"}
                  </p>
                  {(searchQuery || activeCategory) && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setActiveCategory(null);
                      }}
                      className="text-sm text-primary hover:underline"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post) => (
                    <Link key={post.id} to={`/nuestros-blogs/${post.slug}`} className="group">
                      <Card className="h-full overflow-hidden border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        {post.featured_image_url && (
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={post.featured_image_url}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <CardContent className="p-6 space-y-3">
                          <div className="flex items-center justify-between">
                            {post.category && (
                              <span className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
                                {post.category}
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                          )}
                          <div className="flex items-center justify-between pt-3 border-t border-border">
                            <div className="flex items-center gap-2">
                              {post.author_avatar_url ? (
                                <img
                                  src={post.author_avatar_url}
                                  alt={post.author_name || "Autor"}
                                  className="w-6 h-6 rounded-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-muted" />
                              )}
                              <span className="text-xs text-muted-foreground">{post.author_name || "Brilus"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(post.published_at).toLocaleDateString("es-ES", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {post.views_count}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
