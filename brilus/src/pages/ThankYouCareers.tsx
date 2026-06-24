import React from "react";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import NavbarBrilus from "@/components/NavbarBrilus";
import Footer from "@/components/Footer";
import { CheckCircle2, Calendar, ArrowRight, Heart, BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const BOOKING_URL =
  "https://outlook.office.com/bookwithme/user/8b179fca665f41baa2aa78e72f1b74f5@somosbrilus.com/meetingtype/x0E3BLL0aEqHLrtPpKprsg2?bookingcode=4f773523-ce37-4dac-9434-b455996541af&anonymous&ismsaljsauthenabled&ep=mlink";

const nextSteps = [
  {
    icon: BookOpen,
    title: "Revisamos tu perfil",
    desc: "Nuestro equipo revisará tu aplicación en las próximas 48 horas hábiles.",
  },
  {
    icon: Calendar,
    title: "Llamada exploratoria",
    desc: "Si tu perfil encaja, agendaremos una llamada de 20-30 min para conocerte.",
  },
  {
    icon: Users,
    title: "Entrevista clínica",
    desc: "Una conversación más profunda sobre tu experiencia, valores y motivación.",
  },
];

const ThankYouCareers: React.FC = () => {
  return (
    <>
      <SEOHead
        title="¡Aplicación recibida! – Brilus Careers"
        description="Gracias por postularte como terapeuta en Brilus. Revisaremos tu perfil pronto."
        canonical="/gracias-careers"
        noindex={true}
      />
      <NavbarBrilus />
      <main className="min-h-screen bg-background pt-[88px] md:pt-[96px]">
        <div className="px-6 md:px-12 py-12 md:py-16">
          <div className="max-w-[800px] mx-auto space-y-10">
            {/* Success header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-5"
            >
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-brand-coral/10 flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-brand-coral" />
                </div>
              </div>
              <h1 className="text-h2 md:text-h1 font-bold text-foreground">
                ¡Gracias por querer ser Briler!
              </h1>
              <p className="text-body-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
                Hemos recibido tu aplicación correctamente. Nuestro equipo la
                revisará y te contactaremos pronto.
              </p>
            </motion.div>

            {/* Next steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-muted/40 rounded-3xl p-12 space-y-6"
            >
              <h2 className="text-h4 font-bold text-foreground">
                ¿Qué sigue?
              </h2>
              <div className="space-y-5">
                {nextSteps.map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-coral/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <step.icon className="w-5 h-5 text-brand-coral" />
                    </div>
                    <div>
                      <p className="text-body-md font-semibold text-foreground">
                        {step.title}
                      </p>
                      <p className="text-body-sm text-muted-foreground">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA to schedule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-foreground rounded-3xl p-12 text-center space-y-5"
            >
              <div className="flex justify-center gap-1.5 mb-2">
                <span className="w-2 h-2 rounded-full bg-brand-coral" />
                <span className="w-2 h-2 rounded-full bg-brand-amber" />
                <span className="w-2 h-2 rounded-full bg-brand-blue" />
              </div>
              <h2 className="text-h3 font-bold text-background">
                ¿Quieres adelantar el proceso?
              </h2>
              <p className="text-body-md text-background/70 max-w-md mx-auto">
                Agenda directamente tu llamada exploratoria con nuestro equipo
                sin esperar a que te contactemos.
              </p>
              <Button
                variant="coral"
                size="lg"
                className="text-base px-10"
                asChild
              >
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                  <Calendar className="w-5 h-5 mr-2" />
                  Agendar llamada exploratoria
                </a>
              </Button>
            </motion.div>

            {/* Back link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="text-center"
            >
              <Link
                to="/careers"
                className="text-body-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Volver a Careers
              </Link>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ThankYouCareers;
