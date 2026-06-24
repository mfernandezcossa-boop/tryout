import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import NavbarBrilus from "@/components/NavbarBrilus";

const signInSchema = z.object({
  email: z.string().trim().min(1, "El email es requerido").email("Email inválido").max(254, "Email demasiado largo"),
  password: z.string().min(1, "La contraseña es requerida").max(128, "Contraseña demasiado larga"),
});

const signUpSchema = z.object({
  full_name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(100, "Nombre demasiado largo"),
  email: z.string().trim().min(1, "El email es requerido").email("Email inválido").max(254, "Email demasiado largo"),
  phone: z.string().trim().max(20, "Teléfono demasiado largo").optional().or(z.literal("")),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres").max(128, "Contraseña demasiado larga"),
});

const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "El email es requerido").email("Email inválido").max(254, "Email demasiado largo"),
});

type SignInFormValues = z.infer<typeof signInSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { full_name: "", email: "", phone: "", password: "" },
  });

  const forgotPasswordForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/seleccionar-portal");
      }
    });
  }, [navigate]);

  const handleSignIn = async (data: SignInFormValues) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast({ title: "Error de inicio de sesión", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Inicio de sesión exitoso", description: "Bienvenido de vuelta" });
    navigate("/seleccionar-portal");
  };

  const handleSignUp = async (data: SignUpFormValues) => {
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { emailRedirectTo: `${window.location.origin}/seleccionar-portal` },
    });

    if (error) {
      toast({ title: "Error de registro", description: error.message, variant: "destructive" });
      return;
    }

    const userId = signUpData.user?.id;
    if (!userId) {
      toast({
        title: "No pudimos completar tu alta",
        description: "Ese email ya existe o el registro no terminó correctamente. Intenta iniciar sesión o usa otro email.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: registrationData, error: fnError } = await supabase.functions.invoke("register-therapist", {
        body: {
          user_id: userId,
          full_name: data.full_name.trim(),
          email: data.email.trim(),
          phone: data.phone?.trim() || null,
        },
      });

      if (fnError) throw new Error(fnError.message);
      if (registrationData?.error) throw new Error(registrationData.error);

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) throw new Error(signInError.message);

      toast({ title: "Registro exitoso", description: "Tu solicitud fue enviada. Ahora puedes continuar." });
      navigate("/pendiente-aprobacion");
    } catch (err: any) {
      const message = String(err?.message || "");
      const description = message.includes("User not found in Auth")
        ? "Ese email ya existe o el alta no se completó. Intenta iniciar sesión o usa otro email."
        : "No pudimos crear tu solicitud como terapeuta. Intenta de nuevo con otro email o avísanos para revisarlo.";

      await supabase.auth.signOut();
      toast({ title: "No pudimos completar tu alta", description, variant: "destructive" });
    }
  };

  const handleForgotPassword = async (data: ForgotPasswordFormValues) => {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email.trim(), {
      redirectTo: `https://brilus-mx.lovable.app/reset-password`,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    setForgotPasswordSent(true);
    toast({ title: "Correo enviado", description: "Revisa tu bandeja de entrada para restablecer tu contraseña." });
  };

  return (
    <>
      <SEOHead title="Acceso – Brilus" description="Página de acceso" noindex={true} />
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <NavbarBrilus />
        <div className="pt-[88px] md:pt-[96px]">
          <div className="container mx-auto px-4 py-16 flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Acceso a Brilus</CardTitle>
                <CardDescription>Inicia sesión o regístrate para acceder al portal</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Iniciar Sesión</TabsTrigger>
                    <TabsTrigger value="signup">Registrarse</TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin">
                    {showForgotPassword ? (
                      forgotPasswordSent ? (
                        <div className="space-y-4 py-4 text-center">
                          <Alert className="border-primary/20 bg-primary/5">
                            <Info className="h-4 w-4 text-primary" />
                            <AlertTitle className="text-sm font-medium">Correo enviado</AlertTitle>
                            <AlertDescription className="text-xs text-muted-foreground">
                              Revisa tu bandeja de entrada y sigue el enlace para restablecer tu contraseña.
                            </AlertDescription>
                          </Alert>
                          <Button
                            type="button"
                            variant="link"
                            onClick={() => {
                              setShowForgotPassword(false);
                              setForgotPasswordSent(false);
                              forgotPasswordForm.reset();
                            }}
                          >
                            Volver a iniciar sesión
                          </Button>
                        </div>
                      ) : (
                        <form
                          onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)}
                          className="space-y-4"
                          autoComplete="off"
                        >
                          <p className="text-sm text-muted-foreground">
                            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
                          </p>
                          <div className="space-y-2">
                            <label htmlFor="forgot-email" className="text-sm font-medium leading-none">Email</label>
                            <Input
                              id="forgot-email"
                              type="email"
                              placeholder="tu@email.com"
                              autoComplete="off"
                              autoCapitalize="none"
                              autoCorrect="off"
                              spellCheck={false}
                              inputMode="email"
                              data-lpignore="true"
                              data-1p-ignore="true"
                              {...forgotPasswordForm.register("email")}
                            />
                            {forgotPasswordForm.formState.errors.email && (
                              <p className="text-sm font-medium text-destructive">
                                {forgotPasswordForm.formState.errors.email.message}
                              </p>
                            )}
                          </div>
                          <Button type="submit" className="w-full" disabled={forgotPasswordForm.formState.isSubmitting}>
                            {forgotPasswordForm.formState.isSubmitting ? "Enviando..." : "Enviar enlace"}
                          </Button>
                          <Button
                            type="button"
                            variant="link"
                            className="w-full"
                            onClick={() => {
                              setShowForgotPassword(false);
                              forgotPasswordForm.reset();
                            }}
                          >
                            Volver a iniciar sesión
                          </Button>
                        </form>
                      )
                    ) : (
                      <Form {...signInForm}>
                        <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                          <FormField
                            control={signInForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="tu@email.com" autoComplete="email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={signInForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Contraseña</FormLabel>
                                <FormControl>
                                  <Input type="password" autoComplete="current-password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" className="w-full" disabled={signInForm.formState.isSubmitting}>
                            {signInForm.formState.isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
                          </Button>
                          <button
                            type="button"
                            className="w-full text-sm text-muted-foreground transition-colors hover:text-foreground"
                            onClick={() => setShowForgotPassword(true)}
                          >
                            ¿Olvidaste tu contraseña?
                          </button>
                        </form>
                      </Form>
                    )}
                  </TabsContent>

                  <TabsContent value="signup">
                    <Form {...signUpForm}>
                      <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                        <FormField
                          control={signUpForm.control}
                          name="full_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre completo *</FormLabel>
                              <FormControl>
                                <Input placeholder="Tu nombre completo" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signUpForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="tu@email.com" autoComplete="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signUpForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Teléfono (opcional)</FormLabel>
                              <FormControl>
                                <Input type="tel" placeholder="55 1234 5678" autoComplete="tel" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signUpForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contraseña *</FormLabel>
                              <FormControl>
                                <Input type="password" autoComplete="new-password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full" disabled={signUpForm.formState.isSubmitting}>
                          {signUpForm.formState.isSubmitting ? "Registrando..." : "Crear Cuenta"}
                        </Button>
                        <Alert className="mt-4 border-primary/20 bg-primary/5">
                          <Info className="h-4 w-4 text-primary" />
                          <AlertTitle className="text-sm font-medium">¿Cómo funciona?</AlertTitle>
                          <AlertDescription className="text-xs text-muted-foreground">
                            Al registrarte, tu solicitud será revisada por el equipo de Brilus. Una vez aprobada, podrás acceder al portal de terapeutas con todos los módulos y recursos.
                          </AlertDescription>
                        </Alert>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}