import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Save, Upload, User, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface TeamMemberFormProps {
  memberId?: string;
  onSave: () => void;
  onCancel: () => void;
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

const CLINICAL_ROLES = ["Terapeuta ABA", "Terapeuta Ocupacional", "Terapeuta de Lenguaje", "Director Clínico"];

const SPECIALTY_SUGGESTIONS = [
  "Autismo", "TDAH", "Early Intervention", "Terapia de Lenguaje",
  "Análisis Conductual Aplicado", "Terapia Ocupacional", "Neurodesarrollo",
  "Habilidades Sociales", "Manejo Conductual", "Inclusión Escolar",
];

function isClinicalRole(role: string): boolean {
  return CLINICAL_ROLES.some(r => role.toLowerCase().includes(r.toLowerCase()));
}

export const TeamMemberForm = ({ memberId, onSave, onCancel }: TeamMemberFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [sobre, setSobre] = useState("");
  const [formacion, setFormacion] = useState("");
  const [certificationNumber, setCertificationNumber] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [specialtyInput, setSpecialtyInput] = useState("");
  const [visible, setVisible] = useState(false);
  const [orderIndex, setOrderIndex] = useState(100);

  const effectiveRole = isCustomRole ? customRole : roleTitle;
  const isClinical = isClinicalRole(effectiveRole);

  useEffect(() => {
    if (memberId) fetchMember();
  }, [memberId]);

  const fetchMember = async () => {
    if (!memberId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("id", memberId)
      .single();

    if (error) {
      toast({ title: "Error", description: "No se pudo cargar el miembro", variant: "destructive" });
      onCancel();
    } else if (data) {
      setName(data.name);
      const predefined = ROLE_OPTIONS.includes(data.role_title);
      if (predefined) {
        setRoleTitle(data.role_title);
        setIsCustomRole(false);
      } else {
        setRoleTitle("otro");
        setCustomRole(data.role_title);
        setIsCustomRole(true);
      }
      setPhotoUrl(data.photo_url || "");
      setSobre((data as any).presentacion_personal || data.bio_short || "");
      setFormacion((data as any).formacion || "");
      setCertificationNumber((data as any).certification_number || "");
      const sp = (data as any).specialties;
      if (Array.isArray(sp)) setSpecialties(sp);
      setVisible(data.visible);
      setOrderIndex(data.order_index ?? 100);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast({ title: "Formato no válido", description: "Solo se permiten JPG y PNG", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Archivo muy grande", description: "La imagen no puede superar 5MB", variant: "destructive" });
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `team/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("Photos").upload(path, file);
    if (uploadError) {
      toast({ title: "Error al subir", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("Photos").getPublicUrl(path);
    if (urlData) setPhotoUrl(urlData.publicUrl);
    setUploading(false);
  };

  const addSpecialty = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !specialties.includes(trimmed)) {
      setSpecialties([...specialties, trimmed]);
    }
    setSpecialtyInput("");
  };

  const removeSpecialty = (tag: string) => {
    setSpecialties(specialties.filter(s => s !== tag));
  };

  const validate = (): string | null => {
    if (!name.trim() || name.trim().length < 3) return "El nombre debe tener al menos 3 caracteres.";
    if (!effectiveRole.trim()) return "El rol es obligatorio.";
    if (!sobre.trim()) return "El campo 'Sobre' es obligatorio.";
    return null;
  };

  const handleSave = async (publish: boolean) => {
    const err = validate();
    if (err) {
      toast({ title: "Campos incompletos", description: err, variant: "destructive" });
      return;
    }

    setSaving(true);
    const payload: Record<string, any> = {
      name: name.trim(),
      role_title: effectiveRole.trim(),
      photo_url: photoUrl || null,
      bio_short: sobre.trim() || null,
      presentacion_personal: sobre.trim() || null,
      formacion: formacion.trim() || null,
      certification_number: certificationNumber.trim() || null,
      specialties,
      visible: publish,
      order_index: orderIndex,
      updated_by: user?.id,
    };

    let error;
    if (memberId) {
      const res = await supabase.from("team_members").update(payload).eq("id", memberId);
      error = res.error;
    } else {
      payload.created_by = user?.id;
      const res = await supabase.from("team_members").insert([payload as any]);
      error = res.error;
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: memberId ? "Cambios guardados ✓" : "¡Perfil creado!",
        description: publish
          ? "¡Perfil publicado! Ya es visible en la página del equipo."
          : "Guardado como borrador. Activa 'Visible en web' para publicarlo.",
      });
      onSave();
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Button variant="ghost" onClick={onCancel} className="text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSave(false)} disabled={saving}>
            Guardar Borrador
          </Button>
          <Button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="bg-[hsl(16,100%,60%)] hover:bg-[hsl(16,100%,50%)] text-white"
          >
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Guardar y Publicar
          </Button>
        </div>
      </div>

      {/* 1. Información Básica */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Información Básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Photo */}
          <div className="space-y-2">
            <Label>Foto de Perfil</Label>
            <div className="flex items-center gap-4">
              {photoUrl ? (
                <img src={photoUrl} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-muted" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                  <User className="h-8 w-8 text-muted-foreground/50" />
                </div>
              )}
              <div className="space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Upload className="mr-2 h-3 w-3" />}
                  {photoUrl ? "Cambiar foto" : "Subir foto"}
                </Button>
                <p className="text-xs text-muted-foreground">JPG o PNG, máx 5MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Nombre Completo *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: María González"
              maxLength={100}
            />
            {name.length > 0 && name.trim().length < 3 && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> Mínimo 3 caracteres
              </p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <Label>Rol / Posición *</Label>
            <Select
              value={isCustomRole ? "otro" : roleTitle}
              onValueChange={(v) => {
                if (v === "otro") {
                  setIsCustomRole(true);
                  setRoleTitle("otro");
                } else {
                  setIsCustomRole(false);
                  setRoleTitle(v);
                  setCustomRole("");
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
                <SelectItem value="otro">Otro (escribir)</SelectItem>
              </SelectContent>
            </Select>
            {isCustomRole && (
              <Input
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder="Escribe el rol personalizado"
                className="mt-2"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* 2. Sobre */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Sobre {name ? name.split(" ")[0] : "este miembro"} *
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Textarea
            value={sobre}
            onChange={(e) => setSobre(e.target.value)}
            placeholder={
              isClinical
                ? "Ej: Llevo X años trabajando con niños con autismo. Lo que más me motiva es ver los avances de cada niño y acompañar a las familias en ese proceso."
                : "Ej: Mi trabajo en Brilus es [qué haces]. Elegí estar aquí porque... Me mueve..."
            }
            rows={5}
            maxLength={600}
          />
          <div className="flex justify-end">
            <span className="text-xs text-muted-foreground font-mono">{sobre.length}/600</span>
          </div>
        </CardContent>
      </Card>

      {/* 3. Perfil Clínico (solo roles clínicos) */}
      {isClinical && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Perfil Clínico <Badge variant="secondary" className="ml-2 text-xs">Opcional</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Formación */}
            <div className="space-y-1.5">
              <Label htmlFor="formacion">Formación</Label>
              <Input
                id="formacion"
                value={formacion}
                onChange={(e) => setFormacion(e.target.value)}
                placeholder="Ej: Licenciatura en Psicología, UNAM · Maestría en Análisis Conductual, ITAM"
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground">Universidad y título(s) obtenidos</p>
            </div>

            {/* Cédula */}
            <div className="space-y-1.5">
              <Label htmlFor="cert_number">Cédula / Número de certificación</Label>
              <Input
                id="cert_number"
                value={certificationNumber}
                onChange={(e) => setCertificationNumber(e.target.value)}
                placeholder="Ej: BCBA #1-23-45678 · Cédula 1234567"
                maxLength={100}
              />
            </div>

            {/* Especialidades */}
            <div className="space-y-1.5">
              <Label>Especialidades</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {specialties.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeSpecialty(tag)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={specialtyInput}
                  onChange={(e) => setSpecialtyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addSpecialty(specialtyInput);
                    }
                  }}
                  placeholder="Escribe y presiona Enter"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addSpecialty(specialtyInput)}
                  disabled={!specialtyInput.trim()}
                >
                  Agregar
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {SPECIALTY_SUGGESTIONS.filter(s => !specialties.includes(s)).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => addSpecialty(s)}
                    className="text-xs px-2 py-0.5 rounded-full border border-dashed border-muted-foreground/40 text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 4. Configuración */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Configuración</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="visible-toggle" className="cursor-pointer">Visible en página web</Label>
              <p className="text-xs text-muted-foreground">Mostrar este perfil en la página pública</p>
            </div>
            <Switch id="visible-toggle" checked={visible} onCheckedChange={setVisible} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="order">Orden de visualización</Label>
            <Input
              id="order"
              type="number"
              value={orderIndex}
              onChange={(e) => setOrderIndex(parseInt(e.target.value) || 100)}
              className="w-24"
            />
            <p className="text-xs text-muted-foreground">Los perfiles se ordenan de menor a mayor número</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
