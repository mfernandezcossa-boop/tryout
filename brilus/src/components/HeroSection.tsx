import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full min-h-[70vh] md:min-h-screen overflow-hidden flex items-center">
      {/* Background image */}
      <img
        src="https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/Home/pexels-ivan-s-4783976%20(2).webp"
        alt="Madre acompañando a su hijo con autismo"
        className="absolute inset-0 w-full h-full object-cover object-center"
        fetchPriority="high"
        width={1920}
        height={1080}
      />

      {/* Overlay — más oscuro en mobile para legibilidad del texto centrado */}
      <div className="absolute inset-0 bg-brand-black/55 md:bg-gradient-to-r md:from-brand-black/60 md:via-brand-black/30 md:to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full px-5 md:px-16 lg:px-24 xl:px-32 pt-20 pb-8 md:py-32">

        {/* Mobile: centrado — Desktop: izquierda */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left max-w-[600px] md:max-w-[600px] mx-auto md:mx-0 space-y-5 md:space-y-6">
          <h1 className="text-hero font-bold text-white leading-tight">
            <span className="md:hidden">Tu hijo puede llegar más lejos de lo que imaginás</span>
            <span className="hidden md:inline">Cada niño con autismo tiene su propio camino.</span>
          </h1>

          <p className="text-body-lg text-white/90">
            <span className="md:hidden">En Brilus acompañamos a niños y familias con autismo y neurodesarrollo con terapias, diagnóstico y un equipo que no los suelta.</span>
            <span className="hidden md:inline">En Brilus acompañamos a niños con autismo y a sus familias con el método más respaldado científicamente del mundo.</span>
          </p>

          {/* Mobile: outline button — Desktop: solid black */}
          <Link
            to="/contacto"
            className="inline-flex items-center justify-center px-6 py-3 text-body-md font-semibold rounded-brilus transition-colors
              border border-white text-white hover:bg-white hover:text-brand-black
              md:border-0 md:bg-brand-black md:text-white md:hover:bg-brand-black/80"
          >
            Habla con un especialista hoy
          </Link>

          {/* Badge Hospital Español — solo desktop */}
          <div className="hidden md:inline-flex items-start gap-4 bg-brand-blue rounded-2xl px-5 py-4 max-w-[480px] mt-2">
            <div className="shrink-0 mt-0.5">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
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
