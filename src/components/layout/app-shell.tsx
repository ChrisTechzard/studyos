import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

type AppShellProps = {
  readonly children: React.ReactNode;
  readonly userInitial: string;
};

export function AppShell({ children, userInitial }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background md:grid md:grid-cols-[280px_minmax(0,1fr)]">
      <Sidebar />
      <div className="flex min-w-0 flex-col">
        <Topbar userInitial={userInitial} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
