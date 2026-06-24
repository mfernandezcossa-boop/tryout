import React from 'react';
import { Calendar, Clock, Laptop } from 'lucide-react';
import { X } from 'lucide-react';

interface WebinarAnnouncementBarProps {
  isVisible?: boolean;
  onClose?: () => void;
}

const WebinarAnnouncementBar: React.FC<WebinarAnnouncementBarProps> = ({ 
  isVisible = true, 
  onClose 
}) => {
  const [isOpen, setIsOpen] = React.useState(true); // Siempre visible al cargar

  if (!isOpen || !isVisible) return null;

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <div className="w-full bg-[#E8F2FE] border-b border-[#4686EF]/10 relative z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 md:py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
          {/* Left side: Content */}
          <div className="flex items-start md:items-center gap-3 flex-1">
            {/* Optional: Speaker photo circle - remove this div if not needed */}
            <div className="hidden md:block flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#4686EF] to-[#6BA3FF] border-2 border-white shadow-md overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-white font-semibold text-sm">
                🎓
              </div>
            </div>

            {/* Text content */}
            <div className="flex-1 min-w-0">
              <p className="text-[#1F1F1F] font-medium text-sm md:text-base leading-tight mb-1">
                Webinar gratis: Cómo acompañar mejor a tu hijo con Autismo, TDAH u otras necesidades
              </p>
              <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-[#1F1F1F]/70 font-normal">
                <span className="inline-flex items-center gap-1 bg-white/60 rounded-full px-2.5 py-1">
                  <Calendar className="w-3.5 h-3.5 text-[#4686EF]" />
                  3 de diciembre
                </span>
                <span className="inline-flex items-center gap-1 bg-white/60 rounded-full px-2.5 py-1">
                  <Clock className="w-3.5 h-3.5 text-[#FC683D]" />
                  8 PM (CDMX)
                </span>
                <span className="inline-flex items-center gap-1 bg-white/60 rounded-full px-2.5 py-1">
                  <Laptop className="w-3.5 h-3.5 text-[#FF9C1D]" />
                  Virtual
                </span>
              </div>
            </div>
          </div>

          {/* Right side: CTA Button */}
          <div className="flex items-center gap-2 md:gap-3">
            <a
              href="https://luma.com/ebdvo35a"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2 md:px-6 md:py-2.5 bg-[#4686EF] text-white font-semibold text-sm md:text-base rounded-full hover:bg-[#3B72D9] transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 whitespace-nowrap flex-1 md:flex-initial"
            >
              Reservar mi lugar
            </a>
            
            {/* Close button */}
            <button
              onClick={handleClose}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/50 transition-colors duration-200 text-[#1F1F1F]/40 hover:text-[#1F1F1F]"
              aria-label="Cerrar anuncio"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebinarAnnouncementBar;
