import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

type AppLayoutProps = {
  readonly children: React.ReactNode;
};

export default async function AppLayout({ children }: AppLayoutProps): Promise<React.ReactNode> {
  const user = await getCurrentUser();

  if (user === null) {
    redirect("/login");
  }

  const userInitial = user.email.trim().charAt(0).toUpperCase() || "?";
  return <AppShell userInitial={userInitial}>{children}</AppShell>;
}
