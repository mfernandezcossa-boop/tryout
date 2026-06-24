import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";

interface Testimonial {
  id: string;
  quote: string;
  author_name: string;
}

export default function RotatingTestimonialCard() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("id, quote, author_name")
        .eq("visible", true)
        .order("order_index", { ascending: true })
        .limit(5);

      if (!error && data) {
        setTestimonials(data);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="bg-brand-coral rounded-2xl p-8 md:p-10 relative overflow-hidden">
      {/* Decorative quote icon */}
      <Quote className="absolute top-4 right-4 w-10 h-10 text-brand-white/20" />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTestimonial.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <p className="text-brand-white text-body-md md:text-body-lg leading-relaxed font-medium italic">
            "{currentTestimonial.quote}"
          </p>
          <p className="text-brand-white/80 text-body-sm font-semibold">
            — {currentTestimonial.author_name}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Dots indicator */}
      {testimonials.length > 1 && (
        <div className="flex gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-brand-white w-6"
                  : "bg-brand-white/40 w-2 hover:bg-brand-white/60"
              }`}
              aria-label={`Ver testimonio ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
