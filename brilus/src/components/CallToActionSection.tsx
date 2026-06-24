import React from 'react';
import { Link } from 'react-router-dom';

const CallToActionSection: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <section className="w-full bg-brand-coral section-py-lg py-48">
      <div className="section-px max-w-5xl mx-auto">
        <div className="text-center space-y-6">
          <h2 className="text-h4 text-white">Brilus</h2>
          <h3 className="text-h1 text-white leading-tight">
            Conversemos sobre cómo apoyar el desarrollo de tu hijo
          </h3>
          <p className="text-body-lg text-white/90">
            En Brilus, trabajamos contigo y con tu familia para crear un plan claro, humano y efectivo.
          </p>
          <Link
            to="/contacto"
            className="mt-8 inline-flex items-center justify-center gap-2 px-6 py-3 text-body-md font-medium text-brand-coral bg-white rounded-brilus hover:bg-white/90 transition-colors shadow-brilus-1"
          >
            Agenda tu llamada ahora
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
