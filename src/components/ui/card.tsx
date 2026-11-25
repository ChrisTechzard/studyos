import { cn } from "@/lib/utils";

type CardProps = {
  className?: string;
  children: React.ReactNode;
};

export function Card({ className, children }: CardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-surface p-5 shadow-sm shadow-black/5",
        className,
      )}
    >
      {children}
    </section>
  );
}
