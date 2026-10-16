import { createClient } from "@supabase/supabase-js";

const env = import.meta.env;

export const IS_SUPABASE = Boolean(env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY);

export const supabase = IS_SUPABASE
  ? createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)
  : null;

// True while no database is connected: data lives only in this browser.
export const IS_DEMO = !IS_SUPABASE;
