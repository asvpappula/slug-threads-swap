// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://blaajolvqnyuprihqqen.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsYWFqb2x2cW55dXByaWhxcWVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMjcxMDAsImV4cCI6MjA2MzcwMzEwMH0.qHCNILbtu-YWQgM8e0QI0Jae2ZJIJInHo8Pthqlha_c";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);