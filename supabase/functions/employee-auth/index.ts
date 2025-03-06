
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.22.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Employee Auth function called");
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase configuration");
      return new Response(
        JSON.stringify({ 
          status: 'error',
          error: "Server configuration error" 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const supabaseClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { action, username, password, employeeId } = await req.json();
    console.log(`Auth action: ${action}`);

    // For debug: check if employees table exists and has data
    const { count, error: countError } = await supabaseClient
      .from('employees')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.error('Error checking employees count:', countError);
    } else {
      console.log(`Total employees in database: ${count || 0}`);
    }

    // Login action
    if (action === 'login') {
      console.log(`Attempting login for username: ${username}`);
      
      // Get employee from database
      const { data: employees, error: employeeError } = await supabaseClient
        .from('employees')
        .select('*')
        .eq('username', username)
        .limit(1);

      if (employeeError) {
        console.error('Employee lookup error:', employeeError);
        return new Response(
          JSON.stringify({ 
            status: 'error',
            error: 'Error looking up employee', 
            details: employeeError.message
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      if (!employees || employees.length === 0) {
        console.error('No employee found with username:', username);
        return new Response(
          JSON.stringify({ 
            status: 'error',
            error: 'Invalid username or password'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      const employee = employees[0];
      console.log(`Found employee: ${employee.name}, verifying password`);
      
      // Verify password (in production, use proper password hashing)
      if (employee.password !== password) {
        console.log('Password verification failed');
        return new Response(
          JSON.stringify({ 
            status: 'error',
            error: 'Invalid username or password'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      // Update last login timestamp
      console.log('Password verification successful, updating last login timestamp');
      await supabaseClient
        .from('employees')
        .update({ last_login: new Date().toISOString() })
        .eq('id', employee.id);

      // Log the login activity
      try {
        await supabaseClient
          .from('activity_logs')
          .insert({
            employee_id: employee.id,
            action: 'User logged in'
          });
        console.log('Activity log created for login');
      } catch (logError) {
        console.error('Error creating activity log:', logError);
        // Continue despite log error
      }

      return new Response(
        JSON.stringify({ 
          status: 'success',
          employee: {
            id: employee.id,
            name: employee.name,
            email: employee.email,
            role: employee.role
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    } 
    // Logout action
    else if (action === 'logout') {
      // Log the logout activity if employeeId is provided
      if (employeeId) {
        try {
          await supabaseClient
            .from('activity_logs')
            .insert({
              employee_id: employeeId,
              action: 'User logged out'
            });
          console.log('Activity log created for logout');
        } catch (logError) {
          console.error('Error creating logout activity log:', logError);
          // Continue despite log error
        }
      }

      return new Response(
        JSON.stringify({ 
          status: 'success',
          message: 'Logged out successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }
    else {
      return new Response(
        JSON.stringify({ 
          status: 'error',
          error: 'Invalid action'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }
  } catch (error) {
    console.error('Unhandled error in auth function:', error);
    return new Response(
      JSON.stringify({ 
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});
