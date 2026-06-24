import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Save, Upload, Plus, X, User, Loader2, Eye, AlertCircle, Globe } from "lucide-react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { CredencialesEditor, type CredencialDetalle } from "./CredencialesEditor";
import { TagInput } from "./TagInput";
import { RichTextEditor } from "./RichTextEditor";

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

const THERAPEUTIC_ROLES = ["Terapeuta ABA", "Terapeuta Ocupacional", "Terapeuta de Lenguaje", "Director Clínico"];

const SPECIALTY_SUGGESTIONS = [
  'Autismo', 'TDAH', 'Early Intervention', 'Terapia de Lenguaje',
  'Análisis Conductual Aplicado', 'Terapia Ocupacional', 'Neurodesarrollo',
  'Habilidades Sociales', 'Manejo Conductual', 'Inclusión Escolar'
];

const LANGUAGE_SUGGESTIONS = ['Español', 'English', 'Français', 'Português', 'Lengua de Señas Mexicana'];

function isTherapeuticRole(role: string): boolean {
  return THERAPEUTIC_ROLES.some(r => role.toLowerCase().includes(r.toLowerCase()));
}

// ─── Live Preview Component ────────────────────────────────────
function ProfilePreview({
  name,
  roleTitle,
  photoUrl,
  presentacion,
  credenciales,
  credencialesDetalle,
  filosofia,
}: {
  name: string;
  roleTitle: string;
  photoUrl: string;
  presentacion: string;
  credenciales: string[];
  credencialesDetalle: CredencialDetalle[];
  filosofia: string;
}) {
  return (
    <div className="bg-white rounded-xl border-2 border-[hsl(210,100%,27%)] p-6 space-y-4 max-w-sm">
      {/* Avatar */}
      <div className="flex flex-col items-center text-center">
        {photoUrl ? (
          <img src={photoUrl} alt={name} className="w-24 h-24 rounded-full object-cover border-2 border-muted mb-3" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-3">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
        <h3 className="text-lg font-bold" style={{ color: "hsl(210,100%,27%)" }}>
          {name || "Nombre Completo"}
        </h3>
        <p className="text-sm font-medium" style={{ color: "hsl(16,100%,60%)" }}>
          {roleTitle || "Rol / Posición"}
        </p>
      </div>

      {/* Presentacion */}
      {presentacion && (
        <p className="text-sm text-[hsl(0,0%,40%)] leading-relaxed">{presentacion}</p>
      )}

      {/* Credenciales */}
      {credencialesDetalle.length > 0 ? (
        <div>
          <p className="text-xs font-semibold text-[hsl(0,0%,20%)] uppercase tracking-wider mb-2">Lo que hago</p>
          <ul className="space-y-2">
            {credencialesDetalle.filter(c => c.title || c.institution).map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                {c.logo_url ? (
                  <img src={c.logo_url} alt={c.institution} className="w-6 h-6 rounded object-contain flex-shrink-0 mt-0.5" />
                ) : (
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[hsl(16,100%,60%)] flex-shrink-0" />
                )}
                <div>
                  <p className="text-sm text-[hsl(0,0%,30%)] font-medium">{c.title}</p>
                  {c.institution && <p className="text-xs text-[hsl(0,0%,50%)]">{c.institution}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : credenciales.filter(Boolean).length > 0 ? (
        <div>
          <p className="text-xs font-semibold text-[hsl(0,0%,20%)] uppercase tracking-wider mb-2">Lo que hago</p>
          <ul className="space-y-1">
            {credenciales.filter(Boolean).map((c, i) => (
              <li key={i} className="text-sm text-[hsl(0,0%,40%)] flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[hsl(16,100%,60%)] flex-shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Filosofia */}
      {filosofia && (
        <blockquote className="border-l-4 pl-3 italic text-sm text-[hsl(0,0%,40%)]" style={{ borderColor: "hsl(145,47%,36%)" }}>
          "{filosofia}"
        </blockquote>
      )}
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────
export const TeamMemberForm = ({ memberId, onSave, onCancel }: TeamMemberFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cpLogoInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingCpLogo, setUploadingCpLogo] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [bioShort, setBioShort] = useState("");
  const [presentacion, setPresentacion] = useState("");
  const [credenciales, setCredenciales] = useState<string[]>(["", ""]);
  const [credencialesDetalle, setCredencialesDetalle] = useState<CredencialDetalle[]>([]);
  const [presentacionHtml, setPresentacionHtml] = useState("");
  const [filosofia, setFilosofia] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [featuredQuote, setFeaturedQuote] = useState("");
  const [yearsExperience, setYearsExperience] = useState<string>("");
  const [certificationNumber, setCertificationNumber] = useState("");
  const [consultingPartnerName, setConsultingPartnerName] = useState("");
  const [consultingPartnerDescription, setConsultingPartnerDescription] = useState("");
  const [consultingPartnerLogoUrl, setConsultingPartnerLogoUrl] = useState("");
  const [visible, setVisible] = useState(false);
  const [orderIndex, setOrderIndex] = useState(100);
  const [showPreview, setShowPreview] = useState(false);

  const effectiveRole = isCustomRole ? customRole : roleTitle;
  const isTherapeut = isTherapeuticRole(effectiveRole);

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
      setBioShort(data.bio_short || "");
      setPresentacion((data as any).presentacion_personal || "");
      const creds = (data as any).credenciales as string[] | null;
      setCredenciales(creds && creds.length > 0 ? creds : ["", ""]);
      const detalle = (data as any).credenciales_detalle;
      if (Array.isArray(detalle) && detalle.length > 0) {
        setCredencialesDetalle(detalle);
      }
      setFilosofia((data as any).filosofia || "");
      const sp = (data as any).specialties;
      if (Array.isArray(sp)) setSpecialties(sp);
      const lg = (data as any).languages;
      if (Array.isArray(lg)) setLanguages(lg);
      setFeaturedQuote((data as any).featured_quote || "");
      setYearsExperience((data as any).years_experience != null ? String((data as any).years_experience) : "");
      setCertificationNumber((data as any).certification_number || "");
      const cp = (data as any).consulting_partnership;
      if (cp) {
        setConsultingPartnerName(cp.name || "");
        setConsultingPartnerDescription(cp.description || "");
        setConsultingPartnerLogoUrl(cp.logo_url || "");
      }
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

  const handleCpLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/svg+xml", "image/webp"].includes(file.type)) {
      toast({ title: "Formato no válido", description: "Solo JPG, PNG, SVG o WebP", variant: "destructive" });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Archivo muy grande", description: "El logo no puede superar 2MB", variant: "destructive" });
      return;
    }
    setUploadingCpLogo(true);
    const ext = file.name.split(".").pop();
    const path = `team/logos/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("Photos").upload(path, file);
    if (uploadError) {
      toast({ title: "Error al subir", description: uploadError.message, variant: "destructive" });
      setUploadingCpLogo(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("Photos").getPublicUrl(path);
    if (urlData) setConsultingPartnerLogoUrl(urlData.publicUrl);
    setUploadingCpLogo(false);
  };

  const addCredential = () => {
    if (credenciales.length >= 4) return;
    setCredenciales([...credenciales, ""]);
  };

  const removeCredential = (i: number) => {
    if (credenciales.length <= 2) return;
    setCredenciales(credenciales.filter((_, idx) => idx !== i));
  };

  const updateCredential = (i: number, val: string) => {
    const next = [...credenciales];
    next[i] = val;
    setCredenciales(next);
  };

  const validate = (): string | null => {
    if (!name.trim() || name.trim().length < 3) return "El nombre debe tener al menos 3 caracteres.";
    if (!effectiveRole.trim()) return "El rol es obligatorio.";
    const plainText = presentacion.replace(/[#*_\->\[\]()]/g, '').trim();
    // No minimum character limit for presentacion personal
    // Validate credentials: either detalle or plain text
    const hasDetalleCredentials = credencialesDetalle.filter(c => c.title || c.institution).length >= 2;
    const hasPlainCredentials = credenciales.filter(Boolean).length >= 2;
    if (!hasDetalleCredentials && !hasPlainCredentials) return "Agrega al menos 2 credenciales.";
    if (filosofia.length > 200) return "La filosofía no puede exceder 200 caracteres.";
    return null;
  };

  const handleSave = async (publish: boolean) => {
    const err = validate();
    if (err) {
      toast({ title: "Campos incompletos", description: err, variant: "destructive" });
      return;
    }

    if (!photoUrl && publish) {
      toast({ title: "⚠ Foto recomendada", description: "Una foto profesional genera más confianza. Recomendamos subirla antes de publicar.", variant: "default" });
    }

    setSaving(true);
    // Build plain text credenciales from detailed ones for backward compat
    const credencialesPlain = credencialesDetalle.length > 0
      ? credencialesDetalle.filter(c => c.title || c.institution).map(c => [c.title, c.institution].filter(Boolean).join(' — '))
      : credenciales.filter(Boolean);

    const payload: Record<string, any> = {
      name: name.trim(),
      role_title: effectiveRole.trim(),
      photo_url: photoUrl || null,
      bio_short: bioShort.trim() || null,
      certification_number: certificationNumber.trim() || null,
      consulting_partnership: consultingPartnerName.trim()
        ? {
            name: consultingPartnerName.trim(),
            description: consultingPartnerDescription.trim(),
            logo_url: consultingPartnerLogoUrl.trim() || undefined,
          }
        : null,
      presentacion_personal: presentacion || null,
      credenciales: credencialesPlain,
      credenciales_detalle: credencialesDetalle,
      filosofia: filosofia || null,
      specialties,
      languages,
      featured_quote: featuredQuote || null,
      years_experience: yearsExperience !== '' ? Number(yearsExperience) : null,
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
          : "Perfil guardado como borrador. Activa 'Visible en web' para publicarlo.",
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

  const presentacionHelper = isTherapeut
    ? "Ejemplo: Llevo X años trabajando con niños con autismo, especialmente en [área]. Lo que más me motiva es... Mi enfoque es..."
    : "Ejemplo: Mi trabajo en Brilus es [qué haces concretamente]. Elegí estar aquí porque... Creo que...";

  const credPlaceholder = isTherapeut
    ? "Ej: Licenciada en Psicología por la UNAM"
    : "Ej: 5 años liderando estrategia en Brilus";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Button variant="ghost" onClick={onCancel} className="text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            className="md:hidden"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="mr-2 h-4 w-4" />
            {showPreview ? "Ocultar Preview" : "Ver Preview"}
          </Button>
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

      {/* Content: Form + Preview */}
      <div className="flex gap-6 items-start">
        {/* Form Column */}
        <div className="flex-1 space-y-5 min-w-0">
          {/* Section 1: Info Básica */}
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
                  <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Mínimo 3 caracteres</p>
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

          {/* Section 2: Bio Short */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Descripción Corta <Badge variant="secondary" className="ml-2 text-xs">Opcional</Badge></CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label>Resumen breve visible junto al nombre</Label>
              <Textarea
                value={bioShort}
                onChange={(e) => setBioShort(e.target.value)}
                placeholder="Ej: Especialista en intervención temprana con más de 8 años de experiencia..."
                rows={3}
                maxLength={300}
              />
              <div className="flex justify-between">
                <p className="text-xs text-muted-foreground">Se muestra debajo del nombre en el perfil.</p>
                <span className="text-xs text-muted-foreground font-mono">{bioShort.length}/300</span>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Presentación */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Presentación Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label>Quién eres *</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Usa negritas, párrafos y listas para estructurar la biografía.
              </p>
              <RichTextEditor
                content={presentacion}
                onChange={(md) => setPresentacion(md)}
                onHtmlChange={(html) => setPresentacionHtml(html)}
                placeholder="Cuenta quién eres, por qué haces lo que haces, y tu enfoque de trabajo..."
              />
              <p className="text-xs text-muted-foreground">{presentacionHelper}</p>
            </CardContent>
          </Card>

          {/* Section 3: Credenciales Detalladas */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Credenciales / Experiencia</CardTitle>
              <p className="text-xs text-muted-foreground">
                {isTherapeut
                  ? "Incluye solo lo más relevante: título, certificaciones importantes, especialización."
                  : "Enfócate en lo que has construido en Brilus y tu impacto concreto."}
              </p>
            </CardHeader>
            <CardContent>
              <CredencialesEditor
                value={credencialesDetalle}
                onChange={setCredencialesDetalle}
                userId={user?.id}
              />
              {credencialesDetalle.filter(c => c.title || c.institution).length < 2 && (
                <p className="text-xs text-amber-600 flex items-center gap-1 mt-3"><AlertCircle className="h-3 w-3" /> Agrega al menos 2 credenciales</p>
              )}
            </CardContent>
          </Card>

          {/* Section 4: Especialidades, Idiomas y Experiencia */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Perfil Profesional <Badge variant="secondary" className="ml-2 text-xs">Opcional</Badge></CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="years_exp">Años de experiencia</Label>
                <Input
                  id="years_exp"
                  type="number"
                  min={0}
                  max={60}
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  placeholder="ej. 7"
                  className="w-32"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cert_number">Número de certificación</Label>
                <Input
                  id="cert_number"
                  value={certificationNumber}
                  onChange={(e) => setCertificationNumber(e.target.value)}
                  placeholder="ej. BCBA #1-23-45678"
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground">Opcional. Se mostrará en el perfil público.</p>
              </div>

              <TagInput
                label="Especialidades"
                value={specialties}
                onChange={setSpecialties}
                placeholder="ej. Autismo, TDAH, Early Intervention"
                suggestions={SPECIALTY_SUGGESTIONS}
              />

              <TagInput
                label="Idiomas"
                value={languages}
                onChange={setLanguages}
                placeholder="ej. Español, English"
                suggestions={LANGUAGE_SUGGESTIONS}
              />

              {/* Consulting Partnership */}
              <div className="space-y-3 p-4 rounded-lg border border-border">
                <Label className="text-sm font-semibold">Consulting Partnership</Label>
                <p className="text-xs text-muted-foreground">Si este miembro tiene una alianza de consultoría, llena los campos. Déjalos vacíos para no mostrar esta sección.</p>
                <div className="space-y-1.5">
                  <Label htmlFor="cp_name">Nombre del partner</Label>
                  <Input id="cp_name" value={consultingPartnerName} onChange={(e) => setConsultingPartnerName(e.target.value)} placeholder="ej. Grupo ABA México" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cp_desc">Descripción</Label>
                  <Textarea id="cp_desc" value={consultingPartnerDescription} onChange={(e) => setConsultingPartnerDescription(e.target.value)} rows={3} placeholder="Descripción de la alianza estratégica" />
                </div>
                <div className="space-y-1.5">
                  <Label>Logo del partner (opcional)</Label>
                  <div className="flex items-center gap-3">
                    {consultingPartnerLogoUrl ? (
                      <img src={consultingPartnerLogoUrl} alt="Logo" className="w-12 h-12 rounded object-contain border border-muted" />
                    ) : (
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center border border-dashed border-muted-foreground/30">
                        <Upload className="h-4 w-4 text-muted-foreground/50" />
                      </div>
                    )}
                    <div className="space-y-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => cpLogoInputRef.current?.click()}
                        disabled={uploadingCpLogo}
                      >
                        {uploadingCpLogo ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Upload className="mr-2 h-3 w-3" />}
                        {consultingPartnerLogoUrl ? "Cambiar logo" : "Subir logo"}
                      </Button>
                      {consultingPartnerLogoUrl && (
                        <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={() => setConsultingPartnerLogoUrl("")}>
                          <X className="mr-1 h-3 w-3" /> Quitar
                        </Button>
                      )}
                    </div>
                    <input
                      ref={cpLogoInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/svg+xml,image/webp"
                      className="hidden"
                      onChange={handleCpLogoUpload}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="featured_quote">Frase destacada</Label>
                <Textarea
                  id="featured_quote"
                  value={featuredQuote}
                  onChange={(e) => setFeaturedQuote(e.target.value)}
                  placeholder="Una frase inspiradora que defina a este miembro"
                  rows={2}
                  maxLength={300}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Filosofía */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Filosofía Personal <Badge variant="secondary" className="ml-2 text-xs">Opcional</Badge></CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Textarea
                value={filosofia}
                onChange={(e) => setFilosofia(e.target.value)}
                placeholder="Una frase genuina sobre cómo trabajas o qué te guía"
                rows={2}
                maxLength={200}
              />
              <div className="flex justify-between">
                <p className="text-xs text-muted-foreground">
                  Ejemplo: Para mí cada niño se comunica, aunque no sea con palabras, y mi trabajo es construir desde ahí.
                </p>
                <span className="text-xs text-muted-foreground font-mono">{filosofia.length}/200</span>
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Config */}
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
                <p className="text-xs text-muted-foreground">Los perfiles se ordenarán de menor a mayor número</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Column - Desktop */}
        <div className="hidden md:block w-[340px] flex-shrink-0 sticky top-6">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Vista previa
            </h3>
            <ProfilePreview
              name={name}
              roleTitle={effectiveRole}
              photoUrl={photoUrl}
              presentacion={presentacion}
              credenciales={credenciales}
              credencialesDetalle={credencialesDetalle}
              filosofia={filosofia}
            />
          </div>
        </div>
      </div>

      {/* Preview - Mobile Accordion */}
      {showPreview && (
        <div className="md:hidden">
          <ProfilePreview
            name={name}
            roleTitle={effectiveRole}
            photoUrl={photoUrl}
            presentacion={presentacion}
            credenciales={credenciales}
            credencialesDetalle={credencialesDetalle}
            filosofia={filosofia}
          />
        </div>
      )}
    </div>
  );
};
