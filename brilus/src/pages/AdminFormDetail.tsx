import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface FormSubmission {
  id: string;
  form_name: string;
  payload: any;
  email: string | null;
  status: 'new' | 'in_review' | 'done' | 'spam';
  handled_by: string | null;
  notes: string | null;
  created_at: string;
}

const statusLabels = {
  new: 'Nuevo',
  in_review: 'En revisión',
  done: 'Completado',
  spam: 'Spam'
};

export default function AdminFormDetail() {
  const { id } = useParams();
  const { user, userRoles, loading: authLoading } = useAuth(['moderator', 'admin']);
  const [submission, setSubmission] = useState<FormSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<FormSubmission['status']>('new');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && userRoles.roles.length > 0 && id) {
      fetchSubmission();
    }
  }, [authLoading, userRoles, id]);

  const fetchSubmission = async () => {
    try {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setSubmission(data as FormSubmission);
      setStatus(data.status as FormSubmission['status']);
      setNotes(data.notes || '');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'No se pudo cargar el formulario',
        variant: 'destructive'
      });
      navigate('/admin/forms');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const { error } = await supabase
        .from('form_submissions')
        .update({
          status,
          notes,
          handled_by: user?.id
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Éxito',
        description: 'Formulario actualizado'
      });
      navigate('/admin/forms');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el formulario',
        variant: 'destructive'
      });
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <SEOHead title="Detalle del Formulario – Panel Admin Brilus" description="Panel administrativo" noindex={true} />
        <AdminLayout>
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </AdminLayout>
      </>
    );
  }

  if (!submission) {
    return (
      <>
        <SEOHead title="Formulario no encontrado – Panel Admin Brilus" description="Panel administrativo" noindex={true} />
        <AdminLayout>
          <p>Formulario no encontrado</p>
        </AdminLayout>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Detalle del Formulario – Panel Admin Brilus" description="Panel administrativo" noindex={true} />
      <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate('/admin/forms')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <h2 className="text-3xl font-bold text-foreground">Detalle del Formulario</h2>

        <Card className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Formulario</Label>
              <p className="font-medium">{submission.form_name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Fecha</Label>
              <p className="font-medium">
                {format(new Date(submission.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
              </p>
            </div>
            {submission.email && (
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{submission.email}</p>
              </div>
            )}
            <div>
              <Label className="text-muted-foreground">Estado actual</Label>
              <div className="mt-1">
                <Badge>{statusLabels[submission.status]}</Badge>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-muted-foreground">Datos del formulario</Label>
            <Card className="p-4 mt-2 bg-muted/50">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(submission.payload, null, 2)}
              </pre>
            </Card>
          </div>

          <div>
            <Label htmlFor="status">Cambiar estado</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as FormSubmission['status'])}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Nuevo</SelectItem>
                <SelectItem value="in_review">En revisión</SelectItem>
                <SelectItem value="done">Completado</SelectItem>
                <SelectItem value="spam">Spam</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notas internas</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Añade notas sobre este envío..."
            />
          </div>

          <div className="flex gap-4">
            <Button onClick={handleUpdate}>
              Guardar cambios
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin/forms')}>
              Cancelar
            </Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
    </>
  );
}
