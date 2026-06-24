import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Gift, FileText, Eye, Target, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
const valoracionItems = [{
  icon: ClipboardList,
  text: "Entrevista detallada con padres"
}, {
  icon: Eye,
  text: "Observación directa del niño"
}, {
  icon: FileText,
  text: "Informe clínico completo"
}, {
  icon: Target,
  text: "Recomendación terapéutica personalizada"
}];
export const ABAPromoSection = () => {
  return <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-brand-coral/5 via-background to-brand-amber/5 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-coral/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-amber/10 rounded-full blur-3xl pointer-events-none" />

      <div className="section-px section-container relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Promo Card */}
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="bg-card border-2 border-brand-coral/30 rounded-brilus p-6 sm:p-8 md:p-12 shadow-brilus-2">
            {/* Badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 bg-brand-coral text-background px-4 py-2 rounded-full">
                <Gift className="w-5 h-5" />
                <span className="text-body-md font-semibold">Promoción Back to School</span>
              </div>
            </div>

            {/* Headline */}
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-h2 text-foreground mb-4">
                <span className="text-brand-coral">50% de descuento</span> en tu Valoración Inicial
              </h2>
              <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">Si continúas con las terapias después de la valoración, obtienes la mitad del costo. La valoración es realizada por una profesional certificada BCaBA.</p>
            </div>

            {/* What's included */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-10">
              {valoracionItems.map((item, index) => <motion.div key={index} initial={{
              opacity: 0,
              x: -20
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.1
            }} className="flex flex-col items-center text-center gap-2 bg-background/60 rounded-brilus p-3 sm:p-4">
                  <div className="w-10 h-10 bg-brand-coral/10 rounded-brilus flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-brand-coral" />
                  </div>
                  <span className="text-body-sm sm:text-body-md text-foreground leading-tight">{item.text}</span>
                </motion.div>)}
            </div>

            {/* CTA */}
            <div className="text-center">
              <Button size="lg" className="bg-brand-coral hover:bg-brand-coral/90 text-background px-10 py-6 text-body-md font-semibold rounded-brilus" asChild>
                <Link to="/contacto">
                  <Calendar className="w-5 h-5 mr-2" />
                  Aprovechar promoción
                </Link>
              </Button>
              <p className="text-body-sm text-muted-foreground mt-4">
                Promoción válida hasta el 15 de enero     
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
};