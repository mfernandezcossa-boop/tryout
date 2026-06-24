
-- Create Module 3: Supervisión Clínica
INSERT INTO public.induction_modules (module_number, title, description, order_index, visible)
VALUES (3, 'Supervisión Clínica', 'Función de la supervisión clínica, retroalimentación profesional y comunicación con el equipo.', 3, true);

-- Insert 10 questions for Module 3
INSERT INTO public.induction_quiz_questions (module_id, question_text, option_a, option_b, option_c, option_d, correct_answer, order_index)
VALUES
  ((SELECT id FROM public.induction_modules WHERE module_number = 3),
   '¿Cuál es la función principal de la supervisión clínica en el modelo de Brilus?',
   'Evaluar el desempeño administrativo y puntualidad del IBT.',
   'Garantizar la seguridad del cliente y la calidad del servicio mediante un sistema de apoyo continuo.',
   'Sustituir al IBT en las sesiones más difíciles con el alumno.',
   'Diseñar programas de entretenimiento para el tiempo libre del alumno.',
   'b', 1),

  ((SELECT id FROM public.induction_modules WHERE module_number = 3),
   '¿Quién es la responsable directa de diseñar y ajustar los planes de tratamiento en Brilus?',
   'El equipo administrativo de la oficina central.',
   'La familia del alumno según sus preferencias diarias.',
   'La supervisora (BCaBA o BCBA).',
   'El IBT con más experiencia en el caso.',
   'c', 2),

  ((SELECT id FROM public.induction_modules WHERE module_number = 3),
   'Si una supervisora te da retroalimentación correctiva durante una sesión, ¿cuál debe ser tu reacción profesional?',
   'Discutir la validez de la crítica frente a los padres para que vean tu criterio.',
   'Escuchar, pedir ejemplos si no entiendes y agradecer la retroalimentación.',
   'Ignorar la sugerencia si crees que tu método funciona mejor con ese alumno.',
   'Explicar inmediatamente por qué lo estabas haciendo de esa manera para defender tu punto.',
   'b', 3),

  ((SELECT id FROM public.induction_modules WHERE module_number = 3),
   '¿Qué debe hacer un IBT si se siente emocionalmente abrumado por un caso desafiante?',
   'Dejar de asistir a las sesiones sin avisar para tomar un respiro.',
   'Ocultarlo para no parecer débil o poco profesional ante el equipo.',
   'Comunicarlo a su supervisora para buscar entrenamiento adicional o apoyo emocional.',
   'Pedirle consejo a la familia sobre cómo manejar sus emociones.',
   'c', 4),

  ((SELECT id FROM public.induction_modules WHERE module_number = 3),
   '¿Cuál es el canal correcto para reportar cambios o dudas clínicas no urgentes sobre un cliente?',
   'Esperar hasta la próxima reunión presencial en tres meses.',
   'El canal de Microsoft Teams designado para el cliente.',
   'Llamar por teléfono a la supervisora a media noche.',
   'Mensajes directos de WhatsApp en cualquier horario.',
   'b', 5),

  ((SELECT id FROM public.induction_modules WHERE module_number = 3),
   '¿Qué significa que la supervisión en Brilus sea ''colaboración y mentoría''?',
   'Que el IBT y la supervisora tienen exactamente el mismo nivel de autoridad clínica.',
   'Que el IBT puede decidir no seguir las instrucciones si no está de acuerdo.',
   'Que es un espacio para aprender, hacer preguntas sin miedo y mejorar juntos la vida del alumno.',
   'Que la supervisora solo aparece para regañar cuando algo sale mal.',
   'c', 6),

  ((SELECT id FROM public.induction_modules WHERE module_number = 3),
   'En el contexto de la supervisión, ¿qué importancia tiene la frase ''Si no está escrito, no pasó''?',
   'Indica que solo los éxitos deben ser documentados en Hi Rasmus.',
   'Significa que las conversaciones verbales con la supervisora no tienen valor alguno.',
   'Significa que la documentación precisa es esencial para que la supervisora pueda analizar el progreso real.',
   'Es solo una frase para motivar a los IBTs a escribir mejor sus notas SOAP.',
   'c', 7),

  ((SELECT id FROM public.induction_modules WHERE module_number = 3),
   '¿Cuál de las siguientes acciones es una ''Regla de Oro'' de la supervisión mencionada en el módulo?',
   'Intentar resolver problemas clínicos por tu cuenta antes de avisar.',
   'Cambiar el objetivo de una sesión si el niño parece aburrido.',
   'Preguntar siempre que tengas una duda, no hay ''preguntas tontas''.',
   'Llegar a la supervisión sin datos para que la charla sea más fluida.',
   'c', 8),

  ((SELECT id FROM public.induction_modules WHERE module_number = 3),
   '¿Qué debe hacer un IBT si cree que la retroalimentación de su supervisora es injusta?',
   'Dejar de hablarle a la supervisora durante las siguientes sesiones.',
   'Hacer lo contrario a lo sugerido para demostrar que la supervisora se equivoca.',
   'Pedir una conversación privada con el equipo operativo de Brilus para expresar su perspectiva.',
   'Quejarse con la familia del alumno para que ellos intercedan.',
   'c', 9),

  ((SELECT id FROM public.induction_modules WHERE module_number = 3),
   'Verdadero o Falso: La supervisora es responsable tanto del diseño del plan como de proteger tu desarrollo profesional.',
   'Verdadero',
   'Falso',
   'No aplica',
   'Depende del caso',
   'a', 10);
