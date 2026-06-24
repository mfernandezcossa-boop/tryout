import React from "react";
import { Link } from "react-router-dom";

const SupervisionSection: React.FC = () => {
  return (
    <section className="w-full md:section-px section-py">
      <div className="md:section-container bg-brand-blue md:rounded-brilus-card overflow-hidden md:shadow-brilus-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 lg:gap-12 items-start lg:items-center px-10 py-10 sm:p-8 md:p-12 lg:p-16">
          <div className="order-2 lg:order-1">
            <img
              src="https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/website_assets/images/imagen_metodo_brilus_science%20(1).webp"
              alt="Supervisión profesional BCBA certificada"
              width={600}
              height={400}
              loading="lazy"
              className="w-full h-auto aspect-[3/2] object-cover rounded-brilus-inner"
            />
          </div>
          <div className="order-1 lg:order-2 space-y-6">
            <div className="space-y-4">
              <h2 className="text-h4 text-white">El Método Brilus</h2>
              <h3 className="text-h2 text-white">Ciencia y Valores para Resultados Reales</h3>
              <p className="text-body-lg text-white/90">
                En Brilus, nuestras terapistas están supervisadas por una profesional certificada BCBA. Su enfoque
                combina excelencia científica con sensibilidad humana, asegurando que cada plan terapéutico sea
                rigurosamente diseñado, monitoreado y adaptado al progreso real de cada niño.
              </p>
            </div>
            <Link
              to="/contacto"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-body-md font-medium text-brand-blue bg-white rounded-brilus hover:bg-white/90 transition-colors shadow-brilus-1"
            >
              Descubre cómo podemos ayudarte
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupervisionSection;
