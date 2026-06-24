import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, LogOut, User, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminTopbarProps {
  activeSection: string;
  onSearch: (query: string) => void;
}

const SECTION_TITLES: Record<string, string> = {
  posts: "Blogs",
  team: "Equipo",
  forms: "Formularios",
  users: "Usuarios",
  testimonials: "Testimonios",
  locations: "Locaciones",
  quizz: "Quizz",
  faqs: "FAQs",
  "knowledge-base": "Base de Conocimiento",
  "job-applications": "Postulaciones",
  "induction-modules": "Módulos",
  "induction-quiz": "Cuestionarios",
  therapists: "Terapeutas",
  "therapist-progress": "Progreso",
  "brilers-dashboard": "Dashboard",
  "brilers-quiz-tracking": "Quiz Tracking",
  "brilers-metrics": "Métricas",
};

export const AdminTopbar = ({ activeSection, onSearch }: AdminTopbarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Error", description: "No se pudo cerrar sesión", variant: "destructive" });
    } else {
      navigate("/auth");
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const title = SECTION_TITLES[activeSection] || "Admin";

  return (
    <header className="flex items-center justify-between gap-3 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <SidebarTrigger className="shrink-0" />
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span className="hidden sm:inline">Home</span>
          <span className="hidden sm:inline">/</span>
          <span className="font-semibold text-foreground">{title}</span>
        </nav>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 h-9 w-48 lg:w-64 rounded-xl bg-foreground/[0.04] border-0 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-foreground/10"
          />
        </div>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 shrink-0">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-foreground/[0.06]">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
