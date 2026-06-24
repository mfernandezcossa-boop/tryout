import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, User, Link2, Unlink, KeyRound, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Therapist {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string | null;
  phone: string | null;
  status: string;
  hire_date: string | null;
  created_at: string;
}

interface TherapistForm {
  full_name: string;
  email: string;
  phone: string;
  status: string;
  hire_date: string;
  user_id: string;
}

const emptyForm: TherapistForm = { full_name: "", email: "", phone: "", status: "pending", hire_date: "", user_id: "" };

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: "Activo", color: "bg-emerald-200 dark:bg-emerald-900/40" },
  inactive: { label: "Inactivo", color: "bg-red-100 dark:bg-red-900/40" },
  pending: { label: "Pendiente", color: "bg-amber-100 dark:bg-amber-900/40" },
};

const CARD_COLORS = [
  "bg-sky-100 dark:bg-sky-900/40",
  "bg-violet-100 dark:bg-violet-900/40",
  "bg-teal-100 dark:bg-teal-900/40",
  "bg-rose-100 dark:bg-rose-900/40",
  "bg-amber-100 dark:bg-amber-900/40",
  "bg-lime-100 dark:bg-lime-900/40",
  "bg-indigo-100 dark:bg-indigo-900/40",
  "bg-orange-100 dark:bg-orange-900/40",
];

export function TherapistsSection() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TherapistForm>(emptyForm);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [createAccountOnSave, setCreateAccountOnSave] = useState(false);

  const { data: authUsers = [] } = useQuery({
    queryKey: ["auth-users-for-link"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("list-users");
      if (error) throw error;
      return (data?.users || []) as { id: string; email: string; roles: string[] }[];
    },
  });

  const { data: therapists = [], isLoading } = useQuery({
    queryKey: ["therapists"],
    queryFn: async () => {
      const { data, error } = await supabase.from("therapists").select("*").order("full_name");
      if (error) throw error;
      return data as Therapist[];
    },
  });

  const { data: modulesCount = 0 } = useQuery({
    queryKey: ["induction-modules-count"],
    queryFn: async () => {
      const { count, error } = await supabase.from("induction_modules").select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: attempts = [] } = useQuery({
    queryKey: ["therapist-quiz-attempts-summary"],
    queryFn: async () => {
      const { data, error } = await supabase.from("therapist_quiz_attempts").select("therapist_id, module_id, score, total_questions");
      if (error) throw error;
      return data;
    },
  });

  const getProgress = (id: string) => {
    const ta = attempts.filter((a) => a.therapist_id === id);
    const uniqueModules = new Set(ta.map((a) => a.module_id));
    const totalScore = ta.reduce((s, a) => s + (a.score / a.total_questions) * 100, 0);
    return { completed: uniqueModules.size, avg: ta.length > 0 ? Math.round(totalScore / ta.length) : 0 };
  };

  const saveMutation = useMutation({
    mutationFn: async (data: TherapistForm & { id?: string; shouldCreateAccount?: boolean }) => {
      const payload: any = { full_name: data.full_name, email: data.email || null, phone: data.phone || null, status: data.status, hire_date: data.hire_date || null, user_id: data.user_id || null };
      if (data.id) {
        const { error } = await supabase.from("therapists").update(payload).eq("id", data.id);
        if (error) throw error;
        return { therapistId: data.id, shouldCreateAccount: false };
      } else {
        const { data: inserted, error } = await supabase.from("therapists").insert(payload).select("id").single();
        if (error) throw error;
        return { therapistId: inserted.id, shouldCreateAccount: data.shouldCreateAccount, email: data.email };
      }
    },
    onSuccess: async (result) => {
      if (result.shouldCreateAccount && result.email) {
        try {
          const { data, error } = await supabase.functions.invoke("create-therapist-account", {
            body: { email: result.email.trim(), therapist_id: result.therapistId },
          });
          if (error) throw error;
          if (data?.error) throw new Error(data.error);
          toast({ title: "Terapeuta creado con cuenta de acceso", description: "Ya puede acceder al portal." });
        } catch (err: any) {
          toast({ title: "Terapeuta creado, pero falló la cuenta", description: err.message + ". Puedes crear la cuenta editándolo.", variant: "destructive" });
        }
      } else {
        toast({ title: editingId ? "Actualizado" : "Creado" });
      }
      queryClient.invalidateQueries({ queryKey: ["therapists"] });
      queryClient.invalidateQueries({ queryKey: ["auth-users-for-link"] });
      setDialogOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      setCreateAccountOnSave(false);
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("therapists").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["therapists"] }); toast({ title: "Eliminado" }); },
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("therapists").update({ status: "active" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["therapists"] });
      toast({ title: "Terapeuta aprobado", description: "Ya puede acceder al portal." });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const openEdit = (t: Therapist) => { setEditingId(t.id); setForm({ full_name: t.full_name, email: t.email || "", phone: t.phone || "", status: t.status, hire_date: t.hire_date || "", user_id: t.user_id || "" }); setCreateAccountOnSave(false); setDialogOpen(true); };
  const openNew = () => { setEditingId(null); setForm(emptyForm); setCreateAccountOnSave(false); setDialogOpen(true); };

  const handleCreateAccount = async () => {
    if (!form.email?.trim() || !form.email.includes("@")) {
      toast({ title: "Ingresa un email válido primero", variant: "destructive" });
      return;
    }
    if (!editingId) {
      toast({ title: "Guarda el terapeuta primero antes de crear cuenta", variant: "destructive" });
      return;
    }
    setCreatingAccount(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-therapist-account", {
        body: { email: form.email.trim(), therapist_id: editingId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast({ title: "Cuenta creada", description: "El terapeuta ya puede acceder al portal." });
      queryClient.invalidateQueries({ queryKey: ["therapists"] });
      queryClient.invalidateQueries({ queryKey: ["auth-users-for-link"] });
      setForm({ ...form, user_id: data.user_id });
    } catch (err: any) {
      toast({ title: "Error al crear cuenta", description: err.message, variant: "destructive" });
    } finally {
      setCreatingAccount(false);
    }
  };

  // Users already linked to other therapists
  const linkedUserIds = new Set(therapists.filter(t => t.user_id && t.id !== editingId).map(t => t.user_id));
  const availableUsers = authUsers.filter(u => !linkedUserIds.has(u.id));
  const getLinkedEmail = (userId: string | null) => {
    if (!userId) return null;
    return authUsers.find(u => u.id === userId)?.email || null;
  };

  if (isLoading) return <div className="py-12 text-center text-muted-foreground">Cargando…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Terapeutas</h2>
          <p className="text-muted-foreground text-sm mt-1">{therapists.length} registrados</p>
        </div>
        <Button size="lg" className="rounded-full shadow-md" onClick={openNew}>
          <Plus className="h-5 w-5 mr-2" /> Nuevo terapeuta
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {therapists.filter(t => t.status === "pending").concat(therapists.filter(t => t.status !== "pending")).map((t, idx) => {
          const progress = getProgress(t.id);
          const linkedEmail = getLinkedEmail(t.user_id);
          return (
            <div key={t.id} className={`${t.status === "pending" ? "ring-2 ring-amber-400/60" : ""} ${CARD_COLORS[idx % CARD_COLORS.length]} rounded-2xl p-5 flex flex-col justify-between min-h-[180px] transition-all hover:scale-[1.02] hover:shadow-lg`}>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                    <User className="h-5 w-5 opacity-60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground truncate">{t.full_name}</p>
                    <p className="text-xs text-foreground/60 truncate">{t.email || "Sin email"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={t.status === "active" ? "default" : "secondary"} className="text-xs">
                    {statusConfig[t.status]?.label || t.status}
                  </Badge>
                  {t.user_id ? (
                    <Badge variant="outline" className="text-xs gap-1">
                      <Link2 className="h-3 w-3" />
                      {linkedEmail ? linkedEmail.split("@")[0] : "Vinculado"}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs gap-1 text-amber-600 border-amber-300">
                      <Unlink className="h-3 w-3" />
                      Sin acceso
                    </Badge>
                  )}
                </div>
                {modulesCount > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    <Progress value={(progress.completed / modulesCount) * 100} className="h-2 flex-1" />
                    <span className="text-xs opacity-60">{progress.completed}/{modulesCount}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end mt-4 gap-1">
                {t.status === "pending" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-400 gap-1.5 text-xs font-medium px-3"
                    onClick={() => approveMutation.mutate(t.id)}
                    disabled={approveMutation.isPending}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Aprobar
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-foreground/10 hover:bg-foreground/20" onClick={() => openEdit(t)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-foreground/10 hover:bg-destructive/20" onClick={() => { if (confirm("¿Eliminar?")) deleteMutation.mutate(t.id); }}>
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            </div>
          );
        })}

        <div className="rounded-2xl border-2 border-dashed border-muted-foreground/20 p-5 flex flex-col items-center justify-center min-h-[180px] cursor-pointer hover:border-muted-foreground/40 hover:bg-muted/30 transition-all" onClick={openNew}>
          <Plus className="h-8 w-8 text-muted-foreground/40 mb-2" />
          <span className="text-sm text-muted-foreground/60 font-medium">Nuevo terapeuta</span>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editingId ? "Editar" : "Nuevo"} terapeuta</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Nombre *</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            {!editingId && form.email?.includes("@") && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
                <Switch checked={createAccountOnSave} onCheckedChange={setCreateAccountOnSave} id="create-account" />
                <Label htmlFor="create-account" className="text-sm cursor-pointer flex-1">
                  Crear cuenta y dar acceso al portal con este email
                </Label>
              </div>
            )}
            <div><Label>Teléfono</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div><Label>Estado</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Fecha de ingreso</Label><Input type="date" value={form.hire_date} onChange={(e) => setForm({ ...form, hire_date: e.target.value })} /></div>
            
            <div className="border-t pt-4">
              <Label className="flex items-center gap-2 mb-2">
                <Link2 className="h-4 w-4" />
                Vincular cuenta de usuario (acceso al portal)
              </Label>
              <Select value={form.user_id || "none"} onValueChange={(v) => setForm({ ...form, user_id: v === "none" ? "" : v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sin vincular" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin vincular</SelectItem>
                  {availableUsers.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Al vincular una cuenta, el terapeuta podrá acceder al portal con ese email.
              </p>
              {editingId && !form.user_id && (
                <div className="mt-3 pt-3 border-t border-dashed">
                  <p className="text-xs text-muted-foreground mb-2">¿No tiene cuenta aún?</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={handleCreateAccount}
                    disabled={creatingAccount}
                  >
                    <KeyRound className="h-4 w-4" />
                    {creatingAccount ? "Creando cuenta…" : "Crear cuenta con este email"}
                  </Button>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={() => { if (!form.full_name.trim()) { toast({ title: "Nombre requerido", variant: "destructive" }); return; } saveMutation.mutate({ ...form, id: editingId || undefined, shouldCreateAccount: !editingId && createAccountOnSave }); }} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Guardando…" : "Guardar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}