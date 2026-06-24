import { Button } from "@/components/ui/button";
import { Calendar, MessageCircle, Award } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
const heroImage = "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/Home/pexels-ivan-s-4783976%20(2).webp";
const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=525562151706&text=Hola+Brilus%2C+necesito+informaci%C3%B3n&type=phone_number&app_absent=0";
export const ABAHeroSection = () => {
  return <section className="relative min-h-[100svh] md:min-h-[80vh] flex items-center overflow-hidden pt-20 md:pt-24">
      {/* Background Image */}
      <img src={heroImage} alt="Familia feliz en sesión de terapia ABA" className="absolute inset-0 w-full h-full object-cover" />
      
      {/* Overlay for text contrast */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative z-10 section-px py-16 md:py-24 lg:py-32 w-full">
        <div className="max-w-[960px] mx-auto text-center space-y-4 md:space-y-6">
          {/* Badge */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} className="inline-flex items-center gap-2 bg-brand-white/20 backdrop-blur-sm text-brand-white px-3 md:px-4 py-2 rounded-full border border-brand-white/30">
            <Award className="w-4 h-4 flex-shrink-0" />
            <span className="text-body-sm font-medium">Back to School: 50% OFF en Valoración Inicial</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.1
        }} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-brand-white drop-shadow-lg leading-tight">Terapia personalizada para apoyar el desarrollo de tu hijo con autismo</motion.h1>

          {/* Subheadline */}
          <motion.p initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="text-sm sm:text-base md:text-lg text-brand-white/90 max-w-2xl mx-auto drop-shadow-md px-2">Trabajamos con la Terapia ABA para niños autismo, TDAH, u otras necesidades del neurodesarrollo dentro del hogar o escuela, con supervisión clínica de una experta del comportamiento.</motion.p>

          {/* CTAs */}
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.3
        }} className="flex flex-col gap-3 sm:gap-4 justify-center pt-4 px-4 sm:px-0">
            <Button size="lg" className="bg-brand-coral hover:bg-brand-coral/90 text-brand-white px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-semibold rounded-full w-full sm:w-auto sm:mx-auto" asChild>
              <Link to="/contacto">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                Agendar llamada inicial
              </Link>
            </Button>
            <Button size="lg" className="bg-brand-white/90 hover:bg-brand-white text-brand-charcoal px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-semibold rounded-full w-full sm:w-auto sm:mx-auto border-0" asChild>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                Resolver dudas por WhatsApp
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>;
};