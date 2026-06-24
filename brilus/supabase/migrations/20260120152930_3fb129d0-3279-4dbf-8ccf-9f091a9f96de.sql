-- Create knowledge_base_articles table for editable content
CREATE TABLE public.knowledge_base_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  content JSONB NOT NULL DEFAULT '[]'::jsonb,
  order_index INTEGER DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.knowledge_base_articles ENABLE ROW LEVEL SECURITY;

-- Public can read visible articles (accessed via direct link only, not indexed)
CREATE POLICY "Anyone can view visible articles" 
ON public.knowledge_base_articles 
FOR SELECT 
USING (visible = true);

-- Admins and moderators can manage articles
CREATE POLICY "Admins can manage articles" 
ON public.knowledge_base_articles 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role IN ('admin', 'moderator')
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_knowledge_base_articles_updated_at
BEFORE UPDATE ON public.knowledge_base_articles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the Hi Rasmus manual article with structured content
INSERT INTO public.knowledge_base_articles (slug, title, description, category, content, order_index) 
VALUES (
  'manual-hi-rasmus',
  'Manual para Padres: Hi Rasmus',
  'Guía práctica para familias sobre cómo usar la aplicación Hi Rasmus para el seguimiento del proceso terapéutico.',
  'manuales',
  '[
    {
      "id": "intro",
      "title": "Introducción",
      "content": "Este manual ha sido creado para acompañar a las familias en el uso de la aplicación Hi Rasmus, una herramienta diseñada para fortalecer la comunicación y el seguimiento del proceso terapéutico de tu hijo(a).\n\nA través de esta aplicación podrás:\n\n• **Consultar los objetivos** que se trabajan durante las sesiones, así como los que se trabajarán en casa. Esto permite que terapeutas y familias mantengan una alineación constante entre la intervención clínica y el trabajo en casa.\n\n• **Visualizar los avances** de tu hijo(a). La app presenta la información recopilada durante las sesiones en gráficas visuales y comprensibles, lo que facilita el análisis del progreso a lo largo del tiempo.\n\nLa participación de la familia es una parte fundamental del proceso terapéutico. Esta aplicación busca brindar transparencia, acceso a la información y un seguimiento continuo.\n\nSi tienes dudas, puedes comunicarte con nuestro equipo o preguntarle al terapeuta que trabaja con tu hijo(a)."
    },
    {
      "id": "inicio-sesion",
      "title": "Inicio de sesión",
      "content": "### Acceso a la plataforma\n\nTu usuario, accesos y enlace para ingresar te serán proporcionados al momento de la firma de contrato. Recibirás un correo electrónico de Hi Rasmus (revisa también tu carpeta de SPAM si no lo encuentras).\n\n### Crear tu cuenta\n\nAl hacer clic en el enlace del correo, tendrás dos opciones para activar tu cuenta:\n\n1. **Registro manual**: Escribe tu nombre de usuario (mamá/papá de...), email, contraseña y confirmación de contraseña.\n\n2. **Vincular cuenta existente**: Usa tu cuenta de Google, Apple o Microsoft.\n\nAcepta los términos y condiciones de privacidad (disponibles en PDF para tu lectura) y guarda tu contraseña en un lugar seguro.\n\n### Ajustes de idioma\n\nUna vez que inicies sesión, dirígete a **Settings** (Ajustes) en el menú y modifica el idioma a español si lo prefieres."
    },
    {
      "id": "sesiones-padres",
      "title": "Sesiones con padres",
      "content": "En algunos momentos, la supervisora les indicará realizar sesiones en casa para apoyar y reforzar lo que tu hijo(a) trabaja durante la terapia. Estas sesiones están pensadas para acompañarlos en el proceso y fortalecer el aprendizaje en un ambiente familiar.\n\n### Objetivos de trabajo\n\nEn la parte superior derecha encontrarás el apartado **HOME/HOGAR**. Al dar clic ahí, aparecerán los programas asignados previamente por el equipo.\n\n### ¿Cómo iniciar una sesión?\n\n1. Presiona el botón verde **\"Iniciar sesión\"**\n2. Revisa los programas a trabajar con tu hijo(a)\n3. Familiarízate con las instrucciones, materiales necesarios y objetivos de cada programa\n\n### Estrategia de enseñanza\n\nUsamos una jerarquía de apoyo de menor a mayor asistencia:\n\n1. **Tell (Decir)**: Indica verbalmente el siguiente paso. Ejemplo: \"seca las manos con la toalla\"\n\n2. **Show (Mostrar)**: Modela o señala el siguiente paso si tu hijo(a) no responde al apoyo verbal\n\n3. **Do (Hacer)**: Proporciona asistencia física si es necesario\n\nRecuerda: usa la menor asistencia posible y disminuye el apoyo conforme tu hijo(a) complete los pasos de forma independiente."
    },
    {
      "id": "recoleccion-datos",
      "title": "Recolección de datos",
      "content": "Los datos recolectados permiten al supervisor monitorear el progreso y ajustar la intervención según las necesidades de tu hijo(a).\n\n### Durante la sesión\n\n• Sigue las indicaciones para enseñar cada objetivo\n• Cada vez que trabajes un objetivo, haz clic en él y selecciona el resultado correspondiente:\n  - **Lo realiza**: Tu hijo(a) completó el paso de forma independiente\n  - **Lo realiza con apoyo**: Necesitó algún tipo de asistencia\n  - **No lo realiza**: No completó el paso\n\n### Notas y multimedia\n\nEn la parte inferior encontrarás:\n• Una sección para **notas** donde puedes anotar aspectos relevantes\n• Iconos de **cámara y video** para agregar fotos o videos de la sesión\n\n### ¿Te equivocaste?\n\nPresiona **Deshacer (Undo)** para eliminar el último dato registrado.\n\n### Cambiar de programa\n\nTienes tres opciones:\n1. Usar el botón \"Al próximo programa\"\n2. Ver todos los programas en una pantalla\n3. Cambiar entre pestañas\n\n### Finalizar la sesión\n\nCuando termines, presiona **FINALIZAR SESIÓN**, confirma con OK y cierra sesión."
    },
    {
      "id": "avances-progreso",
      "title": "Avances y progreso",
      "content": "En este apartado podrás observar los avances de tu hijo(a) a lo largo del tiempo, reflejados de forma clara y sencilla.\n\n### Acceder al historial y progreso\n\nDesde el menú principal tienes dos apartados:\n\n**Historial (History)**\nMuestra un resumen de las sesiones pasadas en formato de línea de tiempo, incluyendo:\n• Fecha y duración de cada sesión\n• Tipo de actividad\n• Usuario que trabajó la sesión\n\nAl dar clic en el icono de hoja con lápiz, verás un informe detallado de la sesión.\n\n**Progreso (Progress)**\nAquí encontrarás las gráficas del progreso de tu hijo(a), donde se muestran:\n• Avances logrados en cada objetivo\n• Promedio de pruebas y sesiones para dominar cada habilidad\n• Tendencias a lo largo del tiempo\n\nEstas gráficas permiten identificar avances significativos y detectar áreas que requieren ajustes."
    },
    {
      "id": "archivos-ayuda",
      "title": "Archivos y ayuda",
      "content": "### Archivos\n\nDirígete a **Files/Archivos** para visualizar documentos que la supervisora de tu hijo(a) ha compartido contigo.\n\n### ¿Necesitas ayuda?\n\nSi tienes alguna duda sobre la plataforma, puedes:\n\n• **Contactar al equipo de Brilus** directamente\n• **Preguntar al terapeuta** que trabaja con tu hijo(a)\n• **Consultar la ayuda oficial** de Hi Rasmus: [help.hirasmus.com/knowledge/parents](https://help.hirasmus.com/knowledge/parents)\n\nEstamos aquí para acompañarte en este proceso."
    }
  ]'::jsonb,
  1
);