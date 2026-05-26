import * as Lucide from "lucide-react";
import { Link } from "react-router-dom";
import { SERVICES } from "../../lib/services";
import { ArrowRight } from "lucide-react";

export default function Services() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <div className="text-xs uppercase tracking-[0.2em] text-[#00E676] mb-3">Services</div>
        <h1 className="text-4xl lg:text-5xl font-bold">Six independent services. One ecosystem.</h1>
        <p className="text-white/60 mt-4">Subscribe to one, several or all. Your dashboard adapts automatically.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6 mt-12">
        {SERVICES.map((s) => {
          const Icon = (Lucide as any)[s.icon] || Lucide.Star;
          return (
            <div key={s.key} className="card p-7 relative overflow-hidden">
              <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br ${s.color} blur-2xl`} />
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#00E676]/10 border border-[#00E676]/20 text-[#00E676] flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg">{s.name}</h3>
                  <p className="text-white/60 text-sm mt-1">{s.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {s.plans.map((p) => (
                      <span key={p.key} className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">
                        {p.name} — ${p.price}{p.period}
                      </span>
                    ))}
                  </div>
                  <Link to={`/pricing#${s.key}`} className="mt-5 inline-flex items-center gap-1 text-[#00E676] text-sm">
                    Subscribe <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
