import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogOut, Mail, UserRound } from "lucide-react";
import { signOutAction } from "@/app/login/actions";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Profile" };
export const dynamic = "force-dynamic";

export default async function ProfilePage(): Promise<React.ReactNode> {
  const user = await getCurrentUser();

  if (user === null) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Profile"
        title="Your academic identity"
        description="Identity comes from your verified session; study data is scoped to your account."
      />
      <Card className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <UserRound className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Account</h2>
            <p className="text-sm text-muted-foreground">Signed in with Supabase Auth</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 px-4 py-3">
          <Mail className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className="text-sm">{user.email}</span>
        </div>
        <form action={signOutAction}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:border-danger/40 hover:text-danger"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </form>
      </Card>
    </div>
  );
}
