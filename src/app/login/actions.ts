"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { AuthActionState } from "@/components/auth/action-state";
import { isAuthConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const CONFIG_ERROR = "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.";
const GENERIC_ERROR = "Authentication failed. Please try again.";

export async function signInAction(
  _previous: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isAuthConfigured()) {
    return { status: "error", message: CONFIG_ERROR };
  }

  const email = readFormString(formData, "email");
  const password = readFormString(formData, "password");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error !== null) {
    return { status: "error", message: toAuthMessage(error.message) };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signUpAction(
  _previous: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isAuthConfigured()) {
    return { status: "error", message: CONFIG_ERROR };
  }

  const email = readFormString(formData, "email");
  const password = readFormString(formData, "password");
  const displayName = readFormString(formData, "displayName");
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  });

  if (error !== null) {
    return { status: "error", message: toAuthMessage(error.message) };
  }

  if (data.session === null) {
    return { status: "success", message: "Account created. Check your email to confirm, then sign in." };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOutAction(): Promise<void> {
  if (isAuthConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  revalidatePath("/", "layout");
  redirect("/login");
}

function readFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function toAuthMessage(message: string): string {
  return message.length > 0 ? message : GENERIC_ERROR;
}
