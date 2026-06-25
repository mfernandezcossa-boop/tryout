import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Loader2, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import type { ScreenerConfig, ScreenerQuestion, QuestionAnswer } from "./screenerTypes";
import { calculateScore, getRiskLevel } from "./scoring";

// Turnstile global is already declared in src/pages/Contacto.tsx

type Step = "intro" | "form" | "mini_form" | "quiz" | "closing" | "rejected" | "provisional_closing";

const COUNTRY_CODES = [
  { code: "+52", country: "México" },
  { code: "+1", country: "EE.UU./Canadá" },
  { code: "+34", country: "España" },
  { code: "+54", country: "Argentina" },
  { code: "+56", country: "Chile" },
  { code: "+57", country: "Colombia" },
  { code: "+58", country: "Venezuela" },
  { code: "+51", country: "Perú" },
  { code: "+593", country: "Ecuador" },
  { code: "+502", country: "Guatemala" },
  { code: "+503", country: "El Salvador" },
  { code: "+504", country: "Honduras" },
  { code: "+505", country: "Nicaragua" },
  { code: "+506", country: "Costa Rica" },
  { code: "+507", country: "Panamá" },
  { code: "+591", country: "Bolivia" },
  { code: "+595", country: "Paraguay" },
  { code: "+598", country: "Uruguay" },
];

interface LeadFormState {
  caregiver_name: string;
  caregiver_lastname: string;
  email: string;
  countryCode: string;
  whatsapp: string;
  child_name: string;
  child_birthdate: string;
  postal_code: string;
  consent: boolean;
}

const leadSchema = z.object({
  caregiver_name: z.string().trim().min(1, "Requerido").max(100),
  caregiver_lastname: z.string().trim().min(1, "Requerido").max(100),
  email: z.string().trim().email("Correo inválido").max(255),
  countryCode: z.string().trim().min(2, "Requerido").max(6),
  whatsapp: z.string().trim().min(7, "Número inválido").max(40),
  child_name: z.string().trim().min(1, "Requerido").max(100),
  child_birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
  postal_code: z.string().trim().min(1, "Requerido").max(20),
  consent: z.boolean().refine((v) => v === true, "Debes aceptar el aviso de privacidad"),
});

interface Props {
  config: ScreenerConfig;
  skipIntro?: boolean;
  /**
   * Bypass temporal del cuestionario. Cuando es true, al enviar el formulario
   * (Paso 2) se muestra directamente una pantalla de cierre provisoria sin
   * avanzar al cuestionario (Paso 3). El registro queda como "iniciado" en
   * screener_leads. Para reactivar el flujo completo, eliminar esta prop en
   * el consumidor (ver /screening-mchat).
   */
  bypassQuiz?: boolean;
  /**
   * Modo privado: formulario mínimo (solo nombre y apellido), sin intro ni
   * bypass — va directo al cuestionario real. Para links que el equipo de
   * Brilus comparte manualmente fuera del flujo público.
   */
  privateMode?: boolean;
  /**
   * Si se provee, al enviar exitosamente el formulario (LeadFormStep) se invoca
   * este callback con el leadId en lugar de avanzar internamente al siguiente paso.
   * Útil para redirigir a una URL dedicada (start-mchat / start-cast) para tracking.
   */
  onLeadSubmitted?: (leadId: string) => void;
}

const ScreenerFlow = ({ config, skipIntro = false, bypassQuiz = false, privateMode = false, onLeadSubmitted }: Props) => {
  const [step, setStep] = useState<Step>(privateMode ? "mini_form" : skipIntro ? "form" : "intro");
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [rejection, setRejection] = useState<"too_young" | "too_old" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-[76px] md:pt-[92px]">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 md:py-10">
        {step === "intro" && <IntroStep config={config} onStart={() => setStep("form")} />}
        {step === "mini_form" && (
          <MiniLeadFormStep
            config={config}
            submitting={submitting}
            setSubmitting={setSubmitting}
            onSuccess={(id) => {
              setLeadId(id);
              setStep("quiz");
            }}
            onRejected={(r) => {
              setRejection(r);
              setStep("rejected");
            }}
          />
        )}
        {step === "form" && (
          <LeadFormStep
            config={config}
            submitting={submitting}
            setSubmitting={setSubmitting}
            onSuccess={(id) => {
              setLeadId(id);
              if (onLeadSubmitted) {
                onLeadSubmitted(id);
                return;
              }
              setStep(bypassQuiz ? "provisional_closing" : "quiz");
            }}
            onRejected={(r) => {
              setRejection(r);
              setStep("rejected");
            }}
          />
        )}
        {step === "quiz" && leadId && (
          <QuizStep config={config} leadId={leadId} onComplete={() => setStep("closing")} />
        )}
        {step === "closing" && <ClosingStep config={config} />}
        {step === "provisional_closing" && <ProvisionalClosingStep leadId={leadId} />}
        {step === "rejected" && rejection && <RejectedStep config={config} reason={rejection} />}
        {config.footerCopyright && step !== "intro" && step !== "provisional_closing" && (
          <p className="mt-8 text-center text-xs tracking-[-0.05em] text-[#717182]">{config.footerCopyright}</p>
        )}
      </div>
    </div>
  );
};

/* ============================================================
 * Provisional closing (bypass del cuestionario)
 * ============================================================ */
const ProvisionalClosingStep = ({ leadId }: { leadId: string | null }) => {
  const [countryCode, setCountryCode] = useState("+52");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadId || !phone.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("submit-screener", {
        body: { mode: "update_phone", id: leadId, whatsapp: `${countryCode}${phone}` },
      });
      if (error) throw error;
      setSaved(true);
      toast.success("Número guardado. Te contactaremos pronto.");
    } catch (err: any) {
      toast.error(err?.message ?? "No pudimos guardar el número. Inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-[14px] border border-[rgba(0,0,0,0.1)] bg-white p-6 md:p-10 text-center">
      <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
        <CheckCircle2 className="h-6 w-6" />
      </div>
      <h2 className="text-[24px] md:text-[28px] font-semibold tracking-[-1px] text-[#1F1F1F]">
        ¡Gracias por tu interés!
      </h2>
      <p className="mt-4 text-base tracking-[-1px] text-[#717182]">
        Hemos recibido tus datos correctamente. En breve nos pondremos en contacto contigo por WhatsApp o correo
        electrónico para enviarte el acceso al cuestionario M-CHAT-R de forma privada.
      </p>

      <Button asChild variant="outline" size="lg" className="mt-6 w-full md:w-auto">
        <a href="/">Volver al inicio</a>
      </Button>
    </div>
  );
};

/* ============================================================
 * Step 1 — Intro
 * ============================================================ */
const IntroStep = ({ config, onStart }: { config: ScreenerConfig; onStart: () => void }) => (
  <div className="rounded-[14px] border border-[rgba(0,0,0,0.1)] bg-white p-6 md:p-10">
    <div className="mb-4 inline-flex items-center rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-medium tracking-[-0.05em] text-brand-blue">
      Herramienta de detección — no es un diagnóstico
    </div>
    <h1 className="text-[32px] md:text-[40px] font-semibold tracking-[-1px] leading-[1.1] text-[#1F1F1F]">
      {config.title}
    </h1>
    <p className="mt-4 text-base md:text-[20px] leading-relaxed tracking-[-1px] text-[#717182]">{config.description}</p>
    <div className="mt-6 flex flex-col gap-3 rounded-[10px] bg-[#F4F4F4] p-4 text-sm tracking-[-0.05em] text-[#1F1F1F]">
      <div>
        <span className="font-medium">Duración estimada:</span>{" "}
        <span className="text-[#717182]">{config.durationEstimate}</span>
      </div>
      <div>
        <span className="font-medium">Rango de edad sugerido:</span>{" "}
        <span className="text-[#717182]">
          {monthsLabel(config.ageRangeMonths.min)} a {monthsLabel(config.ageRangeMonths.max)}
        </span>
      </div>
    </div>
    <Button variant="blue" size="lg" className="mt-8 w-full md:w-auto" onClick={onStart}>
      Iniciar screener
      <ArrowRight className="ml-1 h-4 w-4" />
    </Button>
  </div>
);

function monthsLabel(months: number): string {
  if (months < 24) return `${months} meses`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem === 0 ? `${years} años` : `${years} años ${rem} meses`;
}

/* ============================================================
 * Step 2 — Lead form
 * ============================================================ */
const LeadFormStep = ({
  config,
  submitting,
  setSubmitting,
  onSuccess,
  onRejected,
}: {
  config: ScreenerConfig;
  submitting: boolean;
  setSubmitting: (v: boolean) => void;
  onSuccess: (id: string) => void;
  onRejected: (r: "too_young" | "too_old") => void;
}) => {
  const [data, setData] = useState<LeadFormState>({
    caregiver_name: "",
    caregiver_lastname: "",
    email: "",
    countryCode: "+52",
    whatsapp: "",
    child_name: "",
    child_birthdate: "",
    postal_code: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    (window as any).onScreenerTurnstileSuccess = (token: string) => setTurnstileToken(token);
    return () => {
      try {
        document.head.removeChild(script);
      } catch {}
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = leadSchema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) errs[err.path[0].toString()] = err.message;
      });
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      const { data: resp, error } = await supabase.functions.invoke("submit-screener", {
        body: {
          mode: "start",
          screener_id: config.id,
          caregiver_name: parsed.data.caregiver_name,
          caregiver_lastname: parsed.data.caregiver_lastname,
          email: parsed.data.email,
          whatsapp: `${parsed.data.countryCode}${parsed.data.whatsapp}`,
          child_name: parsed.data.child_name,
          child_birthdate: parsed.data.child_birthdate,
          postal_code: parsed.data.postal_code || null,
          age_range_months: config.ageRangeMonths,
          ...(turnstileToken && { turnstile_token: turnstileToken }),
        },
      });
      if (error) throw error;
      if (resp?.rejected === "too_young") return onRejected("too_young");
      if (resp?.rejected === "too_old") return onRejected("too_old");
      if (resp?.id) return onSuccess(resp.id);
      throw new Error("Respuesta inesperada del servidor");
    } catch (err: any) {
      toast.error(err?.message ?? "No pudimos enviar tus datos. Inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const upd = <K extends keyof LeadFormState>(k: K, v: LeadFormState[K]) => setData((p) => ({ ...p, [k]: v }));

  return (
    <form onSubmit={handleSubmit} className="rounded-[14px] border border-[rgba(0,0,0,0.1)] bg-white p-6 md:p-10">
      <h2 className="text-[24px] md:text-[28px] font-semibold tracking-[-1px] text-[#1F1F1F]">
        {config.title ? `Cuestionario de detección de autismo ${config.title}` : "Antes de empezar"}
      </h2>
      <p className="mt-2 text-sm tracking-[-0.05em] text-[#717182]">
        Por favor, responde estas preguntas pensando en el comportamiento habitual de tu hijo/a. Si has notado que
        realiza alguna de estas conductas solo un par de veces, pero normalmente no lo hace, selecciona NO.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Nombre(s) del cuidador/a" error={errors.caregiver_name}>
          <Input value={data.caregiver_name} onChange={(e) => upd("caregiver_name", e.target.value)} />
        </Field>
        <Field label="Apellidos" error={errors.caregiver_lastname}>
          <Input value={data.caregiver_lastname} onChange={(e) => upd("caregiver_lastname", e.target.value)} />
        </Field>
        <Field label="Correo electrónico" error={errors.email}>
          <Input type="email" value={data.email} onChange={(e) => upd("email", e.target.value)} />
        </Field>
        <Field label="Número de teléfono / WhatsApp *" error={errors.whatsapp || errors.countryCode}>
          <div className="flex gap-2">
            <select
              value={data.countryCode}
              onChange={(e) => upd("countryCode", e.target.value)}
              className="h-10 w-[92px] rounded-md border border-input bg-background px-3 text-sm text-[#1F1F1F] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Código de país"
            >
              {COUNTRY_CODES.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.code}
                </option>
              ))}
            </select>

            <Input
              type="tel"
              required
              placeholder="55 1234 5678"
              value={data.whatsapp}
              onChange={(e) => upd("whatsapp", e.target.value.replace(/\D/g, ""))}
              className="flex-1"
            />
          </div>
        </Field>
        <Field label="Nombre del niño/a" error={errors.child_name}>
          <Input value={data.child_name} onChange={(e) => upd("child_name", e.target.value)} />
        </Field>
        <Field label="Fecha de nacimiento" error={errors.child_birthdate}>
          <Input type="date" value={data.child_birthdate} onChange={(e) => upd("child_birthdate", e.target.value)} />
        </Field>
        <Field label="Código postal" error={errors.postal_code}>
          <Input value={data.postal_code} onChange={(e) => upd("postal_code", e.target.value)} />
        </Field>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-[10px] border border-[rgba(0,0,0,0.1)] bg-[#F7F7F7] p-4">
        <Checkbox id="screener-consent" checked={data.consent} onCheckedChange={(v) => upd("consent", v === true)} />
        <Label htmlFor="screener-consent" className="text-sm leading-relaxed tracking-[-0.05em] text-[#1F1F1F]">
          <>
            Acepto el{" "}
            <a
              href="https://somosbrilus.com/aviso-de-privacidad"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-blue underline underline-offset-2"
            >
              Aviso de Privacidad
            </a>
            . Consiento que mis datos sean tratados de forma confidencial por Brilus y la Unidad de Neurodesarrollo del
            Hospital Español.
          </>
        </Label>
      </div>
      {errors.consent && <p className="mt-2 text-sm text-[#C02C00] tracking-[-0.05em]">{errors.consent}</p>}

      <div className="mt-6">
        <div
          ref={turnstileRef}
          className="cf-turnstile"
          data-sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY || "0x4AAAAAADpN5sGyJZOBL-SK"}
          data-theme="light"
          data-callback="onScreenerTurnstileSuccess"
        />
      </div>

      <Button type="submit" variant="blue" size="lg" disabled={submitting} className="mt-6 w-full md:w-auto">
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Enviando...
          </>
        ) : (
          <>
            Continuar al cuestionario <ArrowRight className="ml-1 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
};

/* ============================================================
 * Mini Lead form (private mode)
 * ============================================================ */
interface MiniLeadFormState {
  caregiver_name: string;
  caregiver_lastname: string;
}

const miniLeadSchema = z.object({
  caregiver_name: z.string().trim().min(1, "Requerido").max(100),
  caregiver_lastname: z.string().trim().min(1, "Requerido").max(100),
});

const MiniLeadFormStep = ({
  config,
  submitting,
  setSubmitting,
  onSuccess,
  onRejected,
}: {
  config: ScreenerConfig;
  submitting: boolean;
  setSubmitting: (v: boolean) => void;
  onSuccess: (id: string) => void;
  onRejected: (r: "too_young" | "too_old") => void;
}) => {
  const [data, setData] = useState<MiniLeadFormState>({ caregiver_name: "", caregiver_lastname: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = miniLeadSchema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) errs[err.path[0].toString()] = err.message;
      });
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      const midMonths = Math.round((config.ageRangeMonths.min + config.ageRangeMonths.max) / 2);
      const birthdate = new Date();
      birthdate.setMonth(birthdate.getMonth() - midMonths);
      const child_birthdate = birthdate.toISOString().slice(0, 10);

      const parentLeadId = new URLSearchParams(window.location.search).get("ref") || undefined;
      const { data: resp, error } = await supabase.functions.invoke("submit-screener", {
        body: {
          mode: "start",
          screener_id: config.id,
          caregiver_name: parsed.data.caregiver_name,
          caregiver_lastname: parsed.data.caregiver_lastname,
          email: "acceso-privado@brilus.mx",
          whatsapp: "0000000000",
          child_name: "No especificado",
          child_birthdate,
          postal_code: null,
          age_range_months: config.ageRangeMonths,
          parent_lead_id: parentLeadId,
        },
      });
      if (error) throw error;
      if (resp?.rejected === "too_young") return onRejected("too_young");
      if (resp?.rejected === "too_old") return onRejected("too_old");
      if (resp?.id) return onSuccess(resp.id);
      throw new Error("Respuesta inesperada del servidor");
    } catch (err: any) {
      toast.error(err?.message ?? "No pudimos enviar tus datos. Inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[14px] border border-[rgba(0,0,0,0.1)] bg-white p-6 md:p-10 text-center"
    >
      <h2 className="text-[24px] md:text-[28px] font-semibold tracking-[-1px] text-[#1F1F1F]">Antes de empezar</h2>
      <p className="mt-2 text-sm tracking-[-0.05em] text-[#717182]">{config.description}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-4 rounded-[10px] bg-[#F4F4F4] p-4 text-sm tracking-[-0.05em] text-[#1F1F1F]">
        <div>
          <span className="font-medium">Duración estimada:</span>{" "}
          <span className="text-[#717182]">{config.durationEstimate}</span>
        </div>
      </div>
      <p className="mt-4 text-sm tracking-[-0.05em] text-[#717182]">
        Ingresa tu nombre y apellido para iniciar el cuestionario.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-4 text-left md:grid-cols-2">
        <Field label="Nombre *" error={errors.caregiver_name}>
          <Input
            value={data.caregiver_name}
            onChange={(e) => setData((p) => ({ ...p, caregiver_name: e.target.value }))}
          />
        </Field>
        <Field label="Apellido *" error={errors.caregiver_lastname}>
          <Input
            value={data.caregiver_lastname}
            onChange={(e) => setData((p) => ({ ...p, caregiver_lastname: e.target.value }))}
          />
        </Field>
      </div>
      <Button type="submit" variant="blue" size="lg" disabled={submitting} className="mt-6 w-full md:mx-auto md:w-auto">
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Iniciar cuestionario"}
      </Button>
    </form>
  );
};

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <Label className="tracking-[-0.05em] text-[#1F1F1F]">{label}</Label>
    {children}
    {error && <span className="text-xs text-[#C02C00] tracking-[-0.05em]">{error}</span>}
  </div>
);

/* ============================================================
 * Rejected (age out of range)
 * ============================================================ */
const RejectedStep = ({ config, reason }: { config: ScreenerConfig; reason: "too_young" | "too_old" }) => {
  const r = reason === "too_young" ? config.redirects.tooYoung : config.redirects.tooOld;
  return (
    <div className="rounded-[14px] border border-[rgba(0,0,0,0.1)] bg-white p-6 md:p-10 text-center">
      <h2 className="text-[24px] md:text-[28px] font-semibold tracking-[-1px] text-[#1F1F1F]">
        Gracias por tu interés
      </h2>
      <p className="mt-4 text-base tracking-[-1px] text-[#717182]">{r.message}</p>
      {r.ctaUrl && r.ctaLabel && (
        <Button asChild variant="blue" size="lg" className="mt-6 w-full md:w-auto">
          <a href={r.ctaUrl}>{r.ctaLabel}</a>
        </Button>
      )}
    </div>
  );
};

/* ============================================================
 * Step 3 — Quiz
 * ============================================================ */
export const QuizStep = ({
  config,
  leadId,
  onComplete,
}: {
  config: ScreenerConfig;
  leadId: string;
  onComplete: () => void;
}) => {
  const qs = config.questions;
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, QuestionAnswer>>({});
  const [submitting, setSubmitting] = useState(false);

  if (qs.length === 0) {
    return (
      <div className="rounded-[14px] border border-[rgba(0,0,0,0.1)] bg-white p-6 md:p-10">
        <h2 className="text-[20px] font-semibold tracking-[-1px] text-[#1F1F1F]">Cuestionario en preparación</h2>
        <p className="mt-3 text-sm tracking-[-0.05em] text-[#717182]">
          El equipo de Brilus está terminando de cargar las preguntas de este cuestionario. Vuelve pronto.
        </p>
      </div>
    );
  }

  const q = qs[idx];
  const a = answers[q.id];
  const prev = idx > 0 ? qs[idx - 1] : null;
  const showInfoSeparator = q.section === "info" && prev?.section === "main";

  const isAnswered = (() => {
    if (!a) return false;
    if (q.type === "yesno_subitems") {
      if (!a.subitemAnswers) return false;
      for (const s of q.subitems ?? []) {
        if (!a.subitemAnswers[s.id]) return false;
        if (
          s.hasConditionalText &&
          a.subitemAnswers[s.id] === "yes" &&
          !(a.subitemConditionalTexts?.[s.id] ?? "").trim()
        ) {
          return false;
        }
      }
      return true;
    }

    if (a.answer === null) return false;

    if (q.type === "yesno_with_text" && a.answer === "yes" && !(a.conditionalText ?? "").trim()) {
      return false;
    }

    return true;
  })();

  const updateAnswer = (patch: Partial<QuestionAnswer>) =>
    setAnswers((p) => ({
      ...p,
      [q.id]: { questionId: q.id, answer: null, ...p[q.id], ...patch },
    }));

  const handleNext = async () => {
    if (!isAnswered) return;
    if (idx < qs.length - 1) {
      setIdx(idx + 1);
      return;
    }
    // Final question — calculate, submit, then advance
    setSubmitting(true);
    try {
      const arr: QuestionAnswer[] = qs.map((qq) => answers[qq.id] ?? { questionId: qq.id, answer: null });
      const score = calculateScore(arr, config.scoringRules);
      const risk_level = getRiskLevel(score, config.scoringRules);
      const { error } = await supabase.functions.invoke("submit-screener", {
        body: {
          mode: "complete",
          id: leadId,
          screener_id: config.id,
          answers: arr,
          score,
          risk_level,
        },
      });
      if (error) throw error;
      onComplete();
    } catch (err: any) {
      toast.error(err?.message ?? "No pudimos guardar tus respuestas.");
      setSubmitting(false);
    }
  };

  return (
    <div>
      {showInfoSeparator && (
        <div className="mb-4 rounded-[10px] bg-brand-amber/20 px-4 py-3 text-sm font-medium tracking-[-0.05em] text-[#1F1F1F]">
          Información adicional
        </div>
      )}
      <div className="rounded-[14px] border border-[rgba(0,0,0,0.1)] bg-white p-6 md:p-10">
        <div className="mb-2 flex items-center justify-between text-xs tracking-[-0.05em] text-[#717182]">
          <span>
            Pregunta {idx + 1} de {qs.length}
          </span>
          <span>{Math.round(((idx + 1) / qs.length) * 100)}%</span>
        </div>
        <Progress value={((idx + 1) / qs.length) * 100} className="h-2" />

        <h3 className="mt-6 text-[20px] md:text-[24px] font-semibold tracking-[-1px] leading-[1.3] text-[#1F1F1F]">
          {q.text}
        </h3>

        {q.type !== "yesno_subitems" && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            {(["yes", "no"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => updateAnswer({ answer: opt })}
                className={`rounded-[10px] border-2 px-4 py-4 text-base font-semibold tracking-[-1px] transition-colors ${
                  a?.answer === opt
                    ? "border-brand-blue bg-brand-blue text-white"
                    : "border-[rgba(0,0,0,0.1)] bg-white text-[#1F1F1F] hover:border-brand-blue/40"
                }`}
              >
                {opt === "yes" ? "SÍ" : "NO"}
              </button>
            ))}
          </div>
        )}

        {q.type === "yesno_with_text" && a?.answer === "yes" && (
          <div className="mt-5">
            <Label className="tracking-[-0.05em] text-[#1F1F1F]">
              {q.conditionalTextLabel ?? "Por favor describe brevemente"}
            </Label>
            <Textarea
              className="mt-2"
              value={a?.conditionalText ?? ""}
              onChange={(e) => updateAnswer({ conditionalText: e.target.value })}
            />
          </div>
        )}

        {q.type === "yesno_subitems" && q.subitems && (
          <div className="mt-5 space-y-3">
            {q.subitems.map((s) => {
              const sa = a?.subitemAnswers?.[s.id];
              return (
                <div key={s.id} className="rounded-[10px] border border-[rgba(0,0,0,0.1)] p-3">
                  <p className="text-sm tracking-[-0.05em] text-[#1F1F1F]">{s.label}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {(["yes", "no"] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() =>
                          updateAnswer({
                            subitemAnswers: { ...(a?.subitemAnswers ?? {}), [s.id]: opt },
                          })
                        }
                        className={`rounded-[8px] border px-3 py-2 text-sm font-medium tracking-[-0.05em] transition-colors ${
                          sa === opt
                            ? "border-brand-blue bg-brand-blue text-white"
                            : "border-[rgba(0,0,0,0.1)] bg-white text-[#1F1F1F]"
                        }`}
                      >
                        {opt === "yes" ? "SÍ" : "NO"}
                      </button>
                    ))}
                  </div>
                  {s.hasConditionalText && sa === "yes" && (
                    <Textarea
                      className="mt-2"
                      placeholder="Especifica"
                      value={a?.subitemConditionalTexts?.[s.id] ?? ""}
                      onChange={(e) =>
                        updateAnswer({
                          subitemConditionalTexts: {
                            ...(a?.subitemConditionalTexts ?? {}),
                            [s.id]: e.target.value,
                          },
                        })
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 md:flex-row md:justify-between">
          <Button
            type="button"
            variant="ghost"
            disabled={idx === 0 || submitting}
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Atrás
          </Button>
          <Button
            type="button"
            variant="blue"
            size="lg"
            disabled={!isAnswered || submitting}
            onClick={handleNext}
            className="w-full md:w-auto"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Enviando...
              </>
            ) : idx === qs.length - 1 ? (
              "Finalizar"
            ) : (
              <>
                Siguiente <ArrowRight className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
 * Step 4 — Closing (same for all users)
 * ============================================================ */
export const ClosingStep = ({ config }: { config: ScreenerConfig }) => (
  <div className="rounded-[14px] border border-[rgba(0,0,0,0.1)] bg-white p-6 md:p-10 text-center">
    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue/10">
      <CheckCircle2 className="h-7 w-7 text-brand-blue" />
    </div>
    <h2 className="text-[28px] md:text-[32px] font-semibold tracking-[-1px] text-[#1F1F1F]">
      {config.closingPage.title}
    </h2>
    <p className="mt-4 text-base md:text-[20px] tracking-[-1px] text-[#717182]">{config.closingPage.thankYouMessage}</p>
    <p className="mt-3 text-sm md:text-base tracking-[-0.05em] text-[#717182]">{config.closingPage.nextStepsMessage}</p>
    <div className="mt-8 flex flex-col gap-2 md:flex-row md:flex-wrap md:justify-center">
      <Button asChild className="w-full md:w-auto">
        <a href="/">Volver al inicio</a>
      </Button>
      {config.closingPage.resourceLinks
        .map((l) => (
          <Button key={l.url} asChild variant="outline" className="w-full md:w-auto">
            <a href={l.url}>{l.label}</a>
          </Button>
        ))}
    </div>
  </div>
);

export default ScreenerFlow;
