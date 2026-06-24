import React from "react";
import { motion } from "framer-motion";
import { FileCheck, AlertCircle } from "lucide-react";

const TargetAudienceSection: React.FC = () => {
  const formalDiagnoses = [
    "Autismo (de grado 1 a 3)",
    "TDAH",
    "Discapacidad intelectual leve o moderada",
    "Síndrome de Down u otros síndromes genéticos",
    "Retrasos globales del desarrollo",
  ];
  const difficulties = [
    "Comunicación y lenguaje: dificultad para comunicarse, pedir, responder o usar el lenguaje",
    "Conducta y regulación: rabietas intensas, agresiones y cambios de humor",
    "Habilidades del día a día: mucha resistencia a rutinas básicas",
    "Social: poco interés en interactuar y juego repetitivo",
    "Sensorial: hipersensibilidad o búsqueda intensa de estímulos",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  return (
    <section className="w-full bg-muted section-px section-py">
      <div className="section-container space-y-12 md:space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 max-w-3xl mx-auto"
        >
          <span className="inline-block px-4 py-1.5 bg-brand-blue-50 text-brand-blue rounded-brilus-pill text-body-sm font-medium">
            ¿A quiénes acompañamos?
          </span>
          <h2 className="text-h2 text-brand-black">
            Para niños que necesitan apoyo para alcanzar su potencial
          </h2>
          <p className="text-body-lg text-muted-foreground">
            En Brilus acompañamos a niños desde los 18 meses hasta los 25 años que están atravesando desafíos en su desarrollo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Card 1: Diagnóstico formal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-brilus-card p-10 md:p-12 shadow-brilus-3 border border-border"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-brilus-inner bg-brand-grey-light border border-brand-grey flex items-center justify-center">
                  <FileCheck className="w-6 h-6 text-brand-blue" />
                </div>
                <div>
                  <h3 className="text-h4 text-brand-black">Niños con diagnóstico formal</h3>
                  <p className="text-body-sm text-muted-foreground">Condiciones del neurodesarrollo</p>
                </div>
              </div>
              <motion.ul variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-3">
                {formalDiagnoses.map((diagnosis, index) => (
                  <motion.li key={index} variants={itemVariants} className="flex items-start gap-3 group">
                    <div className="w-2 h-2 rounded-brilus-pill bg-brand-blue mt-2 flex-shrink-0 group-hover:scale-125 transition-transform" />
                    <span className="text-body-md text-muted-foreground group-hover:text-brand-black transition-colors">{diagnosis}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>

          {/* Card 2: Dificultades claras */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-card rounded-brilus-card p-10 md:p-12 shadow-brilus-3 border border-border"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-brilus-inner bg-brand-grey-light border border-brand-grey flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-brand-coral" />
                </div>
                <div>
                  <h3 className="text-h4 text-brand-black">Niños con dificultades claras</h3>
                  <p className="text-body-sm text-muted-foreground">Con o sin diagnóstico formal</p>
                </div>
              </div>
              <motion.ul variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-3">
                {difficulties.map((difficulty, index) => (
                  <motion.li key={index} variants={itemVariants} className="flex items-start gap-3 group">
                    <div className="w-2 h-2 rounded-brilus-pill bg-brand-coral mt-2 flex-shrink-0 group-hover:scale-125 transition-transform" />
                    <span className="text-body-md text-muted-foreground group-hover:text-brand-black transition-colors">{difficulty}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TargetAudienceSection;
