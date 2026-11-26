import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { getCurrentUser } from "@/lib/auth/session";
import { isAuthConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function LoginPage(): Promise<React.ReactNode> {
  const configured = isAuthConfigured();

  if (configured) {
    const user = await getCurrentUser();

    if (user !== null) {
      redirect("/");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-5">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Your academic home</h1>
          <p className="text-sm text-muted-foreground">Plan, study, and make progress with your group.</p>
        </div>
        {configured ? <LoginForm /> : <SetupNotice />}
      </div>
    </main>
  );
}

function SetupNotice() {
  return (
    <div className="rounded-2xl border border-border bg-surface/80 p-5 text-sm leading-relaxed text-muted-foreground">
      <p className="font-semibold text-foreground">Supabase is not configured yet.</p>
      <p className="mt-2">
        Copy <code className="rounded bg-muted px-1 py-0.5">.env.example</code> to{" "}
        <code className="rounded bg-muted px-1 py-0.5">.env.local</code>, add{" "}
        <code className="rounded bg-muted px-1 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
        <code className="rounded bg-muted px-1 py-0.5">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and{" "}
        <code className="rounded bg-muted px-1 py-0.5">DATABASE_URL</code>, then apply{" "}
        <code className="rounded bg-muted px-1 py-0.5">database/migrations/0001_initial.sql</code>.
      </p>
    </div>
  );
}
