import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";
import brilusLogo from "@/assets/brilus-logo.svg";

const NavbarBrilus: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsOpen(false);
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setMobileOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setMobileOpen(false);
      }
    };
    if (isOpen || mobileOpen) {
      document.addEventListener("keydown", handleEsc);
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("keydown", handleEsc);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, mobileOpen]);

  const menuSections = [
    {
      label: "Servicios",
      links: [{ name: "Autismo", path: "/autismo-cdmx" }],
    },
    {
      label: "Detección Temprana",
      links: [
        { name: "Diagnóstico de autismo", path: "/diagnostico-autismo" },
        { name: "M-CHAT-R (16 m – 4 años)", path: "/screening-mchat" },
        { name: "CAST (4 – 11 años)", path: "/screening-cast" },
      ],
    },
    {
      label: "Terapia ABA",
      links: [
        { name: "ABA en Casa", path: "/in-home" },
        { name: "ABA en Centro", path: "/in-center" },
        { name: "ABA en Escuela", path: "/in-school" },
      ],
    },
    {
      label: "Nosotros",
      links: [
        { name: "Sobre Nosotros", path: "/sobre-nosotros" },
        { name: "Nuestros Blogs", path: "/nuestros-blogs" },
        { name: "Trabaja con nosotros", path: "/careers" },
      ],
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      ref={menuRef}
      className={`fixed inset-x-0 top-0 z-50 bg-brand-white transition-shadow duration-300 ${
        isScrolled || isOpen || mobileOpen ? "shadow-brilus-1" : ""
      }`}
    >
      <nav className="flex items-center justify-between px-4 sm:px-6 md:px-12 lg:px-28 py-3 md:py-5">
        <Link to="/" className="flex-shrink-0">
          <img src={brilusLogo} alt="Brilus" className="h-9 sm:h-10 md:h-11 w-auto" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 text-brand-black hover:text-brand-blue transition-colors text-body-md font-medium tracking-tight"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isOpen}
          >
            Menú
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <Link
            to="/contacto"
            className="text-body-md font-medium tracking-tight text-brand-black hover:text-brand-blue transition-colors"
          >
            Contáctanos
          </Link>

          <Link
            to="/contacto"
            className="inline-flex items-center h-9 px-4 bg-brand-coral text-brand-white text-body-sm font-semibold tracking-[-0.05em] rounded-full hover:bg-brand-coral/90 transition-colors"
          >
            Hablar con un experto
          </Link>
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            to="/contacto"
            className="inline-flex items-center h-9 px-4 bg-brand-coral text-brand-white text-body-sm font-semibold tracking-[-0.05em] rounded-full hover:bg-brand-coral/90 transition-colors whitespace-nowrap"
          >
            Contáctanos
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-brilus text-brand-black hover:bg-muted transition-colors"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Desktop dropdown panel */}
      <div
        className={`hidden md:block overflow-hidden transition-all duration-300 ease-in-out border-t border-border ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 border-t-0"
        }`}
      >
        <div className="px-6 md:px-12 lg:px-28 py-8 md:py-10">
          <div className="grid grid-cols-4 gap-12">
            {menuSections.map((section) => (
              <div key={section.label}>
                <span className="text-body-xs font-semibold tracking-[-0.05em] uppercase text-brand-coral mb-3 block">
                  {section.label}
                </span>
                <div className="flex flex-col gap-1">
                  {section.links.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`text-h5 py-1.5 transition-colors ${
                        isActive(link.path) ? "text-brand-blue" : "text-brand-black hover:text-brand-blue"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
                <div className="mt-4 h-px bg-border" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile slide panel */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-border ${
          mobileOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0 border-t-0"
        }`}
      >
        <div className="px-6 py-6 flex flex-col gap-6">
          {menuSections.map((section) => (
            <div key={section.label}>
              <span className="text-body-xs font-semibold tracking-[-0.05em] uppercase text-brand-coral mb-2 block">
                {section.label}
              </span>
              <div className="flex flex-col gap-1">
                {section.links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-body-md font-semibold tracking-tight py-2 transition-colors ${
                      isActive(link.path) ? "text-brand-blue" : "text-brand-black hover:text-brand-blue"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="mt-3 h-px bg-border" />
            </div>
          ))}
          <Link
            to="/contacto"
            className="text-body-md font-medium tracking-tight text-brand-black hover:text-brand-blue transition-colors py-2"
          >
            Contáctanos
          </Link>
        </div>
      </div>
    </header>
  );
};

export default NavbarBrilus;
