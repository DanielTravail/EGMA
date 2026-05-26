import { Link } from "react-router-dom";

export function Logo({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="flex items-center gap-2 group">
      <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#00E676] to-[#00B85F] flex items-center justify-center shadow-[0_0_20px_-4px_rgba(0,230,118,0.6)]">
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#0A0A0A]" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M3 17l5-5 4 4 9-9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="leading-tight">
        <div className="text-white font-bold tracking-tight">Enextrade</div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-[#00E676]/80 -mt-0.5">Global Market</div>
      </div>
    </Link>
  );
}
