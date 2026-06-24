import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Briefcase, GraduationCap, ClipboardCheck,
  BarChart3, BookOpen, LogOut, Menu, X, ExternalLink, Loader2,
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "applications", label: "Postulaciones", icon: Briefcase },
  { id: "modules", label: "Módulos", icon: GraduationCap },
  { id: "quiz-tracking", label: "Quiz Tracking", icon: ClipboardCheck },
  { id: "metrics", label: "Métricas", icon: BarChart3 },
  { id: "knowledge-base", label: "Base de Conocimiento", icon: BookOpen },
];

interface BrilersLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const BrilersLayout = ({ children, activeSection, onSectionChange }: BrilersLayoutProps) => {
  const { user, profile, loading, slowConnection } = useAuth(["admin", "admin_brilers"]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-brand-coral" />
        <p className="text-muted-foreground text-sm">Cargando panel Brilers...</p>
        {slowConnection && <p className="text-xs text-muted-foreground">Conexión lenta detectada...</p>}
      </div>
    );
  }

  const SidebarNav = ({ onItemClick }: { onItemClick?: () => void }) => (
    <nav className="flex-1 p-4 space-y-1">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => { onSectionChange(item.id); onItemClick?.(); }}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            activeSection === item.id
              ? "bg-brand-coral/10 text-brand-coral"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-card border-r border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">Admin Brilers</h2>
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {profile?.display_name || user?.email}
          </p>
        </div>
        <SidebarNav />
        <div className="p-4 border-t border-border space-y-2">
          <Link
            to="/admin"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-4 w-4" /> Admin Operations
          </Link>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">Admin Brilers</h2>
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)}>
          <div className="absolute top-14 left-0 right-0 bg-card border-b border-border p-4 space-y-1" onClick={(e) => e.stopPropagation()}>
            <SidebarNav onItemClick={() => setMobileOpen(false)} />
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 mt-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Cerrar sesión
            </Button>
          </div>
        </div>
      )}

      <main className="flex-1 md:p-8 p-4 pt-20 md:pt-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default BrilersLayout;
