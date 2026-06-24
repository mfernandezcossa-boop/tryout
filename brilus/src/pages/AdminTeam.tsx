import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role_title: string;
  bio_short: string | null;
  photo_url: string | null;
  email: string | null;
  phone: string | null;
  order_index: number;
  visible: boolean;
  created_at: string;
}

export default function AdminTeam() {
  const { user, userRoles, loading: authLoading } = useAuth(['moderator', 'admin']);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && userRoles.roles.length > 0) {
      fetchMembers();
    }
  }, [authLoading, userRoles]);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('order_index', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los miembros del equipo',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisible = async (id: string, currentVisible: boolean) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ visible: !currentVisible, updated_by: user?.id })
        .eq('id', id);

      if (error) throw error;

      setMembers(members.map(m => m.id === id ? { ...m, visible: !currentVisible } : m));
      toast({
        title: 'Éxito',
        description: 'Visibilidad actualizada'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la visibilidad',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este miembro?')) return;

    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMembers(members.filter(m => m.id !== id));
      toast({
        title: 'Éxito',
        description: 'Miembro eliminado'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el miembro',
        variant: 'destructive'
      });
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-foreground">Gestión de Equipo</h2>
          <Button onClick={() => navigate('/admin/team/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Miembro
          </Button>
        </div>

        <Card className="p-6">
          {members.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No hay miembros del equipo aún
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Foto</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Visible</TableHead>
                  <TableHead>Orden</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      {member.photo_url ? (
                        <img 
                          src={member.photo_url} 
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground text-sm">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.role_title}</TableCell>
                    <TableCell>
                      <Switch
                        checked={member.visible}
                        onCheckedChange={() => handleToggleVisible(member.id, member.visible)}
                      />
                    </TableCell>
                    <TableCell>{member.order_index}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin/team/${member.id}`)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {userRoles.roles.includes('admin') && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(member.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
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
