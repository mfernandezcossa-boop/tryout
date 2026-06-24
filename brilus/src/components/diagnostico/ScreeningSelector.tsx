import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Baby, GraduationCap, ArrowRight } from "lucide-react";
import { ReactNode } from "react";

interface ScreeningCardProps {
  icon: ReactNode;
  badge: string;
  title: string;
  ageRange: string;
  bullets: string[];
  cta: string;
  to: string;
}

const ScreeningCard = ({ icon, badge, title, ageRange, bullets, cta, to }: ScreeningCardProps) => (
  <Link
    to={to}
    className="group flex flex-col gap-4 rounded-brilus-card border border-black/10 bg-white p-6 transition-all hover:border-brand-blue/40 hover:shadow-lg"
  >
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-brilus-inner bg-brand-blue/10 text-brand-blue">
        {icon}
      </div>
      <span className="inline-flex items-center rounded-brilus-pill bg-brand-blue px-3 py-1 text-[12px] font-medium tracking-brilus-ui text-white">
        {badge}
      </span>
    </div>
    <div>
      <h3 className="text-[18px] font-semibold leading-[1.3] tracking-brilus-ui text-foreground">{title}</h3>
      <p className="mt-1 text-base tracking-brilus-ui text-muted-foreground">{ageRange}</p>
    </div>
    <ul className="space-y-1.5">
      {bullets.map((b) => (
        <li key={b} className="text-[14px] tracking-brilus-ui text-foreground/80">
          • {b}
        </li>
      ))}
    </ul>
    <span className="mt-auto inline-flex items-center justify-center gap-2 rounded-[8px] bg-foreground px-4 py-3 text-[14px] font-medium tracking-brilus-ui text-background transition-colors group-hover:bg-brand-blue">
      {cta}
      <ArrowRight className="h-4 w-4" />
    </span>
  </Link>
);

export const ScreeningOptions = () => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    <ScreeningCard
      icon={<Baby className="h-6 w-6" />}
      badge="16 meses – 4 años"
      title="M-CHAT-R"
      ageRange="Para niños pequeños"
      bullets={["20 preguntas de sí/no", "Toma menos de 5 minutos", "Gratis y confidencial"]}
      cta="Realizar el M-CHAT-R"
      to="/screening-mchat#top"
    />
    <ScreeningCard
      icon={<GraduationCap className="h-6 w-6" />}
      badge="4 – 11 años"
      title="CAST"
      ageRange="Para niños en edad escolar"
      bullets={["39 preguntas de sí/no", "Evalúa autismo y comunicación", "Gratis y confidencial"]}
      cta="Realizar el CAST"
      to="/screening-cast#top"
    />
  </div>
);

interface SelectorProps {
  trigger: ReactNode;
}

const ScreeningSelector = ({ trigger }: SelectorProps) => (
  <Dialog>
    <DialogTrigger asChild>{trigger}</DialogTrigger>
    <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-brilus-card p-5 sm:p-8">
      <DialogHeader className="pr-8">
        <DialogTitle className="text-[20px] font-semibold leading-tight tracking-brilus-ui text-foreground sm:text-[24px]">
          ¿Cuál screening le corresponde a tu hijo?
        </DialogTitle>
        <DialogDescription className="text-[14px] tracking-brilus-ui text-muted-foreground">
          Elige la evaluación según la edad. Son los mismos cuestionarios que usan pediatras y neuropediatras.
        </DialogDescription>
      </DialogHeader>
      <div className="mt-2">
        <ScreeningOptions />
      </div>
      <p className="mt-2 text-center text-base tracking-brilus-ui text-muted-foreground">
        Gratis y orientativo · No es un diagnóstico · Confidencial
      </p>
    </DialogContent>
  </Dialog>
);

export default ScreeningSelector;
