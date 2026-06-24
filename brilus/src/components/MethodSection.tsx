import React, { useState, useRef, useEffect } from "react";

const MethodSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = scrollContainerRef.current.scrollWidth / features.length;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(index);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const features = [
    {
      icon: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/website_assets/icons/Icono%20feature%201.svg",
      title: "Planes de Cuidado Personalizados",
      description:
        "Cada niño recibe un plan adaptado a su perfil, con seguimiento continuo. Se ajusta si es necesario para acompañar su evolución.",
    },
    {
      icon: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/website_assets/icons/Icono%20feature%202.svg",
      title: "Acompañamiento estratégico a padres",
      description:
        "Brindamos herramientas para que cada decisión sea informada, sostenible y en favor del desarrollo de su hijo.",
    },
    {
      icon: "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/website_assets/icons/Icono%20feature%203.svg",
      title: "Interacción con el ambiente del niño",
      description:
        "Trabajamos junto a su entorno —hogar, rutinas, vínculos—para que la terapia se integre de forma natural en su vida cotidiana.",
    },
  ];

  return (
    <section className="w-full bg-background section-px section-py">
      <div className="section-container">
        <div className="section-header">
          <img
            src="https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/website_assets/images/logo_metodo_brilus.webp"
            alt="Logo Brilus - Método integral para desarrollo infantil"
            width={160}
            height={80}
            loading="lazy"
            className="w-[120px] md:w-[160px] mx-auto"
          />
          <div className="space-y-[16px]">
            <h2 className="text-h4 text-brand-black">El Método Brilus</h2>
            <h3 className="text-h1 text-brand-black">Un enfoque integral para el desarrollo infantil</h3>
            <p className="text-body-lg text-muted-foreground max-w-[960px] mx-auto">
              En Brilus, sabemos que cada niño es único. Por eso, creamos planes de intervención personalizados para
              niños con autismo que integran Terapia ABA, lenguaje y terapia ocupacional. Siempre bajo la supervisión de
              nuestra especialista BCBA.
            </p>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-8 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide pl-4 pr-[calc(50vw-140px)] md:pl-0 md:pr-0 md:grid md:grid-cols-2 md:overflow-x-visible md:snap-none xl:grid-cols-3"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {features.map((feature, index) => (
            <article
              key={index}
              className={`flex flex-col items-center text-center h-auto p-6 md:p-12 rounded-brilus-card bg-white border border-border min-w-[80vw] snap-center md:min-w-0 ${
                index === 2 ? "md:col-span-2 md:justify-self-center md:max-w-[480px] xl:col-span-1 xl:max-w-none" : ""
              }`}
            >
              <img
                src={feature.icon}
                alt={`${feature.title} icon`}
                width={64}
                height={64}
                loading="lazy"
                className="w-[clamp(48px,6vw,72px)] h-[clamp(48px,6vw,72px)] object-contain mb-6"
              />
              <h3 className="text-h4 font-semibold mb-3 text-brand-black">{feature.title}</h3>
              <p className="text-body-md text-muted-foreground leading-relaxed">{feature.description}</p>
            </article>
          ))}
        </div>

        {/* Indicadores de scroll solo en mobile */}
        <div className="flex justify-center gap-2 mt-6 md:hidden">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (scrollContainerRef.current) {
                  const cardWidth = scrollContainerRef.current.scrollWidth / features.length;
                  scrollContainerRef.current.scrollTo({
                    left: cardWidth * index,
                    behavior: "smooth",
                  });
                }
              }}
              className={`h-2 rounded-brilus-pill transition-all duration-300 ${
                activeIndex === index ? "w-8 bg-brand-blue" : "w-2 bg-brand-blue/30"
              }`}
              aria-label={`Ir a tarjeta ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MethodSection;
