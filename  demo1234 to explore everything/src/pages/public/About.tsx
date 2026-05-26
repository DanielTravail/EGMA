import { Award, Globe2, Target, Users } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-xs uppercase tracking-[0.2em] text-[#00E676] mb-3">About</div>
      <h1 className="text-4xl lg:text-5xl font-bold">Building the future of retail trading.</h1>
      <p className="text-white/60 mt-5 max-w-2xl">
        Enextrade Global Market combines elite-grade signals, structured education, automated trading and managed capital under one secure roof — designed for the modern trader.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
        {[
          { i: Target, t: "Mission", d: "Empower every trader with institutional-grade tools." },
          { i: Award, t: "Excellence", d: "Quality signals, transparent reporting, ethical practices." },
          { i: Users, t: "Community", d: "12,000+ active members across 60+ countries." },
          { i: Globe2, t: "Global", d: "Multi-currency, multi-method, worldwide accessible." },
        ].map((b) => (
          <div key={b.t} className="card p-6">
            <b.i className="w-6 h-6 text-[#00E676] mb-3" />
            <div className="text-white font-semibold">{b.t}</div>
            <div className="text-sm text-white/60 mt-1">{b.d}</div>
          </div>
        ))}
      </div>
      <div className="mt-14 card p-8">
        <h2 className="text-xl font-bold">Our story</h2>
        <p className="text-white/70 mt-3 text-sm leading-relaxed">
          Founded by a team of former proprietary traders, fintech engineers and educators, Enextrade was built to solve a simple problem: traders shouldn't have to choose between scattered tools. We unified signals, analytics, education, automation and managed investments into a single ecosystem so members can focus on what matters — trading better, with less noise.
        </p>
      </div>
    </div>
  );
}
