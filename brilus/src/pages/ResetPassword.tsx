import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/SEOHead";
import NavbarBrilus from "@/components/NavbarBrilus";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const resetPasswordSchema = z.object({
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres").max(128, "Contraseña demasiado larga"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isReady, setIsReady] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const queryParams = new URLSearchParams(window.location.search);
    const type = hashParams.get("type") || queryParams.get("type");

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || type === "recovery" || session) {
        setIsReady(true);
        setIsChecking(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (type === "recovery" || session) {
        setIsReady(true);
      }
      setIsChecking(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (data: ResetPasswordFormValues) => {
    const { error } = await supabase.auth.updateUser({ password: data.password });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Contraseña actualizada", description: "Ya puedes iniciar sesión con normalidad." });
    navigate("/seleccionar-portal");
  };

  return (
    <>
      <SEOHead title="Restablecer contraseña – Brilus" description="Restablece tu contraseña" noindex />
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <NavbarBrilus />
        <div className="pt-[88px] md:pt-[96px]">
          <div className="container mx-auto flex items-center justify-center px-4 py-16">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Restablecer contraseña</CardTitle>
                <CardDescription>
                  {isChecking
                    ? "Estamos preparando tu acceso seguro."
                    : isReady
                      ? "Ingresa tu nueva contraseña para continuar."
                      : "Abre el enlace de recuperación desde tu correo para continuar."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isChecking ? (
                  <div className="flex justify-center py-6">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
                  </div>
                ) : isReady ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nueva contraseña *</FormLabel>
                            <FormControl>
                              <Input type="password" autoComplete="new-password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmar contraseña *</FormLabel>
                            <FormControl>
                              <Input type="password" autoComplete="new-password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Guardando..." : "Guardar contraseña"}
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <Button className="w-full" onClick={() => navigate("/auth")}>Volver a acceso</Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
