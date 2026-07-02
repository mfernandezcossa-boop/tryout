import React, { useEffect, useRef, useState } from "react";
import { SERVICE_CARDS } from "@/content/serviceCards";

const cards = [SERVICE_CARDS.casa, SERVICE_CARDS.centro, SERVICE_CARDS.escuela];

const HomeServicesSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const cardWidth = el.scrollWidth / cards.length;
      const idx = Math.round(el.scrollLeft / cardWidth);
      setActiveIndex(Math.max(0, Math.min(cards.length - 1, idx)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToIndex = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / cards.length;
    el.scrollTo({ left: cardWidth * i, behavior: "smooth" });
  };

  return (
    <section className="section-py md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="mb-10 md:mb-12 max-w-3xl">
          <h2 className="text-h2 font-semibold text-foreground tracking-tight">
            Terapia ABA en tres entornos, un mismo plan clínico
          </h2>
          <p className="text-body-md text-foreground/70 mt-3">
            Acompañamos a tu hijo con autismo donde más lo necesita: en casa, en el centro o en la escuela en Ciudad de México.
          </p>
        </div>

        {/* Mobile: horizontal scroll with snap and centering */}
        <div className="md:hidden">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {cards.map((c, i) => (
              <a
                key={i}
                href={c.href}
                className="group relative block rounded-2xl overflow-hidden aspect-[4/5] w-full shrink-0 snap-center basis-full"
              >
                <img
                  src={c.image}
                  alt={`${c.title} para niños con autismo en Ciudad de México`}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full bg-white/90 text-foreground text-body-sm font-medium uppercase tracking-tight">
                  {c.badge}
                </span>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-h4 font-semibold">{c.title}</h3>
                  <p className="text-body-md text-white/85 mt-1">{c.subtitle}</p>
                  <span className="inline-flex items-center mt-4 px-4 py-2 rounded-full bg-white/90 text-foreground text-body-sm font-medium">
                    {c.ctaLabel}
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Scroll indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                aria-label={`Ir a tarjeta ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === i ? "w-8 bg-foreground" : "w-2 bg-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: grid */}
        <div className="hidden md:grid gap-6 md:grid-cols-3">
          {cards.map((c, i) => (
            <a
              key={i}
              href={c.href}
              className="group relative block rounded-2xl overflow-hidden aspect-[4/5] hover:shadow-lg transition"
            >
              <img
                src={c.image}
                alt={`${c.title} para niños con autismo en Ciudad de México`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full bg-white/90 text-foreground text-body-sm font-medium uppercase tracking-tight">
                {c.badge}
              </span>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-h4 font-semibold">{c.title}</h3>
                <p className="text-body-md text-white/85 mt-1">{c.subtitle}</p>
                <span className="inline-flex items-center mt-4 px-4 py-2 rounded-full bg-white/90 text-foreground text-body-sm font-medium">
                  {c.ctaLabel}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeServicesSection;
