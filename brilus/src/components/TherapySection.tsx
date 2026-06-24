import React, { useState, useRef, useEffect } from "react";

const TherapySection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = scrollContainerRef.current.scrollWidth / benefits.length;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(index);
    };
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const benefits = [
    {
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/6a4c18fd8caf51742b245b869a77f21a9b583e3e?placeholderIfAbsent=true",
      bgColor: "bg-brand-blue",
      title: "Mejora en la comunicación",
      description: "Ya sea verbal, gestual o con dispositivos, enseñamos al niño a expresar lo que necesita, siente y piensa.",
    },
    {
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/f541fe64435178639521c447e29997abc9c8ae96?placeholderIfAbsent=true",
      bgColor: "bg-brand-amber",
      title: "Desarrollo de habilidades sociales",
      description: "Aprender a jugar, compartir, saludar, esperar turnos y relacionarse con otros niños y adultos.",
    },
    {
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/c4a61b08bf475aedf3b7cbdd684fa462e71e5456?placeholderIfAbsent=true",
      bgColor: "bg-brand-coral",
      title: "Mayor autonomía",
      description: "Enseñamos rutinas como vestirse, comer, ir al baño, organizar sus cosas—paso a paso, con apoyo y motivación.",
    },
    {
      icon: "https://api.builder.io/api/v1/image/assets/TEMP/3018040ff2f2c98b35b2ad7709b38a4bc7b58a25?placeholderIfAbsent=true",
      bgColor: "bg-brand-blue",
      title: "Empoderamiento familiar",
      description: "Los padres reciben herramientas claras para acompañar el proceso, entender el comportamiento de su hijo y sentirse parte activa del tratamiento.",
    },
  ];

  return (
    <section className="w-full bg-background section-px section-py">
      <div className="section-container space-y-12 md:space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-h5 text-brand-black font-semibold">Terapia ABA</p>
              <h2 className="text-h2 text-brand-black">
                Un enfoque basado en ciencia que potencia el desarrollo de tu hijo
              </h2>
            </div>
            <p className="text-body-lg text-muted-foreground">
              La Terapia ABA (Análisis Conductual Aplicado) es el método más reconocido y respaldado científicamente en
              Estados Unidos y el mundo para el tratamiento del autismo. <br />
              <br /> En Brilus aplicamos este enfoque con sensibilidad y precisión, adaptándolo a cada niño y su
              familia. Nuestro objetivo: transformar desafíos en aprendizajes reales, dentro del hogar y en la
              comunidad.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              alt="Ilustración de Terapia ABA - Análisis Conductual Aplicado para niños"
              width={400}
              height={400}
              loading="lazy"
              className="w-full max-w-[400px] h-auto object-contain"
              src="https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/website_assets/images/aba_therapy_image_home.webp"
            />
          </div>
        </div>

        <div className="space-y-8 md:space-y-10 my-[61px]">
          <div className="space-y-4">
            <h3 className="text-h5 text-brand-black">Beneficios Terapia ABA</h3>
            <h4 className="text-h3 text-brand-black">¿Cómo la Terapia ABA puede transformar el futuro de tu hijo?</h4>
          </div>
          <div
            ref={scrollContainerRef}
            className="flex gap-2 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide pl-4 pr-[calc(50vw-140px)] md:space-y-2 md:flex-col md:pl-0 md:pr-0 md:overflow-x-visible md:snap-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {benefits.map((benefit, index) => (
              <article
                key={index}
                className="flex flex-col items-start text-left gap-[24px] p-[24px] min-w-[280px] snap-center md:flex-row md:items-start md:gap-[16px] md:p-[16px] md:min-w-0"
              >
                <div
                  className={`flex-shrink-0 flex items-center justify-center ${benefit.bgColor} rounded-brilus-pill p-[16px] md:p-[12px]`}
                  style={{
                    width: "clamp(80px, 10vw, 96px)",
                    height: "clamp(80px, 10vw, 96px)",
                  }}
                >
                  <img
                    src={benefit.icon}
                    alt={`${benefit.title} icon`}
                    width={48}
                    height={48}
                    loading="lazy"
                    className="object-contain"
                    style={{
                      width: "clamp(40px, 6vw, 48px)",
                      height: "clamp(40px, 6vw, 48px)",
                    }}
                  />
                </div>
                <div className="flex-1 space-y-[8px] my-0">
                  <h5 className="text-h4 text-brand-black text-left">{benefit.title}</h5>
                  <p className="text-body-md text-muted-foreground text-left">{benefit.description}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Indicadores de scroll solo en mobile */}
          <div className="flex justify-center gap-2 mt-6 md:hidden">
            {benefits.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (scrollContainerRef.current) {
                    const cardWidth = scrollContainerRef.current.scrollWidth / benefits.length;
                    scrollContainerRef.current.scrollTo({
                      left: cardWidth * index,
                      behavior: "smooth",
                    });
                  }
                }}
                className={`h-2 rounded-brilus-pill transition-all duration-300 ${
                  activeIndex === index ? "w-8 bg-brand-blue" : "w-2 bg-brand-blue/30"
                }`}
                aria-label={`Ir a beneficio ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TherapySection;
