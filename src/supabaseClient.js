import { createClient } from "@supabase/supabase-js";

// This is a publishable/anon key, not a secret — it is safe to ship in
// client-side code. Access to the data itself is enforced by Postgres
// row-level security policies on the Supabase project, which only allow
// reads/writes from a logged-in (authenticated) session.
const SUPABASE_URL = "https://tgdtscqdhtnvdskgphzu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_31h9aL2dH2QUaUnVhh8aiw_IeruAHGO";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
