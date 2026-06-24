import { motion } from "framer-motion";
import { Phone, ClipboardCheck, ArrowRight } from "lucide-react";
const steps = [{
  number: "1",
  title: "Intake Call",
  subtitle: "30-45 min · Videollamada",
  icon: Phone,
  items: ["Revisión detallada del caso de tu hijo", "Explicación del Modelo Brilus", "Alineación de expectativas", "Discusión de horas, costos y duración", "Definición del rol de los padres"],
  lineColor: "bg-brand-blue"
}, {
  number: "2",
  title: "Valoración Inicial",
  subtitle: "Evaluación híbrida (en casa y en línea)",
  icon: ClipboardCheck,
  items: ["Entrevista a profundidad con padres", "Observación directa del niño", "Informe clínico detallado", "Metas definidas para niño y padres", "Intensidad terapéutica recomendada"],
  lineColor: "bg-brand-coral"
}];
export const ABAProcessSection = () => {
  return <section className="py-12 md:py-16 lg:py-20 bg-background">
      <div className="section-px section-container">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <motion.h2 initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-h2 md:text-h1 font-bold text-foreground mb-4">
            2 pasos simples para comenzar
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
          delay: 0.1
        }} className="text-body-md md:text-body-lg text-muted-foreground">
            Un proceso claro y estructurado para que tu familia 
            sepa exactamente qué esperar desde el primer contacto.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 py-4 md:py-[19px]">

            {steps.map((step, index) => <motion.article key={index} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.15
          }} className="flex flex-col gap-4">
                {/* Color line */}
                <div className={`h-1.5 w-full ${step.lineColor} rounded-full`} />
                
                {/* Content */}
                <div className="space-y-4">
                  {/* Number */}
                  <span className="text-5xl sm:text-6xl md:text-7xl font-bold text-foreground leading-none">
                    {step.number}
                  </span>
                  
                  {/* Title & Subtitle */}
                  <div className="space-y-1">
                    <h3 className="text-h3 md:text-h2 font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-body-sm text-muted-foreground">
                      {step.subtitle}
                    </p>
                  </div>

                  {/* Items */}
                  <ul className="space-y-2 pt-2">
                    {step.items.map((item, itemIndex) => <li key={itemIndex} className="flex items-start gap-3">
                        <div className={`w-1.5 h-1.5 ${step.lineColor} rounded-full mt-2 flex-shrink-0`} />
                        <span className="text-body-md text-foreground/80">{item}</span>
                      </li>)}
                  </ul>
                </div>

                {/* Mobile Arrow */}
                {index === 0 && <div className="md:hidden flex justify-center py-4">
                    <ArrowRight className="w-6 h-6 text-brand-amber rotate-90" />
                  </div>}
              </motion.article>)}
          </div>
        </div>
      </div>
    </section>;
};