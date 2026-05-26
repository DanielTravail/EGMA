import { type ReactNode } from "react";
import { cn } from "../../utils/cn";

type Variant = "brand" | "neutral" | "warning" | "danger" | "info";

export function Badge({ children, variant = "neutral", className }: { children: ReactNode; variant?: Variant; className?: string }) {
  const styles: Record<Variant, string> = {
    brand: "bg-[#00E676]/15 text-[#00E676] border-[#00E676]/30",
    neutral: "bg-white/5 text-white/70 border-white/10",
    warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    danger: "bg-red-500/15 text-red-400 border-red-500/30",
    info: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full border", styles[variant], className)}>
      {children}
    </span>
  );
}
