import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

// src/lib/supabase.ts

export const supabase = createPagesBrowserClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
});
