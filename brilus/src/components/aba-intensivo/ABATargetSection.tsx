import { motion } from "framer-motion";
import { Baby, Brain, Heart, Users, Home, Target, CheckCircle2 } from "lucide-react";
const childProfiles = ["Autismo (nivel 1, 2 o 3)", "TDAH", "Discapacidad intelectual", "Síndrome de Down", "Síndromes genéticos", "Retraso global del desarrollo"];
const needsAreas = [{
  icon: MessageSquareIcon,
  text: "Comunicación y lenguaje"
}, {
  icon: Brain,
  text: "Conducta y regulación emocional"
}, {
  icon: Heart,
  text: "Habilidades de la vida diaria"
}, {
  icon: SensorIcon,
  text: "Procesamiento sensorial"
}, {
  icon: Users,
  text: "Habilidades sociales"
}];
const familyProfile = ["Buscan un enfoque multidisciplinario e integral", "Prefieren terapias en casa o escuela", "Desean evitar traslados y tiempos perdidos", "Necesitan estructura, claridad y metas definidas", "Están dispuestos a participar activamente"];
function MessageSquareIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>;
}
function SensorIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <circle cx="12" cy="12" r="4" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 17.66l1.41 1.41" />
      <path d="M4.93 19.07l1.41-1.41" />
      <path d="M17.66 6.34l1.41-1.41" />
    </svg>;
}
export const ABATargetSection = () => {
  return <section className="py-12 md:py-16 lg:py-20 bg-background">
      <div className="section-px section-container">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16">
          <motion.span initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="inline-block text-brand-coral text-body-sm font-semibold uppercase tracking-wider mb-4">
            ¿Es para ti?
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
            Para quién es el programa
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Child Profile */}
        <motion.div initial={{
          opacity: 0,
          x: -30
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} className="bg-muted/60 border border-border rounded-brilus p-6 sm:p-8 md:p-10 lg:p-12 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-brand-blue/10 rounded-brilus flex items-center justify-center">
                <Baby className="w-6 h-6 text-brand-blue" />
              </div>
              <div>
                <h3 className="text-h4 text-foreground">Perfil del niño</h3>
                <p className="text-body-sm text-muted-foreground">18 meses a 18 años</p>
              </div>
            </div>

            {/* Needs Areas */}
            <div className="mb-6">
              <p className="text-body-md text-foreground mb-4">
                Presenta necesidades en mínimo 2 de estas áreas:
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {needsAreas.map((area, index) => <div key={index} className="flex items-center gap-2 text-body-sm text-muted-foreground">
                    <area.icon className="w-4 h-4 text-brand-blue flex-shrink-0" />
                    <span>{area.text}</span>
                  </div>)}
              </div>
            </div>

            {/* Diagnoses */}
            <div>
              <p className="text-body-md text-foreground mb-4">
                Incluye diagnósticos como:
              </p>
              <div className="flex flex-wrap gap-2">
                {childProfiles.map((profile, index) => <span key={index} className="inline-flex items-center bg-brand-blue/10 text-brand-blue text-body-sm px-3 py-1 rounded-full">
                    {profile}
                  </span>)}
              </div>
            </div>
          </motion.div>

          {/* Family Profile */}
          <motion.div initial={{
          opacity: 0,
          x: 30
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} className="bg-muted/60 border border-border rounded-brilus p-6 sm:p-8 md:p-10 lg:p-12 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-brand-coral/10 rounded-brilus flex items-center justify-center">
                <Home className="w-6 h-6 text-brand-coral" />
              </div>
              <div>
                <h3 className="text-h4 text-foreground">Perfil de la familia</h3>
                <p className="text-body-sm text-muted-foreground">Comprometidas con el proceso</p>
              </div>
            </div>

            <ul className="space-y-4">
              {familyProfile.map((item, index) => <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-coral mt-0.5 flex-shrink-0" />
                  <span className="text-body-md text-foreground">{item}</span>
                </li>)}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>;
};