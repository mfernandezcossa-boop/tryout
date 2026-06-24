import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { user_id, full_name, email, phone } = body;

    if (!user_id || typeof user_id !== "string") {
      return new Response(JSON.stringify({ error: "user_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!full_name || typeof full_name !== "string" || full_name.trim().length < 2) {
      return new Response(JSON.stringify({ error: "full_name is required (min 2 chars)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return new Response(JSON.stringify({ error: "valid email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify user exists in Auth and auto-confirm email
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(user_id);
    if (authError || !authUser?.user) {
      return new Response(JSON.stringify({ error: "User not found in Auth" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Auto-confirm email so therapist can log in immediately
    if (!authUser.user.email_confirmed_at) {
      await supabaseAdmin.auth.admin.updateUserById(user_id, {
        email_confirm: true,
      });
    }

    // Check if therapist record already exists for this user
    const { data: existing } = await supabaseAdmin
      .from("therapists")
      .select("id")
      .eq("user_id", user_id)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ ok: true, therapist_id: existing.id, message: "already registered" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert therapist with status pending
    const { data: therapist, error: insertError } = await supabaseAdmin
      .from("therapists")
      .insert({
        user_id,
        full_name: full_name.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        status: "pending",
      })
      .select("id")
      .single();

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Assign 'user' role
    await supabaseAdmin.from("user_roles").insert({
      user_id,
      role: "user",
    });

    return new Response(JSON.stringify({ ok: true, therapist_id: therapist.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
