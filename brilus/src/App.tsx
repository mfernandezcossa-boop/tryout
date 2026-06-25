import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./components/ScrollToTop";
import { AnalyticsTracker } from "./components/AnalyticsTracker";
import Index from "./pages/Index";
import SobreNosotros from "./pages/SobreNosotros";
import Contacto from "./pages/Contacto";
import Auth from "./pages/Auth";
import AdminWorkspace from "./pages/AdminWorkspace";
import BlogsPage from "./pages/BlogsPage";
import BlogPostPage from "./pages/BlogPostPage";
import AdminFormDetail from "./pages/AdminFormDetail";
import AvisoPrivacidad from "./pages/AvisoPrivacidad";
import ThankYou from "./pages/ThankYou";
import QuizABA from "./pages/QuizABA";
import KnowledgeBase from "./pages/KnowledgeBase";
import AutismoCDMX from "./pages/AutismoCDMX";
import JobPosting from "./pages/JobPosting";
import TeamMemberPage from "./pages/TeamMemberPage";
// import ABAIntensivo from "./pages/ABAIntensivo"; // Temporarily disabled
import Careers from "./pages/Careers";
import NotFound from "./pages/NotFound";
import ThankYouCareers from "./pages/ThankYouCareers";
import AdminTeam from "./pages/AdminTeam";
import AdminTeamForm from "./pages/AdminTeamForm";
import TherapistPortal from "./pages/TherapistPortal";
import RoleSelector from "./pages/RoleSelector";
import PendienteAprobacion from "./pages/PendienteAprobacion";
import ResetPassword from "./pages/ResetPassword";
import InHomePage from "./pages/InHomePage";
import InCenterPage from "./pages/InCenterPage";
import InSchoolPage from "./pages/InSchoolPage";
import ScreeningMchat from "./pages/ScreeningMchat";
import ScreeningCast from "./pages/ScreeningCast";
import StartScreeningMchat from "./pages/StartScreeningMchat";
import StartScreeningCast from "./pages/StartScreeningCast";
import TestMchat from "./pages/TestMchat";
import TestCast from "./pages/TestCast";
import ScreeningMchatPrivado from "./pages/ScreeningMchatPrivado";
import DiagnosticoAutismo from "./pages/DiagnosticoAutismo";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnalyticsTracker />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sobre-nosotros" element={<SobreNosotros />} />
            <Route path="/equipo/:id" element={<TeamMemberPage />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/aviso-de-privacidad" element={<AvisoPrivacidad />} />
            <Route path="/nuestros-blogs" element={<BlogsPage />} />
            <Route path="/nuestros-blogs/:slug" element={<BlogPostPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin" element={<AdminWorkspace />} />
            <Route path="/admin/forms/:id" element={<AdminFormDetail />} />
            <Route path="/admin/team" element={<AdminTeam />} />
            <Route path="/admin/team/:id" element={<AdminTeamForm />} />
            <Route path="/quiz-aba" element={<QuizABA />} />
            <Route path="/familias" element={<KnowledgeBase />} />
            <Route path="/familias/:slug" element={<KnowledgeBase />} />
            {/* <Route path="/aba-intensivo" element={<Navigate to="/" replace />} /> */} {/* Removed - page disabled */}
            <Route path="/autismo-cdmx" element={<AutismoCDMX />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/jobs/pm-junior" element={<JobPosting />} />
            <Route path="/gracias" element={<ThankYou />} />
            <Route path="/gracias-careers" element={<ThankYouCareers />} />
            <Route path="/portal" element={<TherapistPortal />} />
            <Route path="/seleccionar-portal" element={<RoleSelector />} />
            <Route path="/pendiente-aprobacion" element={<PendienteAprobacion />} />
            <Route path="/in-home" element={<InHomePage />} />
            <Route path="/in-center" element={<InCenterPage />} />
            <Route path="/in-school" element={<InSchoolPage />} />
            <Route path="/screening-mchat" element={<ScreeningMchat />} />
            <Route path="/screening-mchat/start-mchat" element={<StartScreeningMchat />} />
            <Route path="/screening-cast" element={<ScreeningCast />} />
            <Route path="/screening-cast/start-cast" element={<StartScreeningCast />} />
            <Route path="/test-mchat" element={<TestMchat />} />
            <Route path="/test-cast" element={<TestCast />} />
            <Route path="/mchat-acceso-privado" element={<ScreeningMchatPrivado />} />
            <Route path="/diagnostico-autismo" element={<DiagnosticoAutismo />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
