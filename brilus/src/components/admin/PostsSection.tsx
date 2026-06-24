import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BlogEditor } from "./BlogEditor";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  status: string;
  published_at: string | null;
  views_count: number;
  created_at: string;
}

const CARD_COLORS = [
  "bg-indigo-100 dark:bg-indigo-900/40",
  "bg-amber-100 dark:bg-amber-900/40",
  "bg-emerald-100 dark:bg-emerald-900/40",
  "bg-rose-100 dark:bg-rose-900/40",
  "bg-violet-100 dark:bg-violet-900/40",
  "bg-sky-100 dark:bg-sky-900/40",
  "bg-orange-100 dark:bg-orange-900/40",
  "bg-teal-100 dark:bg-teal-900/40",
];

export const PostsSection = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, status, published_at, views_count, created_at")
      .order("created_at", { ascending: false });
    if (error) { toast({ title: "Error", description: "No se pudieron cargar los posts", variant: "destructive" }); }
    setPosts(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) { toast({ title: "Error", variant: "destructive" }); } else { toast({ title: "Post eliminado" }); fetchPosts(); }
  };

  if (isCreating || editingPost) {
    return <BlogEditor postId={editingPost || undefined} onSave={() => { setIsCreating(false); setEditingPost(null); fetchPosts(); }} onCancel={() => { setIsCreating(false); setEditingPost(null); }} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Blogs</h2>
          <p className="text-muted-foreground text-sm mt-1">{posts.length} posts</p>
        </div>
        <Button size="lg" className="rounded-full shadow-md" onClick={() => setIsCreating(true)}>
          <Plus className="h-5 w-5 mr-2" /> Nuevo post
        </Button>
      </div>

      {loading ? (
        <div className="py-12 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No hay posts. ¡Crea el primero!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post, idx) => (
            <div key={post.id} className={`${CARD_COLORS[idx % CARD_COLORS.length]} rounded-2xl p-5 flex flex-col justify-between min-h-[180px] transition-all hover:scale-[1.02] hover:shadow-lg`}>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={post.status === "published" ? "default" : "secondary"} className="text-xs">
                    {post.status === "published" ? "Publicado" : "Borrador"}
                  </Badge>
                  <span className="text-xs opacity-50 flex items-center gap-1"><Eye className="h-3 w-3" />{post.views_count}</span>
                </div>
                <p className="font-bold text-foreground leading-snug line-clamp-2">{post.title}</p>
                {post.excerpt && <p className="text-sm text-foreground/70 mt-1 line-clamp-2">{post.excerpt}</p>}
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs opacity-50">{new Date(post.created_at).toLocaleDateString("es-ES")}</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-foreground/10 hover:bg-foreground/20" onClick={() => setEditingPost(post.id)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-foreground/10 hover:bg-destructive/20" onClick={() => handleDelete(post.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <div className="rounded-2xl border-2 border-dashed border-muted-foreground/20 p-5 flex flex-col items-center justify-center min-h-[180px] cursor-pointer hover:border-muted-foreground/40 hover:bg-muted/30 transition-all" onClick={() => setIsCreating(true)}>
            <Plus className="h-8 w-8 text-muted-foreground/40 mb-2" />
            <span className="text-sm text-muted-foreground/60 font-medium">Nuevo post</span>
          </div>
        </div>
      )}
    </div>
  );
};