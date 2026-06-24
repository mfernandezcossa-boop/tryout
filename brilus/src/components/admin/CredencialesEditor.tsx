import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Upload, Loader2, GraduationCap } from 'lucide-react';

export interface CredencialDetalle {
  institution: string;
  logo_url: string;
  title: string;
}

interface CredencialesEditorProps {
  value: CredencialDetalle[];
  onChange: (value: CredencialDetalle[]) => void;
  userId?: string;
}

export function CredencialesEditor({ value, onChange, userId }: CredencialesEditorProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const addCredencial = () => {
    if (value.length >= 4) {
      toast({ title: 'Límite', description: 'Máximo 4 credenciales permitidas', variant: 'destructive' });
      return;
    }
    onChange([...value, { institution: '', logo_url: '', title: '' }]);
  };

  const removeCredencial = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateCredencial = (index: number, field: keyof CredencialDetalle, val: string) => {
    const updated = [...value];
    updated[index] = { ...updated[index], [field]: val };
    onChange(updated);
  };

  const handleLogoUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Error', description: 'Solo se permiten imágenes', variant: 'destructive' });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: 'Error', description: 'La imagen no debe superar 2MB', variant: 'destructive' });
      return;
    }

    setUploadingIndex(index);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId || 'shared'}/credentials/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: signedUrlData } = await supabase.storage
        .from('blog-media')
        .createSignedUrl(fileName, 60 * 60 * 24 * 365);

      if (signedUrlData) {
        updateCredencial(index, 'logo_url', signedUrlData.signedUrl);
        toast({ title: 'Éxito', description: 'Logo subido correctamente' });
      }
    } catch {
      toast({ title: 'Error', description: 'No se pudo subir el logo', variant: 'destructive' });
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          Credenciales y Educación
        </Label>
        <Button type="button" variant="outline" size="sm" onClick={addCredencial} disabled={value.length >= 4}>
          <Plus className="w-4 h-4 mr-1" /> Agregar
        </Button>
      </div>

      {value.length === 0 && (
        <p className="text-sm text-muted-foreground italic">
          No hay credenciales. Haz clic en "Agregar" para añadir una.
        </p>
      )}

      {value.map((cred, index) => (
        <Card key={index} className="p-4 space-y-3 relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-destructive hover:text-destructive"
            onClick={() => removeCredencial(index)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <div className="flex gap-4 items-start">
            {/* Logo preview / upload */}
            <div className="flex-shrink-0 space-y-2">
              <div className="w-14 h-14 rounded-lg border border-border bg-muted flex items-center justify-center overflow-hidden">
                {cred.logo_url ? (
                  <img src={cred.logo_url} alt="Logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <GraduationCap className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleLogoUpload(index, e)}
                  disabled={uploadingIndex === index}
                />
                <span className="text-xs text-primary hover:underline flex items-center gap-1">
                  {uploadingIndex === index ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Upload className="w-3 h-3" />
                  )}
                  Logo
                </span>
              </label>
            </div>

            {/* Fields */}
            <div className="flex-1 space-y-2">
              <div>
                <Label className="text-xs text-muted-foreground">Institución / Universidad</Label>
                <Input
                  placeholder="ej. Universidad Nacional Autónoma de México"
                  value={cred.institution}
                  onChange={(e) => updateCredencial(index, 'institution', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Título / Certificación</Label>
                <Input
                  placeholder="ej. Maestría en Análisis Conductual Aplicado"
                  value={cred.title}
                  onChange={(e) => updateCredencial(index, 'title', e.target.value)}
                />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
