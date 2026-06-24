import React, { useState, useRef, useEffect } from "react";

const ProcessSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = scrollContainerRef.current.scrollWidth / steps.length;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(index);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const steps = [
    {
      number: "01",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/9ee1bd129c6e04c7811fa025f1043909d49e30c3?placeholderIfAbsent=true",
      title: "Primer contacto",
      description:
        "Nos reunimos contigo para conocerte, entender tus necesidades y contarte cómo trabajamos. Este encuentro es gratuito y sin compromiso.",
    },
    {
      number: "02",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/e56d69e9554577a4d5e72362a786875c5d078441?placeholderIfAbsent=true",
      title: "Evaluación y plan de cuidado",
      description:
        "Observamos al niño en su entorno y diseñamos un plan terapéutico personalizado, integrado por nuestro equipo clínico. Se ajusta si es necesario para acompañar su evolución.",
    },
    {
      number: "03",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/4aee8e3b63b605600e2b50f7c55721d0c90c6824?placeholderIfAbsent=true",
      title: "Sesiones en el hogar y seguimiento",
      description:
        "Las sesiones comienzan en casa, donde el niño se siente seguro. Son lúdicas, estructuradas y respetan su ritmo. Mes a mes, revisamos avances, ajustamos objetivos y compartimos informes claros.",
    },
    {
      number: "04",
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/84021ecb1d3e4a967182a7a7153d69ca23775b29?placeholderIfAbsent=true",
      title: "Evolución del plan",
      description:
        "A medida que el niño crece y avanza, el plan se adapta. Nuestro enfoque es modular y evolutivo, para que cada etapa tenga sentido y continuidad.",
    },
  ];

  return (
    <section className="w-full bg-background section-py">
      <div className="section-px section-container">
        <div className="section-header max-w-4xl mx-auto">
          <p className="text-h5 font-semibold text-brand-black">Nuestro Proceso</p>
          <h2 className="text-h2 md:text-h1 font-semibold text-brand-black leading-tight">
            Simple, claro y acompañado en cada paso
          </h2>
          <p className="text-body-lg text-muted-foreground leading-relaxed">
            Sabemos que iniciar un tratamiento puede generar dudas, ansiedad o incertidumbre. Por eso, en Brilus
            diseñamos un proceso claro, humano y coordinado, para que cada familia se sienta contenida desde el primer
            momento.
          </p>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide pl-4 pr-[calc(50vw-140px)] md:grid md:grid-cols-2 md:gap-8 lg:gap-12 md:pl-0 md:pr-0 md:overflow-x-visible md:snap-none max-w-6xl mx-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {steps.map((step, index) => (
            <article key={index} className="gap-4 sm:gap-6 mx-0 min-w-[280px] snap-center md:min-w-0 flex flex-col">
              <img
                src={step.icon}
                alt={`Paso ${step.number}`}
                width={96}
                height={96}
                loading="lazy"
                className="w-[72px] h-[72px] flex-shrink-0 object-contain"
              />
              <div className="flex-1 space-y-2">
                <p className="text-h1 font-semibold text-brand-black">{step.number}</p>
                <div className="space-y-2">
                  <h3 className="text-h4 sm:text-h3 font-semibold text-brand-black leading-tight">{step.title}</h3>
                  <p className="text-body-sm md:text-body-md text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Indicadores de scroll solo en mobile */}
        <div className="flex justify-center gap-2 mt-6 md:hidden">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (scrollContainerRef.current) {
                  const cardWidth = scrollContainerRef.current.scrollWidth / steps.length;
                  scrollContainerRef.current.scrollTo({
                    left: cardWidth * index,
                    behavior: 'smooth',
                  });
                }
              }}
              className={`h-2 rounded-brilus-pill transition-all duration-300 ${
                activeIndex === index ? 'w-8 bg-brand-blue' : 'w-2 bg-brand-blue/30'
              }`}
              aria-label={`Ir a paso ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
