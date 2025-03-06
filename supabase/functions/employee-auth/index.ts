
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
        JSON.stringify({ error: "Server configuration error" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const supabaseClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { action, employeeId, password } = await req.json();
    console.log(`Auth action: ${action} for employee ID: ${employeeId}`);

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
      // Get employee from database
      const { data: employee, error: employeeError } = await supabaseClient
        .from('employees')
        .select('*')
        .eq('id', employeeId)
        .single();

      if (employeeError) {
        console.error('Employee lookup error:', employeeError);
        return new Response(
          JSON.stringify({ 
            error: 'Employee not found', 
            details: employeeError.message,
            status: 'error'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }

      if (!employee) {
        console.error('No employee found with ID:', employeeId);
        return new Response(
          JSON.stringify({ 
            error: 'Invalid employee ID', 
            status: 'error'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }

      console.log(`Found employee: ${employee.name}, verifying password`);
      
      // Verify password (in production, use proper password hashing)
      if (employee.password_hash !== password) {
        console.log('Password verification failed');
        return new Response(
          JSON.stringify({ 
            error: 'Invalid password', 
            status: 'error'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        );
      }

      // Update last login timestamp
      console.log('Password verification successful, updating last login timestamp');
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
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    // Seed action - for development only
    else if (action === 'seed') {
      console.log("Seeding employees table with sample data");
      
      // Check if employees already exist
      const { count: existingCount } = await supabaseClient
        .from('employees')
        .select('*', { count: 'exact', head: true });
        
      if (existingCount && existingCount > 0) {
        console.log(`Found ${existingCount} existing employees, skipping seed`);
        return new Response(
          JSON.stringify({ 
            status: 'success',
            message: 'Employees already exist, skipping seed'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Sample employee data
      const sampleEmployees = [
        {
          id: '1001',
          name: 'Admin User',
          email: 'admin@pharmasync.com',
          password_hash: 'admin123',
          role: 'admin'
        },
        {
          id: '1002',
          name: 'Sales Representative',
          email: 'sales@pharmasync.com',
          password_hash: 'sales123',
          role: 'sales_rep'
        },
        {
          id: '1003',
          name: 'Manager User',
          email: 'manager@pharmasync.com',
          password_hash: 'manager123',
          role: 'manager'
        }
      ];
      
      const { error: seedError } = await supabaseClient
        .from('employees')
        .insert(sampleEmployees);
        
      if (seedError) {
        console.error('Error seeding employees:', seedError);
        return new Response(
          JSON.stringify({ 
            error: 'Failed to seed employees', 
            details: seedError.message,
            status: 'error'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
      
      console.log('Successfully seeded employees table');
      return new Response(
        JSON.stringify({ 
          status: 'success',
          message: 'Employees table seeded successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    else {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid action', 
          status: 'error'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
  } catch (error) {
    console.error('Unhandled error in auth function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 'error'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
