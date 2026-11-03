import { createClient } from "@/lib/supabase/client";
import { createServerClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createServerClient();
  const { data: { user }, error } = await (supabase as any).auth.getUser();
  if (error || !user) return null;
  return user;
}

export function useSupabase() {
  return createClient();
}
