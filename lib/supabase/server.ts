import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let adminClient: SupabaseClient | null = null;
let anonClient: SupabaseClient | null = null;

function assertUrl(): string {
  if (!SUPABASE_URL) {
    throw new Error("Supabase URL is not configured. Set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL.");
  }
  return SUPABASE_URL;
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!SERVICE_ROLE_KEY) {
    throw new Error("Supabase service role key missing. Set SUPABASE_SERVICE_ROLE_KEY in environment.");
  }
  if (!adminClient) {
    adminClient = createClient(assertUrl(), SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}

export function getSupabaseAnon(): SupabaseClient {
  if (!ANON_KEY) {
    throw new Error("Supabase anon key missing. Set SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }
  if (!anonClient) {
    anonClient = createClient(assertUrl(), ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return anonClient;
}
