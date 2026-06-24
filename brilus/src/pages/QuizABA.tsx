import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import NavbarBrilus from "@/components/NavbarBrilus";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Helmet } from "react-helmet-async";

type QuizStep = "welcome" | "age" | "q1" | "q2" | "q3" | "q4" | "q5" | "result";

interface QuizData {
  ageRange: string;
  q1: boolean | null;
  q2: boolean | null;
  q3: boolean | null;
  q4: boolean | null;
  q5: boolean | null;
}

const QuizABA = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<QuizStep>("welcome");
  const [data, setData] = useState<QuizData>({
    ageRange: "",
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null
  });

  const totalSteps = 6; // age + 5 questions
  const stepOrder: QuizStep[] = ["welcome", "age", "q1", "q2", "q3", "q4", "q5", "result"];
  const currentStepIndex = stepOrder.indexOf(step);

  const calculateScore = () => {
    let score = 0;
    if (data.q1) score++;
    if (data.q2) score++;
    if (data.q3) score++;
    if (data.q4) score++;
    if (data.q5) score++;
    return score;
  };

  const isApproved = () => {
    // Approved if score >= 3 and age is not 19+
    return data.ageRange !== "19+" && calculateScore() >= 3;
  };

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < stepOrder.length) {
      setStep(stepOrder[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setStep(stepOrder[prevIndex]);
    }
  };

  const handleQuestionAnswer = (questionKey: keyof QuizData, value: boolean) => {
    const newData = {
      ...data,
      [questionKey]: value
    };
    setData(newData);
    
    if (questionKey === "q5") {
      setStep("result");
    } else {
      setTimeout(() => {
        handleNext();
      }, 300);
    }
  };

  const handleContactRedirect = () => {
    navigate("/contacto");
  };

  const renderProgressBar = () => {
    if (step === "welcome" || step === "result") return null;
    const progress = (currentStepIndex - 1) / (totalSteps) * 100;
    return (
      <div className="mb-8">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Paso {currentStepIndex} de {totalSteps}
        </p>
      </div>
    );
  };

  const cardVariants = {
    initial: {
      opacity: 0,
      x: 50
    },
    animate: {
      opacity: 1,
      x: 0
    },
    exit: {
      opacity: 0,
      x: -50
    }
  };

  const structuredData = [{
    "@context": "https://schema.org",
    "@type": "Quiz",
    "name": "Quiz ABA - ¿Es adecuada la Terapia ABA para tu hijo/a?",
    "description": "Descubre en 2-3 minutos si la Terapia ABA puede ser adecuada para tu hijo o hija. Quiz gratuito y confidencial para determinar si la Terapia ABA es recomendable.",
    "about": {
      "@type": "MedicalTherapy",
      "name": "Terapia ABA (Análisis Conductual Aplicado)",
      "description": "Terapia basada en evidencia para el tratamiento del Trastorno del Espectro Autista (TEA)"
    },
    "educationalLevel": "Familias y cuidadores de niños con TEA o trastornos del desarrollo",
    "timeRequired": "PT3M",
    "interactivityType": "active",
    "isAccessibleForFree": true,
    "audience": {
      "@type": "PeopleAudience",
      "audienceType": "Padres y familias de niños con necesidades especiales"
    },
    "provider": {
      "@type": "Organization",
      "name": "Brilus",
      "url": "https://somosbrilus.com",
      "logo": "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/seo/faviconbrilus.png",
      "description": "Plataforma digital que integra diagnóstico, intervención y comunidad para niños y jóvenes con necesidades especiales"
    },
    "inLanguage": "es-MX",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "MXN",
      "availability": "https://schema.org/InStock"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": "https://somosbrilus.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Quiz ABA",
        "item": "https://somosbrilus.com/quiz-aba"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Tu hijo/a ha sido diagnosticado/a con autismo o un trastorno del desarrollo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Esta pregunta ayuda a determinar si el niño tiene un diagnóstico formal que pueda beneficiarse de la Terapia ABA."
        }
      },
      {
        "@type": "Question",
        "name": "¿Tu hijo/a presenta dificultades para comunicarse, relacionarse con otros o adaptarse a rutinas?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Las dificultades en comunicación, interacción social y adaptación son áreas clave que la Terapia ABA puede abordar efectivamente."
        }
      },
      {
        "@type": "Question",
        "name": "¿Tu hijo/a tiene comportamientos repetitivos o dificultades para regular emociones?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Los comportamientos repetitivos y las dificultades de autorregulación son indicadores comunes en TEA que responden bien a intervención ABA."
        }
      },
      {
        "@type": "Question",
        "name": "¿Te gustaría que tu hijo/a desarrolle habilidades como autonomía, comunicación o interacción social?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "La Terapia ABA se enfoca en desarrollar habilidades funcionales y de adaptación que mejoren la calidad de vida del niño."
        }
      },
      {
        "@type": "Question",
        "name": "¿Tu familia puede comprometerse con sesiones de terapia estructuradas y el seguimiento de recomendaciones?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "El compromiso familiar es fundamental para el éxito de la Terapia ABA. La participación activa de la familia maximiza los resultados."
        }
      }
    ]
  }];

  return (
    <>
      <SEOHead 
        title="Quiz ABA - ¿Es adecuada la Terapia ABA para tu hijo/a? | Brilus" 
        description="Descubre en 2-3 minutos si la Terapia ABA puede ser adecuada para tu hijo o hija. Quiz gratuito y confidencial." 
        canonical="/quiz-aba"
        structuredData={structuredData}
      />
      <div className="min-h-screen flex flex-col bg-background">
        <NavbarBrilus />
        
        <main className="flex-1 container max-w-3xl mx-auto px-4 pt-32 pb-8 md:pt-28 md:pb-16 flex items-center justify-center">
          <div className="w-full">
            {renderProgressBar()}
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={step} 
                variants={cardVariants} 
                initial="initial" 
                animate="animate" 
                exit="exit" 
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 md:p-10 shadow-lg">
                  {step === "welcome" && (
                    <div className="text-center space-y-6">
                      <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                        ¿La Terapia ABA es adecuada para tu hijo/a?
                      </h1>
                      <p className="text-lg text-muted-foreground">
                        Toma 2–3 minutos completar este quiz y te indicamos si la Terapia ABA podría ser beneficioso para tu peque                
                      </p>
                      <Button size="lg" onClick={() => setStep("age")} className="w-full md:w-auto px-12">
                        Empezar
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  )}

                  {step === "age" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-foreground mb-6">
                        ¿Cuál es la edad de tu hijo/a?
                      </h2>
                      
                      <div className="grid gap-4">
                        {["0–2", "3–5", "6–12", "13–18", "19+"].map(range => (
                          <Button 
                            key={range} 
                            variant="outline" 
                            size="lg" 
                            onClick={() => {
                              setData({ ...data, ageRange: range });
                              if (range === "19+") {
                                setStep("result");
                              } else {
                                setTimeout(() => handleNext(), 300);
                              }
                            }} 
                            className="w-full h-auto py-4 text-lg hover:bg-primary hover:text-primary-foreground"
                          >
                            {range} años
                          </Button>
                        ))}
                      </div>

                      <Button variant="outline" onClick={handleBack} className="w-full">
                        <ChevronLeft className="mr-2 h-5 w-5" />
                        Atrás
                      </Button>
                    </div>
                  )}

                  {step === "q1" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-foreground mb-6">
                        ¿Tu hijo/a tiene un diagnóstico o sospecha de autismo, TEA o trastornos del desarrollo?
                      </h2>
                      
                      <div className="grid gap-4">
                        <Button 
                          size="lg" 
                          variant="outline" 
                          onClick={() => handleQuestionAnswer("q1", true)} 
                          className="w-full h-auto py-4 text-lg hover:bg-primary hover:text-primary-foreground"
                        >
                          Sí
                        </Button>
                        <Button 
                          size="lg" 
                          variant="outline" 
                          onClick={() => handleQuestionAnswer("q1", false)} 
                          className="w-full h-auto py-4 text-lg hover:bg-primary hover:text-primary-foreground"
                        >
                          No
                        </Button>
                      </div>

                      <Button variant="outline" onClick={handleBack} className="w-full">
                        <ChevronLeft className="mr-2 h-5 w-5" />
                        Atrás
                      </Button>
                    </div>
                  )}

                  {step === "q2" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-foreground mb-6">
                        ¿Tiene dificultades significativas en comunicación, interacción social o comportamiento?
                      </h2>
                      
                      <div className="grid gap-4">
                        <Button 
                          size="lg" 
                          variant="outline" 
                          onClick={() => handleQuestionAnswer("q2", true)} 
                          className="w-full h-auto py-4 text-lg hover:bg-primary hover:text-primary-foreground"
                        >
                          Sí
                        </Button>
                        <Button 
                          size="lg" 
                          variant="outline" 
                          onClick={() => handleQuestionAnswer("q2", false)} 
                          className="w-full h-auto py-4 text-lg hover:bg-primary hover:text-primary-foreground"
                        >
                          No
                        </Button>
                      </div>

                      <Button variant="outline" onClick={handleBack} className="w-full">
                        <ChevronLeft className="mr-2 h-5 w-5" />
                        Atrás
                      </Button>
                    </div>
                  )}

                  {step === "q3" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-foreground mb-6">
                        ¿Presenta comportamientos difíciles de manejar (rabietas, agresión, autolesión)?
                      </h2>
                      
                      <div className="grid gap-4">
                        <Button 
                          size="lg" 
                          variant="outline" 
                          onClick={() => handleQuestionAnswer("q3", true)} 
                          className="w-full h-auto py-4 text-lg hover:bg-primary hover:text-primary-foreground"
                        >
                          Sí
                        </Button>
                        <Button 
                          size="lg" 
                          variant="outline" 
                          onClick={() => handleQuestionAnswer("q3", false)} 
                          className="w-full h-auto py-4 text-lg hover:bg-primary hover:text-primary-foreground"
                        >
                          No
                        </Button>
                      </div>

                      <Button variant="outline" onClick={handleBack} className="w-full">
                        <ChevronLeft className="mr-2 h-5 w-5" />
                        Atrás
                      </Button>
                    </div>
                  )}

                  {step === "q4" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-foreground mb-6">
                        ¿Necesita ayuda práctica para aprender habilidades cotidianas (vestirse, comer, ir al baño)?
                      </h2>
                      
                      <div className="grid gap-4">
                        <Button 
                          size="lg" 
                          variant="outline" 
                          onClick={() => handleQuestionAnswer("q4", true)} 
                          className="w-full h-auto py-4 text-lg hover:bg-primary hover:text-primary-foreground"
                        >
                          Sí
                        </Button>
                        <Button 
                          size="lg" 
                          variant="outline" 
                          onClick={() => handleQuestionAnswer("q4", false)} 
                          className="w-full h-auto py-4 text-lg hover:bg-primary hover:text-primary-foreground"
                        >
                          No
                        </Button>
                      </div>

                      <Button variant="outline" onClick={handleBack} className="w-full">
                        <ChevronLeft className="mr-2 h-5 w-5" />
                        Atrás
                      </Button>
                    </div>
                  )}

                  {step === "q5" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-foreground mb-6">
                        ¿La familia está dispuesta a involucrarse activamente en el proceso terapéutico?
                      </h2>
                      
                      <div className="grid gap-4">
                        <Button 
                          size="lg" 
                          variant="outline" 
                          onClick={() => handleQuestionAnswer("q5", true)} 
                          className="w-full h-auto py-4 text-lg hover:bg-primary hover:text-primary-foreground"
                        >
                          Sí
                        </Button>
                        <Button 
                          size="lg" 
                          variant="outline" 
                          onClick={() => handleQuestionAnswer("q5", false)} 
                          className="w-full h-auto py-4 text-lg hover:bg-primary hover:text-primary-foreground"
                        >
                          No
                        </Button>
                      </div>

                      <Button variant="outline" onClick={handleBack} className="w-full">
                        <ChevronLeft className="mr-2 h-5 w-5" />
                        Atrás
                      </Button>
                    </div>
                  )}

                  {step === "result" && (
                    <div className="space-y-6 text-center">
                      <h2 className="text-3xl font-bold text-foreground mb-4">
                        Resultados
                      </h2>
                      
                      {data.ageRange === "19+" ? (
                        <div className="space-y-4">
                          <p className="text-lg text-muted-foreground">
                            En Brilus nos enfocamos en infancia y adolescencia. Para personas de 19 años o más, es mejor acudir a un neuropsicólogo especializado en adultos.
                          </p>
                        </div>
                      ) : calculateScore() === 0 ? (
                        <div className="space-y-4">
                          <p className="text-lg text-muted-foreground">
                            La Terapia ABA probablemente no es la intervención principal para tu hijo/a. Te sugerimos considerar otras opciones con tu pediatra o neuropsicólogo.
                          </p>
                        </div>
                      ) : calculateScore() <= 2 ? (
                        <div className="space-y-4">
                          <p className="text-lg text-muted-foreground">
                            ABA podría ayudar en áreas específicas. Completa el formulario para que podamos orientarte mejor.
                          </p>
                          <Button size="lg" onClick={handleContactRedirect} className="w-full md:w-auto px-12">
                            Continuar al formulario
                            <ChevronRight className="ml-2 h-5 w-5" />
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-lg text-muted-foreground">
                            ¡Excelente! La Terapia ABA probablemente es adecuada para tu hijo/a. Completa el formulario de contacto para que podamos conocer mejor tu caso.
                          </p>
                          <Button size="lg" onClick={handleContactRedirect} className="w-full md:w-auto px-12">
                            Continuar al formulario
                            <ChevronRight className="ml-2 h-5 w-5" />
                          </Button>
                        </div>
                      )}

                      <div className="pt-8 border-t">
                        <Button variant="outline" onClick={() => navigate("/")} className="w-full md:w-auto">
                          Volver al inicio
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default QuizABA;
