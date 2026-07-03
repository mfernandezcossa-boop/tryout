import React from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/ScrollReveal';

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full min-h-[70vh] md:min-h-[80vh] overflow-hidden bg-brand-blue section-px py-24 md:py-32 lg:py-40 flex items-center">
      {/* Background Image */}
      <img
        src="https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/website_assets/heros/hero_background_home.webp"
        alt="Niño en terapia ABA alcanzando su máximo potencial"
        className="absolute inset-0 w-full h-full object-cover"
        fetchPriority="high"
        width={1920}
        height={1080}
      />

      {/* Overlay for text contrast */}
      <div className="absolute inset-0 bg-brand-black/[0.42]" />

      {/* Content */}
      <div className="relative z-10 max-w-[960px] text-center space-y-8 mx-auto">
        <ScrollReveal delay={0.15}>
          <h1 className="text-hero text-white pt-[76px]">
            Tu hijo con autismo puede llegar más lejos de lo que imaginás
          </h1>
          <h2 className="text-h3 text-white/80 mt-3 font-normal">
            Terapia ABA para niños con autismo en Ciudad de México
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.35}>
          <p className="text-body-lg text-white/90">
            En Brilus acompañamos a niños y familias con autismo y neurodesarrollo con terapias, diagnóstico y un equipo que no los suelta.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.5} variant="scaleUp">
          <div className="flex flex-col items-center justify-center gap-4 mt-8 my-[36px]">
            <Link
              to="/contacto"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-body-md font-medium bg-white text-brand-black rounded-brilus hover:bg-white/90 transition-colors shadow-brilus-2"
            >
              Habla con un especialista
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default HeroSection;
