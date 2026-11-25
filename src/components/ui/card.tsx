import { cn } from "@/lib/utils";

type CardProps = {
  className?: string;
  children: React.ReactNode;
};

export function Card({ className, children }: CardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-surface/80 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-sm transition-all duration-200",
        className,
      )}
    >
      {children}
    </section>
  );
}
