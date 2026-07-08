import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: string;
  quote: string;
  author_name: string;
  author_vinculo?: string | null;
  author_photo_url?: string | null;
  youtube_url?: string | null;
  order_index: number;
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    let videoId: string | null = null;
    if (u.hostname.includes("youtu.be")) {
      videoId = u.pathname.slice(1);
    } else if (u.searchParams.get("v")) {
      videoId = u.searchParams.get("v");
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0` : null;
  } catch {
    return null;
  }
}

interface Props {
  displayLocation?: "home" | "aba" | "all";
  limit?: number;
}

export default function TestimonialBlock({ displayLocation = "home", limit = 6 }: Props) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    supabase
      .from("testimonials")
      .select("*")
      .eq("visible", true)
      .in("display_location", [displayLocation, "all"])
      .order("order_index", { ascending: true })
      .limit(limit)
      .then(({ data, error }) => {
        if (!error && data) setTestimonials(data as Testimonial[]);
      });
  }, [displayLocation, limit]);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    startAutoplay();
    return () => stopAutoplay();
  }, [testimonials.length]);

  const startAutoplay = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % testimonials.length);
    }, 6000);
  };

  const stopAutoplay = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
  };

  const pauseAndResume = () => {
    stopAutoplay();
    pauseTimeoutRef.current = setTimeout(startAutoplay, 10000);
  };

  const goTo = (i: number) => { setCurrentIndex(i); pauseAndResume(); };
  const goPrev = () => goTo((currentIndex - 1 + testimonials.length) % testimonials.length);
  const goNext = () => goTo((currentIndex + 1) % testimonials.length);

  if (testimonials.length === 0) return null;

  const t = testimonials[currentIndex];
  const embedUrl = t.youtube_url ? getYouTubeEmbedUrl(t.youtube_url) : null;

  return (
    <section className="w-full section-py overflow-hidden">
      <div className="flex flex-col md:flex-row w-full min-h-[380px] md:min-h-[420px] md:rounded-3xl overflow-hidden shadow-brilus-2 mx-auto max-w-[1200px]">

        {/* Left media: photo or YouTube — below on mobile, left on desktop */}
        <div className="relative w-full md:w-[45%] shrink-0 min-h-[260px] md:min-h-0 bg-brand-grey order-2 md:order-1">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={t.author_name}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : t.author_photo_url ? (
            <img
              src={t.author_photo_url}
              alt={t.author_name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-brand-grey-light" />
          )}
        </div>

        {/* Bubble connector — desktop only */}
        <div className="hidden md:flex items-center relative z-10 -mx-6 shrink-0 order-2">
          <div className="w-12 h-12 rounded-full bg-brand-blue" />
        </div>

        {/* Right: blue panel — top on mobile, right on desktop */}
        <div className="relative flex-1 bg-brand-blue flex flex-col justify-between p-8 md:p-12 rounded-t-3xl md:rounded-t-none md:rounded-r-3xl order-1 md:order-3">
          <blockquote className="text-h3 md:text-h2 font-semibold text-white leading-snug flex-1 flex items-center">
            {t.quote}
          </blockquote>

          <div className="mt-8 flex items-end justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-body-md font-semibold text-white">{t.author_name}</p>
              {t.author_vinculo && (
                <p className="text-body-sm text-white/70">{t.author_vinculo}</p>
              )}
            </div>
            <img
              src="/brilus-logo-white.svg"
              alt="Brilus"
              className="h-8 w-auto opacity-90"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>

          {testimonials.length > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Ver testimonio ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === currentIndex ? "w-8 bg-white" : "w-2 bg-white/40"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={goPrev} aria-label="Anterior" className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition flex items-center justify-center">
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button onClick={goNext} aria-label="Siguiente" className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition flex items-center justify-center">
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
