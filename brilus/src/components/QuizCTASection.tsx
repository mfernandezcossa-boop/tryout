import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, Clock, Lock } from 'lucide-react';

const QuizCTASection: React.FC = () => {
  const benefits = [
    { icon: ClipboardCheck, text: 'Resultados inmediatos con recomendaciones de próximos pasos' },
    { icon: Lock, text: 'Completamente gratuito y confidencial' },
    { icon: Clock, text: 'Primer paso hacia un plan terapéutico personalizado' },
  ];

  return (
    <section className="w-full bg-background section-py">
      <div className="px-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-brand-blue rounded-brilus-card p-6 sm:p-8 md:p-12 lg:p-16 shadow-brilus-2 px-48 py-48">
            <div className="space-y-6 text-center">
              <div className="space-y-4">
                <h2 className="text-h2 text-white leading-tight">
                  ¿Tu hijo podría beneficiarse de la Terapia ABA?
                </h2>
                <p className="text-body-lg text-white/90 max-w-2xl mx-auto">
                  Completa nuestro cuestionario en 3 minutos y te indicamos si la Terapia ABA podría apoyar a tu hijo en lenguaje, conducta y habilidades del día a día.
                </p>
              </div>

              {/* Benefits list */}
              <div className="space-y-4 py-4 max-w-2xl mx-auto">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 text-left">
                    <benefit.icon className="w-6 h-6 text-white flex-shrink-0 mt-0.5" />
                    <p className="text-body-md text-white/90">{benefit.text}</p>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Link
                to="/quiz-aba"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 text-body-md font-semibold text-brand-blue bg-white rounded-brilus hover:bg-white/90 transition-all duration-300 shadow-brilus-2"
              >
                Comenzar evaluación gratuita
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizCTASection;
