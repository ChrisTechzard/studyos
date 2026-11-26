import { redirect } from "next/navigation";
import { isAuthConfigured } from "@/lib/env";
import { UserIdSchema, type UserId } from "@/modules/study/domain";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface CurrentUser {
  readonly id: UserId;
  readonly email: string;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!isAuthConfigured()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error !== null || data.user === null) {
    return null;
  }

  return {
    id: UserIdSchema.parse(data.user.id),
    email: data.user.email ?? "",
  };
}

/** Redirects unauthenticated requests; never trusts a client-provided user id. */
export async function getAuthenticatedOwnerId(): Promise<UserId> {
  const user = await getCurrentUser();

  if (user === null) {
    redirect("/login");
  }

  return user.id;
}
