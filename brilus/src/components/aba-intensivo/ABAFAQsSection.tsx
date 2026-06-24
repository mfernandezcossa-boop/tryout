import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
interface FAQ {
  id: string;
  question: string;
  answer: string;
  order_index: number;
}
export const ABAFAQsSection = () => {
  const {
    data: faqs = [],
    isLoading
  } = useQuery({
    queryKey: ["faqs", "aba-intensivo"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("faqs").select("id, question, answer, order_index").eq("display_location", "aba-intensivo").eq("visible", true).order("order_index", {
        ascending: true
      });
      if (error) throw error;
      return data as FAQ[];
    }
  });
  if (isLoading) {
    return <section className="section-py bg-muted/50">
        <div className="section-px section-container">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </div>
      </section>;
  }
  if (faqs.length === 0) {
    return null;
  }
  return <section className="section-py bg-muted/50">
      <div className="section-px section-container">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mb-12">
            <span className="inline-block text-brand-blue text-body-sm font-semibold uppercase tracking-wider mb-4">
              Preguntas Frecuentes
            </span>
            <h2 className="text-h1 text-foreground mb-4">
              Resolvemos tus dudas
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Encuentra respuestas a las preguntas más comunes sobre nuestro
              programa de terapia ABA intensivo.
            </p>
          </motion.div>

          {/* Accordion */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: 0.1
        }}>
            <Accordion type="single" collapsible className="bg-card ring-border/20 rounded-brilus w-full border border-border px-4 sm:px-6 md:px-12 lg:px-16 py-3 shadow-sm ring-1">
              {faqs.map(faq => <AccordionItem key={faq.id} value={faq.id} className="border-dotted">
                  <AccordionTrigger className="cursor-pointer text-base text-left hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-base text-muted-foreground pb-2">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>)}
            </Accordion>

            <p className="text-muted-foreground mt-6 text-center">
              ¿No encuentras lo que buscas?{" "}
              <Link to="/contacto" className="text-primary font-medium hover:underline">
                Contáctanos
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default ABAFAQsSection;