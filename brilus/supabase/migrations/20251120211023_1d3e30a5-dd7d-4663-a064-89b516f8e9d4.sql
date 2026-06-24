-- Create quiz_responses table
CREATE TABLE public.quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Contact data
  full_name TEXT NOT NULL,
  child_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  role TEXT NOT NULL, -- 'mother_father', 'family', 'school', 'other'
  
  -- Quiz data
  age_range TEXT NOT NULL, -- '0-2', '3-5', '6-12', '13-18', '19+'
  
  -- Questions (all boolean)
  q1_diagnosis BOOLEAN NOT NULL,
  q2_difficulties BOOLEAN NOT NULL,
  q3_behaviors BOOLEAN NOT NULL,
  q4_skills_help BOOLEAN NOT NULL,
  q5_family_commitment BOOLEAN NOT NULL,
  
  -- Results
  score INTEGER NOT NULL,
  segment TEXT NOT NULL, -- '0_yes', '1_2_yes', '3_5_yes', '19_plus'
  
  -- Consent
  consent BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all responses
CREATE POLICY "Admins can view quiz responses"
ON public.quiz_responses
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Admins can delete responses
CREATE POLICY "Admins can delete quiz responses"
ON public.quiz_responses
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for better query performance
CREATE INDEX idx_quiz_responses_created_at ON public.quiz_responses(created_at DESC);
CREATE INDEX idx_quiz_responses_score ON public.quiz_responses(score);