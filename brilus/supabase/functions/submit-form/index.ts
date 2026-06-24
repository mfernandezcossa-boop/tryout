import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const formSubmissionSchema = z.object({
  form_name: z.string().min(1).max(50, "Form name must be 50 characters or less"),
  payload: z.record(z.unknown()).refine(
    (obj) => JSON.stringify(obj).length <= 10000,
    { message: "Payload exceeds maximum size of 10KB" }
  ),
  email: z.string().email("Invalid email format").max(255).optional().nullable(),
  turnstile_token: z.string().max(2048).optional()
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawBody = await req.json();
    
    // Validate input
    const validation = formSubmissionSchema.safeParse(rawBody);
    if (!validation.success) {
      console.error('Validation error:', validation.error.errors);
      return new Response(
        JSON.stringify({ error: 'Invalid form data', details: validation.error.errors[0]?.message }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { form_name, payload, email, turnstile_token } = validation.data;
    console.log('Received validated form submission:', { form_name, email });

    // Verify Turnstile token if provided
    if (turnstile_token) {
      const turnstileSecret = Deno.env.get('TURNSTILE_SECRET_KEY');
      if (!turnstileSecret) {
        console.error('TURNSTILE_SECRET_KEY not configured');
        return new Response(
          JSON.stringify({ error: 'Server configuration error' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const verification = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secret: turnstileSecret,
            response: turnstile_token
          })
        }
      );

      const outcome = await verification.json();
      console.log('Turnstile verification result:', outcome.success);

      if (!outcome.success) {
        return new Response(
          JSON.stringify({ error: 'Verification failed. Please try again.' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data, error } = await supabase
      .from("form_submissions")
      .insert({ form_name, payload, email })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Form submission saved:', data.id);

    return new Response(
      JSON.stringify({ ok: true, id: data.id }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    );
  } catch (e: any) {
    console.error('Error in submit-form:', e);
    return new Response(
      JSON.stringify({ error: e.message ?? 'Internal server error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
