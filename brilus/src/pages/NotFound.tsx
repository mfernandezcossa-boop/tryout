import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft, MessageCircle } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import NavbarBrilus from "@/components/NavbarBrilus";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <SEOHead 
        title="Página no encontrada – Brilus" 
        description="La página que buscas no existe. Regresa a nuestra página principal." 
        noindex={true}
      />
      <NavbarBrilus />
      
      <main className="min-h-screen bg-gradient-to-b from-brand-gray/30 to-background flex items-center justify-center section-px">
        <div className="section-container max-w-2xl mx-auto text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* 404 Number */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              <span className="text-[120px] md:text-[180px] font-bold text-brand-blue/10 leading-none select-none">
                404
              </span>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl md:text-8xl font-bold text-brand-blue">
                  404
                </span>
              </div>
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              <h1 className="text-h2 text-brand-black">
                Página no encontrada
              </h1>
              <p className="text-body-lg text-brand-black/70 max-w-md mx-auto">
                Lo sentimos, la página que buscas no existe o ha sido movida. Te invitamos a explorar nuestro sitio.
              </p>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            >
              <Button asChild size="lg" className="gap-2">
                <Link to="/">
                  <Home className="w-4 h-4" />
                  Ir al inicio
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link to="/contacto">
                  <MessageCircle className="w-4 h-4" />
                  Contáctanos
                </Link>
              </Button>
            </motion.div>

            {/* Back link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 text-body-sm text-brand-black/60 hover:text-brand-blue transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver a la página anterior
              </button>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default NotFound;
