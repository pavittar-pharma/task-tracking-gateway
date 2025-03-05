
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.22.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Auth function called");
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { employeeId, password } = await req.json();
    console.log(`Auth attempt for employee ID: ${employeeId}`);

    // Get employee from database
    const { data: employee, error: employeeError } = await supabaseClient
      .from('employees')
      .select('*')
      .eq('id', employeeId)
      .single();

    if (employeeError) {
      console.error('Employee lookup error:', employeeError);
      return new Response(
        JSON.stringify({ error: 'Employee not found', details: employeeError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    if (!employee) {
      console.error('No employee found with ID:', employeeId);
      return new Response(
        JSON.stringify({ error: 'Employee not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    console.log(`Found employee: ${employee.name}, comparing passwords...`);
    
    // In a production system, you would use a proper password verification library
    // For demonstration, we're comparing directly (this should use bcrypt or similar in production)
    if (employee.password_hash !== password) {
      console.log('Password mismatch');
      return new Response(
        JSON.stringify({ error: 'Invalid password' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Update last login timestamp
    console.log('Password match, updating last login timestamp');
    await supabaseClient
      .from('employees')
      .update({ last_login: new Date().toISOString() })
      .eq('id', employeeId);

    // Log the login activity
    try {
      await supabaseClient
        .from('activity_logs')
        .insert({
          employee_id: employeeId,
          action: 'User logged in'
        });
      console.log('Activity log created');
    } catch (logError) {
      console.error('Error creating activity log:', logError);
      // Continue despite log error
    }

    console.log('Authentication successful, returning employee data');
    return new Response(
      JSON.stringify({ 
        employee: {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          role: employee.role
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unhandled error in auth function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
