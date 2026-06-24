import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
interface PricingFeature {
  title: string;
  items: string[];
}
const features: PricingFeature[] = [{
  title: "Incluido en el programa",
  items: ["Terapeuta dedicado", "Supervisión semanal", "Coaching mensual a padres", "Supervisión mensual con escuela", "Soporte WhatsApp"]
}, {
  title: "Beneficios adicionales",
  items: ["Plan de intervención personalizado", "Reportes de progreso mensuales", "Acceso a comunidad de padres", "Recursos educativos digitales"]
}];
export const ABAPricingSection = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, {
    once: true,
    amount: 0.2
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 260,
        damping: 20
      }
    }
  };
  const listItemVariants = {
    hidden: {
      opacity: 0,
      x: -20
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 10
      }
    }
  };
  const navigate = useNavigate();
  const handleCTAClick = () => {
    navigate("/contacto");
  };
  return <motion.section ref={containerRef} className="py-16 md:py-24 section-px bg-muted/30" initial="hidden" animate={hasAnimated ? "visible" : "hidden"} variants={containerVariants}>
      <div className="section-container">
        {/* Section header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Una inversión en el desarrollo integral de tu hijo</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un programa integral diseñado para maximizar el desarrollo y bienestar de tu familia
          </p>
        </motion.div>

        <Card className="relative mx-auto w-full max-w-5xl overflow-hidden border-0 shadow-brilus-3 rounded-2xl">
          <div className="flex flex-col lg:flex-row">
            {/* Left side - Pricing info */}
            <motion.div variants={itemVariants} className="flex flex-col p-6 md:p-8 lg:p-12 lg:w-2/5 text-primary-foreground bg-brand-blue">
              <div className="flex-1">
                <CardHeader className="p-0">
                  <CardTitle className="font-bold text-primary-foreground text-xl sm:text-2xl md:text-3xl leading-tight">
                    Programa de Desarrollo Integral ABA
                  </CardTitle>
                  <CardDescription className="mt-3 text-primary-foreground/80 text-sm sm:text-base md:text-lg">20 horas semanales de intervención personalizada desde</CardDescription>
                </CardHeader>
                <motion.div className="mt-6 md:mt-8 space-y-1" variants={itemVariants}>
                  <div className="flex items-baseline justify-start flex-wrap">
                    <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground">$11,999</span>
                    <span className="ml-2 text-base md:text-lg text-primary-foreground/80">MXN</span>
                  </div>
                  <span className="block text-sm text-primary-foreground/70">
                    pago mensual
                  </span>
                </motion.div>
              </div>
              <motion.div className="mt-10" variants={itemVariants}>
                <Button size="lg" onClick={handleCTAClick} className="w-full font-semibold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all bg-primary-foreground text-brand-blue">
                  Agendar llamada inicial 
                </Button>
              </motion.div>
            </motion.div>

            {/* Right side - Features */}
            <motion.div className="bg-card p-6 md:p-8 lg:w-3/5 lg:p-12" variants={itemVariants}>
              <div className="space-y-8">
                {features.map((feature, featureIndex) => <div key={featureIndex}>
                    <h3 className="mb-5 text-base font-semibold text-foreground uppercase tracking-wide">
                      {feature.title}
                    </h3>
                    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {feature.items.map((item, index) => <motion.li key={index} className="flex items-center" variants={listItemVariants} custom={index + featureIndex * feature.items.length}>
                          <div className="mr-3 h-6 w-6 rounded-full bg-brand-blue/10 flex items-center justify-center flex-shrink-0">
                            <Check className="h-4 w-4 text-brand-blue" />
                          </div>
                          <span className="text-sm text-foreground">{item}</span>
                        </motion.li>)}
                    </ul>
                    {featureIndex < features.length - 1 && <Separator className="my-8" />}
                  </div>)}
              </div>
            </motion.div>
          </div>
        </Card>
      </div>
    </motion.section>;
};