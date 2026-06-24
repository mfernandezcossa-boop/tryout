import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Clock, Calendar, Briefcase, Users, Rocket, GraduationCap, Facebook, Instagram, Globe, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import brilusLogo from "@/assets/brilus-logo.svg";

const JobPosting = () => {
  return (
    <>
      <SEOHead
        title="Servicio Social / Prácticas Profesionales – Project Manager Junior | Brilus"
        description="Únete al equipo de Brilus como Project Manager Junior."
        noindex={true}
      />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-gradient-to-br from-brand-blue/10 via-background to-brand-coral/5 py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Logo */}
            <div className="mb-8">
              <Link to="/" className="inline-block">
                <img 
                  src={brilusLogo} 
                  alt="Brilus - Ir al inicio" 
                  className="h-10 md:h-12"
                />
              </Link>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-coral/10 text-brand-coral px-4 py-2 rounded-full text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4" />
              Servicio Social / Prácticas Profesionales
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Project Manager Junior
            </h1>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                25 hrs/semana
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Híbrido (CDMX)
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Inicio: Febrero 2026
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 max-w-4xl py-12 md:py-16">
          {/* Intro */}
          <section className="mb-12">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Buscamos a alguien con ganas de construir, aprender rápido y tener impacto real. 
              Si te interesa el mundo startup, el desarrollo de negocios y quieres trabajar en algo 
              con propósito, este rol es para ti.
            </p>
          </section>

          {/* Sobre Brilus */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <Rocket className="w-6 h-6 text-brand-coral" />
              Sobre Brilus
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Brilus es una startup mexicana de desarrollo infantil que brinda terapias personalizadas 
              a domicilio para niños con autismo y otras necesidades del desarrollo. Trabajamos bajo un 
              modelo basado en evidencia, con supervisión clínica especializada desde Estados Unidos, 
              y un enfoque integral y multidisciplinario. Estamos en etapa de crecimiento: construyendo 
              procesos, alianzas, tecnología y estructura. Eso significa impacto real, decisiones rápidas 
              y mucho aprendizaje práctico.
            </p>
          </section>

          {/* Por qué importa */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-brand-blue" />
              ¿Por qué este rol importa?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Este no es un rol para "ver y aprender". Vas a estar en el centro de la operación y el 
              crecimiento de Brilus, conectando familias, terapeutas, universidades, aliados estratégicos 
              y herramientas tecnológicas. Si el desempeño es bueno, existe posibilidad real de integrarte 
              de tiempo completo al finalizar la práctica.
            </p>
          </section>

          {/* Responsabilidades */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Responsabilidades principales
            </h2>
            <ul className="space-y-3">
              {[
                "Apoyar el desarrollo de alianzas (universidades, escuelas, médicos, aliados)",
                "Dar seguimiento a familias interesadas y apoyar procesos comerciales",
                "Apoyar comunicación y marketing (contenido y redes)",
                "Participar en la operación diaria, organización de información y uso de herramientas tecnológicas (CRM, automatización, IA)"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-brand-coral mt-2 shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Info Práctica */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Información práctica
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="border-border/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-brand-blue" />
                  <div>
                    <p className="font-medium text-foreground">Dedicación</p>
                    <p className="text-sm text-muted-foreground">25 horas por semana</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-brand-blue" />
                  <div>
                    <p className="font-medium text-foreground">Modalidad</p>
                    <p className="text-sm text-muted-foreground">Híbrida (principalmente remoto)</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <Users className="w-5 h-5 text-brand-blue" />
                  <div>
                    <p className="font-medium text-foreground">Presencial</p>
                    <p className="text-sm text-muted-foreground">1–2 días en coworking</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-brand-blue" />
                  <div>
                    <p className="font-medium text-foreground">Inicio</p>
                    <p className="text-sm text-muted-foreground">Febrero 2026</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Lo que ofrecemos */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Lo que ofrecemos
            </h2>
            <div className="bg-gradient-to-br from-brand-blue/5 to-brand-coral/5 rounded-2xl p-6 md:p-8">
              <ul className="space-y-3">
                {[
                  "$3,000 MXN netos/mes",
                  "Trabajo directo con el cofundador y CEO",
                  "Impacto real en decisiones y resultados",
                  "Modalidad híbrida y flexibilidad",
                  "Aprendizaje intensivo en negocio, ventas, marketing, operaciones y tecnología",
                  "Propósito social auténtico",
                  "Posibilidad de contratación al finalizar la práctica"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-brand-coral/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-brand-coral" />
                    </span>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-muted-foreground">
                Este rol puede evolucionar hacia posiciones en operaciones, desarrollo de negocio o 
                coordinación de proyectos, dependiendo de desempeño e intereses.
              </p>
            </div>
          </section>

          {/* Perfil buscado */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Perfil buscado
            </h2>
            <ul className="space-y-3">
              {[
                "Estudiante de Administración, Negocios, Marketing, Comunicación o afín",
                "Interés real por desarrollo de negocios y atención a personas",
                "Alta autonomía, criterio y responsabilidad",
                "Excelentes habilidades de comunicación",
                "Inglés es un plus",
                "Curiosidad y mentalidad emprendedora"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-brand-blue mt-2 shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* CTA */}
          <section className="mb-12">
            <Card className="border-2 border-brand-coral/20 bg-gradient-to-br from-brand-coral/5 to-transparent">
              <CardContent className="p-6 md:p-8 text-center">
                <h2 className="text-2xl font-semibold text-foreground mb-3">
                  ¿Te interesa?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Envía tu CV y una breve explicación de por qué te interesa trabajar con nosotros y este rol.
                </p>
                <Button 
                  variant="coral" 
                  size="lg" 
                  asChild
                  className="gap-2"
                >
                  <a href="mailto:talent@somosbrilus.com">
                    <Mail className="w-4 h-4" />
                    talent@somosbrilus.com
                  </a>
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Social Links */}
          <section className="pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground text-center mb-4">
              Conoce más de Brilus
            </p>
            <div className="flex justify-center gap-4">
              <a 
                href="https://www.facebook.com/somosbrilus" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-muted/50 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/somosbrilus" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-muted/50 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.somosbrilus.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-muted/50 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Website"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a 
                href="https://www.youtube.com/@somosbrilus" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-muted/50 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default JobPosting;
