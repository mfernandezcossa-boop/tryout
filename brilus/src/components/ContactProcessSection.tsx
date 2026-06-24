import React from "react";
const ContactProcessSection: React.FC = () => {
  const steps = [{
    number: "1",
    title: "Llamada de introducción",
    description: "Conoce a nuestra supervisora clínica y contanos sobre tu hijo y tus necesidades.",
    lineColor: "bg-brand-blue"
  }, {
    number: "2",
    title: "Valoración inicial",
    description: "Realizamos entrevistas con los padres y observamos al niño para comprender su entorno y fortalezas.",
    lineColor: "bg-brand-coral"
  }, {
    number: "3",
    title: "Plan terapéutico",
    description: "Diseñamos un plan de intervención ABA personalizado, con metas claras y alcanzables.",
    lineColor: "bg-brand-amber"
  }, {
    number: "4",
    title: "Inicio de las terapias",
    description: "Comenzamos las sesiones en casa y realizamos un seguimiento continuo del progreso, acompañándote en cada paso.",
    lineColor: "bg-brand-blue"
  }];
  return <section className="w-full bg-background py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center space-y-4 mb-12 max-w-4xl mx-auto">
          <h2 className="text-h2 md:text-h1 font-bold text-foreground leading-tight">
            Nuestro proceso
          </h2>
          <p className="text-body-md md:text-body-lg text-foreground/80 leading-relaxed">
            Este proceso nos permite conocer en profundidad a su hijo y a su familia, para diseñar un plan terapéutico personalizado y realista.
          </p>
        </div>

        {/* Desktop/Tablet Grid - 2x2 */}
        <div className="hidden md:grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {steps.map((step, index) => <article key={index} className="flex flex-col gap-4">
              {/* Color line */}
              <div className={`h-1 w-full ${step.lineColor} rounded-full`} />
              
              {/* Content */}
              <div className="space-y-3">
                <h3 className="leading-none font-bold text-foreground text-6xl">
                  {step.number}
                </h3>
                
                <div className="space-y-2">
                  <h4 className="text-h4 md:text-h3 font-bold text-foreground leading-tight text-4xl">
                    {step.title}
                  </h4>
                  
                  <p className="text-body-sm md:text-body-md text-foreground/70 leading-relaxed text-xl">
                    {step.description}
                  </p>
                </div>
              </div>
            </article>)}
        </div>

        {/* Mobile Vertical Stack */}
        <div className="md:hidden flex flex-col gap-8">
          {steps.map((step, index) => <article key={index} className="flex flex-col gap-4">
              {/* Color line */}
              <div className={`h-1 w-full ${step.lineColor} rounded-full`} />
              
              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-[64px] leading-none font-bold text-foreground">
                  {step.number}
                </h3>
                
                <div className="space-y-2">
                  <h4 className="text-h4 font-bold text-foreground leading-tight">
                    {step.title}
                  </h4>
                  
                  <p className="text-body-sm text-foreground/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </article>)}
        </div>
      </div>
    </section>;
};
export default ContactProcessSection;