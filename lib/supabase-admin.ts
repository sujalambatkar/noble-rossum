import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Admin Supabase client — uses the SERVICE_ROLE key, which bypasses RLS.
 *
 * MUST only be used in server-side code (API routes, server components,
 * server actions, scripts). The `server-only` import will cause a build
 * error if this file is ever imported into client-side code.
 *
 * Never expose SUPABASE_SERVICE_ROLE_KEY to the client. Do NOT prefix it
 * with NEXT_PUBLIC_.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
}
if (!serviceRoleKey) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is not set. Get it from Supabase Dashboard → Settings → API → service_role"
  );
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
