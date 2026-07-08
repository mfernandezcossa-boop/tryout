import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full min-h-[90vh] md:min-h-screen overflow-hidden flex items-end md:items-center">
      {/* Background image */}
      <img
        src="https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/website_assets/heros/hero_background_home.webp"
        alt="Madre acompañando a su hijo con autismo"
        className="absolute inset-0 w-full h-full object-cover object-center"
        fetchPriority="high"
        width={1920}
        height={1080}
      />

      {/* Subtle left-side gradient for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-black/60 via-brand-black/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full section-px pt-28 pb-12 md:pt-0 md:pb-0">
        <div className="max-w-[600px] space-y-6">
          <h1 className="text-hero font-bold text-white leading-tight">
            Cada niño con autismo tiene su propio camino.
          </h1>
          <p className="text-body-lg text-white/90">
            En Brilus acompañamos a niños con autismo y a sus familias con el método más respaldado científicamente del mundo.
          </p>
          <Link
            to="/contacto"
            className="inline-flex items-center justify-center px-6 py-3 text-body-md font-semibold bg-brand-black text-white rounded-brilus hover:bg-brand-black/80 transition-colors"
          >
            Habla con un especialista hoy
          </Link>

          {/* Hospital Español badge */}
          <div className="mt-6 inline-flex items-start gap-4 bg-brand-blue rounded-2xl px-5 py-4 max-w-[480px]">
            <div className="shrink-0 mt-0.5">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="20" cy="20" r="20" fill="white" fillOpacity="0.15"/>
                <path d="M20 8C15 8 11 12 11 17C11 22 14 24 17 26.5C18.5 27.7 19.2 29 19.2 29H20.8C20.8 29 21.5 27.7 23 26.5C26 24 29 22 29 17C29 12 25 8 20 8Z" stroke="white" strokeWidth="1.5" fill="none"/>
                <circle cx="20" cy="17" r="3" stroke="white" strokeWidth="1.5" fill="none"/>
              </svg>
            </div>
            <div>
              <p className="text-body-md text-white">
                <span className="font-bold">Terapia ABA para autismo</span> en la Unidad de Neurodesarrollo del Hospital Español
              </p>
              <Link to="/supervision" className="text-body-sm text-white/70 underline underline-offset-2 hover:text-white transition-colors mt-1 inline-block">
                Ver mas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
