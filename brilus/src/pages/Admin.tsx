import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import NavbarBrilus from "@/components/NavbarBrilus";
import { Loader2 } from "lucide-react";

interface ContactRequest {
  id: string;
  parent_full_name: string;
  child_name: string;
  child_age_band: string;
  email: string;
  phone: string;
  concerns: string;
  consent: boolean;
  created_at: string;
}

export default function Admin() {
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          navigate("/auth");
          return;
        }

        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (roleError || !roleData) {
          toast({
            title: "Acceso denegado",
            description: "No tienes permisos de administrador",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        if (!alive) return;
        setIsAdmin(true);

        setDataLoading(true);
        const { data, error } = await supabase.functions.invoke("get-contact-requests");
        if (error) throw error;
        if (!alive) return;
        setContactRequests((data?.data as ContactRequest[]) ?? []);
      } catch (e) {
        // Only log errors in development mode to avoid exposing sensitive information
        if (import.meta.env.DEV) {
          console.error('Error checking auth:', e);
        }
        navigate("/auth");
      } finally {
        if (alive) setAuthLoading(false);
        if (alive) setDataLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [navigate, toast]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch {
      toast({ title: "Error", description: "No se pudo cerrar sesión", variant: "destructive" });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <NavbarBrilus />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <Button onClick={handleSignOut} variant="outline">
            Cerrar Sesión
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Solicitudes de Contacto</CardTitle>
            <CardDescription>{contactRequests.length} solicitudes recibidas</CardDescription>
          </CardHeader>
          <CardContent>
            {dataLoading ? (
              <div className="py-8 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : contactRequests.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No hay solicitudes de contacto aún</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Nombre del Padre/Madre</TableHead>
                      <TableHead>Nombre del Niño/a</TableHead>
                      <TableHead>Edad</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Preocupaciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contactRequests.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{new Date(r.created_at).toLocaleDateString("es-AR")}</TableCell>
                        <TableCell>{r.parent_full_name}</TableCell>
                        <TableCell>{r.child_name}</TableCell>
                        <TableCell>{r.child_age_band}</TableCell>
                        <TableCell>{r.email}</TableCell>
                        <TableCell>{r.phone}</TableCell>
                        <TableCell title={r.concerns} className="max-w-md truncate">
                          {r.concerns}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
