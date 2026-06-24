import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, BookOpen, BarChart3, LogOut, Menu, X, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface PortalLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navItems = [
  { id: "profile", label: "Mi Perfil", icon: UserCircle },
  { id: "modules", label: "Módulos", icon: BookOpen },
  { id: "progress", label: "Mi Progreso", icon: BarChart3 },
];

const PortalLayout = ({ children, activeSection, onSectionChange }: PortalLayoutProps) => {
  const { user, profile, loading, slowConnection } = useAuth(['user', 'admin', 'moderator', 'admin_operations', 'admin_brilers']);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
        <p className="text-muted-foreground text-sm">Cargando portal...</p>
        {slowConnection && (
          <p className="text-xs text-muted-foreground">Conexión lenta detectada, por favor espera...</p>
        )}
      </div>
    );
  }

  const displayName = profile?.display_name || user?.email || "Briler";
  const initials = displayName.slice(0, 2).toUpperCase();

  const sectionTitle = navItems.find(i => i.id === activeSection)?.label || "Portal";

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-background border-r-0">
        {/* Profile header */}
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 shrink-0 ring-2 ring-foreground/10">
              <AvatarFallback className="text-xs font-bold bg-foreground/[0.06] text-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">Portal Briler</p>
              <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav group */}
        <div className="px-3 mb-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-3 mb-1">
            Principal
          </p>
        </div>
        <nav className="flex-1 px-3 space-y-[2px]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150",
                activeSection === item.id
                  ? "bg-foreground/[0.06] text-foreground font-semibold"
                  : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
              )}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-4 mt-auto">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-3 mb-1">
            Configuración
          </p>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground transition-all duration-150"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 ring-2 ring-foreground/10">
            <AvatarFallback className="text-xs font-bold bg-foreground/[0.06] text-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold text-foreground">{sectionTitle}</span>
        </div>
        <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute top-14 left-0 right-0 bg-background rounded-b-2xl border-b border-border/50 p-4 space-y-[2px] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onSectionChange(item.id); setMobileOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150",
                  activeSection === item.id
                    ? "bg-foreground/[0.06] text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
                )}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" />
                {item.label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground transition-all duration-150 mt-2"
            >
              <LogOut className="h-[18px] w-[18px] shrink-0" />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop topbar with breadcrumb */}
        <div className="hidden lg:flex items-center justify-between px-8 pt-4 pb-2">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>Home</span>
            <span>/</span>
            <span className="font-semibold text-foreground">{sectionTitle}</span>
          </nav>
        </div>

        <main className="flex-1 overflow-auto px-4 lg:px-8 py-6 pt-16 lg:pt-4">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PortalLayout;
