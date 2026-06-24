import { motion } from "framer-motion";
import { Clock, Users, Home, Headphones, GraduationCap, MessageSquare } from "lucide-react";
import therapyImage from "@/assets/aba-therapy-session.jpg";
const features = [{
  icon: Home,
  title: "Intervención en casa o escuela",
  description: "Llevamos la terapia a donde tu hijo la necesita, sin traslados ni interrupciones a su rutina."
}, {
  icon: GraduationCap,
  title: "Supervisión por Expertas BCBA/BCaBA",
  description: "Nuestro equipo clínico, certificado en Estados Unidos, evalúa y ajusta cada programa según las necesidades específicas del autismo infantil"
}, {
  icon: Clock,
  title: "20 horas semanales de intensidad",
  description: "La intensidad recomendada internacionalmente para lograr progresos significativos en comunicación, conducta, regulación emocional y autonomía en niños con autismo."
}, {
  icon: Users,
  title: "Enfoque multidisciplinario",
  description: "Abordamos comunicación, conducta, habilidades de vida diaria, sensorial y social."
}, {
  icon: MessageSquare,
  title: "Coaching mensual a padres",
  description: "Te enseñamos estrategias prácticas para continuar el trabajo en casa."
}, {
  icon: Headphones,
  title: "Grupo de Apoyo de WhatsApp",
  description: "Comunicación directa para dudas, avances y coordinación del equipo."
}];
export const ABAProgramSection = () => {
  return <section className="py-12 md:py-16 lg:py-20 bg-muted/50">
      <div className="section-px section-container">
        {/* Section Header with Image */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-10 md:mb-16">
          <div>
            <motion.span initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} className="inline-block text-brand-blue text-body-sm font-semibold uppercase tracking-wider mb-4">
              Nuestro Programa
            </motion.span>
            <motion.h2 initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.1
          }} className="text-h1 text-foreground mb-6">
              ¿Qué es el Programa de Desarrollo Integral ABA de Brilus?
            </motion.h2>
            <motion.p initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.2
          }} className="text-body-lg text-muted-foreground">Un modelo integral de Terapia ABA para niños con autismo y otras condiciones del neurodesarrollo, con planes personalizados que trabajan comunicación, conducta, regulación emocional, desarrollo sensorial y más.</motion.p>
          </div>
          <motion.div initial={{
          opacity: 0,
          scale: 0.95
        }} whileInView={{
          opacity: 1,
          scale: 1
        }} viewport={{
          once: true
        }} transition={{
          delay: 0.3
        }} className="relative">
            <img src={therapyImage} alt="Sesión de terapia ABA con niño" className="w-full h-48 sm:h-56 md:h-72 lg:h-96 object-cover rounded-brilus shadow-brilus-2" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-coral/20 rounded-full blur-2xl" />
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-brand-blue/20 rounded-full blur-2xl" />
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {features.map((feature, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.1
        }} className="bg-background border border-border rounded-brilus p-6 shadow-sm hover:shadow-brilus-2 transition-shadow">
              <div className="w-12 h-12 bg-brand-blue/10 rounded-brilus flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-brand-blue" />
              </div>
              <h3 className="text-h5 text-foreground mb-2">{feature.title}</h3>
              <p className="text-body-md text-muted-foreground">{feature.description}</p>
            </motion.div>)}
        </div>

      </div>
    </section>;
};