import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";

interface Testimonial {
  id: string;
  quote: string;
  author_name: string;
  author_photo_url?: string;
  order_index: number;
}

const COLORS = [
  { bg: "bg-brand-coral", name: "coral" },
  { bg: "bg-brand-blue", name: "blue" },
  { bg: "bg-brand-amber", name: "amber" },
];

export const ABATestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplaying, setIsAutoplaying] = useState(true);
  const autoplayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    skipSnaps: false,
    duration: 20
  });

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("visible", true)
        .in("display_location", ["all", "aba"])
        .order("order_index", { ascending: true })
        .limit(3);

      if (!error && data) {
        setTestimonials(data);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (testimonials.length === 0 || !isAutoplaying || !emblaApi) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length, isAutoplaying, emblaApi]);

  const pauseAutoplay = () => {
    setIsAutoplaying(false);
    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current);
    }
    autoplayTimeoutRef.current = setTimeout(() => {
      setIsAutoplaying(true);
    }, 10000);
  };

  const handlePrevious = () => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      pauseAutoplay();
    }
  };

  const handleNext = () => {
    if (emblaApi) {
      emblaApi.scrollNext();
      pauseAutoplay();
    }
  };

  const handleDotClick = (index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
      pauseAutoplay();
    }
  };

  const handleDragStart = () => {
    pauseAutoplay();
  };

  if (testimonials.length === 0) return null;

  const currentColor = COLORS[currentIndex % COLORS.length];

  return (
    <section
      className={`w-full py-16 sm:py-24 lg:py-32 transition-colors duration-700 ${currentColor.bg}`}
    >
      <div className="section-px max-w-5xl mx-auto">
        <div className="relative">
          {/* Navigation Buttons - Hidden on mobile */}
          <div className="hidden lg:flex absolute inset-y-0 left-0 right-0 items-center justify-between pointer-events-none z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="pointer-events-auto bg-brand-white/80 hover:bg-brand-white text-brand-black rounded-full h-12 w-12 -ml-4 shadow-md hover:shadow-lg transition-all"
              aria-label="Testimonio anterior"
            >
              <ChevronLeft className="h-7 w-7" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="pointer-events-auto bg-brand-white/80 hover:bg-brand-white text-brand-black rounded-full h-12 w-12 -mr-4 shadow-md hover:shadow-lg transition-all"
              aria-label="Siguiente testimonio"
            >
              <ChevronRight className="h-7 w-7" />
            </Button>
          </div>

          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef} onPointerDown={handleDragStart}>
            <div className="flex">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="flex-[0_0_100%] min-w-0 px-4">
                  <div className="text-center space-y-6 py-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-brand-black">
                      Lo que dicen las familias
                    </h2>
                    <blockquote className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-brand-black leading-tight max-w-4xl mx-auto px-2 sm:px-4">
                      "{testimonial.quote}"
                    </blockquote>
                    <cite className="text-lg sm:text-xl text-brand-black not-italic">
                      - <span className="font-semibold">{testimonial.author_name}</span>
                    </cite>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators - Visible only on mobile */}
          <div className="flex lg:hidden justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index 
                    ? 'w-8 bg-brand-black' 
                    : 'w-2 bg-brand-black/30'
                }`}
                aria-label={`Ir al testimonio ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
