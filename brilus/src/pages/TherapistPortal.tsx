import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import PortalLayout from "@/components/portal/PortalLayout";
import PortalModulesList from "@/components/portal/PortalModulesList";
import PortalModuleContent from "@/components/portal/PortalModuleContent";
import PortalQuiz from "@/components/portal/PortalQuiz";
import PortalProgress from "@/components/portal/PortalProgress";
import PortalProfile from "@/components/portal/PortalProfile";

type PortalView = "list" | "content" | "quiz";

const TherapistPortal = () => {
  const { user, userRoles } = useAuth();
  const [activeSection, setActiveSection] = useState("profile");
  const [view, setView] = useState<PortalView>("list");
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  const roles = userRoles?.roles ?? [];
  const isAdmin = roles.includes("admin");
  const isModerator = roles.includes("moderator");
  const isPrivileged = isAdmin || isModerator;

  // Get therapist record linked to current user
  const { data: therapist } = useQuery({
    queryKey: ["portal-therapist", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("therapists")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Admins can access everything; therapists need a linked profile
  const canAccessQuiz = !!therapist || isPrivileged;
  // For quiz submission we need a therapist ID; admins without one get a "preview" experience
  const effectiveTherapistId = therapist?.id || null;

  const handleSelectModule = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setView("content");
  };

  const handleStartQuiz = () => setView("quiz");
  const handleBackToContent = () => setView("content");
  const handleBackToList = () => { setView("list"); setSelectedModuleId(null); };

  const renderModulesSection = () => {
    if (view === "quiz" && selectedModuleId && canAccessQuiz) {
      return <PortalQuiz moduleId={selectedModuleId} therapistId={effectiveTherapistId} onBack={handleBackToContent} isPreview={!effectiveTherapistId} />;
    }
    if (view === "content" && selectedModuleId) {
      return <PortalModuleContent moduleId={selectedModuleId} onBack={handleBackToList} onStartQuiz={handleStartQuiz} therapistId={effectiveTherapistId} canAccessQuiz={canAccessQuiz} />;
    }
    return <PortalModulesList therapistId={effectiveTherapistId} onSelectModule={handleSelectModule} />;
  };

  return (
    <PortalLayout activeSection={activeSection} onSectionChange={(s) => { setActiveSection(s); setView("list"); setSelectedModuleId(null); }}>
      {!therapist && !isPrivileged && user && (
        <div className="bg-brand-amber/10 border border-brand-amber/30 rounded-lg p-3 mb-6 text-sm text-foreground flex items-start gap-2">
          <span className="shrink-0 text-brand-amber">⚠</span>
          <span>Tu cuenta aún no está vinculada a un perfil de terapeuta. Contacta a tu administrador.</span>
        </div>
      )}
      {isPrivileged && !therapist && (
        <div className="bg-sky-50 border border-sky-200/60 rounded-2xl p-3 mb-6 text-sm text-foreground flex items-start gap-2">
          <span className="shrink-0">👁</span>
          <span>Modo vista previa — Puedes explorar todo, pero los resultados de quiz no se guardarán sin un perfil de terapeuta vinculado.</span>
        </div>
      )}
      {activeSection === "profile" && <PortalProfile therapistId={effectiveTherapistId} />}
      {activeSection === "modules" && renderModulesSection()}
      {activeSection === "progress" && <PortalProgress therapistId={effectiveTherapistId} />}
    </PortalLayout>
  );
};

export default TherapistPortal;
