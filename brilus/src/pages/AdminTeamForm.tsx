import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { CredencialesEditor, type CredencialDetalle } from '@/components/admin/CredencialesEditor';
import { TagInput } from '@/components/admin/TagInput';

const SPECIALTY_SUGGESTIONS = [
  'Autismo', 'TDAH', 'Early Intervention', 'Terapia de Lenguaje',
  'Análisis Conductual Aplicado', 'Terapia Ocupacional', 'Neurodesarrollo',
  'Habilidades Sociales', 'Manejo Conductual', 'Inclusión Escolar'
];

const LANGUAGE_SUGGESTIONS = ['Español', 'English', 'Français', 'Português', 'Lengua de Señas Mexicana'];

export default function AdminTeamForm() {
  const { id } = useParams();
  const isNew = id === 'new';
  const { user, userRoles, loading: authLoading } = useAuth(['moderator', 'admin']);
  const [loading, setLoading] = useState(!isNew);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role_title: '',
    bio_short: '',
    photo_url: '',
    email: '',
    phone: '',
    visible: true,
    order_index: 100,
    featured_quote: '',
    years_experience: '' as string | number,
    certification_number: '',
    consulting_partner_name: '',
    consulting_partner_description: '',
    consulting_partner_logo_url: '',
  });
  const [credencialesDetalle, setCredencialesDetalle] = useState<CredencialDetalle[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isNew && id) {
      fetchMember();
    }
  }, [authLoading, isNew, id]);

  const fetchMember = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setFormData({
        name: data.name,
        role_title: data.role_title,
        bio_short: data.bio_short || '',
        photo_url: data.photo_url || '',
        email: data.email || '',
        phone: data.phone || '',
        visible: data.visible,
        order_index: data.order_index ?? 100,
        featured_quote: (data as any).featured_quote || '',
        years_experience: (data as any).years_experience ?? '',
        certification_number: (data as any).certification_number || '',
        consulting_partner_name: (data as any).consulting_partnership?.name || '',
        consulting_partner_description: (data as any).consulting_partnership?.description || '',
        consulting_partner_logo_url: (data as any).consulting_partnership?.logo_url || '',
      });
      const detalle = (data as any).credenciales_detalle;
      if (Array.isArray(detalle)) setCredencialesDetalle(detalle);
      const sp = (data as any).specialties;
      if (Array.isArray(sp)) setSpecialties(sp);
      const lg = (data as any).languages;
      if (Array.isArray(lg)) setLanguages(lg);
    } catch (error: any) {
      toast({ title: 'Error', description: 'No se pudo cargar el miembro', variant: 'destructive' });
      navigate('/admin/team');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Error', description: 'Solo se permiten imágenes', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Error', description: 'La imagen no debe superar 5MB', variant: 'destructive' });
      return;
    }
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('blog-media').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: signedUrlData } = await supabase.storage.from('blog-media').createSignedUrl(fileName, 60 * 60 * 24 * 365);
      if (signedUrlData) {
        setFormData(prev => ({ ...prev, photo_url: signedUrlData.signedUrl }));
        toast({ title: 'Éxito', description: 'Imagen subida correctamente' });
      }
    } catch {
      toast({ title: 'Error', description: 'No se pudo subir la imagen', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role_title) {
      toast({ title: 'Error', description: 'Nombre y cargo son obligatorios', variant: 'destructive' });
      return;
    }
    const credencialesPlain = credencialesDetalle
      .filter(c => c.title || c.institution)
      .map(c => [c.title, c.institution].filter(Boolean).join(' — '));

    try {
      const hasPartner = formData.consulting_partner_name.trim();
      const consulting_partnership = hasPartner
        ? {
            name: formData.consulting_partner_name.trim(),
            description: formData.consulting_partner_description.trim(),
            logo_url: formData.consulting_partner_logo_url.trim() || undefined,
          }
        : null;

      const { consulting_partner_name, consulting_partner_description, consulting_partner_logo_url, ...rest } = formData;

      const payload = {
        ...rest,
        credenciales: credencialesPlain,
        credenciales_detalle: credencialesDetalle,
        specialties,
        languages,
        consulting_partnership,
        featured_quote: rest.featured_quote || null,
        certification_number: rest.certification_number || null,
        years_experience: rest.years_experience !== '' ? Number(rest.years_experience) : null,
        updated_by: user?.id
      } as any;

      if (isNew) {
        payload.created_by = user?.id;
        const { error } = await supabase.from('team_members').insert(payload);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('team_members').update(payload).eq('id', id);
        if (error) throw error;
      }
      toast({ title: 'Éxito', description: isNew ? 'Miembro creado' : 'Miembro actualizado' });
      navigate('/admin/team');
    } catch {
      toast({ title: 'Error', description: 'No se pudo guardar el miembro', variant: 'destructive' });
    }
  };

  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground mb-6">
          {isNew ? 'Nuevo Miembro' : 'Editar Miembro'}
        </h2>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Nombre *</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} required />
            </div>

            <div>
              <Label htmlFor="role_title">Cargo *</Label>
              <Input id="role_title" value={formData.role_title} onChange={(e) => setFormData(prev => ({ ...prev, role_title: e.target.value }))} required />
            </div>

            <div>
              <Label htmlFor="years_experience">Años de experiencia</Label>
              <Input id="years_experience" type="number" min={0} max={60} value={formData.years_experience} onChange={(e) => setFormData(prev => ({ ...prev, years_experience: e.target.value }))} placeholder="ej. 7" />
            </div>

            <div>
              <Label htmlFor="bio_short">Biografía corta</Label>
              <Textarea id="bio_short" value={formData.bio_short} onChange={(e) => setFormData(prev => ({ ...prev, bio_short: e.target.value }))} rows={4} />
            </div>

            <div>
              <Label htmlFor="photo">Foto</Label>
              <div className="space-y-4">
                {formData.photo_url && (
                  <img src={formData.photo_url} alt="Preview" className="w-32 h-32 rounded-xl object-cover" />
                )}
                <div className="flex gap-2">
                  <Input id="photo" type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                  {uploading && <Loader2 className="h-6 w-6 animate-spin" />}
                </div>
              </div>
            </div>

            <CredencialesEditor value={credencialesDetalle} onChange={setCredencialesDetalle} userId={user?.id} />

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

            <div>
              <Label htmlFor="certification_number">Número de certificación (opcional)</Label>
              <Input id="certification_number" value={formData.certification_number} onChange={(e) => setFormData(prev => ({ ...prev, certification_number: e.target.value }))} placeholder="ej. BACB-12345" />
            </div>

            <div>
              <Label htmlFor="featured_quote">Frase destacada (opcional)</Label>
              <Textarea
                id="featured_quote"
                value={formData.featured_quote}
                onChange={(e) => setFormData(prev => ({ ...prev, featured_quote: e.target.value }))}
                rows={3}
                placeholder="Una frase inspiradora o filosofía que defina a este miembro del equipo"
              />
            </div>

            {/* Consulting Partnership (opcional) */}
            <div className="space-y-3 p-4 rounded-lg border border-border">
              <Label className="text-base font-semibold">Consulting Partnership (opcional)</Label>
              <p className="text-sm text-muted-foreground">Si este miembro tiene una alianza de consultoría, llena los campos. Déjalos vacíos para no mostrar esta sección.</p>
              <div>
                <Label htmlFor="cp_name">Nombre del partner</Label>
                <Input id="cp_name" value={formData.consulting_partner_name} onChange={(e) => setFormData(prev => ({ ...prev, consulting_partner_name: e.target.value }))} placeholder="ej. Consulting Partner" />
              </div>
              <div>
                <Label htmlFor="cp_description">Descripción</Label>
                <Textarea id="cp_description" value={formData.consulting_partner_description} onChange={(e) => setFormData(prev => ({ ...prev, consulting_partner_description: e.target.value }))} rows={3} placeholder="Descripción de la alianza estratégica" />
              </div>
              <div>
                <Label htmlFor="cp_logo">URL del logo (opcional)</Label>
                <Input id="cp_logo" value={formData.consulting_partner_logo_url} onChange={(e) => setFormData(prev => ({ ...prev, consulting_partner_logo_url: e.target.value }))} placeholder="https://..." />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} />
            </div>

            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} />
            </div>

            <div>
              <Label htmlFor="order_index">Orden</Label>
              <Input id="order_index" type="number" value={formData.order_index} onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) }))} />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="visible" checked={formData.visible} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, visible: checked }))} />
              <Label htmlFor="visible">Visible en el sitio público</Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit">Guardar</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin/team')}>Cancelar</Button>
            </div>
          </form>
        </Card>
      </div>
    </AdminLayout>
  );
}
