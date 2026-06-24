import {
  FileText,
  Users,
  ClipboardList,
  UserCog,
  MessageSquareQuote,
  MapPin,
  ClipboardCheck,
  HelpCircle,
  BookOpen,
  Briefcase,
  GraduationCap,
  CircleHelp,
  Stethoscope,
  BarChart3,
  ExternalLink,
  LayoutDashboard,
  TrendingUp,
  Settings,
  RefreshCw,
  Activity,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export type AdminSection =
  | "posts"
  | "team"
  | "forms"
  | "users"
  | "testimonials"
  | "locations"
  | "quizz"
  | "faqs"
  | "knowledge-base"
  | "job-applications"
  | "induction-modules"
  | "induction-quiz"
  | "therapists"
  | "therapist-progress"
  | "brilers-dashboard"
  | "brilers-quiz-tracking"
  | "brilers-metrics"
  | "diagnostico";

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  isAdmin: boolean;
  isModerator: boolean;
  userEmail?: string;
}

export const AdminSidebar = ({
  activeSection,
  onSectionChange,
  isAdmin,
  isModerator,
  userEmail,
}: AdminSidebarProps) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const mainSections = [
    { id: "posts" as const, label: "Blogs", icon: FileText, visible: isAdmin || isModerator },
    { id: "team" as const, label: "Equipo", icon: Users, visible: isAdmin || isModerator },
    { id: "locations" as const, label: "Locaciones", icon: MapPin, visible: isAdmin || isModerator },
    { id: "forms" as const, label: "Formularios", icon: ClipboardList, visible: isAdmin || isModerator },
    { id: "testimonials" as const, label: "Testimonios", icon: MessageSquareQuote, visible: isAdmin || isModerator },
    { id: "quizz" as const, label: "Quizz", icon: ClipboardCheck, visible: isAdmin || isModerator },
    { id: "faqs" as const, label: "FAQs", icon: HelpCircle, visible: isAdmin || isModerator },
    { id: "diagnostico" as const, label: "Diagnóstico", icon: Activity, visible: isAdmin || isModerator },
  ];

  const manageSections = [
    { id: "job-applications" as const, label: "Postulaciones", icon: Briefcase, visible: isAdmin },
    { id: "users" as const, label: "Usuarios", icon: UserCog, visible: isAdmin },
  ];

  const brilersSections = [
    { id: "induction-modules" as const, label: "Módulos", icon: GraduationCap, visible: isAdmin || isModerator },
    { id: "knowledge-base" as const, label: "Base de Conocimiento", icon: BookOpen, visible: isAdmin || isModerator },
    { id: "induction-quiz" as const, label: "Cuestionarios", icon: CircleHelp, visible: isAdmin || isModerator },
    { id: "therapists" as const, label: "Terapeutas", icon: Stethoscope, visible: isAdmin || isModerator },
    { id: "therapist-progress" as const, label: "Progreso", icon: BarChart3, visible: isAdmin || isModerator },
    { id: "brilers-dashboard" as const, label: "Dashboard", icon: LayoutDashboard, visible: isAdmin },
    { id: "brilers-quiz-tracking" as const, label: "Quiz Tracking", icon: TrendingUp, visible: isAdmin },
    { id: "brilers-metrics" as const, label: "Métricas", icon: BarChart3, visible: isAdmin },
  ];

  const initials = userEmail ? userEmail.slice(0, 2).toUpperCase() : "BA";

  const renderGroup = (
    label: string,
    items: Array<{ id: AdminSection; label: string; icon: any; visible: boolean }>,
  ) => {
    const visible = items.filter((s) => s.visible);
    if (!visible.length) return null;
    return (
      <SidebarGroup className="my-0 px-3">
        <SidebarGroupLabel
          className={`text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1 ${isCollapsed ? "sr-only" : ""}`}
        >
          {label}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {visible.map((s) => {
              const Icon = s.icon;
              const isActive = activeSection === s.id;
              return (
                <SidebarMenuItem key={s.id}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(s.id)}
                    isActive={isActive}
                    aria-label={s.label}
                    className={`
                      mx-0 my-[1px] py-2.5 min-h-9 rounded-xl text-[13px] font-medium
                      transition-all duration-150
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-ring
                      ${
                        isActive
                          ? "bg-foreground/[0.06] text-foreground font-semibold"
                          : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
                      }
                    `}
                    data-active={isActive ? "true" : "false"}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" />
                    <span className={isCollapsed ? "sr-only" : ""}>{s.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  };

  return (
    <Sidebar collapsible="icon" role="navigation" aria-label="Barra lateral de administración" className="border-r-0">
      <SidebarContent className="bg-background">
        {/* Profile header */}
        <div className={`px-5 pt-6 pb-4 ${isCollapsed ? "px-2 pt-4" : ""}`}>
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 shrink-0 ring-2 ring-foreground/10">
              <AvatarFallback className="text-xs font-bold bg-foreground/[0.06] text-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">Brilus Admin</p>
                {userEmail && <p className="text-[11px] text-muted-foreground truncate">{userEmail}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Navigation groups */}
        {renderGroup("Contenido", mainSections)}
        {renderGroup("Gestión", manageSections)}
        {renderGroup("Brilers", brilersSections)}

        {/* Footer links */}
        <div className="mt-auto px-3 pb-4 space-y-0.5">
          <SidebarGroupLabel
            className={`text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1 px-3 ${isCollapsed ? "sr-only" : ""}`}
          >
            Configuración
          </SidebarGroupLabel>
          <Link
            to="/portal"
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium
              text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground transition-all duration-150
            `}
          >
            <ExternalLink className="h-[18px] w-[18px] shrink-0" />
            {!isCollapsed && <span>Portal Terapeuta</span>}
          </Link>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};
