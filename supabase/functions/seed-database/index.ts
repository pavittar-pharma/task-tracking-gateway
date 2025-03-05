
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
    console.log("Seed database function called");
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { type } = await req.json();
    console.log(`Seeding ${type} data`);

    if (type === 'employees') {
      // Check if employees already exist
      const { data: existingEmployees, error: checkError } = await supabaseClient
        .from('employees')
        .select('id')
        .limit(1);
        
      console.log("Check existing employees:", existingEmployees, checkError);
      
      if (checkError) {
        console.error("Error checking employees:", checkError);
        return new Response(
          JSON.stringify({ error: `Error checking employees: ${checkError.message}` }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
      
      // Only seed if no employees exist
      if (existingEmployees && existingEmployees.length === 0) {
        // Sample employees data
        const employeesData = [
          {
            id: "admin-001",
            name: "Admin User",
            email: "admin@pharmasync.com",
            role: "admin",
            password_hash: "admin123", // In production, this would be properly hashed
            created_at: new Date().toISOString()
          },
          {
            id: "sales-001",
            name: "Sales Rep",
            email: "sales@pharmasync.com",
            role: "sales_rep",
            password_hash: "sales123",
            created_at: new Date().toISOString()
          },
          {
            id: "manager-001",
            name: "Manager User",
            email: "manager@pharmasync.com",
            role: "manager",
            password_hash: "manager123",
            created_at: new Date().toISOString()
          }
        ];

        // Insert sample employees
        const { error: insertError } = await supabaseClient
          .from('employees')
          .insert(employeesData);
          
        if (insertError) {
          console.error("Error inserting employees:", insertError);
          return new Response(
            JSON.stringify({ error: `Failed to insert employees: ${insertError.message}` }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }
        
        console.log("Successfully inserted sample employees");
        return new Response(
          JSON.stringify({ success: true, message: "Sample employees added successfully" }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        console.log("Employees already exist, skipping seed");
        return new Response(
          JSON.stringify({ success: true, message: "Employees already exist" }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ error: `Unknown seed type: ${type}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
  } catch (error) {
    console.error('Unhandled error in seed-database function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
