import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { useAuth, UserRole } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface UserWithProfile {
  id: string;
  email: string;
  display_name: string | null;
  role: UserRole;
}

export default function AdminUsers() {
  const { user, profile, loading: authLoading } = useAuth(['admin']);
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminCount, setAdminCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && profile) {
      fetchUsers();
    }
  }, [authLoading, profile]);

  const fetchUsers = async () => {
    try {
      // Get all user profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('users_profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Get user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Combine profiles with their roles (get first role for each user)
      const usersData: UserWithProfile[] = profiles?.map(p => {
        const userRole = rolesData?.find(r => r.user_id === p.user_id);
        return {
          id: p.user_id,
          email: p.user_id, // In production, fetch from auth.users via edge function
          display_name: p.display_name,
          role: (userRole?.role || 'user') as UserRole
        };
      }) || [];

      setUsers(usersData);
      setAdminCount(usersData.filter(u => u.role === 'admin').length);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los usuarios',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    // Prevent removing the last admin
    if (adminCount === 1 && userId === user?.id && newRole !== 'admin') {
      toast({
        title: 'Error',
        description: 'No puedes degradar al único administrador',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Delete old role
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      // Insert new role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: newRole });

      if (insertError) throw insertError;

      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      
      // Update admin count
      const newAdminCount = users.filter(u => 
        u.id === userId ? newRole === 'admin' : u.role === 'admin'
      ).length;
      setAdminCount(newAdminCount);

      toast({
        title: 'Éxito',
        description: 'Rol actualizado correctamente'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el rol',
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
        <h2 className="text-3xl font-bold text-foreground">Gestión de Usuarios</h2>

        <Card className="p-6">
          {users.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No hay usuarios registrados
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID de Usuario</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((userItem) => (
                  <TableRow key={userItem.id}>
                    <TableCell className="font-mono text-xs">{userItem.id}</TableCell>
                    <TableCell>{userItem.display_name || '-'}</TableCell>
                    <TableCell>
                      <span className="capitalize">{userItem.role}</span>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={userItem.role}
                        onValueChange={(value) => handleRoleChange(userItem.id, value as UserRole)}
                        disabled={adminCount === 1 && userItem.id === user?.id && userItem.role === 'admin'}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="moderator">Moderator</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        <Card className="p-4 bg-muted/50">
          <p className="text-sm text-muted-foreground">
            <strong>Nota:</strong> No puedes degradar al único administrador del sistema.
          </p>
        </Card>
      </div>
    </AdminLayout>
  );
}
