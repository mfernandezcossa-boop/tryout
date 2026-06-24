import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import NavbarBrilus from '@/components/NavbarBrilus';
import Footer from '@/components/Footer';
import { CheckCircle2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
const ThankYou: React.FC = () => {
  useEffect(() => {
    // Track Lead event for Meta Pixel
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead');
    }

    // Load Calendly script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      // Cleanup script on unmount
      document.body.removeChild(script);
    };
  }, []);
  return <>
      <SEOHead title="Agenda tu llamada inicial – Brilus" description="¡Gracias por contactarnos! Agenda tu llamada inicial con nuestro equipo." canonical="/gracias" noindex={true} />
      <NavbarBrilus />
      <main className="min-h-screen bg-brand-white pt-[88px] md:pt-[96px]">
        <div className="px-6 md:px-12 py-12 md:py-16">
          <div className="max-w-[1000px] mx-auto space-y-8">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#4686EF]/10 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 md:w-14 md:h-14 text-[#4686EF]" />
              </div>
            </div>

            {/* Heading */}
            <div className="text-center space-y-4 max-w-[640px] mx-auto">
              <h1 className="text-h2 md:text-h1 font-bold text-brand-black">
                ¡Gracias por confiar en nosotros!
              </h1>
              
              <p className="text-body-lg md:text-h4 text-brand-black/80 leading-relaxed">
                Hemos recibido tu información. Ahora puedes agendar directamente tu llamada inicial con nuestro equipo.
              </p>
            </div>

            {/* Calendly Widget */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="calendly-inline-widget" data-url="https://calendly.com/somosbrilus/llamada-inicial-brilus?text_color=1f1f1f&primary_color=4686ef" style={{
              minWidth: '320px',
              height: '700px'
            }} />
            </div>

            {/* Info Box */}
            <div className="bg-[#F5F5F5] p-6 md:p-8 space-y-3 max-w-[640px] mx-auto rounded-2xl my-[30px]">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-[#4686EF]" />
                <h2 className="text-body-lg font-semibold text-brand-black">
                  ¿Qué puedes esperar de esta llamada?
                </h2>
              </div>
              <ul className="space-y-2 text-body-md text-brand-black/80">
                <li className="flex gap-3">
                  <span className="text-[#4686EF] font-bold">•</span>
                  <span>Conoceremos las necesidades específicas de tu hijo y tu familia.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#4686EF] font-bold">•</span>
                  <span>Te explicaremos nuestro proceso de evaluación y terapias disponibles.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#4686EF] font-bold">•</span>
                  <span>Resolveremos todas tus dudas sobre nuestros servicios.</span>
                </li>
              </ul>
            </div>

            {/* Alternative Contact */}
            <div className="text-center space-y-4 max-w-[640px] mx-auto">
              <p className="text-body-md text-brand-black/70">
                ¿Prefieres que nosotros te contactemos?
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline" className="border-2 border-brand-black text-brand-black hover:bg-brand-black/5 rounded-full px-8 py-6 text-body-md font-semibold">
                  <a href="https://wa.me/525562151706?text=Hola%20Brilus%2C%20acabo%20de%20completar%20el%20formulario%20de%20su%20sitio%20web" target="_blank" rel="noopener noreferrer">
                    Contactar por WhatsApp
                  </a>
                </Button>
              </div>

              <p className="text-body-sm text-brand-black/60 pt-2">
                O escríbenos directamente a{' '}
                <a href="mailto:familia@somosbrilus.com" className="text-[#4686EF] hover:underline font-medium">
                  familia@somosbrilus.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>;
};
export default ThankYou;