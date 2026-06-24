
-- 1. Create induction_modules table
CREATE TABLE public.induction_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_number integer NOT NULL UNIQUE CHECK (module_number >= 1 AND module_number <= 8),
  title text NOT NULL,
  description text,
  slides_url text,
  youtube_url text,
  pdf_url text,
  visible boolean NOT NULL DEFAULT true,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

-- 2. Create induction_quiz_questions table
CREATE TABLE public.induction_quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES public.induction_modules(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  option_a text NOT NULL,
  option_b text NOT NULL,
  option_c text NOT NULL,
  option_d text NOT NULL,
  correct_answer text NOT NULL CHECK (correct_answer IN ('a', 'b', 'c', 'd')),
  order_index integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 3. Create therapists table
CREATE TABLE public.therapists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE,
  full_name text NOT NULL,
  email text,
  phone text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'pending')),
  hire_date date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 4. Create therapist_quiz_attempts table
CREATE TABLE public.therapist_quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id uuid NOT NULL REFERENCES public.therapists(id) ON DELETE CASCADE,
  module_id uuid NOT NULL REFERENCES public.induction_modules(id) ON DELETE CASCADE,
  score integer NOT NULL,
  total_questions integer NOT NULL,
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  completed_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 5. Enable RLS on all tables
ALTER TABLE public.induction_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.induction_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_quiz_attempts ENABLE ROW LEVEL SECURITY;

-- 6. RLS for induction_modules
CREATE POLICY "Admins and ops can manage modules" ON public.induction_modules
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'admin_operations'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'admin_operations'::app_role));

CREATE POLICY "Brilers can view modules" ON public.induction_modules
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin_brilers'::app_role));

CREATE POLICY "Authenticated can view visible modules" ON public.induction_modules
  FOR SELECT TO authenticated
  USING (visible = true);

-- 7. RLS for induction_quiz_questions
CREATE POLICY "Admins and ops can manage questions" ON public.induction_quiz_questions
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'admin_operations'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'admin_operations'::app_role));

CREATE POLICY "Brilers can view questions" ON public.induction_quiz_questions
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin_brilers'::app_role));

CREATE POLICY "Authenticated can view questions for visible modules" ON public.induction_quiz_questions
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.induction_modules m WHERE m.id = module_id AND m.visible = true));

-- 8. RLS for therapists
CREATE POLICY "Admins and ops can manage therapists" ON public.therapists
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'admin_operations'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'admin_operations'::app_role));

CREATE POLICY "Brilers can view therapists" ON public.therapists
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin_brilers'::app_role));

CREATE POLICY "Therapists can view own record" ON public.therapists
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- 9. RLS for therapist_quiz_attempts
CREATE POLICY "Admins and ops can view all attempts" ON public.therapist_quiz_attempts
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'admin_operations'::app_role));

CREATE POLICY "Brilers can view all attempts" ON public.therapist_quiz_attempts
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin_brilers'::app_role));

CREATE POLICY "Therapists can insert own attempts" ON public.therapist_quiz_attempts
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.therapists t WHERE t.id = therapist_id AND t.user_id = auth.uid()));

CREATE POLICY "Therapists can view own attempts" ON public.therapist_quiz_attempts
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.therapists t WHERE t.id = therapist_id AND t.user_id = auth.uid()));

-- 10. Updated_at triggers
CREATE TRIGGER update_induction_modules_updated_at
  BEFORE UPDATE ON public.induction_modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_induction_quiz_questions_updated_at
  BEFORE UPDATE ON public.induction_quiz_questions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_therapists_updated_at
  BEFORE UPDATE ON public.therapists
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 11. Create storage bucket for module PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('modulos-pdfs', 'modulos-pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- 12. Storage policies for modulos-pdfs
CREATE POLICY "Admins and ops can upload module PDFs" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'modulos-pdfs' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'admin_operations'::app_role)));

CREATE POLICY "Admins and ops can update module PDFs" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'modulos-pdfs' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'admin_operations'::app_role)));

CREATE POLICY "Admins and ops can delete module PDFs" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'modulos-pdfs' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'admin_operations'::app_role)));

CREATE POLICY "Anyone can read module PDFs" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'modulos-pdfs');
