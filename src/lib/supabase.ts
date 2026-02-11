import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

function isConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

// Server-side client with service role (bypasses RLS — use for webhooks/admin)
export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase not configured");
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Lazy alias for backward compat
export const supabaseAdmin = {
  get auth() { return getSupabaseAdmin().auth; },
  from(table: string) { return getSupabaseAdmin().from(table); },
};

// Server-side client with anon key (respects RLS — use with user JWT)
export function createSupabaseClient(accessToken?: string) {
  if (!isConfigured()) {
    throw new Error("Supabase not configured");
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
  });
}

// Extract JWT from Authorization header
export function getAccessToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}

// Verify JWT and get user
export async function getAuthUser(accessToken: string) {
  if (!isConfigured()) return null;
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}
