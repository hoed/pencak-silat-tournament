
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gfoxgwziutcibwzmidur.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmb3hnd3ppdXRjaWJ3em1pZHVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5Njg0MjAsImV4cCI6MjA2MjU0NDQyMH0.R5wFj4DUGFscRnj_8yjo9Rd5I6t4i3j026BFfJU_qis";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
