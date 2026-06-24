import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import brilusLogo from "@/assets/brilus-logo.svg";
const CONTACT_URL = "/contacto";
const navLinks = [{
  label: "Programa",
  href: "#programa"
}, {
  label: "Quiz",
  href: "#quiz"
}, {
  label: "Promoción",
  href: "#promo"
}, {
  label: "Proceso",
  href: "#proceso"
}, {
  label: "Beneficios",
  href: "#beneficios"
}, {
  label: "Zonas",
  href: "#zonas"
}];
export const ABANavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth"
      });
    }
    setIsOpen(false);
  };
  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent"}`}>
      <div className="container mx-auto px-6 md:px-12 lg:px-28">
        <nav className="flex items-center justify-between py-4 md:py-5">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={brilusLogo} alt="Brilus" className="h-[32px] sm:h-[36px] md:h-[40px]" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => <button key={link.href} onClick={() => scrollToSection(link.href)} className={`px-3 py-2 text-body-sm transition-colors rounded-md ${scrolled ? "text-foreground hover:text-brand-coral" : "text-brand-white hover:text-brand-white/80"}`}>
                {link.label}
              </button>)}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Button size="sm" className={`rounded-brilus transition-all duration-300 ${scrolled ? "bg-brand-coral hover:bg-brand-coral/90 text-background" : "bg-brand-white text-brand-charcoal hover:bg-brand-white/90"}`} asChild>
              <a href={CONTACT_URL}>
                <Calendar className="w-4 h-4 mr-2" />
                Agendar Llamada  
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className={`lg:hidden p-2.5 transition-colors duration-300 ${scrolled ? "text-foreground" : "text-brand-white"}`} aria-label="Toggle menu">
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: "auto"
      }} exit={{
        opacity: 0,
        height: 0
      }} className="lg:hidden bg-background border-t border-border">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col gap-2">
                {navLinks.map(link => <button key={link.href} onClick={() => scrollToSection(link.href)} className="w-full text-left px-4 py-3 text-body-md text-foreground hover:bg-muted rounded-brilus transition-colors">
                    {link.label}
                  </button>)}
                <div className="pt-4 border-t border-border mt-2">
                  <Button className="w-full bg-brand-coral hover:bg-brand-coral/90 text-background rounded-brilus" asChild>
                    <a href={CONTACT_URL}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Agendar Intake Call
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>}
      </AnimatePresence>
    </header>;
};