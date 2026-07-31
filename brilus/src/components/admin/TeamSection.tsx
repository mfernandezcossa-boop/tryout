import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, User, Filter, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { TeamMemberForm } from "./TeamMemberForm";

interface TeamMember {
  id: string;
  name: string;
  role_title: string;
  bio_short: string | null;
  photo_url: string | null;
  visible: boolean;
  order_index: number;
  presentacion_personal: string | null;
  credenciales: string[] | null;
  filosofia: string | null;
}

const ROLE_OPTIONS = [
  "Terapeuta ABA",
  "Terapeuta Ocupacional",
  "Terapeuta de Lenguaje",
  "Coordinadora de Casos",
  "Marketing & Comunicación",
  "Operaciones",
  "Director Clínico",
];

export const TeamSection = () => {
  const { toast } = useToast();
  const { userRoles } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);
  const [reordering, setReordering] = useState(false);

  const isAdmin = userRoles.roles.includes("admin");
  const isFiltering = search !== "" || roleFilter !== "all" || statusFilter !== "all";

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("order_index", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      toast({ title: "Error", description: "No se pudieron cargar los miembros", variant: "destructive" });
    } else {
      setMembers((data as TeamMember[]) || []);
    }
    setLoading(false);
  };

  const handleToggleVisible = async (id: string, currentVisible: boolean) => {
    const { error } = await supabase
      .from("team_members")
      .update({ visible: !currentVisible })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "No se pudo actualizar la visibilidad", variant: "destructive" });
    } else {
      setMembers(members.map(m => m.id === id ? { ...m, visible: !currentVisible } : m));
      toast({ title: !currentVisible ? "¡Perfil publicado!" : "Perfil ocultado", description: !currentVisible ? "Ya es visible en la página del equipo." : "El perfil ya no es visible públicamente." });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from("team_members").delete().eq("id", deleteTarget.id);
    if (error) {
      toast({ title: "Error", description: "No se pudo eliminar el miembro", variant: "destructive" });
    } else {
      setMembers(members.filter(m => m.id !== deleteTarget.id));
      toast({ title: "Perfil eliminado", description: "Puedes restaurarlo desde el archivo si lo necesitas." });
    }
    setDeleteTarget(null);
  };

  const moveOrder = async (id: string, direction: "up" | "down") => {
    const sorted = [...members].sort((a, b) => a.order_index - b.order_index);
    const idx = sorted.findIndex(m => m.id === id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const a = sorted[idx];
    const b = sorted[swapIdx];
    setReordering(true);
    const [r1, r2] = await Promise.all([
      supabase.from("team_members").update({ order_index: b.order_index }).eq("id", a.id),
      supabase.from("team_members").update({ order_index: a.order_index }).eq("id", b.id),
    ]);
    setReordering(false);
    if (r1.error || r2.error) {
      toast({ title: "Error", description: "No se pudo cambiar el orden", variant: "destructive" });
    } else {
      setMembers(members.map(m => {
        if (m.id === a.id) return { ...m, order_index: b.order_index };
        if (m.id === b.id) return { ...m, order_index: a.order_index };
        return m;
      }).sort((x, y) => x.order_index - y.order_index));
    }
  };

  const filteredMembers = members.filter(m => {
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.role_title.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || m.role_title === roleFilter;
    const matchStatus = statusFilter === "all" || (statusFilter === "published" ? m.visible : !m.visible);
    return matchSearch && matchRole && matchStatus;
  });

  if (isCreating || editingMember) {
    return (
      <TeamMemberForm
        memberId={editingMember || undefined}
        onSave={() => {
          setIsCreating(false);
          setEditingMember(null);
          fetchMembers();
        }}
        onCancel={() => {
          setIsCreating(false);
          setEditingMember(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-h3 font-bold text-foreground">Equipo Brilus</h2>
          <p className="text-body-md text-muted-foreground mt-1">Gestiona los perfiles del equipo</p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-[hsl(16,100%,60%)] hover:bg-[hsl(16,100%,50%)] text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar Miembro
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o rol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Filtrar por rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los roles</SelectItem>
            {ROLE_OPTIONS.map(r => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="published">Publicados</SelectItem>
            <SelectItem value="draft">Borradores</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-card rounded-xl border p-6 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-muted" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
              <div className="h-3 bg-muted rounded w-full mt-2" />
            </div>
          ))}
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border">
          <User className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {members.length === 0 ? "Aún no hay miembros del equipo" : "Sin resultados"}
          </h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            {members.length === 0
              ? "¡Comienza agregando el primer perfil del equipo!"
              : "Intenta cambiar los filtros o el término de búsqueda."}
          </p>
          {members.length === 0 && (
            <Button
              className="mt-6 bg-[hsl(16,100%,60%)] hover:bg-[hsl(16,100%,50%)] text-white"
              onClick={() => setIsCreating(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar primer miembro
            </Button>
          )}
        </div>
      ) : (
        <>
        {isFiltering && (
          <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
            Los botones ↑ ↓ de orden solo están disponibles sin filtros activos.
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member, idx) => (
            <div
              key={member.id}
              className="bg-card rounded-xl border p-5 transition-all duration-200 hover:shadow-md group"
            >
              {/* Top row: avatar + info + badge */}
              <div className="flex items-start gap-4 mb-4">
                {member.photo_url ? (
                  <img
                    src={member.photo_url}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0 border-2 border-muted"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="font-semibold text-foreground truncate">{member.name}</h3>
                    {!isFiltering && (
                      <div className="flex flex-col gap-0.5 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 text-muted-foreground hover:text-foreground"
                          onClick={() => moveOrder(member.id, "up")}
                          disabled={reordering || idx === 0}
                          aria-label="Mover arriba"
                        >
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 text-muted-foreground hover:text-foreground"
                          onClick={() => moveOrder(member.id, "down")}
                          disabled={reordering || idx === filteredMembers.length - 1}
                          aria-label="Mover abajo"
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{member.role_title}</p>
                  <Badge
                    variant={member.visible ? "default" : "secondary"}
                    className={`mt-1.5 text-xs ${member.visible
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
                      : "bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200"
                    }`}
                  >
                    {member.visible ? "Publicado" : "Borrador"}
                  </Badge>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t my-3" />

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={member.visible}
                    onCheckedChange={() => handleToggleVisible(member.id, member.visible)}
                    aria-label="Toggle visibilidad"
                  />
                  <span className="text-xs text-muted-foreground">Visible</span>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[hsl(210,100%,27%)] hover:bg-[hsl(210,100%,95%)]"
                    onClick={() => setEditingMember(member.id)}
                    aria-label="Editar miembro"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteTarget(member)}
                      aria-label="Eliminar miembro"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        </>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este perfil?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás por eliminar el perfil de <strong>{deleteTarget?.name}</strong>. Esta acción se puede revertir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
