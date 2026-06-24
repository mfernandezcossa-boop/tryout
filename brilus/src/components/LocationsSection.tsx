import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";

interface Location {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  order_index: number | null;
}

export default function LocationsSection() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplaying, setIsAutoplaying] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    skipSnaps: false,
    duration: 20,
    align: 'center',
    containScroll: false,
  });

  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("visible", true)
        .order("order_index", { ascending: true });
      if (!error && data) setLocations(data);
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setCurrentIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || !isAutoplaying) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 2500);
    return () => clearInterval(interval);
  }, [emblaApi, isAutoplaying]);

  const pauseAutoplay = () => setIsAutoplaying(false);
  const handleDotClick = (index: number) => {
    pauseAutoplay();
    emblaApi?.scrollTo(index);
  };

  if (locations.length === 0) return null;

  return (
    <section className="section-py bg-muted relative overflow-hidden">
      <div className="section-px section-container relative z-10">
        {/* Section Header */}
        <div className="section-header max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-h2 text-brand-black mb-4"
          >
            Estamos cerca de ti
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-body-md text-muted-foreground"
          >
            Nuestros terapeutas trabajan en distintas zonas de CDMX y área metropolitana
          </motion.p>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-5 w-full max-w-5xl mx-auto">
          {locations.map((location, index) => (
            <motion.article
              key={location.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-brilus-card mb-3 aspect-[3/4] shadow-brilus-3 group-hover:shadow-brilus-2 transition-shadow duration-300">
                {location.image_url ? (
                  <img
                    src={location.image_url}
                    alt={location.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <h3 className="text-body-lg font-semibold text-brand-black group-hover:text-brand-coral transition-colors">
                {location.name}
              </h3>
              <p className="text-body-md text-muted-foreground line-clamp-2">
                {location.description}
              </p>
            </motion.article>
          ))}
        </div>

        {/* Mobile/Tablet: Carousel */}
        <div className="lg:hidden overflow-hidden" ref={emblaRef}>
          <div className="flex" onMouseDown={pauseAutoplay} onTouchStart={pauseAutoplay}>
            {locations.map((location) => (
              <article key={location.id} className="flex-[0_0_65%] sm:flex-[0_0_45%] md:flex-[0_0_35%] min-w-0 px-2">
                <div className="relative overflow-hidden rounded-brilus-card mb-3 aspect-[3/4] shadow-brilus-3">
                  {location.image_url ? (
                    <img src={location.image_url} alt={location.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <h3 className="text-body-lg font-semibold text-brand-black">{location.name}</h3>
                <p className="text-body-md text-muted-foreground line-clamp-2">{location.description}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Mobile/Tablet dots indicator */}
        <div className="flex lg:hidden justify-center gap-2 mt-8">
          {locations.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-brilus-pill transition-all duration-300 ${
                index === currentIndex ? "bg-brand-coral w-8" : "bg-muted-foreground/30 w-2"
              }`}
              aria-label={`Ir a la ubicación ${index + 1}`}
            />
          ))}
        </div>

        {/* Note for other zones */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8 text-body-sm text-muted-foreground py-16"
        >
          ¿Estás en otra zona? <span className="text-brand-black font-medium">Evaluamos casos fuera de estas áreas.</span>
        </motion.p>
      </div>
    </section>
  );
}
