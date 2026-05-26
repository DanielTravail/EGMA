import { type ReactNode } from "react";

export function EmptyState({ icon, title, message, action }: { icon?: ReactNode; title: string; message?: string; action?: ReactNode }) {
  return (
    <div className="text-center py-14 px-6">
      {icon && <div className="mx-auto w-14 h-14 rounded-2xl bg-[#0A0A0A] border border-[#262626] flex items-center justify-center text-[#00E676] mb-4">{icon}</div>}
      <h3 className="text-white font-semibold text-lg">{title}</h3>
      {message && <p className="text-white/50 mt-1 max-w-md mx-auto text-sm">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
