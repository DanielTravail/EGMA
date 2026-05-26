import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/cn";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "brand" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export function Button({ variant = "brand", size = "md", className, children, ...rest }: Props) {
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  } as const;
  const variants = {
    brand: "bg-[#00E676] text-[#0A0A0A] hover:bg-[#00B85F] font-semibold",
    outline: "border border-[#262626] text-white hover:border-[#00E676] hover:text-[#00E676]",
    ghost: "text-white/80 hover:text-white hover:bg-white/5",
    danger: "bg-red-600 text-white hover:bg-red-700 font-semibold",
  } as const;
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[10px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        sizes[size],
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
