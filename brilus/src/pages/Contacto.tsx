import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import NavbarBrilus from "@/components/NavbarBrilus";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ContactProcessSection from "@/components/ContactProcessSection";
import RotatingTestimonialCard from "@/components/RotatingTestimonialCard";
import VideoTestimonialSection from "@/components/VideoTestimonialSection";
import ScrollReveal from "@/components/ScrollReveal";
import { z } from "zod";
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "0x4AAAAAADpN5sGyJZOBL-SK";
const COUNTRY_CODES = [
  {
    code: "+1",
    name: "Estados Unidos/Canadá",
  },
  {
    code: "+52",
    name: "México",
  },
  {
    code: "+54",
    name: "Argentina",
  },
  {
    code: "+57",
    name: "Colombia",
  },
  {
    code: "+34",
    name: "España",
  },
  {
    code: "+58",
    name: "Venezuela",
  },
  {
    code: "+56",
    name: "Chile",
  },
  {
    code: "+51",
    name: "Perú",
  },
  {
    code: "+593",
    name: "Ecuador",
  },
];
const REFERRAL_SOURCES = [
  {
    value: "social_media",
    label: "Redes sociales (Instagram, Facebook, TikTok)",
  },
  {
    value: "family_friend",
    label: "Recomendación de un familiar o amigo",
  },
  {
    value: "professional",
    label: "Recomendación de un profesional (colegio, terapeuta, neuropediatra)",
  },
  {
    value: "google_search",
    label: "Búsqueda en Google",
  },
  {
    value: "webinar",
    label: "Webinar de Brilus",
  },
  {
    value: "event",
    label: "Evento o taller presencial",
  },
  {
    value: "influencer",
    label: "Influencer o colaboración de contenido",
  },
  {
    value: "other",
    label: "Otro",
  },
];
const contactFormSchema = z.object({
  parentFullName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(120, "El nombre no puede exceder 120 caracteres")
    .trim(),
  childName: z.string().min(1, "El nombre es requerido").max(120, "El nombre no puede exceder 120 caracteres").trim(),
  childAgeBand: z.string().min(1, "Por favor selecciona un rango de edad"),
  hasDiagnosis: z.array(z.string()).min(1, "Por favor selecciona al menos una opción"),
  otherDiagnosis: z.string().optional(),
  email: z.string().email("Correo electrónico inválido").max(254, "El correo no puede exceder 254 caracteres").trim(),
  countryCode: z.string().min(1, "Selecciona un código de país"),
  phoneNumber: z
    .string()
    .min(7, "El número debe tener al menos 7 dígitos")
    .max(15, "El número no puede exceder 15 dígitos")
    .regex(/^\d+$/, "Solo se permiten números"),
  postalCode: z
    .string()
    .min(4, "El código postal debe tener al menos 4 dígitos")
    .max(10, "El código postal no puede exceder 10 caracteres")
    .trim(),
  concerns: z
    .string()
    .min(20, "Por favor escribe al menos 20 caracteres")
    .max(1000, "El mensaje no puede exceder 1000 caracteres")
    .trim(),
  referralSource: z.string().min(1, "Por favor selecciona una opción"),
  consent: z.boolean().refine((val) => val === true, "Debes aceptar los términos"),
});
declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string;
          theme: string;
          callback: (token: string) => void;
        },
      ) => string;
      reset: (widgetId: string) => void;
    };
  }
}
const Contacto: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const turnstileRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    parentFullName: "",
    childName: "",
    childAgeBand: "",
    hasDiagnosis: [] as string[],
    otherDiagnosis: "",
    email: "",
    countryCode: "+52",
    phoneNumber: "",
    postalCode: "",
    concerns: "",
    referralSource: "",
    professionalName: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    // Load Cloudflare Turnstile script
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form data
    try {
      if (formData.hasDiagnosis.includes("otro") && !formData.otherDiagnosis.trim()) {
        setErrors((prev) => ({ ...prev, otherDiagnosis: "Por favor especifica el diagnóstico" }));
        return;
      }
      if (formData.referralSource === "professional" && !formData.professionalName.trim()) {
        setErrors((prev) => ({ ...prev, professionalName: "Por favor especifica el nombre del profesional" }));
        return;
      }
      const validatedData = contactFormSchema.parse({
        ...formData,
        parentFullName: formData.parentFullName.trim(),
        childName: formData.childName.trim(),
        email: formData.email.trim(),
        postalCode: formData.postalCode.trim(),
        concerns: formData.concerns.trim(),
      });
      setIsSubmitting(true);

      // Build E.164 phone number
      const e164Phone = `${validatedData.countryCode}${validatedData.phoneNumber}`;

      // Submit via Edge Function
      const { data, error } = await supabase.functions.invoke("submit-form", {
        body: {
          form_name: "contact",
          email: validatedData.email,
          ...(turnstileToken && {
            turnstile_token: turnstileToken,
          }),
          payload: {
            parent_full_name: validatedData.parentFullName,
            child_name: validatedData.childName,
            child_age_band: validatedData.childAgeBand,
            has_diagnosis: validatedData.hasDiagnosis
              .map((v) =>
                v === "otro" && formData.otherDiagnosis.trim() ? `Otro: ${formData.otherDiagnosis.trim()}` : v,
              )
              .join(", "),
            phone: e164Phone,
            postal_code: validatedData.postalCode,
            concerns: validatedData.concerns,
            referral_source:
              validatedData.referralSource === "professional" && formData.professionalName.trim()
                ? `professional: ${formData.professionalName.trim()}`
                : validatedData.referralSource,
            consent: validatedData.consent,
          },
        },
      });
      if (error) throw error;

      // Redirect to thank you page
      navigate("/gracias");

      // Reset turnstile
      if (turnstileRef.current) {
        turnstileRef.current.innerHTML = "";
        const widget = document.createElement("div");
        widget.className = "cf-turnstile";
        widget.setAttribute("data-sitekey", "0x4AAAAAADpN5sGyJZOBL-SK");
        widget.setAttribute("data-theme", "light");
        widget.setAttribute("data-callback", "onTurnstileSuccess");
        turnstileRef.current.appendChild(widget);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
        toast({
          title: "Error en el formulario",
          description: "Por favor corrige los errores antes de continuar.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Hubo un problema al enviar tu solicitud. Por favor intenta de nuevo.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    // Define callback for Turnstile
    (window as any).onTurnstileSuccess = (token: string) => {
      setTurnstileToken(token);
    };
  }, []);
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://somosbrilus.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Contacto",
        item: "https://somosbrilus.com/contacto",
      },
    ],
  };
  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contacto - Brilus",
    description: "Agenda tu evaluación gratuita. Terapias ABA con supervisión BCBA para niños con autismo en CDMX.",
    url: "https://somosbrilus.com/contacto",
  };
  return (
    <>
      <SEOHead
        title="Contacto – Brilus | Evaluación gratuita de terapias ABA en CDMX"
        description="Agenda tu evaluación gratuita hoy. Terapias ABA con supervisión BCBA para niños con autismo en CDMX. Te contactamos en 24hrs. ¡Inicia ahora!"
        canonical="/contacto"
        structuredData={[breadcrumbSchema, contactPageSchema]}
      />
      <NavbarBrilus />
      <main className="min-h-screen bg-brand-white pt-[88px] md:pt-[96px]">
        <div className="px-6 md:px-12 lg:px-16 xl:px-28 section-py">
          <div className="section-container grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Left Column - Text and Testimonials */}
            <div className="flex flex-col lg:sticky lg:top-32 gap-[38px]">
              <ScrollReveal variant="fadeLeft">
                <div className="space-y-6 max-w-[480px] mx-auto lg:mx-0">
                  <h1 className="text-h2 lg:text-h1 font-bold text-brand-black">
                    Recibe el apoyo que tú y tu hijo necesitan
                  </h1>

                  <p className="text-body-md text-brand-black/80 leading-relaxed">
                    Nunca es tarde para ayudar a tu hijo a alcanzar su máximo potencial. En Brilus, te acompañamos con
                    terapias personalizadas basadas en evidencia científica, supervisadas por una BCBA certificada en
                    Estados Unidos, especialista en autismo y desarrollo infantil. Contáctanos hoy para agendar una
                    llamada inicial y te guiaremos paso a paso en nuestro proceso.
                  </p>
                </div>
              </ScrollReveal>

              {/* Rotating Testimonial Card */}
              <ScrollReveal variant="fadeIn" delay={0.2}>
                <div className="max-w-[480px] mx-auto lg:mx-0 w-full">
                  <RotatingTestimonialCard />
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column - Form */}
            <ScrollReveal variant="fadeRight" delay={0.1}>
              <div className="bg-brand-white rounded-xl p-6 md:p-8 lg:p-12 shadow-brilus-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Parent Name */}
                  <div className="space-y-2">
                    <Label htmlFor="parentFullName" className="text-body-md font-semibold text-brand-black">
                      Nombre completo del padre/madre/tutor
                    </Label>
                    <Input
                      id="parentFullName"
                      type="text"
                      placeholder="Ingresa tu nombre completo"
                      required
                      value={formData.parentFullName}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          parentFullName: e.target.value,
                        });
                        if (errors.parentFullName) {
                          const newErrors = {
                            ...errors,
                          };
                          delete newErrors.parentFullName;
                          setErrors(newErrors);
                        }
                      }}
                      className={`bg-[#F5F5F5] border-0 text-brand-black ${errors.parentFullName ? "ring-2 ring-destructive" : ""}`}
                      aria-invalid={!!errors.parentFullName}
                      aria-describedby={errors.parentFullName ? "parentFullName-error" : undefined}
                    />
                    {errors.parentFullName && (
                      <p id="parentFullName-error" role="alert" className="text-body-xs text-destructive">
                        {errors.parentFullName}
                      </p>
                    )}
                  </div>

                  {/* Child Name and Age */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="childName" className="text-body-md font-semibold text-brand-black">
                        Nombre del niño/a
                      </Label>
                      <Input
                        id="childName"
                        type="text"
                        placeholder="Ingresa el nombre"
                        required
                        value={formData.childName}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            childName: e.target.value,
                          });
                          if (errors.childName) {
                            const newErrors = {
                              ...errors,
                            };
                            delete newErrors.childName;
                            setErrors(newErrors);
                          }
                        }}
                        className={`bg-[#F5F5F5] border-0 text-brand-black ${errors.childName ? "ring-2 ring-destructive" : ""}`}
                        aria-invalid={!!errors.childName}
                        aria-describedby={errors.childName ? "childName-error" : undefined}
                      />
                      {errors.childName && (
                        <p id="childName-error" role="alert" className="text-body-xs text-destructive">
                          {errors.childName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="childAgeBand" className="text-body-md font-semibold text-brand-black">
                        Edad del niño/a
                      </Label>
                      <Select
                        required
                        value={formData.childAgeBand}
                        onValueChange={(value) => {
                          setFormData({
                            ...formData,
                            childAgeBand: value,
                          });
                          if (errors.childAgeBand) {
                            const newErrors = {
                              ...errors,
                            };
                            delete newErrors.childAgeBand;
                            setErrors(newErrors);
                          }
                        }}
                      >
                        <SelectTrigger
                          className={`bg-[#F5F5F5] border-0 text-brand-black ${errors.childAgeBand ? "ring-2 ring-destructive" : ""}`}
                        >
                          <SelectValue placeholder="Selecciona un rango" />
                        </SelectTrigger>
                        <SelectContent className="bg-brand-white border border-[#E4E4E4] z-50">
                          <SelectItem value="0-2">0-2 años</SelectItem>
                          <SelectItem value="3-5">3-5 años</SelectItem>
                          <SelectItem value="6-8">6-8 años</SelectItem>
                          <SelectItem value="9-12">9-12 años</SelectItem>
                          <SelectItem value="13-17">13-17 años</SelectItem>
                          <SelectItem value="18+">18+ años</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.childAgeBand && (
                        <p id="childAgeBand-error" role="alert" className="text-body-xs text-destructive">
                          {errors.childAgeBand}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Diagnosis - Checkboxes */}
                  <div className="space-y-3">
                    <Label className="text-body-md font-semibold text-brand-black">
                      ¿Tu hijo/a tiene un diagnóstico?
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { value: "autismo", label: "Autismo (TEA)" },
                        { value: "tdah", label: "TDAH" },
                        { value: "paralisis_cerebral", label: "Parálisis cerebral" },
                        { value: "sindrome_down", label: "Síndrome de Down" },
                        { value: "retraso_desarrollo", label: "Retraso en el desarrollo" },
                        { value: "discapacidad_intelectual", label: "Discapacidad intelectual" },
                        { value: "en_proceso", label: "En proceso de evaluación" },
                        { value: "sin_diagnostico", label: "Sin diagnóstico formal" },
                        { value: "otro", label: "Otro" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`flex items-center gap-2.5 cursor-pointer rounded-lg px-3 py-2.5 transition-colors border-2 ${
                            formData.hasDiagnosis.includes(option.value)
                              ? "bg-blue-50 border-[#4686EF] text-[#4686EF]"
                              : "bg-[#F5F5F5] border-transparent hover:bg-[#ECECEC]"
                          }`}
                        >
                          <Checkbox
                            checked={formData.hasDiagnosis.includes(option.value)}
                            onCheckedChange={(checked) => {
                              const updated = checked
                                ? [...formData.hasDiagnosis, option.value]
                                : formData.hasDiagnosis.filter((v) => v !== option.value);
                              setFormData({ ...formData, hasDiagnosis: updated });
                              if (errors.hasDiagnosis) {
                                const newErrors = { ...errors };
                                delete newErrors.hasDiagnosis;
                                setErrors(newErrors);
                              }
                            }}
                          />
                          <span className="text-body-sm text-brand-black">{option.label}</span>
                        </label>
                      ))}
                    </div>
                    {formData.hasDiagnosis.includes("otro") && (
                      <div className="mt-2">
                        <Input
                          placeholder="Especifica el diagnóstico"
                          value={formData.otherDiagnosis}
                          onChange={(e) => {
                            setFormData({ ...formData, otherDiagnosis: e.target.value });
                            if (errors.otherDiagnosis) setErrors((prev) => ({ ...prev, otherDiagnosis: undefined }));
                          }}
                          className={`bg-[#F5F5F5] border text-brand-black ${errors.otherDiagnosis ? "border-destructive" : "border-transparent"}`}
                        />
                        {errors.otherDiagnosis && (
                          <p role="alert" className="text-body-xs text-destructive mt-1">
                            {errors.otherDiagnosis}
                          </p>
                        )}
                      </div>
                    )}
                    {errors.hasDiagnosis && (
                      <p id="hasDiagnosis-error" role="alert" className="text-body-xs text-destructive">
                        {errors.hasDiagnosis}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-body-md font-semibold text-brand-black">
                      Correo electrónico
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      required
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        });
                        if (errors.email) {
                          const newErrors = {
                            ...errors,
                          };
                          delete newErrors.email;
                          setErrors(newErrors);
                        }
                      }}
                      className={`bg-[#F5F5F5] border-0 text-brand-black ${errors.email ? "ring-2 ring-destructive" : ""}`}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" role="alert" className="text-body-xs text-destructive">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone with Country Code */}
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-body-md font-semibold text-brand-black">
                      Teléfono de contacto
                    </Label>
                    <div className="flex gap-2">
                      <Select
                        value={formData.countryCode}
                        onValueChange={(value) => {
                          setFormData({
                            ...formData,
                            countryCode: value,
                          });
                          if (errors.countryCode) {
                            const newErrors = {
                              ...errors,
                            };
                            delete newErrors.countryCode;
                            setErrors(newErrors);
                          }
                        }}
                      >
                        <SelectTrigger
                          className={`w-[85px] sm:w-[100px] bg-[#F5F5F5] border-0 text-brand-black ${errors.countryCode ? "ring-2 ring-destructive" : ""}`}
                        >
                          <SelectValue>{formData.countryCode}</SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-brand-white border border-[#E4E4E4] z-50">
                          {COUNTRY_CODES.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.code} {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="1234567890"
                        required
                        value={formData.phoneNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setFormData({
                            ...formData,
                            phoneNumber: value,
                          });
                          if (errors.phoneNumber) {
                            const newErrors = {
                              ...errors,
                            };
                            delete newErrors.phoneNumber;
                            setErrors(newErrors);
                          }
                        }}
                        className={`flex-1 bg-[#F5F5F5] border-0 text-brand-black ${errors.phoneNumber ? "ring-2 ring-destructive" : ""}`}
                        aria-invalid={!!errors.phoneNumber}
                        aria-describedby={errors.phoneNumber ? "phoneNumber-error" : undefined}
                      />
                    </div>
                    {(errors.countryCode || errors.phoneNumber) && (
                      <p id="phoneNumber-error" role="alert" className="text-body-xs text-destructive">
                        {errors.countryCode || errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  {/* Postal Code */}
                  <div className="space-y-2">
                    <Label htmlFor="postalCode" className="text-body-md font-semibold text-brand-black">
                      Código postal
                    </Label>
                    <Input
                      id="postalCode"
                      type="text"
                      placeholder="01234"
                      required
                      value={formData.postalCode}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          postalCode: e.target.value,
                        });
                        if (errors.postalCode) {
                          const newErrors = {
                            ...errors,
                          };
                          delete newErrors.postalCode;
                          setErrors(newErrors);
                        }
                      }}
                      className={`bg-[#F5F5F5] border-0 text-brand-black ${errors.postalCode ? "ring-2 ring-destructive" : ""}`}
                      aria-invalid={!!errors.postalCode}
                      aria-describedby={errors.postalCode ? "postalCode-error" : undefined}
                    />
                    {errors.postalCode && (
                      <p id="postalCode-error" role="alert" className="text-body-xs text-destructive">
                        {errors.postalCode}
                      </p>
                    )}
                  </div>

                  {/* Referral Source */}
                  <div className="space-y-2">
                    <Label htmlFor="referralSource" className="text-body-md font-semibold text-brand-black">
                      ¿Cómo conociste Brilus?
                    </Label>
                    <Select
                      required
                      value={formData.referralSource}
                      onValueChange={(value) => {
                        setFormData({
                          ...formData,
                          referralSource: value,
                        });
                        if (errors.referralSource) {
                          const newErrors = {
                            ...errors,
                          };
                          delete newErrors.referralSource;
                          setErrors(newErrors);
                        }
                      }}
                    >
                      <SelectTrigger
                        className={`bg-[#F5F5F5] border-0 text-brand-black ${errors.referralSource ? "ring-2 ring-destructive" : ""}`}
                      >
                        <SelectValue placeholder="Selecciona una opción" />
                      </SelectTrigger>
                      <SelectContent className="bg-brand-white border border-[#E4E4E4] z-50">
                        {REFERRAL_SOURCES.map((source) => (
                          <SelectItem key={source.value} value={source.value}>
                            {source.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.referralSource && (
                      <p id="referralSource-error" role="alert" className="text-body-xs text-destructive">
                        {errors.referralSource}
                      </p>
                    )}

                    {formData.referralSource === "professional" && (
                      <div className="space-y-2 pt-2">
                        <Label htmlFor="professionalName" className="text-body-sm font-medium text-brand-black">
                          Nombre del profesional que te recomendó
                        </Label>
                        <Input
                          id="professionalName"
                          type="text"
                          placeholder="Ej. Dra. María López"
                          value={formData.professionalName}
                          onChange={(e) => {
                            setFormData({ ...formData, professionalName: e.target.value });
                            if (errors.professionalName) {
                              const newErrors = { ...errors };
                              delete newErrors.professionalName;
                              setErrors(newErrors);
                            }
                          }}
                          className={`bg-[#F5F5F5] border-0 text-brand-black ${errors.professionalName ? "ring-2 ring-destructive" : ""}`}
                          aria-invalid={!!errors.professionalName}
                          aria-describedby={errors.professionalName ? "professionalName-error" : undefined}
                        />
                        {errors.professionalName && (
                          <p id="professionalName-error" role="alert" className="text-body-xs text-destructive">
                            {errors.professionalName}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Concerns */}
                  <div className="space-y-2">
                    <Label htmlFor="concerns" className="text-body-md font-semibold text-brand-black">
                      ¿Qué señales o preocupaciones has notado?
                    </Label>
                    <Textarea
                      id="concerns"
                      placeholder="Sé lo más específica posible: describe comportamientos, situaciones o señales que hayas observado..."
                      required
                      rows={6}
                      value={formData.concerns}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          concerns: e.target.value,
                        });
                        if (errors.concerns) {
                          const newErrors = {
                            ...errors,
                          };
                          delete newErrors.concerns;
                          setErrors(newErrors);
                        }
                      }}
                      className={`bg-[#F5F5F5] border-0 text-brand-black resize-none ${errors.concerns ? "ring-2 ring-destructive" : ""}`}
                      aria-invalid={!!errors.concerns}
                      aria-describedby={errors.concerns ? "concerns-error" : "concerns-help"}
                    />
                    <p id="concerns-help" className="text-body-xs text-brand-black/60">
                      Cuéntanos con detalle para poder orientarte mejor
                    </p>
                    {errors.concerns && (
                      <p id="concerns-error" role="alert" className="text-body-xs text-destructive">
                        {errors.concerns}
                      </p>
                    )}
                    <p className="text-body-xs text-brand-black/50">
                      {formData.concerns.length}/1000 caracteres (mínimo 20)
                    </p>
                  </div>

                  {/* Consent Checkbox */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="consent"
                        checked={formData.consent}
                        onCheckedChange={(checked) => {
                          setFormData({
                            ...formData,
                            consent: checked as boolean,
                          });
                          if (errors.consent) {
                            const newErrors = {
                              ...errors,
                            };
                            delete newErrors.consent;
                            setErrors(newErrors);
                          }
                        }}
                        className="mt-1"
                        aria-invalid={!!errors.consent}
                      />
                      <Label htmlFor="consent" className="text-body-sm text-brand-black leading-relaxed cursor-pointer">
                        Acepto que Brilus use mi información para contactarme sobre sus servicios y acepto la política
                        de privacidad.
                      </Label>
                    </div>
                    {errors.consent && (
                      <p id="consent-error" role="alert" className="text-body-xs text-destructive">
                        {errors.consent}
                      </p>
                    )}
                  </div>

                  {/* Cloudflare Turnstile Captcha */}
                  <div className="space-y-2 overflow-hidden w-full max-w-full">
                    <div
                      ref={turnstileRef}
                      className="cf-turnstile scale-[0.85] origin-left sm:scale-100"
                      data-sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY || "0x4AAAAAADpN5sGyJZOBL-SK"}
                      data-theme="light"
                      data-callback="onTurnstileSuccess"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-black !text-white hover:bg-[#8B8B8B] font-semibold text-body-md px-8 py-6 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Enviando..." : "Agenda tu llamada inicial"}
                  </Button>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Video Testimonial */}
        <ScrollReveal variant="fadeIn">
          <VideoTestimonialSection videoId="wtGJJfb0RAY" />
        </ScrollReveal>

        {/* Process Section */}
        <ContactProcessSection />
      </main>
      <Footer />
    </>
  );
};
export default Contacto;
