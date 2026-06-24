import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Calendar, Clock, Share2, Copy, Check, Linkedin, Facebook, User, ArrowLeft, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/SEOHead";
import NavbarBrilus from "@/components/NavbarBrilus";
import Footer from "@/components/Footer";
import CallToActionSection from "@/components/CallToActionSection";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  category: string | null;
  tags: string[] | null;
  featured_image_url: string | null;
  published_at: string;
  views_count: number;
  author_name: string | null;
  author_bio: string | null;
  author_link: string | null;
  author_avatar_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  featured_image_url: string | null;
  author_name: string | null;
  author_avatar_url: string | null;
}

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

function PostSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavbarBrilus />
      <main className="flex-1 pt-20">
        <section className="w-full py-12 md:py-16 lg:py-20 px-6 md:px-12 lg:px-28">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              <div className="space-y-6">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-3/4" />
                <div className="flex gap-4">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
              <Skeleton className="aspect-[4/3] lg:aspect-square w-full rounded-2xl" />
            </div>
          </div>
        </section>
        <section className="w-full py-12 px-6 md:px-12 lg:px-28">
          <div className="max-w-[1440px] mx-auto space-y-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [readProgress, setReadProgress] = useState(0);

  // Helper to extract plain text from React children (handles nested <strong>, <em>, etc.)
  const extractText = (node: React.ReactNode): string => {
    if (typeof node === "string") return node;
    if (typeof node === "number") return String(node);
    if (!node) return "";
    if (Array.isArray(node)) return node.map(extractText).join("");
    if (React.isValidElement(node) && node.props?.children) return extractText(node.props.children);
    return "";
  };

  const stripMarkdown = (text: string) => text.replace(/\*\*/g, "").replace(/\*/g, "").replace(/_/g, "").trim();
  const makeId = (text: string) => stripMarkdown(text).toLowerCase().replace(/[^a-z0-9áéíóúñü]+/g, "-").replace(/^-|-$/g, "");

  const toc = useMemo(() => {
    if (!post?.content) return [];
    const headings: TOCItem[] = [];
    const lines = post.content.split("\n");

    lines.forEach((line) => {
      const h2Match = line.match(/^##\s+(.+)$/);
      const h3Match = line.match(/^###\s+(.+)$/);
      const h4Match = line.match(/^####\s+(.+)$/);

      if (h2Match) {
        const raw = h2Match[1].trim();
        headings.push({ id: makeId(raw), text: stripMarkdown(raw), level: 2 });
      } else if (h3Match) {
        const raw = h3Match[1].trim();
        headings.push({ id: makeId(raw), text: stripMarkdown(raw), level: 3 });
      } else if (h4Match) {
        const raw = h4Match[1].trim();
        headings.push({ id: makeId(raw), text: stripMarkdown(raw), level: 4 });
      }
    });

    return headings;
  }, [post?.content]);

  const readingTime = useMemo(() => {
    if (!post?.content) return 0;
    return Math.ceil(post.content.split(/\s+/).length / 200);
  }, [post?.content]);

  useEffect(() => {
    if (slug) fetchPost();
  }, [slug]);

  // Reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setReadProgress(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0);

      // Active TOC section
      const headings = document.querySelectorAll("article h2, article h3, article h4");
      let current = "";
      headings.forEach((heading) => {
        if (heading.getBoundingClientRect().top <= 150) current = heading.id;
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchPost = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error || !data) {
        navigate("/nuestros-blogs");
        return;
      }

      let finalContent = data.content;
      if (!finalContent && data.content_path) {
        const pathInBucket = data.content_path.startsWith("blog-content/")
          ? data.content_path.slice("blog-content/".length)
          : data.content_path;
        const { data: fileData, error: downloadError } = await supabase.storage
          .from("blog-content")
          .download(pathInBucket);
        if (!downloadError && fileData) finalContent = await fileData.text();
      }

      setPost({ ...data, content: finalContent || "" });

      // Increment views
      await supabase
        .from("blog_posts")
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq("id", data.id);

      // Fetch related posts (same category first, then others)
      const { data: related } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, category, featured_image_url, author_name, author_avatar_url")
        .eq("status", "published")
        .neq("id", data.id)
        .order("published_at", { ascending: false })
        .limit(3);

      if (related) setRelatedPosts(related);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      navigate("/nuestros-blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (platform?: "copy" | "linkedin" | "facebook") => {
    const url = window.location.href;
    if (platform === "copy") {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: "smooth" });
  };

  if (loading) return <PostSkeleton />;

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-destructive text-lg">⚠️ Artículo no encontrado</p>
          <Link to="/nuestros-blogs" className="text-primary hover:underline">← Volver a blogs</Link>
        </div>
      </div>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seo_description || post.excerpt || `Artículo sobre ${post.title}`,
    image: post.featured_image_url || "https://somosbrilus.com/og-image.jpg",
    author: {
      "@type": "Person",
      name: post.author_name || "Brilus",
      url: post.author_link || "https://somosbrilus.com/sobre-nosotros",
    },
    publisher: {
      "@type": "Organization",
      name: "Brilus",
      logo: { "@type": "ImageObject", url: "https://somosbrilus.com/logo.png" },
    },
    datePublished: post.published_at,
    dateModified: post.published_at,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://somosbrilus.com/nuestros-blogs/${post.slug}`,
    },
    wordCount: post.content ? post.content.split(/\s+/).length : 0,
    articleSection: post.category || "Desarrollo Infantil",
    inLanguage: "es-MX",
    ...(post.tags && post.tags.length > 0 ? { keywords: post.tags.join(", ") } : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://somosbrilus.com/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://somosbrilus.com/nuestros-blogs" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://somosbrilus.com/nuestros-blogs/${post.slug}` },
    ],
  };

  return (
    <>
      <SEOHead
        title={post.seo_title || `${post.title} – Blog Brilus`}
        description={post.seo_description || post.excerpt || `Lee nuestro artículo sobre ${post.title} en el blog de Brilus.`}
        canonical={`/nuestros-blogs/${post.slug}`}
        ogImage={post.featured_image_url || undefined}
        structuredData={[articleSchema, breadcrumbSchema]}
      />

      {/* Reading progress bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-[hsl(var(--brand-coral))] z-[100] transition-[width] duration-150"
        style={{ width: `${readProgress}%` }}
      />

      <div className="min-h-screen flex flex-col bg-background">
        <NavbarBrilus />

        <main className="flex-1 pt-20">
          {/* Hero Section */}
          <section className="w-full py-12 md:py-16 lg:py-20 px-6 md:px-12 lg:px-28">
            <div className="max-w-[1440px] mx-auto">
              {/* Back link */}
              <Link
                to="/nuestros-blogs"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al blog
              </Link>

              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {post.category && (
                        <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                      )}
                      {post.tags?.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                      {post.title}
                    </h1>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      {post.author_avatar_url ? (
                        <img
                          src={post.author_avatar_url}
                          alt={post.author_name || "Autor"}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <span className="font-medium">{post.author_name || "Brilus"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.published_at).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {readingTime} min de lectura
                    </div>
                  </div>

                  <div className="pt-4">
                    <p className="text-sm text-muted-foreground mb-3">Comparte este artículo</p>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleShare("copy")} aria-label="Copiar enlace">
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleShare("linkedin")} aria-label="LinkedIn">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleShare("facebook")} aria-label="Facebook">
                        <Facebook className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleShare()} aria-label="Compartir">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {post.featured_image_url && (
                  <div className="relative aspect-[4/3] lg:aspect-square overflow-hidden rounded-2xl bg-muted">
                    <img
                      src={post.featured_image_url}
                      alt={post.title}
                      width={800}
                      height={800}
                      loading="eager"
                      fetchPriority="high"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Content + TOC */}
          <section className="w-full py-12 px-6 md:px-12 lg:px-28">
            <div className="max-w-[1440px] mx-auto">
              <div className="grid lg:grid-cols-[1fr_280px] gap-12">
                {/* Main Content */}
                <article className="prose prose-lg prose-slate max-w-none dark:prose-invert prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3 prose-h4:text-xl prose-h4:mt-4 prose-h4:mb-2 prose-p:leading-relaxed prose-p:mb-4 prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4 prose-li:mb-2">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, [rehypeSanitize, { ...defaultSchema, attributes: { ...defaultSchema.attributes, h2: [...(defaultSchema.attributes?.h2 || []), "id"], h3: [...(defaultSchema.attributes?.h3 || []), "id"], h4: [...(defaultSchema.attributes?.h4 || []), "id"] } }]]}
                    components={{
                      h1: () => null,
                      h2: ({ children }) => {
                        const text = extractText(children);
                        const id = makeId(text);
                        return <h2 id={id} className="text-3xl font-bold mt-8 mb-4 text-foreground scroll-mt-24">{children}</h2>;
                      },
                      h3: ({ children }) => {
                        const text = extractText(children);
                        const id = makeId(text);
                        return <h3 id={id} className="text-2xl font-bold mt-6 mb-3 text-foreground scroll-mt-24">{children}</h3>;
                      },
                      h4: ({ children }) => {
                        const text = extractText(children);
                        const id = makeId(text);
                        return <h4 id={id} className="text-xl font-bold mt-4 mb-2 text-foreground scroll-mt-24">{children}</h4>;
                      },
                      p: ({ children }) => <p className="leading-relaxed mb-4 text-foreground">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-6 my-4 space-y-2 text-foreground">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-6 my-4 space-y-2 text-foreground">{children}</ol>,
                      li: ({ children }) => <li className="leading-relaxed text-foreground">{children}</li>,
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-[hsl(var(--brand-coral))] pl-4 py-2 my-4 italic text-muted-foreground bg-muted/30 rounded-r-lg">
                          {children}
                        </blockquote>
                      ),
                      img: ({ src, alt }) => (
                        <img src={src} alt={alt || ""} className="rounded-lg my-6 max-w-full h-auto" loading="lazy" />
                      ),
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                </article>

                {/* TOC Sidebar */}
                {toc.length > 0 && (
                  <aside className="hidden lg:block">
                    <nav className="sticky top-24 rounded-xl p-5 border border-border bg-card" aria-label="Tabla de contenidos">
                      <h3 className="text-sm font-semibold mb-4 text-foreground">Contenido</h3>
                      <ul className="space-y-1.5 text-sm">
                        {toc.map((item) => (
                          <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 0.75}rem` }}>
                            <button
                              onClick={() => scrollToSection(item.id)}
                              className={`text-left w-full py-1 px-2 rounded transition-colors text-sm leading-snug ${
                                activeSection === item.id
                                  ? "text-[hsl(var(--brand-coral))] font-medium bg-muted/50"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {item.text}
                            </button>
                          </li>
                        ))}
                      </ul>

                      {/* Back to top */}
                      <button
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="mt-4 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
                      >
                        <ChevronUp className="h-3 w-3" />
                        Volver arriba
                      </button>
                    </nav>
                  </aside>
                )}
              </div>
            </div>
          </section>

          {/* Author Block */}
          {(post.author_name || post.author_bio) && (
            <section className="w-full py-12 px-6 md:px-12 lg:px-28">
              <div className="max-w-[800px] mx-auto">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-8 bg-card rounded-2xl border border-border shadow-sm">
                  <div className="flex-shrink-0">
                    {post.author_avatar_url ? (
                      <img
                        src={post.author_avatar_url}
                        alt={post.author_name || "Autor"}
                        className="w-24 h-24 rounded-full object-cover ring-2 ring-border"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-3 text-center sm:text-left">
                    <div>
                      <p className="text-xs tracking-wide uppercase text-muted-foreground">Escrito por</p>
                      <h3 className="text-xl font-semibold text-foreground">{post.author_name || "Brilus"}</h3>
                    </div>
                    {post.author_bio && (
                      <p className="text-sm text-muted-foreground leading-relaxed">{post.author_bio}</p>
                    )}
                    {post.author_link && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={post.author_link} target="_blank" rel="noopener noreferrer">Ver perfil</a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* CTA */}
          <CallToActionSection />

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="w-full py-16 px-6 md:px-12 lg:px-28 bg-background">
              <div className="max-w-[1440px] mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-8">Artículos relacionados</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedPosts.map((relatedPost) => (
                    <Link key={relatedPost.id} to={`/nuestros-blogs/${relatedPost.slug}`} className="group">
                      <article className="space-y-4">
                        {relatedPost.featured_image_url && (
                          <div className="aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                            <img
                              src={relatedPost.featured_image_url}
                              alt={relatedPost.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="space-y-2">
                          {relatedPost.category && (
                            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              {relatedPost.category}
                            </span>
                          )}
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {relatedPost.title}
                          </h3>
                          {relatedPost.excerpt && (
                            <p className="text-muted-foreground line-clamp-2 text-sm">{relatedPost.excerpt}</p>
                          )}
                          <div className="flex items-center gap-2 pt-1">
                            {relatedPost.author_avatar_url ? (
                              <img
                                src={relatedPost.author_avatar_url}
                                alt={relatedPost.author_name || "Autor"}
                                className="w-5 h-5 rounded-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-muted" />
                            )}
                            <span className="text-xs text-muted-foreground">{relatedPost.author_name || "Brilus"}</span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
