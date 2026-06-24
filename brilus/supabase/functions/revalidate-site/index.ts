import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log('❌ Revalidation request rejected: No authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.log('❌ Revalidation request rejected: Invalid user', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Admin role check
    const { data: isAdmin, error: roleError } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (roleError || !isAdmin) {
      console.log(`❌ Revalidation request rejected: User ${user.id} is not an admin`);
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin role required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { slug, action } = await req.json();
    
    console.log(`📣 Revalidation request received from admin ${user.id}: ${action} for slug: ${slug || 'all'}`);
    
    // Here you would trigger your build/revalidation process
    // For Vercel: POST to Vercel deploy hook
    // For other platforms: implement accordingly
    
    const VERCEL_DEPLOY_HOOK = Deno.env.get('VERCEL_DEPLOY_HOOK');
    
    if (VERCEL_DEPLOY_HOOK) {
      const deployResponse = await fetch(VERCEL_DEPLOY_HOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!deployResponse.ok) {
        throw new Error('Failed to trigger deploy');
      }
      
      console.log('✅ Deploy triggered successfully');
    } else {
      console.log('⚠️ No deploy hook configured');
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Revalidation triggered for ${slug || 'entire site'}` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('❌ Revalidation error:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
