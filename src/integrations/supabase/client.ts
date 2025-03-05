
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tjanyxpfafuprhcaxiiv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqYW55eHBmYWZ1cHJoY2F4aWl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExNjc1OTcsImV4cCI6MjA1Njc0MzU5N30.hO68bMkagbGfCzQ1neZuqeUcWpQEUqERsnhSRWAFwVs";

// Create a Supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
