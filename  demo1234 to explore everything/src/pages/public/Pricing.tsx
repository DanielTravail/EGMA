import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Check, Crown } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { SERVICES } from "../../lib/services";

export default function Pricing() {
  const loc = useLocation();
  useEffect(() => {
    if (loc.hash) {
      const el = document.getElementById(loc.hash.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [loc.hash]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <div className="text-xs uppercase tracking-[0.2em] text-[#00E676] mb-3">Pricing</div>
        <h1 className="text-4xl lg:text-5xl font-bold">Transparent pricing for every service</h1>
        <p className="text-white/60 mt-4">Subscribe to any combination of services. No hidden fees. Cancel anytime.</p>
      </div>

      {SERVICES.map((service) => (
        <section key={service.key} id={service.key} className="mt-16 scroll-mt-24">
          <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-bold">{service.name}</h2>
              <p className="text-white/60 text-sm mt-1">{service.description}</p>
            </div>
          </div>
          <div className={`grid gap-5 ${service.plans.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
            {service.plans.map((p, i) => {
              const featured = i === service.plans.length - 1;
              return (
                <div key={p.key} className={`card p-7 relative ${featured ? "border-[#00E676]/40 glow-brand" : ""}`}>
                  {featured && (
                    <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-[#00E676] text-[#0A0A0A] text-xs font-bold flex items-center gap-1">
                      <Crown className="w-3 h-3" /> Most Popular
                    </div>
                  )}
                  <div className="text-white/60 text-sm">{p.name}</div>
                  <div className="mt-2 flex items-end gap-1">
                    <span className="text-4xl font-bold text-white">${p.price.toLocaleString()}</span>
                    <span className="text-white/50 mb-1">{p.period}</span>
                  </div>
                  <ul className="mt-6 space-y-2.5 text-sm">
                    {p.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2 text-white/70">
                        <Check className="w-4 h-4 text-[#00E676] mt-0.5" /> {perk}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/dashboard/subscription?service=${service.key}&plan=${p.key}`}
                    className="block mt-7"
                  >
                    <Button className="w-full" variant={featured ? "brand" : "outline"}>Subscribe</Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
