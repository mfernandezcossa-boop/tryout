import React, { useState, useRef, useEffect } from "react";
import { Clipboard, Users, Trophy, Rocket, Fingerprint } from "lucide-react";

const services = [
  {
    icon: Clipboard,
    bgColor: "bg-brand-blue",
    iconColor: "text-white",
    title: "Comunicación funcional",
    description:
      "Ayudamos a tu hijo a encontrar su forma de expresión para que logre decir lo que necesita, siente y piensa.",
  },
  {
    icon: Users,
    bgColor: "bg-brand-amber",
    iconColor: "text-white",
    title: "Habilidades sociales",
    description:
      "Acompañamos su integración al mundo, facilitando que aprenda a relacionarse y compartir en entornos seguros.",
  },
  {
    icon: Trophy,
    bgColor: "bg-brand-coral",
    iconColor: "text-white",
    title: "Autonomía Personal",
    description:
      "Convertimos las rutinas diarias en metas alcanzables que fortalecen la seguridad en sus propias capacidades.",
  },
  {
    icon: Rocket,
    bgColor: "bg-brand-blue-50",
    iconColor: "text-brand-blue",
    title: "Regulación y Bienestar",
    description:
      "Brindamos herramientas para gestionar emociones y reducir crisis, promoviendo el equilibrio y la calma en casa.",
  },
  {
    icon: Fingerprint,
    bgColor: "bg-brand-coral-50",
    iconColor: "text-brand-coral",
    title: "Procesamiento Sensorial",
    description:
      "Logramos que se sienta cómodo en su cuerpo y en cada espacio, ayudándole a procesar mejor los estímulos de su entorno.",
  },
];

const ServicesSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const cardWidth = el.scrollWidth / services.length;
      const idx = Math.round(el.scrollLeft / cardWidth);
      setActiveIndex(Math.max(0, Math.min(services.length - 1, idx)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToIndex = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / services.length;
    el.scrollTo({ left: cardWidth * i, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-background section-px section-py">
      <div className="section-container space-y-10 md:space-y-12">
        <div className="section-header">
          <p className="text-body-sm font-semibold text-brand-black uppercase tracking-widest">
            Beneficios Terapia ABA
          </p>
          <h2 className="text-h2 text-brand-black">¿Cómo la Terapia ABA puede transformar el futuro de tu hijo?</h2>
          <p className="text-body-lg text-muted-foreground max-w-[720px] mx-auto">
            Un enfoque basado en ciencia que impacta las áreas más importantes del desarrollo, respetando el ritmo y la
            singularidad de cada niño.
          </p>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="md:hidden">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <article
                  key={index}
                  className={`${service.bgColor} rounded-brilus-card p-6 space-y-4 shadow-brilus-1 shrink-0 w-[85vw] snap-center`}
                >
                  <div className="mb-2">
                    <Icon className={`w-10 h-10 ${service.iconColor}`} strokeWidth={2} fill="none" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-h4 text-brand-black font-semibold">{service.title}</h3>
                    <p className="text-body-md text-brand-black/70">{service.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {services.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                aria-label={`Ir a servicio ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${activeIndex === i ? "w-8 bg-brand-blue" : "w-2 bg-brand-blue/30"}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: grid 3+2 */}
        <div className="hidden md:grid grid-cols-6 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isBottom = index >= 3;
            return (
              <article
                key={index}
                className={`${service.bgColor} rounded-brilus-card p-10 space-y-5 shadow-brilus-1 ${isBottom ? "col-span-3" : "col-span-2"}`}
              >
                <div className="mb-2">
                  <Icon className={`w-10 h-10 ${service.iconColor}`} strokeWidth={2} fill="none" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-h4 text-brand-black font-semibold">{service.title}</h3>
                  <p className="text-body-md text-brand-black/70">{service.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
