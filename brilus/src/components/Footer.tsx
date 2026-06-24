import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <>
      {/* Separador superior sutil */}
      <div className="w-full py-12 sm:py-6" />

      <footer role="contentinfo" className="w-full bg-brand-black text-white">
        <div className="container mx-auto sm:px-12 lg:px-24 sm:py-14 lg:py-16 px-48 py-[74px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Columna 1: Logo + descripción */}
            <div className="lg:col-span-5 space-y-6">
              <Link to="/" aria-label="Ir al inicio" className="inline-flex items-center">
                <img
                  src="https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/sign/Photos/Componenets/Footer/Ima-%20White.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wNDhkOTJlZC00ODk0LTQzY2UtYjllYy03MzU5ZjgyZTNkZGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQaG90b3MvQ29tcG9uZW5ldHMvRm9vdGVyL0ltYS0gV2hpdGUud2VicCIsImlhdCI6MTc2MTA1NzEwNywiZXhwIjoxNzkyNTkzMTA3fQ.nk-0YL8-pT8twQDF7jMH-6wqARj_qpP_44Pzi5hO698"
                  alt="Brilus"
                  className="h-8 sm:h-9 w-auto"
                  loading="lazy"
                  width={140}
                  height={32}
                />
              </Link>

              <p className="text-body-sm leading-relaxed text-white/90">
                Brilus acompaña a familias, profesionales y comunidades en el camino de la neurodivergencia y la
                discapacidad infantil, ofreciendo herramientas visuales, emocionales y operativas que transforman el
                proceso terapéutico en una experiencia más clara, humana y coordinada.
              </p>

              <p className="text-body-sm text-white/70 mt-4">
                📍 Atendiendo familias en Ciudad de México (CDMX) y zona metropolitana
              </p>

              {/* Social / Contacto */}
              <div className="flex items-center gap-3">
                <a href="https://www.instagram.com/somosbrilus?igsh=MWdwcHQ0ZnlydHAzMA==" target="_blank" rel="noopener noreferrer" aria-label="Abrir Instagram de Brilus en una pestaña nueva" className="inline-flex h-9 w-9 items-center justify-center rounded-brilus-pill bg-white/10 hover:bg-white/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2.5A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5ZM17.25 6a.75.75 0 1 1-.75.75.75.75 0 0 1 .75-.75Z" />
                  </svg>
                </a>
                <a href="https://www.facebook.com/share/19wJudFMFK/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Abrir Facebook de Brilus en una pestaña nueva" className="inline-flex h-9 w-9 items-center justify-center rounded-brilus-pill bg-white/10 hover:bg-white/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="mailto:familias@somosbrilus.com" aria-label="Enviar correo a Brilus" className="inline-flex h-9 w-9 items-center justify-center rounded-brilus-pill bg-white/10 hover:bg-white/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
                    <path d="m22 8-10 6L2 8" />
                  </svg>
                </a>
                <a href="https://wa.me/525562151706?text=Hola%20Brilus,%20me%20gustaría%20recibir%20más%20información%20sobre%20sus%20servicios." target="_blank" rel="noopener noreferrer" aria-label="Enviar WhatsApp a Brilus" className="inline-flex h-9 w-9 items-center justify-center rounded-brilus-pill bg-white/10 hover:bg-white/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                    <path d="M20.52 3.48A11.9 11.9 0 0 0 12.02 0C5.42.02.08 5.35.1 11.95c0 2.1.55 4.15 1.59 5.96L0 24l6.24-1.63a11.87 11.87 0 0 0 5.78 1.49h.01c6.6 0 11.94-5.34 11.97-11.94a11.9 11.9 0 0 0-3.48-8.44ZM12.03 21.2h-.01a9.27 9.27 0 0 1-4.73-1.29l-.34-.2-3.7.97.99-3.61-.22-.37a9.25 9.25 0 1 1 8.01 4.5Zm5.33-6.93c-.29-.14-1.7-.84-1.97-.93-.27-.1-.47-.14-.67.14-.2.29-.77.93-.95 1.12-.17.19-.35.21-.64.07-.29-.14-1.24-.46-2.36-1.46-.87-.77-1.45-1.72-1.62-2.01-.17-.29-.02-.45.12-.59.12-.12.29-.31.43-.46.14-.15.19-.24.29-.41.1-.19.05-.36-.02-.5-.07-.14-.67-1.61-.91-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.5.07-.76.36-.26.29-1 1-1 2.43 0 1.43 1.02 2.81 1.16 3 .14.19 2 3.04 4.83 4.26.68.29 1.21.46 1.62.59.68.22 1.3.19 1.8.12.55-.08 1.7-.7 1.94-1.38.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.33Z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Columna 2: Navegación */}
            <nav aria-label="Navegación del sitio" className="lg:col-span-4">
              <ul className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-x-6 text-white/90">
                <li><Link to="/" className="hover:text-brand-coral transition-colors">Inicio</Link></li>
                <li><Link to="/nuestros-blogs" className="hover:text-brand-coral transition-colors">Nuestros Blogs</Link></li>
                <li><Link to="/sobre-nosotros" className="hover:text-brand-coral transition-colors">Sobre Nosotros</Link></li>
                <li><Link to="/contacto" className="hover:text-brand-coral transition-colors">Contáctanos</Link></li>
                <li><Link to="/aviso-de-privacidad" className="hover:text-brand-coral transition-colors">Aviso de privacidad</Link></li>
                <li><Link to="/careers" className="hover:text-brand-coral transition-colors">Trabaja con nosotros</Link></li>
              </ul>
            </nav>

            {/* Columna 3: CTA WhatsApp */}
            <div className="lg:col-span-3">
              <a
                href="https://wa.me/525562151706?text=Hola%20Brilus,%20me%20gustaría%20recibir%20más%20información%20sobre%20sus%20servicios."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-brilus-pill bg-white text-brand-black px-5 py-3 text-body-sm font-semibold hover:bg-brand-coral hover:text-white transition-colors"
                aria-label="Escríbenos por WhatsApp"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.52 3.48A11.9 11.9 0 0 0 12.02 0C5.42.02.08 5.35.1 11.95c0 2.1.55 4.15 1.59 5.96L0 24l6.24-1.63a11.87 11.87 0 0 0 5.78 1.49h.01c6.6 0 11.94-5.34 11.97-11.94a11.9 11.9 0 0 0-3.48-8.44Z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>

          {/* Línea divisoria */}
          <div className="mt-10 border-t border-white/10" />

          {/* Bottom bar */}
          <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-col md:hidden gap-3 text-xs w-full">
              <a href="https://wa.me/525562151706" target="_blank" rel="noopener noreferrer" className="hover:text-brand-coral transition-colors">+52 55 6215 1706</a>
              <a href="mailto:contacto@somosbrilus.com" className="hover:text-brand-coral transition-colors break-words">familia@somosbrilus.com</a>
              <p className="text-white/70">© 2025 Brilus. Todos los derechos reservados.</p>
            </div>
            <p className="hidden md:block text-xs sm:text-sm text-white/70">© 2025 Brilus. Todos los derechos reservados.</p>
            <div className="hidden md:flex md:flex-row md:items-center gap-4 text-xs sm:text-sm">
              <a href="mailto:contacto@somosbrilus.com" className="hover:text-brand-coral transition-colors">familia@somosbrilus.com</a>
              <span aria-hidden="true" className="text-white/30">•</span>
              <a href="https://wa.me/525562151706" target="_blank" rel="noopener noreferrer" className="hover:text-brand-coral transition-colors whitespace-nowrap">+52 55 6215 1706</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
