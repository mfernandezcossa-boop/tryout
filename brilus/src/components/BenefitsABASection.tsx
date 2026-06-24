import { ClipboardList, Trophy, Sparkles, Bird, Hand, type LucideIcon } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

type Benefit = {
  icon: LucideIcon;
  title: string;
  description: string;
  bg: string;
  text: string;
};

const row1: Benefit[] = [
  {
    icon: ClipboardList,
    title: "Lenguaje y Comunicación funcional",
    description:
      "Ayudamos a tu hijo a encontrar su forma de expresión para que logre decir lo que necesita, siente y piensa.",
    bg: "bg-brand-blue",
    text: "text-brand-black",
  },
  {
    icon: Trophy,
    title: "Habilidades sociales",
    description:
      "Acompañamos su integración al mundo, facilitando que aprenda a relacionarse y compartir en entornos seguros.",
    bg: "bg-brand-coral",
    text: "text-brand-black",
  },
  {
    icon: Sparkles,
    title: "Autonomía Personal",
    description:
      "Convertimos las rutinas diarias en metas alcanzables que fortalecen la seguridad en sus propias capacidades.",
    bg: "bg-brand-amber",
    text: "text-brand-black",
  },
];

const row2: Benefit[] = [
  {
    icon: Bird,
    title: "Regulación y Bienestar",
    description:
      "Brindamos herramientas para gestionar emociones y reducir crisis, promoviendo el equilibrio y la calma en casa.",
    bg: "bg-brand-blue-50",
    text: "text-brand-black",
  },
  {
    icon: Hand,
    title: "Procesamiento Sensorial",
    description:
      "Logramos que se sienta cómodo en su cuerpo y en cada espacio, ayudándole a procesar mejor los estímulos de su entorno. Incluye selectividad alimenticia e intolerancia a lugares con ruidos fuertes o mucha gente.",
    bg: "bg-brand-coral-50",
    text: "text-brand-black",
  },
];

const BenefitCard = ({ item, span }: { item: Benefit; span: string }) => {
  const Icon = item.icon;
  return (
    <div
      className={`${item.bg} ${item.text} ${span} rounded-[20px] p-7 md:p-12 flex flex-col h-full`}
    >
      <Icon className="w-12 h-12 mb-12 md:mb-16 text-brand-black" strokeWidth={1.75} />
      <h3 className="text-h4 font-semibold mb-3">{item.title}</h3>
      <p className="text-body-md opacity-95">{item.description}</p>
    </div>
  );
};

const BenefitsABASection = () => {
  const allBenefits = [...row1, ...row2];
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
    duration: 25,
  });

  return (
    <section className="bg-background section-py md:py-28">
      <div className="section-px section-container">
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20">
          <h5 className="text-h5 text-foreground mb-4">
            Beneficios Terapia ABA
          </h5>
          <h2 className="text-h2 text-foreground mb-5">
            ¿Cómo la Terapia ABA puede transformar el futuro de tu hijo?
          </h2>
          <p className="text-body-lg text-muted-foreground">
            Un enfoque basado en ciencia que impacta las áreas más importantes
            del desarrollo, respetando el ritmo y la singularidad de cada niño.
          </p>
        </div>

        {/* Mobile: Embla carousel with drag */}
        <div className="md:hidden -mx-4 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 px-4 touch-pan-y">
            {allBenefits.map((item) => (
              <div
                key={item.title}
                className="shrink-0 basis-full w-full"
              >
                <BenefitCard item={item} span="" />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: grid */}
        <div className="hidden md:grid md:grid-cols-6 gap-6 md:gap-8">
          {row1.map((item) => (
            <BenefitCard key={item.title} item={item} span="md:col-span-2" />
          ))}
          {row2.map((item) => (
            <BenefitCard key={item.title} item={item} span="md:col-span-3" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsABASection;
