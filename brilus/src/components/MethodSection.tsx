import React from "react";
import { Link } from "react-router-dom";
import { Target } from "lucide-react";

const features = [
  {
    title: "Acceso inmediato",
    description: "Tu hijo con autismo puede iniciar la terapia ABA en Ciudad de México de forma inmediata. Porque cada mes en su desarrollo importa.",
    cta: { label: "Agendar Cita", href: "/contacto" },
  },
  {
    title: "Apoyo diagnóstico",
    description: "Realizamos evaluaciones diagnósticas en Ciudad de México y te orientarnos en cada paso.",
    cta: { label: "Screening gratuito", href: "/diagnostico" },
  },
  {
    title: "Un modelo integral y multidisciplinario",
    description: "Cada niño es único. Diseñamos un programa terapéutico adaptado a sus objetivos, fortalezas y ritmo de aprendizaje.",
    cta: null,
  },
  {
    title: "Supervisión por expertas en Autismo, TDAH",
    description: "Todas las sesiones son diseñadas y supervisadas por una especialista certificada en análisis del comportamiento.",
    cta: null,
  },
  {
    title: "Entrenamiento a Padres",
    description: "Con herramientas concretas para el día a día, vas a sentirte más segura acompañando a tu hijo con autismo — dentro y fuera de las sesiones.",
    cta: { label: "Inscribirse", href: "/contacto" },
  },
  {
    title: "Sombra Escolar Terapéutica",
    description: "Una terapeuta acompaña a tu hijo con autismo dentro del aula en Ciudad de México. Coordinamos con su maestra para que la inclusión escolar sea real.",
    cta: { label: "Ver más", href: "/servicios/sombra-escolar" },
  },
];

const MethodSection: React.FC = () => {
  return (
    <section className="w-full bg-[#D6E4F7] section-py">
      <div className="section-px section-container">
        {/* Header */}
        <div className="section-header">
          <p className="text-body-sm font-medium text-brand-black/60 uppercase tracking-widest">
            Por qué elegirnos
          </p>
          <h2 className="text-h1 font-bold text-brand-black">
            Todo lo que una familia con autismo necesita, en un solo lugar
          </h2>
          <p className="text-body-lg text-brand-black/70 max-w-[680px] mx-auto">
            Combinamos la evidencia científica de la Terapia ABA con el acompañamiento humano que cada mamá, papá y niño merece.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {features.map((feature, index) => (
            <article
              key={index}
              className="bg-white rounded-2xl p-6 md:p-8 flex flex-col gap-4"
            >
              {/* Icon placeholder */}
              <div className="w-10 h-10 rounded-xl bg-brand-blue-50 flex items-center justify-center">
                <Target className="w-5 h-5 text-brand-blue" />
              </div>

              <div className="space-y-2 flex-1">
                <h3 className="text-h4 font-semibold text-brand-black">{feature.title}</h3>
                <p className="text-body-md text-brand-black/60 leading-relaxed">{feature.description}</p>
              </div>

              {feature.cta && (
                <Link
                  to={feature.cta.href}
                  className="self-start inline-flex items-center justify-center px-4 py-2 text-body-sm font-semibold bg-brand-black text-white rounded-brilus hover:bg-brand-black/80 transition-colors"
                >
                  {feature.cta.label}
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MethodSection;
