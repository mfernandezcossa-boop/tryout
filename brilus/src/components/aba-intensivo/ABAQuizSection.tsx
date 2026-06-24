import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ArrowRight, RotateCcw, MessageCircle } from "lucide-react";

const questions = [
  {
    id: 1,
    question: "¿Tu hijo tiene entre 18 meses y 18 años?",
    yesPoints: 1,
  },
  {
    id: 2,
    question: "¿Presenta necesidades en comunicación, lenguaje o interacción social?",
    yesPoints: 1,
  },
  {
    id: 3,
    question: "¿Muestra conductas desafiantes o dificultades de regulación emocional?",
    yesPoints: 1,
  },
  {
    id: 4,
    question: "¿Necesita apoyo en habilidades de la vida diaria (vestirse, alimentarse, higiene)?",
    yesPoints: 1,
  },
  {
    id: 5,
    question: "¿Buscas terapias en casa o escuela para evitar traslados?",
    yesPoints: 1,
  },
  {
    id: 6,
    question: "¿Deseas un enfoque estructurado con metas claras y medibles?",
    yesPoints: 1,
  },
  {
    id: 7,
    question: "¿Estás dispuesto(a) a participar activamente en el proceso terapéutico?",
    yesPoints: 1,
  },
];

const WHATSAPP_URL = "https://wa.me/525562151706?text=Hola%2C%20hice%20el%20quiz%20y%20me%20interesa%20saber%20m%C3%A1s%20sobre%20el%20Programa%20Intensivo%20ABA";

export const ABAQuizSection = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [started, setStarted] = useState(false);

  const handleAnswer = (isYes: boolean) => {
    if (isYes) {
      setScore(score + questions[currentQuestion].yesPoints);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setStarted(false);
  };

  const getResult = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 70) {
      return {
        title: "¡El Programa Intensivo Brilus es ideal para tu familia!",
        description: "Basándonos en tus respuestas, tu hijo podría beneficiarse significativamente de nuestro programa. Te invitamos a agendar una Intake Call para conocer más detalles.",
        color: "text-brand-blue",
        bg: "bg-brand-blue/10"
      };
    } else if (percentage >= 40) {
      return {
        title: "Podríamos ayudarte con algunas necesidades",
        description: "Aunque no todas las características aplican, podemos evaluar el caso de tu hijo. Te recomendamos contactarnos para una valoración personalizada.",
        color: "text-brand-amber",
        bg: "bg-brand-amber/10"
      };
    } else {
      return {
        title: "Quizás otro enfoque sea más adecuado",
        description: "Basándonos en tus respuestas, nuestro programa intensivo podría no ser la mejor opción actual. Sin embargo, contáctanos para orientarte sobre alternativas.",
        color: "text-muted-foreground",
        bg: "bg-muted"
      };
    }
  };

  return (
    <section className="py-12 md:py-20 lg:py-28 bg-brand-grey/30">
        <div className="section-px section-container">
          <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-brand-coral text-body-sm font-semibold uppercase tracking-wider mb-4"
            >
              Descúbrelo
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-h2 text-foreground mb-4"
            >
              ¿Este programa es para mi hijo?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-body-lg text-muted-foreground"
            >
              Responde estas preguntas rápidas para saber si el Programa Intensivo Brilus 
              podría ser la opción ideal para tu familia.
            </motion.p>
          </div>

          {/* Quiz Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-brilus p-4 sm:p-6 md:p-8 shadow-brilus-2"
          >
            <AnimatePresence mode="wait">
              {!started ? (
                <motion.div
                  key="start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  <p className="text-body-lg text-foreground mb-6">
                    Son solo 7 preguntas de Sí o No. ¡Toma menos de 2 minutos!
                  </p>
                  <Button
                    onClick={() => setStarted(true)}
                    className="bg-brand-coral hover:bg-brand-coral/90 text-background px-8 py-6 text-body-md font-semibold rounded-brilus"
                  >
                    Comenzar Quiz
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              ) : showResult ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  {(() => {
                    const result = getResult();
                    return (
                      <>
                        <div className={`inline-flex items-center justify-center w-16 h-16 ${result.bg} rounded-full mb-6`}>
                          <CheckCircle className={`w-8 h-8 ${result.color}`} />
                        </div>
                        <h3 className={`text-h4 ${result.color} mb-4`}>{result.title}</h3>
                        <p className="text-body-md text-muted-foreground mb-8">{result.description}</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Button
                            asChild
                            className="bg-brand-blue hover:bg-brand-blue/90 text-background px-6 py-5 rounded-brilus"
                          >
                            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                              <MessageCircle className="w-5 h-5 mr-2" />
                              Hablar con un asesor
                            </a>
                          </Button>
                          <Button
                            variant="outline"
                            onClick={resetQuiz}
                            className="border-border px-6 py-5 rounded-brilus"
                          >
                            <RotateCcw className="w-5 h-5 mr-2" />
                            Repetir quiz
                          </Button>
                        </div>
                      </>
                    );
                  })()}
                </motion.div>
              ) : (
                <motion.div
                  key={`question-${currentQuestion}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="py-4"
                >
                  {/* Progress */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-body-sm text-muted-foreground">
                      Pregunta {currentQuestion + 1} de {questions.length}
                    </span>
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-blue transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <h3 className="text-h4 text-foreground mb-8 text-center">
                    {questions[currentQuestion].question}
                  </h3>

                  {/* Answer Buttons */}
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() => handleAnswer(true)}
                      className="flex-1 max-w-[140px] bg-brand-blue hover:bg-brand-blue/90 text-background py-6 rounded-brilus"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Sí
                    </Button>
                    <Button
                      onClick={() => handleAnswer(false)}
                      variant="outline"
                      className="flex-1 max-w-[140px] border-border py-6 rounded-brilus"
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      No
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
