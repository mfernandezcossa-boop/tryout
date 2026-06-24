import { useState, useEffect, lazy, Suspense, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SEOHead } from "@/components/SEOHead";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar, type AdminSection } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

// Lazy load de secciones pesadas con named exports
const PostsSection = lazy(() => import("@/components/admin/PostsSection").then((m) => ({ default: m.PostsSection })));
const TeamSection = lazy(() => import("@/components/admin/TeamSection").then((m) => ({ default: m.TeamSection })));
const FormsSection = lazy(() => import("@/components/admin/FormsSection").then((m) => ({ default: m.FormsSection })));
const UsersSection = lazy(() => import("@/components/admin/UsersSection").then((m) => ({ default: m.UsersSection })));
const TestimonialsSection = lazy(() => import("@/components/admin/TestimonialsSection"));
const LocationsSection = lazy(() => import("@/components/admin/LocationsSection"));
const QuizzSection = lazy(() => import("@/components/admin/QuizzSection"));
const FAQsSection = lazy(() => import("@/components/admin/FAQsSection"));
const KnowledgeBaseSection = lazy(() => import("@/components/admin/KnowledgeBaseSection"));
const DiagnosticoSection = lazy(() => import("@/components/admin/DiagnosticoSection"));
const JobApplicationsSection = lazy(() => import("@/components/admin/JobApplicationsSection"));
const InductionModulesSection = lazy(() =>
  import("@/components/admin/InductionModulesSection").then((m) => ({ default: m.InductionModulesSection })),
);
const InductionQuizSection = lazy(() =>
  import("@/components/admin/InductionQuizSection").then((m) => ({ default: m.InductionQuizSection })),
);
const TherapistsSection = lazy(() =>
  import("@/components/admin/TherapistsSection").then((m) => ({ default: m.TherapistsSection })),
);
const TherapistProgressSection = lazy(() =>
  import("@/components/admin/TherapistProgressSection").then((m) => ({ default: m.TherapistProgressSection })),
);

// Brilers sections
const BrilersDashboard = lazy(() => import("@/components/brilers/BrilersDashboard"));
const BrilersQuizTracking = lazy(() => import("@/components/brilers/BrilersQuizTracking"));
const BrilersMetrics = lazy(() => import("@/components/brilers/BrilersMetrics"));

export default function AdminWorkspace() {
  const navigate = useNavigate();
  const { user, userRoles, loading, slowConnection } = useAuth();

  // estado por defecto a salvo de undefined
  const roles = userRoles?.roles ?? [];
  const isAdmin = useMemo(() => roles.includes("admin"), [roles]);
  const isModerator = useMemo(() => roles.includes("moderator"), [roles]);

  const [activeSection, setActiveSection] = useState<AdminSection>("posts");
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setRedirecting(true);
      navigate("/auth", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading || redirecting) {
    return (
      <div className="flex items-center justify-center min-h-dvh" aria-busy="true" aria-live="polite">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">Cargando panel de administración…</p>
          {slowConnection && (
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-200">La conexión está tardando más de lo usual…</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-xs text-amber-600 dark:text-amber-400 hover:underline"
              >
                Reintentar
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!isAdmin && !isModerator) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-2xl font-bold mb-2">Acceso denegado</h1>
          <p className="text-muted-foreground">No tienes permisos para acceder al panel de administración.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead title="Panel de Administración – Brilus" description="Panel administrativo" noindex={true} />

      <SidebarProvider defaultOpen>
        <div className="min-h-dvh overflow-hidden flex w-full bg-muted/30">
          <AdminSidebar
            activeSection={activeSection}
            onSectionChange={(s) => setActiveSection(s)}
            isAdmin={isAdmin}
            isModerator={isModerator}
            userEmail={user?.email}
          />

          <div className="flex-1 flex flex-col min-w-0">
            <div className="px-4 md:px-8 lg:px-12 pt-2">
              <AdminTopbar activeSection={activeSection} onSearch={() => {}} />
            </div>

            {/* Contenido principal centrado y con ancho máximo */}
            <main
              role="main"
              className="
                flex-1 overflow-auto
                px-4 md:px-8 lg:px-12 py-6
                [&>*]:max-w-[1400px] [&>*]:mx-auto [&>*]:w-full
                [&>*]:space-y-6
              "
            >
              <Suspense fallback={<div className="py-12 text-center text-muted-foreground">Cargando sección…</div>}>
                {activeSection === "posts" && <PostsSection />}
                {activeSection === "team" && <TeamSection />}
                {activeSection === "locations" && <LocationsSection />}
                {activeSection === "forms" && <FormsSection />}
                {activeSection === "testimonials" && <TestimonialsSection />}
                {activeSection === "quizz" && <QuizzSection />}
                {activeSection === "faqs" && <FAQsSection />}
                {activeSection === "diagnostico" && <DiagnosticoSection />}
                {activeSection === "knowledge-base" && <KnowledgeBaseSection />}
                {activeSection === "job-applications" && isAdmin && <JobApplicationsSection />}
                {activeSection === "users" && isAdmin && <UsersSection />}
                {activeSection === "induction-modules" && <InductionModulesSection />}
                {activeSection === "induction-quiz" && <InductionQuizSection />}
                {activeSection === "therapists" && <TherapistsSection />}
                {activeSection === "therapist-progress" && <TherapistProgressSection />}
                {activeSection === "brilers-dashboard" && <BrilersDashboard />}
                {activeSection === "brilers-quiz-tracking" && <BrilersQuizTracking />}
                {activeSection === "brilers-metrics" && <BrilersMetrics />}
              </Suspense>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
