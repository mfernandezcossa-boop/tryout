import { motion } from "framer-motion";
import { Info, MapPin, Users } from "lucide-react";

const conditions = [
  {
    icon: MapPin,
    title: "Viáticos fuera de zonas",
    description: "Para ubicaciones fuera de nuestras zonas de cobertura principal, pueden aplicar costos adicionales de traslado."
  },
  {
    icon: Users,
    title: "Participación activa",
    description: "El éxito del programa depende de la colaboración entre padres, escuela y nuestro equipo terapéutico."
  },
];

export const ABAConditionsSection = () => {
  return (
    <section className="py-6 md:py-8 bg-muted/50">
      <div className="section-px section-container">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-10 h-10 bg-muted rounded-brilus flex items-center justify-center">
              <Info className="w-5 h-5 text-muted-foreground" />
            </div>
            <h2 className="text-h3 text-foreground">Condiciones del programa</h2>
          </motion.div>

          {/* Conditions */}
          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 sm:gap-6">
            {conditions.map((condition, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-background border border-border rounded-brilus p-4 sm:p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <condition.icon className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-body-md font-semibold text-foreground mb-1">
                      {condition.title}
                    </h3>
                    <p className="text-body-sm text-muted-foreground">
                      {condition.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
