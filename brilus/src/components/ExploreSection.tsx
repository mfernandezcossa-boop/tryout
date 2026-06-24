import React from 'react';
import { Link } from 'react-router-dom';

const ExploreSection: React.FC = () => {
  return <section className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[350px] lg:min-h-[450px]">
        <div className="bg-[hsl(var(--brand-coral))] section-px flex items-center section-py">
          <div className="space-y-6 max-w-2xl">
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Explora el metodo brilus</h2>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight">Claridad, contención y desarrollo</h3>
            </div>
            <Link to="/contacto" className="inline-flex items-center justify-center gap-2.5 px-6 py-3 text-lg sm:text-xl font-medium text-primary-foreground bg-primary rounded-full hover:opacity-90 transition-opacity">
              Solicita una consulta hoy
            </Link>
          </div>
        </div>
        <div className="min-h-[350px] lg:min-h-[450px]">
          <img src="https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/Home/Child%20development%20illustration.webp" alt="Niño en proceso de desarrollo con terapia personalizada" width={800} height={500} loading="lazy" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>;
};
export default ExploreSection;