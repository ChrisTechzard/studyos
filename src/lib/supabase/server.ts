import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getServerEnv } from "@/lib/env";

export async function createSupabaseServerClient() {
  const env = getServerEnv();
  const cookieStore = await cookies();

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        // Server Components cannot write cookies; the proxy refreshes them.
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Expected outside Server Actions and Route Handlers.
        }
      },
    },
  });
}
