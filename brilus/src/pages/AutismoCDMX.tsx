import React from "react";
import { SEOHead } from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, ChevronDown, Eye, Brain, Users, Heart, CheckCircle2, ArrowRight, MessageCircle, Home, Sparkles, Shield, Clock, Menu, X } from "lucide-react";
import Footer from "@/components/Footer";
import brilusLogo from "@/assets/brilus-logo.svg";
import heroImage from "@/assets/seo/diagnostico-autismo-hero.jpg";
import evaluacionImage from "@/assets/seo/evaluacion-autismo-profesional.jpg";
import familiaImage from "@/assets/seo/acompanamiento-familiar-autismo.jpg";
const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=525562151706&text=Hola+Brilus%2C+necesito+informaci%C3%B3n+sobre+autismo&type=phone_number&app_absent=0";

// Reusable carousel hook + dots for mobile horizontal card lists
function useMobileCarousel(count: number) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(0);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.scrollWidth / count;
      if (w > 0) setActive(Math.max(0, Math.min(count - 1, Math.round(el.scrollLeft / w))));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [count]);
  const goTo = React.useCallback((i: number) => {
    const el = ref.current;
    if (!el) return;
    const w = el.scrollWidth / count;
    el.scrollTo({ left: w * i, behavior: "smooth" });
  }, [count]);
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(Math.min(count - 1, active + 1)); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); goTo(Math.max(0, active - 1)); }
    else if (e.key === "Home") { e.preventDefault(); goTo(0); }
    else if (e.key === "End") { e.preventDefault(); goTo(count - 1); }
  };
  return { ref, active, goTo, onKeyDown };
}

interface CarouselDotsProps {
  count: number;
  active: number;
  onSelect: (i: number) => void;
  label: string;
  hideAt?: "sm" | "md";
}
const CarouselDots: React.FC<CarouselDotsProps> = ({ count, active, onSelect, label, hideAt = "md" }) => (
  <div
    className={`flex ${hideAt === "md" ? "md:hidden" : "sm:hidden"} justify-center gap-2 mt-2 mb-6`}
    role="tablist"
    aria-label={`Paginación de ${label}`}
  >
    {Array.from({ length: count }).map((_, i) => (
      <button
        key={i}
        type="button"
        role="tab"
        aria-selected={active === i}
        aria-label={`Ir a tarjeta ${i + 1} de ${count}`}
        onClick={() => onSelect(i)}
        className={`h-2 rounded-brilus-pill transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 ${
          active === i ? "w-8 bg-brand-blue" : "w-2 bg-brand-blue/30"
        }`}
      />
    ))}
  </div>
);

// Navigation links for the landing
const navLinks = [{
  label: "¿Qué es?",
  href: "#que-es-autismo"
}, {
  label: "Señales",
  href: "#senales-autismo"
}, {
  label: "Diagnóstico",
  href: "#diagnostico"
}, {
  label: "Terapia",
  href: "#terapia"
}, {
  label: "Brilus",
  href: "#brilus"
}, {
  label: "Preguntas",
  href: "#preguntas"
}];

// Simple Header for SEO Landing with in-page navigation
const SimpleLandingHeader = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
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
    setIsMobileMenuOpen(false);
  };
  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-brand-white shadow-brilus-1" : "bg-brand-white/95 backdrop-blur-sm"} border-b border-border`}>
      <div className="section-px py-4 md:py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img src={brilusLogo} alt="Brilus" className="h-[32px] sm:h-[36px] md:h-[40px]" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-3">
            {navLinks.map(link => <button key={link.href} onClick={() => scrollToSection(link.href)} className="px-4 py-2 text-body-md font-medium text-brand-black hover:text-brand-blue transition-colors rounded-brilus">
                {link.label}
              </button>)}
          </nav>

          {/* Desktop CTA */}
          <Button className="hidden lg:flex bg-brand-coral hover:bg-brand-coral/90 text-brand-white rounded-brilus-pill text-body-md font-semibold px-6 py-3" asChild>
            <Link to="/contacto">
              <Phone className="w-4 h-4 mr-2" />
              Hablar con especialista
            </Link>
          </Button>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2.5 text-brand-black hover:text-brand-blue transition-colors" aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}>
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && <div className="lg:hidden bg-brand-white border-t border-border shadow-brilus-1">
          <div className="section-px py-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map(link => <button key={link.href} onClick={() => scrollToSection(link.href)} className="w-full text-left px-4 py-3 text-body-md text-brand-black hover:bg-brand-grey-light rounded-brilus-inner transition-colors">
                  {link.label}
                </button>)}
              <Button className="mt-3 w-full bg-brand-coral hover:bg-brand-coral/90 text-brand-white rounded-brilus-pill text-body-md font-semibold py-3" asChild>
                <Link to="/contacto">
                  <Phone className="w-4 h-4 mr-2" />
                  Hablar con especialista
                </Link>
              </Button>
            </nav>
          </div>
        </div>}
    </header>;
};

// Hero Section with H1 SEO optimized
const HeroSection = () => {
  const scrollToContent = () => {
    document.getElementById('que-es-autismo')?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <section className="relative min-h-[55vh] sm:min-h-[60vh] md:min-h-[70vh] flex items-center overflow-hidden pt-16 sm:pt-20">
      <img src={heroImage} alt="Niño feliz durante sesión de terapia ABA para autismo en Ciudad de México" className="absolute inset-0 w-full h-full object-cover" loading="eager" fetchPriority="high" />
      <div className="absolute inset-0 bg-foreground/50" />
      
      <div className="relative z-10 section-px section-py w-full">
        <div className="max-w-[850px] mx-auto text-center space-y-4 sm:space-y-5">
          <h1 className="text-h2 md:text-h1 lg:text-hero text-brand-white drop-shadow-lg">
            Autismo en CDMX: diagnóstico y terapia infantil
          </h1>
          <p className="text-body-md md:text-body-lg text-brand-white/90 max-w-[600px] mx-auto drop-shadow-md">
            Información clara sobre señales de autismo, diagnóstico y opciones de terapia en Ciudad de México.
          </p>
          <div className="flex flex-col gap-3 md:flex-row md:gap-4 justify-center items-center pt-4">
            <Button size="lg" className="bg-brand-coral hover:bg-brand-coral/90 text-brand-white rounded-brilus-pill px-8 text-body-md font-semibold w-full md:w-auto" asChild>
              <Link to="/contacto" className="flex items-center justify-center">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>Hablar con especialista</span>
              </Link>
            </Button>
            <Button size="lg" variant="outline-white" className="rounded-brilus-pill px-8 text-body-md font-semibold w-full md:w-auto" onClick={scrollToContent}>
              <ChevronDown className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>Explorar guía</span>
            </Button>
          </div>
        </div>
      </div>
    </section>;
};

// What is Autism Section
const WhatIsAutismSection = () => <section id="que-es-autismo" className="section-px section-py bg-brand-white">
    <div className="max-w-[800px] mx-auto">
      <h2 className="text-h3 md:text-h2 text-brand-black text-center mb-8">
        ¿Qué es el autismo?
      </h2>
      <div className="space-y-6 text-body-md md:text-body-lg text-brand-black/80">
        <p>
          El <strong>Trastorno del Espectro Autista (TEA)</strong> es una condición del neurodesarrollo 
          que afecta cómo una persona se comunica, se relaciona con otros y experimenta el mundo.
        </p>
        <p>
          Se le llama "espectro" porque cada niño es diferente. Algunos pueden tener dificultades 
          para hablar, mientras que otros tienen un lenguaje muy desarrollado. Algunos prefieren 
          rutinas muy específicas, otros son más flexibles. <strong>No existe un solo tipo de autismo</strong>.
        </p>
        <p>
          Lo más importante que debes saber: <strong>el autismo no es una enfermedad que se cura</strong>. 
          Es una forma diferente de procesar el mundo. Con el apoyo adecuado, los niños con autismo 
          pueden desarrollar habilidades, comunicarse mejor y tener una vida plena.
        </p>
        <div className="bg-brand-blue-50 rounded-brilus-card p-6 mt-8 border border-border">
          <p className="text-body-md text-brand-black/90 italic">
            "Entender el autismo es el primer paso para acompañar a tu hijo de la mejor manera. 
            No estás solo en este camino."
          </p>
        </div>
      </div>
    </div>
  </section>;

// Signals Section
const SignalsSection = () => {
  const signals = ["No responde a su nombre cuando lo llamas (después de los 12 meses)", "Evita el contacto visual o lo hace de forma diferente", "No señala objetos para mostrar interés (después de los 14 meses)", "No imita gestos como decir adiós con la mano", "Prefiere jugar solo y tiene dificultad para jugar con otros niños", "Repite palabras o frases una y otra vez (ecolalia)", "Se molesta mucho con pequeños cambios en su rutina", "Tiene intereses muy intensos en temas específicos", "Reacciona de forma inusual a sonidos, texturas u olores", "Hace movimientos repetitivos como aletear las manos o mecerse"];
  return <section id="senales-autismo" className="section-px section-py bg-secondary">
      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-h3 md:text-h2 text-brand-black mb-4">
            Señales de autismo que vale la pena observar en niños
          </h2>
          <p className="text-body-md md:text-body-lg text-muted-foreground">
            Estas señales pueden aparecer en los primeros años de vida. Observarlas no significa 
            que tu hijo tenga autismo, pero sí que vale la pena consultar con un especialista.
          </p>
        </div>
        
        <div className="grid gap-4">
          {signals.map((signal, index) => <div key={index} className="flex items-start gap-4 bg-brand-white rounded-brilus-inner p-5 shadow-brilus-1 border border-border">
              <Eye className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
              <p className="text-body-md text-brand-black/80">{signal}</p>
            </div>)}
        </div>

        <div className="bg-brand-amber-50 rounded-brilus-card p-6 mt-8 border border-border">
          <p className="text-body-md text-brand-black/90">
            <strong>Importante:</strong> Observar estas señales no es lo mismo que diagnosticar. 
            Solo un profesional especializado puede hacer una evaluación completa. Si notas 
            varias de estas señales, te recomendamos buscar orientación.
          </p>
        </div>
      </div>
    </section>;
};

// Diagnosis Section (Key SEO section)
const DiagnosisSection = () => {
  const steps = [{
    icon: Eye,
    title: "Observación inicial",
    description: "Los padres y profesores notan comportamientos que les preocupan. Esta observación es valiosa, pero no es un diagnóstico."
  }, {
    icon: Brain,
    title: "Evaluación profesional",
    description: "Un equipo de especialistas realiza pruebas estandarizadas, entrevistas y observaciones estructuradas para entender al niño."
  }, {
    icon: Users,
    title: "Diagnóstico multidisciplinario",
    description: "El diagnóstico formal incluye la opinión de varios profesionales y se basa en criterios internacionales."
  }];
  const stepsCar = useMobileCarousel(steps.length);
  const compareItems = [
    {
      key: "incluye",
      bg: "bg-brand-blue-50",
      head: (
        <>
          <CheckCircle2 className="w-5 h-5 text-brand-blue flex-shrink-0" />
          Un buen diagnóstico incluye:
        </>
      ),
      items: [
        "Evaluación por múltiples profesionales",
        "Uso de instrumentos validados (ADOS-2, ADI-R)",
        "Observación directa del niño",
        "Entrevista detallada con los padres",
        "Informe escrito con recomendaciones",
      ],
    },
    {
      key: "apresurado",
      bg: "bg-brand-coral-50/40",
      head: (
        <>
          <span className="w-5 h-5 rounded-brilus-pill bg-brand-coral flex items-center justify-center text-brand-white text-xs flex-shrink-0">✕</span>
          Un diagnóstico apresurado puede incluir:
        </>
      ),
      items: [
        "Solo una consulta de 30 minutos",
        "Un solo profesional sin especialización",
        "Sin pruebas estandarizadas",
        "Sin escuchar a los padres",
        "Conclusiones sin recomendaciones claras",
      ],
    },
  ];
  const compareCar = useMobileCarousel(compareItems.length);
  return <section id="diagnostico" className="section-px section-py bg-brand-white">
      <div className="max-w-[900px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-h3 md:text-h2 text-brand-black mb-4">
            Diagnóstico de autismo en CDMX: cómo es y qué esperar
          </h2>
          <p className="text-body-md md:text-body-lg text-muted-foreground max-w-[650px] mx-auto">
            Un buen diagnóstico no se hace en una sola cita ni con un solo profesional. 
            Es un proceso cuidadoso que busca entender a tu hijo en profundidad.
          </p>
        </div>

        <div className="mb-10 rounded-brilus-card overflow-hidden shadow-brilus-2">
          <img src={evaluacionImage} alt="Profesional realizando evaluación de diagnóstico de autismo a niño en CDMX" className="w-full h-56 sm:h-72 md:h-[28rem] object-cover" loading="lazy" />
        </div>

        <div
          ref={stepsCar.ref}
          onKeyDown={stepsCar.onKeyDown}
          tabIndex={0}
          role="region"
          aria-roledescription="carrusel"
          aria-label="Pasos del proceso de diagnóstico"
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-x-visible md:snap-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-brilus-card"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {steps.map((step, index) => <div key={index} role="group" aria-roledescription="tarjeta" aria-label={`${index + 1} de ${steps.length}: ${step.title}`} className="bg-brand-white rounded-brilus-card p-8 text-center w-[85vw] max-w-[360px] snap-center md:w-auto md:max-w-none flex-shrink-0 md:flex-shrink shadow-brilus-2 border border-border">
              <div className="w-14 h-14 bg-brand-blue rounded-brilus-pill flex items-center justify-center mx-auto mb-5">
                <step.icon className="w-7 h-7 text-brand-white" aria-hidden="true" />
              </div>
              <h3 className="text-h5 md:text-h4 text-brand-black mb-4">{step.title}</h3>
              <p className="text-body-md text-brand-black/80 leading-relaxed">{step.description}</p>
            </div>)}
        </div>
        <CarouselDots count={steps.length} active={stepsCar.active} onSelect={stepsCar.goTo} label="pasos del diagnóstico" hideAt="md" />

        <div className="space-y-6">
          <h3 className="text-h5 md:text-h4 text-brand-black text-center">
            ¿Quién puede diagnosticar autismo en México?
          </h3>
          <p className="text-body-md md:text-body-lg text-brand-black/80 text-center max-w-[700px] mx-auto">
            En México, el diagnóstico puede ser realizado por <strong>psicólogos clínicos especializados</strong>, 
            <strong> neuropediatras</strong>, <strong>psiquiatras infantiles</strong> o equipos multidisciplinarios con 
            experiencia en Trastorno del Espectro Autista.
          </p>
        </div>

        <div
          ref={compareCar.ref}
          onKeyDown={compareCar.onKeyDown}
          tabIndex={0}
          role="region"
          aria-roledescription="carrusel"
          aria-label="Comparación de tipos de diagnóstico"
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 mt-10 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-x-visible sm:snap-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-brilus-card"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {compareItems.map((item, idx) => (
            <div
              key={item.key}
              role="group"
              aria-roledescription="tarjeta"
              aria-label={`${idx + 1} de ${compareItems.length}`}
              className={`${item.bg} rounded-brilus-card p-6 border border-border w-[85vw] max-w-[360px] sm:w-auto sm:max-w-none flex-shrink-0 sm:flex-shrink snap-center`}
            >
              <h4 className="text-h5 text-brand-black mb-4 flex items-center gap-2">{item.head}</h4>
              <ul className="space-y-3 text-body-md text-brand-black/80">
                {item.items.map((li, i) => <li key={i}>• {li}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <CarouselDots count={compareItems.length} active={compareCar.active} onSelect={compareCar.goTo} label="comparación de diagnóstico" hideAt="sm" />
      </div>
    </section>;
};

// Therapy Section (Key SEO section)
const TherapySection = () => {
  const therapies = [{
    icon: Brain,
    title: "Terapia ABA",
    description: "El Análisis Conductual Aplicado es la intervención con mayor respaldo científico para autismo. Se enfoca en desarrollar habilidades y reducir conductas que interfieren con el aprendizaje."
  }, {
    icon: MessageCircle,
    title: "Terapia de lenguaje",
    description: "Ayuda a desarrollar la comunicación verbal y no verbal, desde primeras palabras hasta conversaciones más complejas."
  }, {
    icon: Users,
    title: "Terapia ocupacional",
    description: "Trabaja habilidades motoras, sensoriales y de la vida diaria para que el niño sea más independiente."
  }];
  const therapiesCar = useMobileCarousel(therapies.length);
  return <section id="terapia" className="section-px section-py bg-secondary">
      <div className="max-w-[900px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-h3 md:text-h2 text-brand-black mb-4">
            Terapia para autismo en CDMX: opciones y enfoque Brilus
          </h2>
          <p className="text-body-md md:text-body-lg text-muted-foreground max-w-[650px] mx-auto">
            Después del diagnóstico, el siguiente paso es encontrar la intervención adecuada. 
            En Ciudad de México existen diversas opciones de terapia basadas en evidencia.
          </p>
        </div>

        <div
          ref={therapiesCar.ref}
          onKeyDown={therapiesCar.onKeyDown}
          tabIndex={0}
          role="region"
          aria-roledescription="carrusel"
          aria-label="Tipos de terapia para autismo"
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 md:grid-cols-3 sm:gap-6 sm:overflow-x-visible sm:snap-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-brilus-card"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {therapies.map((therapy, index) => <div key={index} role="group" aria-roledescription="tarjeta" aria-label={`${index + 1} de ${therapies.length}: ${therapy.title}`} className={`bg-brand-white rounded-brilus-card p-6 shadow-brilus-1 border border-border w-[85vw] max-w-[360px] sm:w-auto sm:max-w-none flex-shrink-0 sm:flex-shrink snap-center ${index === 2 ? 'sm:col-span-2 md:col-span-1' : ''}`}>
              <div className="w-12 h-12 bg-brand-blue-50 rounded-brilus-inner flex items-center justify-center mb-4 border border-border">
                <therapy.icon className="w-5 h-5 text-brand-blue" aria-hidden="true" />
              </div>
              <h3 className="text-h5 text-brand-black mb-3">{therapy.title}</h3>
              <p className="text-body-md text-muted-foreground">{therapy.description}</p>
            </div>)}
        </div>
        <CarouselDots count={therapies.length} active={therapiesCar.active} onSelect={therapiesCar.goTo} label="tipos de terapia" hideAt="sm" />


        <div className="bg-brand-white rounded-brilus-card p-8 md:p-10 lg:px-16 lg:py-12 shadow-brilus-2 border border-border">
          <h3 className="text-h5 md:text-h4 text-brand-black mb-8 text-center">
            Terapia ABA a domicilio en CDMX
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-coral-50/40 rounded-brilus-inner flex items-center justify-center mx-auto mb-3 border border-border">
                <Home className="w-5 h-5 text-brand-coral" />
              </div>
              <h4 className="text-h5 text-brand-black mb-2">En tu hogar</h4>
              <p className="text-body-md text-muted-foreground">
                La terapia se realiza en el ambiente natural del niño, lo que mejora la generalización de habilidades.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-coral-50/40 rounded-brilus-inner flex items-center justify-center mx-auto mb-3 border border-border">
                <Sparkles className="w-5 h-5 text-brand-coral" />
              </div>
              <h4 className="text-h5 text-brand-black mb-2">Personalizada</h4>
              <p className="text-body-md text-muted-foreground">
                Cada programa se diseña específicamente para las necesidades y fortalezas de tu hijo.
              </p>
            </div>
            <div className="text-center sm:col-span-2 md:col-span-1">
              <div className="w-12 h-12 bg-brand-coral-50/40 rounded-brilus-inner flex items-center justify-center mx-auto mb-3 border border-border">
                <Clock className="w-5 h-5 text-brand-coral" />
              </div>
              <h4 className="text-h5 text-brand-black mb-2">Intensiva</h4>
              <p className="text-body-md text-muted-foreground">
                Sesiones consistentes que maximizan el tiempo de aprendizaje durante los años críticos del desarrollo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};

// Brilus Model Section (E-E-A-T)
const BrilusModelSection = () => {
  const features = [{
    icon: Users,
    title: "Más que terapia",
    description: "No solo aplicamos técnicas. Entendemos a tu familia, tus rutinas y tus metas para crear un plan que funcione en la vida real."
  }, {
    icon: Brain,
    title: "Más que diagnóstico",
    description: "Te explicamos cada paso del proceso, resolvemos tus dudas y te damos herramientas para entender mejor a tu hijo."
  }, {
    icon: Heart,
    title: "Acompañamiento continuo",
    description: "Estamos contigo durante todo el camino, ajustando el plan según las necesidades cambiantes de tu hijo."
  }, {
    icon: Shield,
    title: "Claridad para padres",
    description: "Sin lenguaje técnico innecesario. Te hablamos claro para que tomes decisiones informadas."
  }];
  const featuresCar = useMobileCarousel(features.length);
  return <section id="brilus" className="section-px section-py bg-brand-blue-50/40">
      <div className="max-w-[900px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-h3 md:text-h2 text-brand-black mb-4">
            Cómo acompaña Brilus a familias en CDMX
          </h2>
          <p className="text-body-md md:text-body-lg text-muted-foreground max-w-[600px] mx-auto">
            En Brilus nos especializamos en desarrollo infantil con un enfoque integral. 
            Combinamos evaluación, intervención y apoyo familiar para acompañarte en cada etapa.
          </p>
        </div>

        <div
          ref={featuresCar.ref}
          onKeyDown={featuresCar.onKeyDown}
          tabIndex={0}
          role="region"
          aria-roledescription="carrusel"
          aria-label="Cómo acompaña Brilus a las familias"
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-x-visible sm:snap-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-brilus-card"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {features.map((feature, index) => <div key={index} role="group" aria-roledescription="tarjeta" aria-label={`${index + 1} de ${features.length}: ${feature.title}`} className="bg-brand-white rounded-brilus-card p-6 shadow-brilus-2 border border-border w-[85vw] max-w-[360px] sm:w-auto sm:max-w-none flex-shrink-0 sm:flex-shrink snap-center">
              <div className="w-12 h-12 bg-brand-coral-50/40 rounded-brilus-inner flex items-center justify-center mb-4 border border-border">
                <feature.icon className="w-5 h-5 text-brand-coral" aria-hidden="true" />
              </div>
              <h3 className="text-h5 text-brand-black mb-3">{feature.title}</h3>
              <p className="text-body-md text-muted-foreground">{feature.description}</p>
            </div>)}
        </div>
        <CarouselDots count={features.length} active={featuresCar.active} onSelect={featuresCar.goTo} label="acompañamiento Brilus" hideAt="sm" />


        <div className="max-w-2xl mx-auto">
          <div className="bg-brand-white rounded-brilus-card p-8 md:p-10 shadow-brilus-1 border border-border">
            <p className="text-body-md md:text-body-lg text-brand-black/80">
              <strong>No prometemos resultados mágicos.</strong> Lo que sí te aseguramos es un proceso 
              transparente, respetuoso y profesional. Al final, tendrás la información que necesitas 
              para tomar las mejores decisiones para tu hijo.
            </p>
            <Button size="lg" className="bg-brand-coral hover:bg-brand-coral/90 text-brand-white rounded-brilus-pill px-8 text-body-md font-semibold mt-6 w-full md:w-auto" asChild>
              <Link to="/contacto" className="flex items-center justify-center">
                <span>Conocer más sobre Brilus</span>
                <ArrowRight className="w-4 h-4 ml-2 flex-shrink-0" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>;
};

// FAQ Section (SEO Long Tail)
const FAQSection = () => {
  const faqs = [{
    question: "¿A qué edad se puede diagnosticar el autismo?",
    answer: "El autismo puede diagnosticarse de manera confiable a partir de los 18-24 meses de edad. Sin embargo, muchos niños reciben su diagnóstico más tarde, incluso en edad escolar. Lo importante no es la edad exacta, sino buscar evaluación cuando notes señales que te preocupen."
  }, {
    question: "¿Quién diagnostica el autismo en CDMX?",
    answer: "En Ciudad de México, el diagnóstico puede ser realizado por psicólogos clínicos especializados, neuropediatras, psiquiatras infantiles o equipos multidisciplinarios. Es importante buscar profesionales con experiencia específica en Trastorno del Espectro Autista y que utilicen instrumentos de evaluación validados como ADOS-2 o ADI-R."
  }, {
    question: "¿El autismo tiene tratamiento?",
    answer: "El autismo no es una enfermedad y por lo tanto no tiene 'cura'. Sin embargo, sí existen intervenciones efectivas que ayudan a desarrollar habilidades. La Terapia ABA (Análisis Conductual Aplicado) es la intervención con mayor respaldo científico. Con el apoyo adecuado, los niños con autismo pueden desarrollar comunicación, habilidades sociales y autonomía."
  }, {
    question: "¿Qué pasa si no hago nada ahora?",
    answer: "La intervención temprana está asociada con mejores resultados a largo plazo. Los primeros años de vida son cruciales para el desarrollo cerebral. Esperar no hace que las dificultades desaparezcan, y puede significar perder una ventana importante de neuroplasticidad. Si tienes dudas, es mejor consultar pronto."
  }, {
    question: "¿Cuánto cuesta el diagnóstico de autismo en CDMX?",
    answer: "El costo de una evaluación diagnóstica completa varía según el centro y los profesionales involucrados. En Brilus ofrecemos evaluaciones integrales con un equipo multidisciplinario. Te recomendamos agendar una llamada de orientación gratuita para entender tus opciones."
  }, {
    question: "¿La terapia ABA funciona para todos los niños con autismo?",
    answer: "La terapia ABA es efectiva para la mayoría de los niños con autismo, pero cada plan debe ser individualizado. Lo que funciona para un niño puede no funcionar igual para otro. Por eso en Brilus evaluamos a cada niño de manera integral antes de diseñar un programa de intervención personalizado."
  }];
  return <section id="preguntas" className="section-px section-py bg-brand-white">
      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-h3 md:text-h2 text-brand-black mb-4">
            Preguntas frecuentes sobre autismo en CDMX
          </h2>
          <p className="text-body-md md:text-body-lg text-muted-foreground">
            Resolvemos las dudas más comunes de los padres que están buscando respuestas.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`} className="bg-secondary rounded-brilus-inner border border-border shadow-brilus-1 px-6">
              <AccordionTrigger className="text-left text-h5 text-brand-black hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-body-md text-brand-black/80 pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>)}
        </Accordion>
      </div>
    </section>;
};

// Final CTA Section
const FinalCTASection = () => <section className="section-px section-py-lg bg-brand-blue">
    <div className="max-w-[700px] mx-auto text-center">
      <h2 className="text-h3 md:text-h2 text-brand-white mb-6">
        El primer paso es el más importante
      </h2>
      <p className="text-body-md md:text-body-lg text-brand-white/90 mb-8">
        No necesitas tener todas las respuestas ahora. Una llamada de orientación puede 
        ayudarte a entender qué está pasando y cuáles son los siguientes pasos.
      </p>
      <div className="flex flex-col gap-3 md:flex-row md:gap-4 justify-center items-center">
        <Button size="lg" className="bg-brand-white hover:bg-brand-white/90 text-brand-blue rounded-brilus-pill px-8 text-body-md font-semibold w-full md:w-auto" asChild>
          <Link to="/contacto" className="flex items-center justify-center">
            <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Agendar llamada</span>
          </Link>
        </Button>
        <Button size="lg" variant="outline-white" className="rounded-brilus-pill px-8 text-body-md font-semibold w-full md:w-auto" asChild>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
            <MessageCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>WhatsApp</span>
          </a>
        </Button>
      </div>
      <p className="text-body-sm text-brand-white/70 mt-6">
        Atendemos en toda la Ciudad de México y área metropolitana
      </p>
    </div>
  </section>;
const AutismoCDMX: React.FC = () => {
  // Structured Data for SEO
  const structuredData = [
  // MedicalBusiness Schema
  {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "LocalBusiness"],
    "name": "Brilus - Autismo CDMX",
    "description": "Centro especializado en diagnóstico y terapia de autismo en Ciudad de México. Evaluaciones multidisciplinarias y terapia ABA a domicilio.",
    "url": "https://somosbrilus.com/autismo-cdmx",
    "telephone": "+52 55 6215 1706",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ciudad de México",
      "addressRegion": "CDMX",
      "addressCountry": "MX"
    },
    "areaServed": {
      "@type": "City",
      "name": "Ciudad de México"
    },
    "medicalSpecialty": "Pediatric Neurology"
  },
  // FAQPage Schema
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "¿A qué edad se puede diagnosticar el autismo?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El autismo puede diagnosticarse de manera confiable a partir de los 18-24 meses de edad. Sin embargo, muchos niños reciben su diagnóstico más tarde, incluso en edad escolar."
      }
    }, {
      "@type": "Question",
      "name": "¿Quién diagnostica el autismo en CDMX?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "En Ciudad de México, el diagnóstico puede ser realizado por psicólogos clínicos especializados, neuropediatras, psiquiatras infantiles o equipos multidisciplinarios."
      }
    }, {
      "@type": "Question",
      "name": "¿El autismo tiene tratamiento?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El autismo no es una enfermedad y por lo tanto no tiene 'cura'. Sin embargo, sí existen intervenciones efectivas como la Terapia ABA que ayudan a desarrollar habilidades."
      }
    }, {
      "@type": "Question",
      "name": "¿Qué pasa si no hago nada ahora?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "La intervención temprana está asociada con mejores resultados a largo plazo. Esperar puede significar perder una ventana importante de neuroplasticidad."
      }
    }, {
      "@type": "Question",
      "name": "¿Cuánto cuesta el diagnóstico de autismo en CDMX?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El costo varía según el centro y los profesionales involucrados. En Brilus ofrecemos evaluaciones integrales con un equipo multidisciplinario."
      }
    }, {
      "@type": "Question",
      "name": "¿La terapia ABA funciona para todos los niños con autismo?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "La terapia ABA es efectiva para la mayoría de los niños con autismo, pero cada plan debe ser individualizado según las necesidades del niño."
      }
    }]
  },
  // Service Schema - Diagnóstico
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Diagnóstico de Autismo en CDMX",
    "provider": {
      "@type": "Organization",
      "name": "Brilus"
    },
    "areaServed": {
      "@type": "City",
      "name": "Ciudad de México"
    },
    "description": "Evaluación profesional y diagnóstico de Trastorno del Espectro Autista para niños en CDMX con enfoque multidisciplinario",
    "serviceType": "Evaluación del Desarrollo Infantil"
  },
  // Service Schema - Terapia
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Terapia ABA para Autismo en CDMX",
    "provider": {
      "@type": "Organization",
      "name": "Brilus"
    },
    "areaServed": {
      "@type": "City",
      "name": "Ciudad de México"
    },
    "description": "Terapia ABA (Análisis Conductual Aplicado) a domicilio para niños con autismo en Ciudad de México",
    "serviceType": "Terapia Conductual"
  },
  // BreadcrumbList Schema
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": "https://somosbrilus.com"
    }, {
      "@type": "ListItem",
      "position": 2,
      "name": "Autismo en CDMX",
      "item": "https://somosbrilus.com/autismo-cdmx"
    }]
  }];
  return <>
      <SEOHead title="Autismo en CDMX | Diagnóstico y terapia infantil – Brilus" description="Guía clara sobre autismo en CDMX. Señales tempranas, diagnóstico y terapia infantil con un enfoque humano y basado en evidencia. Brilus." canonical="/autismo-cdmx" structuredData={structuredData} />
      <div className="flex flex-col min-h-screen w-full bg-brand-white">
        <SimpleLandingHeader />
        <main className="flex-1">
          <HeroSection />
          <WhatIsAutismSection />
          <SignalsSection />
          <DiagnosisSection />
          <TherapySection />
          <BrilusModelSection />
          <FAQSection />
          <FinalCTASection />
        </main>
        <Footer />
      </div>
    </>;
};
export default AutismoCDMX;