import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, MessageCircle, Clock, Gift } from "lucide-react";
import { Link } from "react-router-dom";
const WHATSAPP_URL = "https://wa.me/525562151706?text=Hola%2C%20me%20interesa%20el%20Programa%20Intensivo%20ABA";
export const ABAFinalCTASection = () => {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-foreground via-foreground to-brand-black relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-brand-coral/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none" />

      <div className="section-px section-container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Promo Badge */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            className="inline-flex items-center gap-2 bg-brand-coral/20 text-brand-coral px-4 py-2 rounded-full mb-8"
          >
            <Gift className="w-4 h-4" />
            <span className="text-body-sm font-medium">Back to School: 50% OFF en Valoración</span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.1,
            }}
            className="text-h1 text-background mb-6"
          >
            El momento de actuar es ahora
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.2,
            }}
            className="text-body-lg text-background/80 mb-10 max-w-2xl mx-auto"
          >
            Agenda tu llamada inicial hoy y descubre cómo el Programa de Desarrollo Integral Brilus puede transformar su
            futuro.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.3,
            }}
            className="flex flex-col gap-3 sm:gap-4 justify-center mb-8 px-2 sm:px-0 sm:flex sm:flex-col my-[20px]"
          >
            <Button
              size="lg"
              className="bg-brand-coral hover:bg-brand-coral/90 text-background px-4 sm:px-10 py-5 sm:py-6 text-sm sm:text-base font-semibold rounded-brilus w-full sm:w-auto"
              asChild
            >
              <Link to="/contacto">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span>Agendar Llamada Inicial</span>
              </Link>
            </Button>
            <Button
              size="lg"
              className="bg-brand-white/90 hover:bg-brand-white text-brand-charcoal px-4 sm:px-10 py-5 sm:py-6 text-sm sm:text-base font-semibold rounded-brilus w-full sm:w-auto"
              asChild
            >
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span>Hablar por WhatsApp</span>
              </a>
            </Button>
          </motion.div>

          {/* Urgency */}
          <motion.div
            initial={{
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.4,
            }}
            className="flex items-center justify-center gap-2 text-brand-amber"
          >
            <Clock className="w-4 h-4" />
            <span className="text-body-sm">Promoción Back to School por tiempo limitado</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
