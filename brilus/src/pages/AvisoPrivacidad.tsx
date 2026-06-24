import NavbarBrilus from "@/components/NavbarBrilus";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";

const AvisoPrivacidad = () => {
  const breadcrumbSchema = {
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
        "name": "Aviso de Privacidad",
        "item": "https://somosbrilus.com/aviso-de-privacidad"
      }
    ]
  };

  return (
    <>
      <SEOHead
        title="Aviso de Privacidad - Brilus"
        description="Aviso de Privacidad Integral de Brilus. Conoce cómo protegemos y tratamos tus datos personales conforme a la legislación mexicana."
        canonical="/aviso-de-privacidad"
        structuredData={breadcrumbSchema}
      />
      
      <div className="min-h-screen bg-background">
        <NavbarBrilus />
        
        <main className="pt-32 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <header className="mb-12 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                Aviso de Privacidad
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Brilus, subsidiaria de RedKnot Inc., tiene como propósito brindar atención especializada y personalizada a niñas y niños con necesidades del desarrollo, mediante terapias conductuales, de lenguaje, ocupacionales y programas de acompañamiento familiar.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                Conscientes de nuestra responsabilidad, reafirmamos nuestro compromiso con la confidencialidad y la protección de sus datos personales, cumpliendo estrictamente con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP), su Reglamento y los Lineamientos del Aviso de Privacidad publicados en el Diario Oficial de la Federación. Este aviso incluye el tratamiento de datos personales sensibles relacionados con la salud, desarrollo y diagnóstico de menores.
              </p>
            </header>

            <article className="prose prose-lg max-w-none">
              {/* Sección 1 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  1. Responsable y datos de contacto
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p><strong className="text-foreground">Responsable del tratamiento:</strong> Brilus, subsidiaria de RedKnot Inc.</p>
                  <p><strong className="text-foreground">Domicilio:</strong> Xola n°301, Departamento 3, Colonia del Valle Norte, Código Postal 03103, Benito Juárez, Ciudad de México, México</p>
                  <p><strong className="text-foreground">Teléfono:</strong> +52 55 6215 1706</p>
                  <p><strong className="text-foreground">Correo electrónico:</strong> <a href="mailto:familias@somosbrilus.com" className="text-primary hover:underline">familias@somosbrilus.com</a></p>
                  <p><strong className="text-foreground">Horario de atención:</strong> de lunes a viernes, de 10:00 a 16:00 horas.</p>
                  <p className="mt-4">
                    Brilus es responsable de recabar, usar y proteger los datos personales de los usuarios, tutores, pacientes y colaboradores que mantienen relación con la organización.
                  </p>
                </div>
              </section>

              {/* Sección 2 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  2. Formas de obtención y tipos de datos personales
                </h2>
                <p className="text-muted-foreground mb-4">
                  Podemos obtener sus datos personales de diferentes formas:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                  <li>Directamente, cuando usted los proporciona al iniciar un proceso de valoración, contratar un servicio o comunicarse con nosotros por medios físicos, electrónicos o telefónicos.</li>
                  <li>Indirectamente, cuando terceros autorizados (como escuelas, médicos tratantes o consultores clínicos) nos los comparten con su consentimiento.</li>
                  <li>Automáticamente, al visitar nuestro sitio web o interactuar con nuestras plataformas digitales, donde se recopilan datos técnicos y de uso mediante cookies estrictamente necesarias.</li>
                </ul>
                <p className="text-muted-foreground mb-4">
                  Los datos personales que tratamos incluyen, según su relación con Brilus:
                </p>
                <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                  <li><strong className="text-foreground">Datos de identificación:</strong> nombre completo, edad, fecha de nacimiento, género, Registro Federal de Contribuyentes (RFC), Clave Única de Registro de Población (CURP), firma y documentos de identidad oficiales.</li>
                  <li><strong className="text-foreground">Datos de contacto:</strong> domicilio, números telefónicos, redes sociales y correos electrónicos.</li>
                  <li><strong className="text-foreground">Datos laborales o académicos (en caso de terapeutas o candidatos):</strong> trayectoria profesional, formación académica, referencias y experiencia clínica.</li>
                  <li><strong className="text-foreground">Datos administrativos y financieros:</strong> información fiscal, datos de facturación y forma de pago.</li>
                  <li><strong className="text-foreground">Datos de menores de edad:</strong> nombre, edad, antecedentes de desarrollo y cualquier información relevante para la planeación terapéutica. Estos datos son proporcionados únicamente por los padres o tutores.</li>
                  <li><strong className="text-foreground">Datos obtenidos en redes sociales:</strong> solo aquellos que el propio usuario haya hecho públicos conforme a las políticas de cada plataforma.</li>
                </ol>
                <p className="text-muted-foreground mt-4">
                  Brilus no recaba datos directamente de menores de edad a través de formularios web o redes sociales.
                </p>
              </section>

              {/* Sección 3 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  3. Datos Personales Sensibles
                </h2>
                <p className="text-muted-foreground">
                  Además de los datos anteriores, Brilus podrá tratar datos personales sensibles que requieren especial protección, tales como información médica, de salud física o mental, informes psicológicos, diagnósticos, evaluaciones conductuales, registros de sesiones terapéuticas, fotografías o grabaciones con fines clínicos. Dichos datos jamás serán utilizados sin la autorización expresa del titular o del padre/madre/tutor legal.
                </p>
              </section>

              {/* Sección 4 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  4. Finalidades del tratamiento
                </h2>
                <p className="text-muted-foreground mb-4">
                  Sus datos personales serán utilizados para las siguientes finalidades:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Brindar atención terapéutica integral y personalizada a menores con necesidades del desarrollo.</li>
                  <li>Realizar valoraciones clínicas iniciales, diagnósticos funcionales, elaboración de planes terapéuticos y seguimiento de progresos.</li>
                  <li>Coordinar el trabajo clínico con profesionales asociados, escuelas o especialistas involucrados en la atención.</li>
                  <li>Gestionar citas, pagos, facturación y obligaciones administrativas derivadas de la relación con Brilus.</li>
                  <li>Cumplir con obligaciones sanitarias, legales y de seguridad establecidas por la normatividad mexicana.</li>
                  <li>Evaluar la calidad del servicio, realizar estudios internos y elaborar reportes estadísticos anonimizados.</li>
                  <li>Difundir contenidos informativos o educativos sobre las terapias ofrecidas por Brilus.</li>
                  <li>Compartir materiales institucionales o de sensibilización sobre inclusión y neurodesarrollo.</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  En caso de que no desee que sus datos se utilicen para finalidades secundarias, podrá manifestarlo enviando un correo electrónico a <a href="mailto:familias@somosbrilus.com" className="text-primary hover:underline">familias@somosbrilus.com</a> dentro de los cinco días hábiles siguientes a que haya tenido acceso a este aviso. Si no se recibe negativa expresa, se entenderá otorgado el consentimiento tácito para los fines secundarios mencionados.
                </p>
              </section>

              {/* Sección 5 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  5. Transferencia de datos personales
                </h2>
                <p className="text-muted-foreground mb-4">
                  Brilus podrá compartir sus datos personales con las siguientes entidades, siempre bajo estrictas medidas de confidencialidad y solo para finalidades compatibles con las descritas:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong className="text-foreground">Autoridades mexicanas:</strong> Cumplimiento de obligaciones legales, fiscales y sanitarias.</li>
                  <li><strong className="text-foreground">Profesionales y consultores clínicos:</strong> Supervisión terapéutica, evaluación o co-intervención bajo confidencialidad.</li>
                  <li><strong className="text-foreground">RedKnot Inc. (EE. UU.):</strong> Supervisión clínica y control de calidad, con medidas contractuales y técnicas de protección de datos.</li>
                  <li><strong className="text-foreground">Instituciones educativas o aliadas terapéuticas:</strong> Coordinación de programas de atención, capacitación o investigación.</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  El titular autoriza expresamente la transferencia internacional de sus datos a RedKnot Inc., en los Estados Unidos, bajo los mismos estándares de protección previstos por la legislación mexicana. Brilus se compromete a no transferir sus datos personales con fines comerciales o publicitarios.
                </p>
              </section>

              {/* Sección 6 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  6. Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)
                </h2>
                <p className="text-muted-foreground mb-4">
                  Usted o su representante legal podrán ejercer los Derechos ARCO respecto a sus datos personales en cualquier momento.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                  <li><strong className="text-foreground">Acceso:</strong> Conocer qué datos personales tenemos y las condiciones de su uso.</li>
                  <li><strong className="text-foreground">Rectificación:</strong> Solicitar la corrección o actualización de datos inexactos o incompletos.</li>
                  <li><strong className="text-foreground">Cancelación:</strong> Solicitar la eliminación de sus datos cuando considere que no están siendo tratados conforme a la ley.</li>
                  <li><strong className="text-foreground">Oposición:</strong> Oponerse al uso de sus datos para finalidades específicas no esenciales.</li>
                </ul>
                <p className="text-muted-foreground mb-4">
                  <strong className="text-foreground">Procedimiento:</strong> Podrá enviar su solicitud a <a href="mailto:familias@somosbrilus.com" className="text-primary hover:underline">familias@somosbrilus.com</a>, indicando:
                </p>
                <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                  <li>Nombre completo y medio de contacto.</li>
                  <li>Copia de identificación oficial o documento que acredite la representación legal.</li>
                  <li>Descripción clara del derecho que desea ejercer.</li>
                  <li>Datos o documentos que faciliten la localización de la información.</li>
                </ol>
                <p className="text-muted-foreground mt-4">
                  Brilus responderá en un plazo máximo de 15 días hábiles mediante correo electrónico. El ejercicio de estos derechos es gratuito, salvo costos justificados de envío o reproducción de copias.
                </p>
              </section>

              {/* Sección 7 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  7. Revocación del Consentimiento
                </h2>
                <p className="text-muted-foreground mb-4">
                  Usted puede revocar su consentimiento para el tratamiento de sus datos personales en cualquier momento, enviando una solicitud a <a href="mailto:familias@somosbrilus.com" className="text-primary hover:underline">familias@somosbrilus.com</a> con su nombre, identificación y medio de contacto. No en todos los casos podremos concluir el uso de inmediato, ya que podríamos estar obligados legalmente a conservar cierta información.
                </p>
                <p className="text-muted-foreground">
                  La revocación podría implicar la suspensión de los servicios, si estos dependen del tratamiento de los datos revocados.
                </p>
              </section>

              {/* Sección 8 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  8. Mecanismos para limitar el uso de su información personal
                </h2>
                <p className="text-muted-foreground">
                  Además del procedimiento anterior, usted puede inscribirse en el Registro Público para Evitar Publicidad (REPEP) de la PROFECO para evitar recibir comunicaciones comerciales. Para más información, visite el portal oficial de PROFECO o solicite asistencia mediante el correo <a href="mailto:familias@somosbrilus.com" className="text-primary hover:underline">familias@somosbrilus.com</a>.
                </p>
              </section>

              {/* Sección 9 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  9. Seguridad en el tratamiento de los datos personales
                </h2>
                <p className="text-muted-foreground">
                  Brilus aplica medidas administrativas, técnicas y físicas para garantizar la protección, confidencialidad e integridad de la información. Esto incluye controles de acceso, protocolos de confidencialidad firmados, cifrado digital en plataformas seguras, respaldo periódico y eliminación controlada de archivos al concluir su vigencia legal. Los expedientes clínicos se conservarán por un periodo mínimo de cinco años contados a partir del último acto terapéutico, conforme a la NOM-004-SSA3-2012.
                </p>
              </section>

              {/* Sección 10 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  10. Cookies y Tecnologías de rastreo
                </h2>
                <p className="text-muted-foreground">
                  Nuestro sitio web <a href="https://somosbrilus.com/" className="text-primary hover:underline">https://somosbrilus.com/</a> utiliza cookies técnicas y de sesión para asegurar su correcto funcionamiento. No usamos cookies de publicidad ni rastreo conductual. Puede desactivarlas en su navegador sin afectar el acceso a la información principal.
                </p>
              </section>

              {/* Sección 11 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  11. Modificaciones al Aviso de Privacidad
                </h2>
                <p className="text-muted-foreground">
                  Este Aviso de Privacidad puede modificarse o actualizarse por razones legales, operativas o tecnológicas. Cualquier cambio será notificado a través de nuestro portal oficial <a href="https://somosbrilus.com" className="text-primary hover:underline">https://somosbrilus.com</a> y, en su caso, mediante correo electrónico.
                </p>
              </section>

              {/* Sección 12 */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  12. Consentimiento expreso para datos personales sensibles
                </h2>
                <p className="text-muted-foreground">
                  Declaro haber leído y comprendido el contenido del presente Aviso de Privacidad Integral y otorgo mi consentimiento expreso para el tratamiento de datos personales sensibles del menor conforme a las finalidades primarias aquí descritas.
                </p>
              </section>

              <footer className="mt-12 pt-8 border-t border-border">
                <p className="text-muted-foreground text-center">
                  <strong>Última actualización:</strong> 20 de octubre 2025
                </p>
              </footer>
            </article>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AvisoPrivacidad;
