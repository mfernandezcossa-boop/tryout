import React, { useState, useRef } from "react";
import { SEOHead } from "@/components/SEOHead";
import NavbarBrilus from "@/components/NavbarBrilus";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Heart, Users, TrendingUp, CheckCircle2, Upload, FileText, X, ChevronDown, ChevronUp, ArrowRight, Quote } from "lucide-react";
import { useNavigate } from "react-router-dom";

const englishLevels = [
  { value: "A1", label: "A1", desc: "Entiendo palabras y frases muy básicas." },
  { value: "A2", label: "A2", desc: "Puedo comunicarme en situaciones simples y cotidianas." },
  { value: "B1", label: "B1", desc: "Puedo sostener conversaciones sobre temas familiares y entender textos sencillos." },
  { value: "B2", label: "B2", desc: "Puedo leer materiales técnicos y comunicarme con bastante fluidez." },
  { value: "C1", label: "C1", desc: "Uso el idioma con soltura en contextos académicos y profesionales." },
  { value: "C2", label: "C2", desc: "Comprendo prácticamente todo con facilidad." },
];



const Careers = () => {
  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showEnglishInfo, setShowEnglishInfo] = useState(false);

  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [bachelorDegree, setBachelorDegree] = useState("");
  const [bachelorUniversity, setBachelorUniversity] = useState("");
  const [hasMasters, setHasMasters] = useState(false);
  const [mastersDegree, setMastersDegree] = useState("");
  const [mastersUniversity, setMastersUniversity] = useState("");
  const [motivation, setMotivation] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [zipCode, setZipCode] = useState("");
  const [availabilityType, setAvailabilityType] = useState("");
  const [availabilityShift, setAvailabilityShift] = useState("");
  const [mobilityCdmx, setMobilityCdmx] = useState("");
  const [englishLevel, setEnglishLevel] = useState("");
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth" });

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "El nombre es obligatorio.";
    if (!whatsapp.trim()) e.whatsapp = "El WhatsApp es obligatorio.";
    if (!bachelorDegree.trim()) e.bachelorDegree = "La licenciatura es obligatoria.";
    if (!bachelorUniversity.trim()) e.bachelorUniversity = "La universidad es obligatoria.";
    if (hasMasters && !mastersDegree.trim()) e.mastersDegree = "Indica tu maestría o posgrado.";
    if (hasMasters && !mastersUniversity.trim()) e.mastersUniversity = "Indica la universidad de tu maestría.";
    if (!motivation.trim()) e.motivation = "Este campo es obligatorio.";
    if (!cvFile) e.cvFile = "Adjunta tu CV en formato PDF.";
    if (cvFile && cvFile.type !== "application/pdf") e.cvFile = "Solo se aceptan archivos PDF.";
    if (cvFile && cvFile.size > 5 * 1024 * 1024) e.cvFile = "El archivo no debe superar 5 MB.";
    if (!zipCode.trim()) e.zipCode = "El código postal es obligatorio.";
    if (!availabilityType) e.availabilityType = "Selecciona tu disponibilidad.";
    if (availabilityType === "medio_tiempo" && !availabilityShift) e.availabilityShift = "Selecciona tu turno.";
    if (!mobilityCdmx) e.mobilityCdmx = "Selecciona tu apertura de movilidad.";
    if (!englishLevel) e.englishLevel = "Selecciona tu nivel de inglés.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate() || submitting) return;
    setSubmitting(true);
    try {
      const ext = cvFile!.name.split(".").pop();
      const filePath = `applications/${Date.now()}_${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("cv-uploads").upload(filePath, cvFile!, { contentType: "application/pdf" });
      if (uploadError) throw new Error("Error al subir el CV: " + uploadError.message);
      const { error: insertError } = await supabase.from("job_applications").insert({
        full_name: fullName.trim(), whatsapp: whatsapp.trim(), bachelor_degree: bachelorDegree.trim(),
        bachelor_university: bachelorUniversity.trim(), has_masters: hasMasters,
        masters_degree: hasMasters ? mastersDegree.trim() : null, masters_university: hasMasters ? mastersUniversity.trim() : null,
        motivation: motivation.trim(), cv_file_path: filePath, cv_file_name: cvFile!.name, cv_mime_type: cvFile!.type,
        zip_code: zipCode.trim(), availability_type: availabilityType,
        availability_shift: availabilityType === "medio_tiempo" ? availabilityShift : null,
        mobility_cdmx: mobilityCdmx, english_level: englishLevel, referral_source: null,
      });
      if (insertError) throw new Error("Error al enviar la postulación: " + insertError.message);
      toast({ title: "¡Postulación enviada!", description: "Gracias por tu interés. Revisaremos tu perfil pronto." });
      navigate("/gracias-careers");
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: err.message || "Ocurrió un error inesperado.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") { setErrors((p) => ({ ...p, cvFile: "Solo se aceptan archivos PDF." })); return; }
    if (file.size > 5 * 1024 * 1024) { setErrors((p) => ({ ...p, cvFile: "El archivo no debe superar 5 MB." })); return; }
    setCvFile(file);
    setErrors((p) => { const n = { ...p }; delete n.cvFile; return n; });
  };

  const FieldError = ({ field }: { field: string }) =>
    errors[field] ? <p className="text-sm text-red-500 mt-1">{errors[field]}</p> : null;

  const inputDark = "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-brand-coral";

  return (
    <>
      <SEOHead
        title="Únete al equipo Brilus | Carreras en terapia infantil CDMX"
        description="Trabaja con propósito y ayuda a transformar el desarrollo de niños y familias. Únete al equipo de Brilus en CDMX."
        canonical="/careers"
      />
      <NavbarBrilus />

      <main className="pt-[72px] md:pt-[80px]">

        {/* ═══════ 1. HERO ═══════ */}
        <section className="py-20 md:py-28 bg-muted/40">
          <div className="container mx-auto px-6 md:px-12 lg:px-28 max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-border bg-background text-xs font-semibold tracking-wider uppercase text-foreground mb-8">
              <span className="w-2 h-2 rounded-full bg-brand-blue" />
              Carreras · Brilus México
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] mb-8">
              No solo un trabajo.<br />
              <span className="text-brand-blue">Una carrera</span> con propósito real.
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
              En Brilus llevamos Terapia ABA (Análisis Aplicado de la Conducta) al hogar de niños con autismo y TDAH en CDMX. Buscamos terapeutas que quieran trabajar en un entorno clínico experto, con supervisión desde Estados Unidos y capacitación estructurada desde el primer día.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Button variant="default" size="lg" className="bg-foreground text-background hover:bg-foreground/90 text-base px-8 rounded-full" asChild>
                <a href="https://outlook.office.com/bookwithme/user/8b179fca665f41baa2aa78e72f1b74f5@somosbrilus.com/meetingtype/x0E3BLL0aEqHLrtPpKprsg2?bookingcode=4f773523-ce37-4dac-9434-b455996541af&anonymous&ismsaljsauthenabled&ep=mlink" target="_blank" rel="noopener noreferrer">
                  Quiero ser Briler <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </Button>
              <Button variant="outline" size="lg" onClick={() => document.getElementById("por-que-brilus")?.scrollIntoView({ behavior: "smooth" })} className="text-base px-8 rounded-full">
                Conoce el camino
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="px-4 py-1.5 rounded-full bg-brand-blue text-white text-xs font-semibold">ABA</span>
              <span className="px-4 py-1.5 rounded-full bg-brand-coral text-white text-xs font-semibold">TDAH</span>
              <span className="px-4 py-1.5 rounded-full bg-brand-amber text-white text-xs font-semibold">Autismo</span>
              <span className="text-sm text-muted-foreground">· CDMX · Terapia en casa</span>
            </div>
          </div>
        </section>

        {/* ═══════ 2. TESTIMONIALS ═══════ */}
        <section className="py-20 md:py-28 bg-foreground">
          <div className="container mx-auto px-6 md:px-12 lg:px-28 max-w-5xl">
            <span className="text-brand-coral text-xs font-semibold tracking-[0.2em] uppercase block mb-4">Testimonios</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-14">
              Lo que dicen sobre los Brilers.
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { quote: "Entré a Brilus sin saber nada de ABA. En seis meses ya tenía mi certificación IBT y mi primer aumento. Lo que más valoro es que nunca me sentí sola — siempre hubo alguien con quién hablar un caso difícil.", name: "Fernanda R.", role: "Terapeuta IBT · 1.5 años en Brilus", initial: "F", color: "bg-brand-blue" },
                { quote: "Aquí ves resultados reales. Ver a un niño que antes no hablaba comenzar a pedir lo que quiere con palabras... eso no tiene precio. Y Brilus me da las herramientas para seguir mejorando como terapeuta.", name: "Carlos M.", role: "Terapeuta Brilus · 8 meses", initial: "C", color: "bg-brand-coral" },
                { quote: "Venía de trabajar en clínicas donde eras un número. En Brilus mi supervisora conoce mi nombre, mis casos y mis metas. El equipo es pequeño pero ese es exactamente su superpoder.", name: "Valeria S.", role: "Terapeuta IBT · Camino al BCBA", initial: "V", color: "bg-brand-amber" },
              ].map((t, i) => (
                <div key={i} className="p-6 md:p-12 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
                  <div>
                    <span className="text-brand-amber text-2xl font-bold leading-none block mb-5">"</span>
                    <p className="text-white/80 text-sm leading-relaxed mb-8">{t.quote}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                      {t.initial}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-white/50">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ 3. CAREER PATH ═══════ */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-6 md:px-12 lg:px-28 max-w-6xl">
            <span className="text-brand-blue text-xs font-semibold tracking-[0.2em] uppercase block mb-4">El camino Brilus</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
              Hay un camino claro para crecer aquí.
            </h2>
            <p className="text-muted-foreground max-w-lg mb-14">
              No te dejamos a la deriva. Desde que entras a Brilus, sabes exactamente hacia dónde vas y cómo llegar.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Card 1 — Punto de entrada */}
              <div className="bg-brand-blue rounded-2xl p-6 md:p-12 flex flex-col justify-between text-white">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider">
                      ☆ Punto de entrada
                    </span>
                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold shrink-0">1</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Terapeuta Brilus</h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Comienza tu camino en Brilus aplicando técnicas conductuales en el hogar de los niños. Recibirás supervisión constante y capacitación interna desde el primer día.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-8">
                  <span className="px-3 py-1.5 rounded-full bg-white/20 text-xs font-medium">Terapia ABA</span>
                  <span className="px-3 py-1.5 rounded-full bg-white/20 text-xs font-medium">Supervisión incluida</span>
                  <span className="px-3 py-1.5 rounded-full bg-white/20 text-xs font-medium">Capacitación continua</span>
                </div>
              </div>

              {/* Card 2 — Certificación */}
              <div className="bg-brand-coral rounded-2xl p-6 md:p-12 flex flex-col justify-between text-white">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider">
                      Certificación internacional
                    </span>
                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold shrink-0">2</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">IBT — International Behavior Therapist</h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Obtén la certificación IBAO mientras trabajas. Brilus te acompaña en el proceso de estudio, horas de supervisión y examen. Un paso concreto en tu carrera.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-8">
                  <span className="px-3 py-1.5 rounded-full bg-white/20 text-xs font-medium">Certificación IBAO</span>
                  <span className="px-3 py-1.5 rounded-full bg-white/20 text-xs font-medium">Horas de supervisión</span>
                  <span className="px-3 py-1.5 rounded-full bg-white/20 text-xs font-medium">Apoyo de estudio</span>
                </div>
              </div>

              {/* Card 3 — Máxima especialización */}
              <div className="bg-brand-amber rounded-2xl p-6 md:p-12 flex flex-col justify-between text-foreground">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/10 text-xs font-semibold uppercase tracking-wider">
                      Máxima especialización
                    </span>
                    <span className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-sm font-bold shrink-0">3</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">IBA — Analista de Conducta</h3>
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    El nivel más alto de especialización en análisis de conducta aplicado. Diseña programas, supervisa equipos y lidera el cambio en la vida de las familias.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-8">
                  <span className="px-3 py-1.5 rounded-full bg-black/10 text-xs font-medium">Análisis conductual</span>
                  <span className="px-3 py-1.5 rounded-full bg-black/10 text-xs font-medium">Liderazgo clínico</span>
                  <span className="px-3 py-1.5 rounded-full bg-black/10 text-xs font-medium">Nivel experto</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground text-center mt-10">
              Cada nivel se construye sobre el anterior — con acompañamiento real de Brilus
            </p>
          </div>
        </section>

        {/* ═══════ 4. FORM ═══════ */}
        <section ref={formRef} id="formulario" className="py-20 md:py-28 bg-foreground">
          <div className="container mx-auto px-6 md:px-12 lg:px-28 max-w-3xl">
            <span className="text-brand-coral text-xs font-semibold tracking-[0.2em] uppercase block mb-4">Únete al equipo</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Completa el formulario para trabajar con Brilus.
            </h2>
            <p className="text-white/50 mb-8 max-w-lg">
              Revisamos cada solicitud de forma personal. Si tu perfil encaja, te contactamos por WhatsApp en menos de 72 horas.
            </p>

            {/* Intro bullets */}
            <div className="space-y-4 mb-14">
              {[
                { emoji: "🔬", title: "Supervisión clínica internacional", desc: "Especialistas certificados internacionalmente revisan tu práctica." },
                { emoji: "🏠", title: "Terapia en el hogar", desc: "Aplicarás intervenciones en el entorno natural del niño." },
                { emoji: "📈", title: "Crecimiento real", desc: "Hay un camino claro, con metas y supervisión constante." },
              ].map((b, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-lg">{b.emoji}</span>
                  <div>
                    <p className="text-white text-sm font-semibold">{b.title}</p>
                    <p className="text-white/50 text-sm">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-10 bg-white/5 border border-white/10 rounded-2xl p-5 md:p-10">

              {/* Datos personales */}
              <div className="space-y-4">
                <h3 className="text-brand-coral text-xs font-semibold tracking-[0.2em] uppercase">Datos personales</h3>
                <div>
                  <Label htmlFor="fullName" className="text-white/70 text-xs font-semibold uppercase tracking-wider">Nombre completo</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Tu nombre completo" className={inputDark} />
                  <FieldError field="fullName" />
                </div>
                <div>
                  <Label htmlFor="whatsapp" className="text-white/70 text-xs font-semibold uppercase tracking-wider">WhatsApp</Label>
                  <Input id="whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+52 55 0000 0000" className={inputDark} />
                  <FieldError field="whatsapp" />
                </div>
              </div>

              {/* Formación */}
              <div className="space-y-4">
                <h3 className="text-brand-coral text-xs font-semibold tracking-[0.2em] uppercase">Formación académica</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bachelorDegree" className="text-white/70 text-xs font-semibold uppercase tracking-wider">Licenciatura</Label>
                    <Input id="bachelorDegree" value={bachelorDegree} onChange={(e) => setBachelorDegree(e.target.value)} placeholder="Ej. Psicología" className={inputDark} />
                    <FieldError field="bachelorDegree" />
                  </div>
                  <div>
                    <Label htmlFor="bachelorUniversity" className="text-white/70 text-xs font-semibold uppercase tracking-wider">Universidad</Label>
                    <Input id="bachelorUniversity" value={bachelorUniversity} onChange={(e) => setBachelorUniversity(e.target.value)} placeholder="Ej. UNAM" className={inputDark} />
                    <FieldError field="bachelorUniversity" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setHasMasters(!hasMasters)}
                  className={`flex items-center gap-2 text-sm transition-colors ${hasMasters ? 'text-brand-coral' : 'text-white/50 hover:text-white/70'}`}
                >
                  <span className={`w-5 h-5 rounded border flex items-center justify-center text-xs ${hasMasters ? 'bg-brand-coral border-brand-coral text-white' : 'border-white/30'}`}>
                    {hasMasters && '✓'}
                  </span>
                  Tengo maestría o posgrado
                </button>
                {hasMasters && (
                  <div className="grid sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
                    <div>
                      <Label htmlFor="mastersDegree" className="text-white/70 text-xs font-semibold uppercase tracking-wider">Maestría o posgrado</Label>
                      <Input id="mastersDegree" value={mastersDegree} onChange={(e) => setMastersDegree(e.target.value)} placeholder="Ej. Maestría en Neuropsicología" className={inputDark} />
                      <FieldError field="mastersDegree" />
                    </div>
                    <div>
                      <Label htmlFor="mastersUniversity" className="text-white/70 text-xs font-semibold uppercase tracking-wider">Universidad</Label>
                      <Input id="mastersUniversity" value={mastersUniversity} onChange={(e) => setMastersUniversity(e.target.value)} placeholder="Universidad del posgrado" className={inputDark} />
                      <FieldError field="mastersUniversity" />
                    </div>
                  </div>
                )}
              </div>

              {/* Motivación */}
              <div className="space-y-4">
                <h3 className="text-brand-coral text-xs font-semibold tracking-[0.2em] uppercase">Motivación</h3>
                <div>
                  <Label htmlFor="motivation" className="text-white/70 text-xs font-semibold uppercase tracking-wider">¿Por qué quieres trabajar con nosotros?</Label>
                  <Textarea id="motivation" value={motivation} onChange={(e) => setMotivation(e.target.value)} placeholder="Cuéntanos en tus propias palabras qué te atrae de Brilus y qué buscas en este rol..." rows={5} className={inputDark} />
                  <FieldError field="motivation" />
                </div>
              </div>

              {/* CV */}
              <div className="space-y-4">
                <Label className="text-white/70 text-xs font-semibold uppercase tracking-wider">CV (solo PDF · máx. 5 MB)</Label>
                <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
                {!cvFile ? (
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full border border-white/10 rounded-xl p-8 flex flex-col items-center gap-2 hover:border-brand-coral/40 hover:bg-brand-coral/5 transition-colors cursor-pointer bg-white/5">
                    <Upload className="w-6 h-6 text-white/40" />
                    <span className="text-sm text-white/50">Haz clic para subir tu CV</span>
                    <span className="text-xs text-white/30">Solo PDF · máx. 5 MB</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3 p-4 border border-white/10 rounded-xl bg-white/5">
                    <FileText className="w-8 h-8 text-brand-coral shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{cvFile.name}</p>
                      <p className="text-xs text-white/50">{(cvFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button type="button" onClick={() => { setCvFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="p-1 hover:bg-white/10 rounded"><X className="w-4 h-4 text-white/50" /></button>
                  </div>
                )}
                <FieldError field="cvFile" />
              </div>

              {/* Logística */}
              <div className="space-y-5">
                <h3 className="text-brand-coral text-xs font-semibold tracking-[0.2em] uppercase">Logística</h3>
                <div>
                  <Label htmlFor="zipCode" className="text-white/70 text-xs font-semibold uppercase tracking-wider">Código postal</Label>
                  <Input id="zipCode" value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="Ej. 06600" maxLength={10} className={`${inputDark} max-w-[160px]`} />
                  <FieldError field="zipCode" />
                </div>

                {/* Disponibilidad — card selectors */}
                <div className="space-y-3">
                  <Label className="text-white/70 text-xs font-semibold uppercase tracking-wider">Disponibilidad</Label>
                  <div className="space-y-2">
                    <button type="button" onClick={() => { setAvailabilityType("medio_tiempo"); }} className={`w-full text-left p-4 rounded-xl border transition-colors ${availabilityType === "medio_tiempo" ? "border-brand-coral bg-brand-coral/10" : "border-white/10 bg-white/5 hover:border-white/20"}`}>
                      <p className={`text-sm font-semibold ${availabilityType === "medio_tiempo" ? "text-white" : "text-white/80"}`}>Medio tiempo</p>
                      <p className="text-xs text-white/40">~20 horas / semana</p>
                    </button>
                    <button type="button" onClick={() => { setAvailabilityType("tiempo_completo"); setAvailabilityShift(""); }} className={`w-full text-left p-4 rounded-xl border transition-colors ${availabilityType === "tiempo_completo" ? "border-brand-coral bg-brand-coral/10" : "border-white/10 bg-white/5 hover:border-white/20"}`}>
                      <p className={`text-sm font-semibold ${availabilityType === "tiempo_completo" ? "text-white" : "text-white/80"}`}>Tiempo completo</p>
                      <p className="text-xs text-white/40">40 horas / semana</p>
                    </button>
                  </div>
                  <FieldError field="availabilityType" />
                  {availabilityType === "medio_tiempo" && (
                    <div className="ml-4 space-y-2 animate-in fade-in duration-200">
                      <Label className="text-white/50 text-xs uppercase tracking-wider">¿En qué turno?</Label>
                      <div className="flex gap-3">
                        <button type="button" onClick={() => setAvailabilityShift("manana")} className={`flex-1 p-3 rounded-xl border text-sm font-medium transition-colors ${availabilityShift === "manana" ? "border-brand-coral bg-brand-coral/10 text-white" : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"}`}>Mañana</button>
                        <button type="button" onClick={() => setAvailabilityShift("tarde")} className={`flex-1 p-3 rounded-xl border text-sm font-medium transition-colors ${availabilityShift === "tarde" ? "border-brand-coral bg-brand-coral/10 text-white" : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"}`}>Tarde</button>
                      </div>
                      <FieldError field="availabilityShift" />
                    </div>
                  )}
                </div>

                {/* Movilidad — pill selectors */}
                <div className="space-y-3">
                  <Label className="text-white/70 text-xs font-semibold uppercase tracking-wider">¿Tienes apertura para moverte por la CDMX?</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setMobilityCdmx("si_sin_problema")} className={`p-3 rounded-xl border text-sm font-medium text-center transition-colors ${mobilityCdmx === "si_sin_problema" ? "border-brand-coral bg-brand-coral/10 text-white" : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"}`}>Sí, sin problema</button>
                    <button type="button" onClick={() => setMobilityCdmx("solo_ciertas_zonas")} className={`p-3 rounded-xl border text-sm font-medium text-center transition-colors ${mobilityCdmx === "solo_ciertas_zonas" ? "border-brand-coral bg-brand-coral/10 text-white" : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"}`}>Solo ciertas zonas</button>
                  </div>
                  <FieldError field="mobilityCdmx" />
                </div>
              </div>

              {/* Inglés — card list */}
              <div className="space-y-4">
                <h3 className="text-brand-coral text-xs font-semibold tracking-[0.2em] uppercase">Nivel de inglés</h3>
                <Label className="text-white/70 text-xs font-semibold uppercase tracking-wider">¿Cuál describe mejor tu nivel actual?</Label>
                <div className="space-y-2">
                  {[
                    { value: "A1", title: "A1 — Principiante", desc: "Entiendo palabras sueltas y frases muy básicas en inglés." },
                    { value: "A2", title: "A2 — Básico", desc: "Me comunico en situaciones cotidianas simples y predecibles." },
                    { value: "B1", title: "B1 — Intermedio", desc: "Me desenvuelvo en conversaciones sobre temas familiares; puedo leer textos técnicos sencillos." },
                    { value: "B2", title: "B2 — Intermedio alto", desc: "Leo manuales clínicos en inglés sin diccionario y me comunico con fluidez." },
                    { value: "C1", title: "C1 — Avanzado", desc: "Uso el idioma de forma flexible para fines académicos y profesionales." },
                    { value: "C2", title: "C2 — Dominio", desc: "Entiendo prácticamente todo con facilidad; nivel bilingüe." },
                  ].map((l) => (
                    <button
                      key={l.value}
                      type="button"
                      onClick={() => setEnglishLevel(l.value)}
                      className={`w-full text-left p-4 rounded-xl border transition-colors ${englishLevel === l.value ? "border-brand-coral bg-brand-coral/10" : "border-white/10 bg-white/5 hover:border-white/20"}`}
                    >
                      <p className={`text-sm font-semibold ${englishLevel === l.value ? "text-white" : "text-white/80"}`}>{l.title}</p>
                      <p className="text-xs text-white/40">{l.desc}</p>
                    </button>
                  ))}
                </div>
                <FieldError field="englishLevel" />
              </div>


              <div className="space-y-3">
                <Button type="submit" variant="coral" size="lg" disabled={submitting} className="w-full text-base rounded-full">
                  {submitting ? "Enviando postulación..." : "Enviar mi solicitud →"}
                </Button>
                <p className="text-xs text-white/30 text-center">
                  Revisamos cada solicitud de forma personal. Tu información es confidencial.
                </p>
              </div>
            </form>
          </div>
        </section>

        {/* ═══════ 5. UN LUGAR DONDE TU TRABAJO IMPORTA ═══════ */}
        <section id="por-que-brilus" className="py-20 md:py-28 bg-muted/40">
          <div className="container mx-auto px-6 md:px-12 lg:px-28 max-w-5xl">
            <span className="text-brand-coral text-xs font-semibold tracking-[0.2em] uppercase block mb-4">Por qué Brilus</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Un lugar donde tu trabajo importa.
            </h2>
            <p className="text-muted-foreground mb-14 max-w-md">
              No somos una clínica fría. Somos un equipo con propósito, estructura y mucho cariño por lo que hacemos.
            </p>
            {/* Scroll indicator - mobile only */}
            <div className="flex items-center gap-2 mb-4 md:hidden text-muted-foreground">
              <span className="text-xs">Desliza para ver más</span>
              <ArrowRight className="w-3 h-3 animate-pulse" />
            </div>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible scrollbar-hide">
              {[
                { icon: CheckCircle2, title: "Supervisión Internacional", desc: "Trabajas bajo la guía de profesionales certificados con estándares internacionales. La supervisión no es un trámite — es la columna vertebral de tu formación en Brilus.", iconBg: "bg-brand-coral/10", iconColor: "text-brand-coral" },
                { icon: FileText, title: "Capacitación real desde el día uno", desc: "Antes de ver tu primer caso ya habrás pasado por entrenamiento estructurado en ABA, manejo de conducta y protocolos clínicos. No improvisamos tu onboarding.", iconBg: "bg-brand-amber/10", iconColor: "text-brand-amber" },
                { icon: Users, title: "Comunidad terapéutica", desc: "Somos un equipo con mucha identidad. Compartimos casos, aprendemos juntos y nos apoyamos en los momentos difíciles.", iconBg: "bg-brand-coral/10", iconColor: "text-brand-coral" },
                { icon: TrendingUp, title: "Entorno de práctica experta", desc: "Aprendes junto a un equipo y muy especializado. Discutimos casos, revisamos evidencia y te das cuenta de que aquí todos están igual de comprometidos con la ciencia.", iconBg: "bg-brand-blue/10", iconColor: "text-brand-blue" },
              ].map((item, i) => (
                <div key={i} className="w-[85vw] min-w-[85vw] flex-shrink-0 snap-center p-6 md:p-12 rounded-2xl border border-border bg-background md:w-auto md:min-w-0 md:flex-shrink">
                  <div className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center mb-6`}>
                    <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ 6. PERFIL QUE BUSCAMOS ═══════ */}
        <section className="py-20 md:py-28 bg-muted/30">
          <div className="container mx-auto px-6 md:px-12 lg:px-28 max-w-4xl">
            <span className="text-brand-coral text-xs font-semibold tracking-[0.2em] uppercase block mb-4">Perfil ideal</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              ¿Este perfil suena como tú?
            </h2>
            <p className="text-muted-foreground max-w-md mb-14">
              No buscamos la perfección — buscamos a la persona correcta. Si cumples la mayoría de esto, queremos conocerte.
            </p>

            <div className="space-y-6">
              {/* Formación académica */}
              <div className="p-6 md:p-12 rounded-2xl border border-border bg-background">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-coral/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-brand-coral" />
                    </div>
                    <span className="text-brand-coral text-xs font-semibold tracking-[0.15em] uppercase">Formación académica</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground"><CheckCircle2 className="w-3.5 h-3.5" /> Requisito</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Carrera en ciencias de la salud o educación</h3>
                <p className="text-muted-foreground text-sm mb-5">
                  Psicología, Educación Especial, Terapia Ocupacional, Pedagogía o área afín. Estudiantes de últimos semestres también son bienvenidos.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Psicología", "Ed. Especial", "T. Ocupacional", "Pedagogía"].map((t) => (
                    <span key={t} className="px-3 py-1.5 rounded-full border border-border text-xs font-medium text-foreground">{t}</span>
                  ))}
                </div>
              </div>

              {/* Idioma */}
              <div className="p-6 md:p-12 rounded-2xl border border-border bg-background">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-brand-blue" />
                    </div>
                    <span className="text-brand-coral text-xs font-semibold tracking-[0.15em] uppercase">Idioma</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground"><CheckCircle2 className="w-3.5 h-3.5" /> Requisito</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Inglés intermedio o avanzado</h3>
                <p className="text-muted-foreground text-sm mb-5">
                  Los manuales clínicos, materiales de certificación IBT y BCBA, y buena parte de la literatura ABA están en inglés. No necesitas ser bilingüe, pero sí poder leer y estudiar en inglés.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Lectura técnica", "Manuales ABA", "Certificaciones ABA"].map((t) => (
                    <span key={t} className="px-3 py-1.5 rounded-full border border-border text-xs font-medium text-foreground">{t}</span>
                  ))}
                </div>
              </div>

              {/* Experiencia previa */}
              <div className="p-6 md:p-12 rounded-2xl border border-border bg-background">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-amber/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-brand-amber" />
                    </div>
                    <span className="text-brand-coral text-xs font-semibold tracking-[0.15em] uppercase">Experiencia previa</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-brand-coral"><CheckCircle2 className="w-3.5 h-3.5" /> Requisito</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-4">Al menos una de las siguientes</h3>
                <div className="space-y-3 mb-4">
                  <div className="p-4 rounded-xl bg-muted/50">
                    <span className="text-brand-coral font-bold text-lg mr-2">6 meses</span>
                    <span className="text-muted-foreground text-sm">de experiencia trabajando con niños con autismo, TDAH o neurodivergencia</span>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <span className="text-brand-coral font-bold text-lg mr-2">1 año</span>
                    <span className="text-muted-foreground text-sm">de experiencia clínica en cualquier entorno terapéutico o educativo</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground italic">* Basta con cumplir una de las dos opciones.</p>
              </div>

              {/* Actitud y valores */}
              <div className="p-6 md:p-12 rounded-2xl border border-border bg-background">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-coral/10 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-brand-coral" />
                    </div>
                    <span className="text-brand-coral text-xs font-semibold tracking-[0.15em] uppercase">Actitud y valores</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground"><CheckCircle2 className="w-3.5 h-3.5" /> Deseable</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Más allá del currículum</h3>
                <p className="text-muted-foreground text-sm mb-5">
                  Buscamos personas con genuina empatía por las familias, tolerancia a la ambigüedad, disposición para recibir feedback y pasión por el aprendizaje continuo.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Empatía real", "Apertura al feedback", "Ganas de crecer"].map((t) => (
                    <span key={t} className="px-3 py-1.5 rounded-full border border-border text-xs font-medium text-foreground">{t}</span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ═══════ 7. MANIFIESTO BRILERS ═══════ */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-6 md:px-12 lg:px-28 max-w-4xl">
            <span className="text-brand-coral text-xs font-semibold tracking-[0.2em] uppercase block mb-4">Manifiesto Brilers</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
              Ser Briler no es solo un título.
            </h2>

            {/* Coral manifesto card */}
            <div className="rounded-2xl bg-brand-coral p-6 md:p-12 mb-10">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">¿Eres un Briler?</h3>
              <div className="w-10 h-0.5 bg-white/40 mb-6" />
              <div className="space-y-4 mb-8">
                {[
                  "Crees que cada niño tiene un enorme potencial, sin importar su diagnóstico.",
                  "Te apasiona el aprendizaje y la ciencia de la conducta, pero no te quedas en la teoría.",
                  "Eres alguien que no se conforma con hacer las cosas 'más o menos bien'.",
                  "Puedes conectar con una familia en crisis y también con los datos de una hoja de registro.",
                  "Buscas más que un empleo — buscas un lugar donde crecer como profesional y como persona.",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-white/60 text-sm mt-0.5">→</span>
                    <p className="text-white/90 text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
              <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8" asChild>
                <a href="https://outlook.office.com/bookwithme/user/8b179fca665f41baa2aa78e72f1b74f5@somosbrilus.com/meetingtype/x0E3BLL0aEqHLrtPpKprsg2?bookingcode=4f773523-ce37-4dac-9434-b455996541af&anonymous&ismsaljsauthenabled&ep=mlink" target="_blank" rel="noopener noreferrer">
                  Soy Briler <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </Button>
            </div>

            {/* Values cards */}
            <div className="space-y-4">
              {[
                { title: "Rigor sin rigidez", desc: "Usamos metodología basada en evidencia, pero siempre con flexibilidad clínica. Cada niño es único.", dot: "bg-brand-blue" },
                { title: "Claridad con empatía", desc: "Damos feedback directo y honesto, pero siempre desde el respeto y el entendimiento profundo.", dot: "bg-brand-coral" },
                { title: "Visión de largo plazo", desc: "No buscamos resultados rápidos. Buscamos transformaciones reales y sostenibles en el tiempo.", dot: "bg-brand-amber" },
                { title: "Curiosidad constante", desc: "Siempre hay algo nuevo que aprender. Cultivamos el asombro y el cuestionamiento como hábito.", dot: "bg-brand-blue" },
              ].map((v, i) => (
                <div key={i} className="p-6 md:p-12 rounded-2xl border border-border bg-background">
                  <div className="flex items-start gap-3">
                    <span className={`w-3 h-3 rounded-full ${v.dot} mt-1.5 shrink-0`} />
                    <div>
                      <h4 className="text-base font-bold text-foreground mb-1">{v.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ 9. ASÍ ES COMO TE UNES A BRILUS ═══════ */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-6 md:px-12 lg:px-28 max-w-5xl">
            <span className="text-brand-coral text-xs font-semibold tracking-[0.2em] uppercase block mb-4">El proceso</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-14">
              Así es como te unes a Brilus.
            </h2>
            {/* Scroll indicator - mobile only */}
            <div className="flex items-center gap-2 mb-4 md:hidden text-muted-foreground">
              <span className="text-xs">Desliza para ver más</span>
              <ArrowRight className="w-3 h-3 animate-pulse" />
            </div>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible scrollbar-hide">
              {[
                { step: "01", badge: "Paso 1", badgeColor: "bg-brand-coral text-white", title: "Formulario de aplicación", desc: "Cuéntanos quién eres, qué estudias o estudiaste, y por qué te interesa el mundo de la terapia conductual. Sin complicaciones." },
                { step: "02", badge: "Paso 2", badgeColor: "bg-brand-coral text-white", title: "Llamada exploratoria", desc: "Una llamada de 20-30 min con nuestro equipo. Queremos conocerte, resolver tus dudas y contarte cómo es el día a día en Brilus." },
                { step: "03", badge: "Paso 3", badgeColor: "bg-brand-amber text-white", title: "Entrevista clínica", desc: "Una conversación más profunda sobre tus conocimientos, valores y expectativas. También puede incluir un role-play terapéutico." },
                { step: "04", badge: "Paso 4", badgeColor: "bg-brand-amber text-white", title: "¡Bienvenido, Briler!", desc: "Si hay match, te damos la bienvenida con un proceso de onboarding estructurado. Tu primer día ya tiene un camino trazado." },
              ].map((item, i) => (
                <div key={i} className="relative w-[85vw] min-w-[85vw] flex-shrink-0 snap-center p-6 md:p-12 rounded-2xl bg-muted/50 overflow-hidden md:w-auto md:min-w-0 md:flex-shrink">
                  <span className="absolute top-4 right-5 text-8xl font-bold text-foreground/[0.06] select-none leading-none pointer-events-none">{item.step}</span>
                  <div className="relative z-10">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${item.badgeColor}`}>{item.badge}</span>
                    <h3 className="text-lg font-bold text-foreground mb-3">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ 10. FINAL CTA ═══════ */}
        <section className="py-20 md:py-28 bg-foreground rounded-3xl mx-4 md:mx-8 lg:mx-16 mb-12">
          <div className="container mx-auto px-6 md:px-12 lg:px-28 max-w-5xl flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <div className="flex gap-1.5 mb-5">
                <span className="w-3 h-3 rounded-full bg-brand-coral" />
                <span className="w-3 h-3 rounded-full bg-brand-amber" />
                <span className="w-3 h-3 rounded-full bg-brand-blue" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3">
                Tu carrera con<br />propósito empieza aquí.
              </h2>
              <p className="text-white/50 text-sm max-w-sm">
                Da el primer paso. Aplica hoy y el equipo de Brilus te contactará para conocerte.
              </p>
            </div>
            <div className="flex flex-col items-start md:items-center gap-3">
              <Button variant="coral" size="lg" className="text-base px-10 w-full md:w-auto" asChild>
                <a href="https://outlook.office.com/bookwithme/user/8b179fca665f41baa2aa78e72f1b74f5@somosbrilus.com/meetingtype/x0E3BLL0aEqHLrtPpKprsg2?bookingcode=4f773523-ce37-4dac-9434-b455996541af&anonymous&ismsaljsauthenabled&ep=mlink" target="_blank" rel="noopener noreferrer">
                  Enviar mi aplicación <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <p className="text-white/40 text-xs">Sin compromisos · 100% en línea</p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default Careers;
