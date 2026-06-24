import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BlogMetadataSection } from "./BlogMetadataSection";
import { BlogContentSection } from "./BlogContentSection";

interface BlogEditorProps {
  postId?: string;
  onSave: () => void;
  onCancel: () => void;
}

const VERY_LARGE = 50_000;
const AUTOSAVE_DELAY = 3000; // 3 segundos

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[áàäâ]/g, "a")
    .replace(/[éèëê]/g, "e")
    .replace(/[íìïî]/g, "i")
    .replace(/[óòöô]/g, "o")
    .replace(/[úùüû]/g, "u")
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const isValidUrl = (s?: string) => {
  if (!s) return true;
  try {
    new URL(s);
    return true;
  } catch {
    return false;
  }
};

export const BlogEditor = ({ postId, onSave, onCancel }: BlogEditorProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Metadatos
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [category, setCategory] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  
  // Autor
  const [authorName, setAuthorName] = useState("");
  const [authorBio, setAuthorBio] = useState("");
  const [authorLink, setAuthorLink] = useState("");
  const [authorAvatar, setAuthorAvatar] = useState("");
  
  // Contenido
  const [content, setContent] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    if (postId) fetchPost();
    
    return () => {
      isMountedRef.current = false;
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [postId]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Auto-guardado
  useEffect(() => {
    if (!hasUnsavedChanges || !postId) return;
    
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    autoSaveTimerRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        handleAutoSave();
      }
    }, AUTOSAVE_DELAY);
    
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [
    title, excerpt, seoTitle, seoDescription, featuredImage, category, tagsInput,
    authorName, authorBio, authorLink, authorAvatar, content, hasUnsavedChanges, postId
  ]);

  const fetchPost = async () => {
    if (!postId) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setTitle(data.title);
        setSlug(data.slug);
        setExcerpt(data.excerpt || "");
        setSeoTitle(data.seo_title || "");
        setSeoDescription(data.seo_description || "");

        // Contenido con cache busting
        if (!data.content && data.content_path) {
          const pathInBucket = data.content_path.startsWith("blog-content/")
            ? data.content_path.slice("blog-content/".length)
            : data.content_path;

          const { data: fileData, error: downloadError } = await supabase.storage
            .from("blog-content")
            .download(pathInBucket);

          if (downloadError) {
            toast({
              title: "Error",
              description: "No se pudo cargar el contenido desde Storage",
              variant: "destructive",
            });
            setContent("");
          } else {
            const text = await fileData.text();
            setContent(text);
          }
        } else {
          setContent(data.content || "");
        }

        setFeaturedImage(data.featured_image_url || "");
        setAuthorName(data.author_name || "");
        setAuthorBio(data.author_bio || "");
        setAuthorLink(data.author_link || "");
        setAuthorAvatar(data.author_avatar_url || "");
        setCategory(data.category || "");
        setTagsInput(data.tags ? data.tags.join(", ") : "");
        setStatus((data.status as "draft" | "published") || "draft");
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar el post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!postId && !slug) setSlug(slugify(value));
    setHasUnsavedChanges(true);
  };

  const handleSlugChange = (value: string) => {
    setSlug(slugify(value));
    setHasUnsavedChanges(true);
  };

  const handleContentChange = useCallback((value: string) => {
    setContent(value);
    setHasUnsavedChanges(true);
  }, []);

  const uploadContentToStorage = async (postIdOrTemp: string, contentText: string): Promise<string> => {
    const fileName = `${postIdOrTemp}.md`;
    const blob = new Blob([contentText], {
      type: "text/markdown; charset=utf-8",
    });

    const { error: uploadError } = await supabase.storage
      .from("blog-content")
      .upload(fileName, blob, { upsert: true });

    if (uploadError) throw uploadError;
    return `blog-content/${fileName}`;
  };

  const handleAutoSave = async () => {
    if (!postId || autoSaving) return;
    
    setAutoSaving(true);
    
    try {
      const tagsArray = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const isVeryLarge = content.length > VERY_LARGE;
      let finalContent: string | null = content;
      let finalContentPath: string | null = null;

      if (isVeryLarge) {
        const path = await uploadContentToStorage(postId, content);
        finalContentPath = path;
        finalContent = null;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const postData: any = {
        title: title.trim() || "Sin título",
        slug: slug || slugify(title) || `post-${Date.now()}`,
        excerpt: excerpt?.trim() || null,
        seo_title: seoTitle?.trim() || null,
        seo_description: seoDescription?.trim() || null,
        content: finalContent,
        content_path: finalContentPath,
        featured_image_url: featuredImage?.trim() || null,
        author_name: authorName?.trim() || null,
        author_bio: authorBio?.trim() || null,
        author_link: authorLink?.trim() || null,
        author_avatar_url: authorAvatar?.trim() || null,
        category: category?.trim() || null,
        tags: tagsArray.length > 0 ? tagsArray : null,
        updated_by: user?.id,
      };

      const { error } = await supabase
        .from("blog_posts")
        .update(postData)
        .eq("id", postId);

      if (!error) {
        setHasUnsavedChanges(false);
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error("Error en auto-guardado:", error);
    } finally {
      setAutoSaving(false);
    }
  };

  const handleSave = async (shouldPublish: boolean) => {
    setProgress(0);
    setProgressMessage("Validando datos...");
    setSaving(true);

    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "El título y contenido son obligatorios",
        variant: "destructive",
      });
      setSaving(false);
      setProgress(0);
      setProgressMessage("");
      return;
    }

    if (!isValidUrl(featuredImage) || (authorLink && !isValidUrl(authorLink)) || (authorAvatar && !isValidUrl(authorAvatar))) {
      toast({
        title: "URL inválida",
        description: "Una o más URLs no son válidas",
        variant: "destructive",
      });
      setSaving(false);
      setProgress(0);
      setProgressMessage("");
      return;
    }

    setProgress(10);

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();
    
    if (authErr || !user?.id) {
      toast({
        title: "Sesión no válida",
        description: "Inicia sesión nuevamente.",
        variant: "destructive",
      });
      setSaving(false);
      setProgress(0);
      setProgressMessage("");
      return;
    }

    const finalSlug = (slug || slugify(title)).trim();
    setProgress(30);

    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const isVeryLarge = content.length > VERY_LARGE;
    let finalContent: string | null = content;
    let finalContentPath: string | null = null;

    if (isVeryLarge) {
      setProgressMessage("Subiendo contenido...");
      setProgress(50);

      try {
        const tempId = postId || `temp-${Date.now()}`;
        const path = await uploadContentToStorage(tempId, content);
        finalContentPath = path;
        finalContent = null;
        setProgress(70);
      } catch (uploadErr: any) {
        toast({
          title: "Error al subir contenido",
          description: uploadErr?.message || "No se pudo subir a Storage.",
          variant: "destructive",
        });
        setSaving(false);
        setProgress(0);
        setProgressMessage("");
        return;
      }
    } else {
      setProgress(70);
    }

    setProgressMessage("Guardando...");

    const postData: any = {
      title: title.trim(),
      slug: finalSlug,
      excerpt: excerpt?.trim() || null,
      seo_title: seoTitle?.trim() || null,
      seo_description: seoDescription?.trim() || null,
      content: finalContent,
      content_path: finalContentPath,
      featured_image_url: featuredImage?.trim() || null,
      author_name: authorName?.trim() || null,
      author_bio: authorBio?.trim() || null,
      author_link: authorLink?.trim() || null,
      author_avatar_url: authorAvatar?.trim() || null,
      category: category?.trim() || null,
      tags: tagsArray.length > 0 ? tagsArray : null,
      status: shouldPublish ? "published" : "draft",
      published_at: shouldPublish ? new Date().toISOString() : null,
    };

    let dbRes;
    if (postId) {
      dbRes = await supabase
        .from("blog_posts")
        .update({ ...postData, updated_by: user.id })
        .eq("id", postId)
        .select()
        .single();
    } else {
      dbRes = await supabase
        .from("blog_posts")
        .insert([
          {
            ...postData,
            author_id: user.id,
            created_by: user.id,
            updated_by: user.id,
          },
        ])
        .select()
        .single();
    }

    if (dbRes.error) {
      toast({
        title: "Error",
        description: dbRes.error.message || "No se pudo guardar",
        variant: "destructive",
      });
      setSaving(false);
      setProgress(0);
      setProgressMessage("");
    } else {
      setProgress(100);
      setProgressMessage(shouldPublish ? "Publicado" : "Guardado");
      
      // Clear Supabase cache by refetching
      await supabase
        .from("blog_posts")
        .select("id")
        .eq("id", dbRes.data.id)
        .single();
      
      toast({
        title: shouldPublish ? "Post publicado" : "Borrador guardado",
        description: shouldPublish ? "Tu artículo está online." : "Se guardó el borrador.",
      });
      setHasUnsavedChanges(false);
      setLastSaved(new Date());

      setTimeout(() => {
        setProgress(0);
        setProgressMessage("");
        setSaving(false);
        onSave();
      }, 800);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => {
              if (hasUnsavedChanges && !window.confirm("Hay cambios sin guardar. ¿Deseas salir?")) {
                return;
              }
              onCancel();
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          
          {lastSaved && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Guardado {lastSaved.toLocaleTimeString()}
            </div>
          )}
          
          {autoSaving && (
            <div className="text-sm text-muted-foreground">
              Guardando...
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSave(false)} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            Guardar Borrador
          </Button>
          <Button onClick={() => handleSave(true)} disabled={saving}>
            Publicar
          </Button>
        </div>
      </div>

      {saving && progress > 0 && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{progressMessage}</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="metadata" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="metadata">Configuración y SEO</TabsTrigger>
          <TabsTrigger value="content">Contenido</TabsTrigger>
        </TabsList>
        
        <TabsContent value="metadata" className="mt-4">
          <BlogMetadataSection
            title={title}
            slug={slug}
            excerpt={excerpt}
            seoTitle={seoTitle}
            seoDescription={seoDescription}
            featuredImage={featuredImage}
            category={category}
            tagsInput={tagsInput}
            authorName={authorName}
            authorBio={authorBio}
            authorLink={authorLink}
            authorAvatar={authorAvatar}
            onTitleChange={handleTitleChange}
            onSlugChange={handleSlugChange}
            onExcerptChange={(v) => { setExcerpt(v); setHasUnsavedChanges(true); }}
            onSeoTitleChange={(v) => { setSeoTitle(v); setHasUnsavedChanges(true); }}
            onSeoDescriptionChange={(v) => { setSeoDescription(v); setHasUnsavedChanges(true); }}
            onFeaturedImageChange={(v) => { setFeaturedImage(v); setHasUnsavedChanges(true); }}
            onCategoryChange={(v) => { setCategory(v); setHasUnsavedChanges(true); }}
            onTagsChange={(v) => { setTagsInput(v); setHasUnsavedChanges(true); }}
            onAuthorNameChange={(v) => { setAuthorName(v); setHasUnsavedChanges(true); }}
            onAuthorBioChange={(v) => { setAuthorBio(v); setHasUnsavedChanges(true); }}
            onAuthorLinkChange={(v) => { setAuthorLink(v); setHasUnsavedChanges(true); }}
            onAuthorAvatarChange={(v) => { setAuthorAvatar(v); setHasUnsavedChanges(true); }}
          />
        </TabsContent>
        
        <TabsContent value="content" className="mt-4">
          <BlogContentSection
            content={content}
            contentHtml={contentHtml}
            onChange={handleContentChange}
            onHtmlChange={setContentHtml}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
