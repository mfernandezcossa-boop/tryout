import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye } from 'lucide-react';
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

const statusColors = {
  new: 'bg-blue-500',
  in_review: 'bg-yellow-500',
  done: 'bg-green-500',
  spam: 'bg-red-500'
};

export default function AdminForms() {
  const { userRoles, loading: authLoading } = useAuth(['moderator', 'admin']);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterFormName, setFilterFormName] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formNames, setFormNames] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && userRoles.roles.length > 0) {
      fetchSubmissions();
    }
  }, [authLoading, userRoles]);

  const fetchSubmissions = async () => {
    try {
      let query = supabase
        .from('form_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      setSubmissions((data || []) as FormSubmission[]);
      
      // Extract unique form names
      const uniqueNames = Array.from(new Set(data?.map(s => s.form_name) || []));
      setFormNames(uniqueNames);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los formularios',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (filterFormName !== 'all' && sub.form_name !== filterFormName) return false;
    if (filterStatus !== 'all' && sub.status !== filterStatus) return false;
    return true;
  });

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
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground">Gestión de Formularios</h2>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={filterFormName} onValueChange={setFilterFormName}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por formulario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los formularios</SelectItem>
                  {formNames.map(name => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="new">Nuevo</SelectItem>
                  <SelectItem value="in_review">En revisión</SelectItem>
                  <SelectItem value="done">Completado</SelectItem>
                  <SelectItem value="spam">Spam</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          {filteredSubmissions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No hay solicitudes de contacto aún
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Formulario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      {format(new Date(submission.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </TableCell>
                    <TableCell className="font-medium">{submission.form_name}</TableCell>
                    <TableCell>{submission.email || '-'}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[submission.status]}>
                        {statusLabels[submission.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/admin/forms/${submission.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
