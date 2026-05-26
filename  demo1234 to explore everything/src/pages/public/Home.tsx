import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, BookOpen, Bot, Check, Copy, Radio, ShieldCheck, Star, TrendingUp, Users, Wallet, Zap } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { SERVICES } from "../../lib/services";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";

const chartData = Array.from({ length: 30 }, (_, i) => ({
  d: i,
  v: 100 + Math.sin(i / 3) * 15 + i * 2 + Math.random() * 6,
}));

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/60 to-[#0A0A0A]" />
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#00E676]/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-[#00E676]/10 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00E676]/30 bg-[#00E676]/5 text-[#00E676] text-xs mb-6">
              <Zap className="w-3.5 h-3.5" /> Live Signals · Academy · Copy & Bot Trading · Investments
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
              Trade smarter with a <span className="gradient-text">complete trading ecosystem.</span>
            </h1>
            <p className="text-white/60 mt-6 text-lg max-w-xl">
              Premium forex signals, structured education, copy & bot automation, mentorship and managed investment plans — all under one professional roof.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register"><Button size="lg">Start Free Account <ArrowRight className="w-4 h-4" /></Button></Link>
              <Link to="/pricing"><Button size="lg" variant="outline">View Pricing</Button></Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {[
                { k: "12,400+", v: "Active Traders" },
                { k: "78%", v: "Signal Win-Rate" },
                { k: "6%", v: "Monthly ROI" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="text-2xl font-bold text-white">{s.k}</div>
                  <div className="text-xs text-white/50 mt-1">{s.v}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Mock Live Chart Card */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
            <div className="card p-6 glow-brand">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs text-white/50">Signal Performance · last 30 days</div>
                  <div className="text-2xl font-bold text-[#00E676]">+24.6%</div>
                </div>
                <div className="px-2.5 py-1 rounded-full border border-[#00E676]/30 bg-[#00E676]/10 text-[#00E676] text-xs flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Bullish
                </div>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00E676" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#00E676" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Tooltip contentStyle={{ background: "#0A0A0A", border: "1px solid #262626", borderRadius: 10 }} />
                    <Area type="monotone" dataKey="v" stroke="#00E676" strokeWidth={2} fill="url(#g)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                {[
                  { l: "Open", v: "12" },
                  { l: "TP Hit", v: "34" },
                  { l: "Win Rate", v: "78%" },
                ].map((s) => (
                  <div key={s.l} className="bg-[#0A0A0A] border border-[#262626] rounded-xl py-3">
                    <div className="text-xs text-white/50">{s.l}</div>
                    <div className="text-white font-semibold">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 border-t border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Services" title="Everything a serious trader needs" subtitle="One platform. Six powerful, independently-subscribable services." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {SERVICES.map((s, i) => {
              const icons: Record<string, any> = { Radio, GraduationCap: BookOpen, Copy, Bot, Wallet, Users };
              const Icon = icons[s.icon] || Star;
              return (
                <motion.div
                  key={s.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="card p-6 hover:border-[#00E676]/40 transition group"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#00E676]/10 border border-[#00E676]/20 flex items-center justify-center text-[#00E676] mb-4 group-hover:scale-110 transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-white font-semibold">{s.name}</h3>
                  <p className="text-sm text-white/60 mt-1">{s.description}</p>
                  <Link to={`/pricing#${s.key}`} className="inline-flex items-center gap-1 mt-4 text-sm text-[#00E676] hover:gap-2 transition-all">
                    View plans <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-20 border-t border-[#262626] bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Why Enextrade" title="Built for performance & trust" subtitle="A modern, audited infrastructure for traders at every level." />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {[
              { icon: ShieldCheck, t: "Bank-grade Security", d: "Secure auth, encrypted sessions and audit-logged admin actions." },
              { icon: BarChart3, t: "Transparent Analytics", d: "Real win/loss tracking, ROI dashboards and historical reports." },
              { icon: Zap, t: "Real-time Alerts", d: "Instant signal delivery via in-app, email and broadcast channels." },
              { icon: Star, t: "Tier-based Access", d: "Subscribe only to what you need. Combine services seamlessly." },
            ].map((b, i) => (
              <motion.div key={b.t} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="card p-6">
                <b.icon className="w-7 h-7 text-[#00E676] mb-3" />
                <div className="text-white font-semibold">{b.t}</div>
                <p className="text-sm text-white/60 mt-1">{b.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 border-t border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Loved by traders" title="Real results from real members" />
          <div className="grid md:grid-cols-3 gap-5 mt-10">
            {[
              { n: "Olivia M.", r: "VIP Signal Member", q: "The VIP signals are clean, well-analyzed, and consistent. My equity curve has never looked better." },
              { n: "Kunle A.", r: "Investment Plan", q: "I love the transparency. Monthly ROI claim is smooth and the team is responsive." },
              { n: "Liam P.", r: "Academy Pro", q: "From total beginner to confidently trading SMC concepts in 4 months. Underrated curriculum." },
            ].map((t) => (
              <div key={t.n} className="card p-6">
                <div className="flex text-[#00E676] mb-3">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}</div>
                <p className="text-white/80 text-sm">"{t.q}"</p>
                <div className="mt-4 text-sm">
                  <div className="text-white font-semibold">{t.n}</div>
                  <div className="text-white/50 text-xs">{t.r}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING TEASER */}
      <section className="py-20 border-t border-[#262626] bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Signal Room Pricing" title="Annual access. Premium signals." subtitle="Tier up for more signals, deeper analysis, and mentor access." />
          <div className="grid md:grid-cols-3 gap-5 mt-10">
            {SERVICES[0].plans.map((p, i) => (
              <div key={p.key} className={`card p-7 relative ${i === 2 ? "border-[#00E676]/40 glow-brand" : ""}`}>
                {i === 2 && <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-[#00E676] text-[#0A0A0A] text-xs font-bold">Most Popular</div>}
                <div className="text-white/60 text-sm">{p.name}</div>
                <div className="mt-2 flex items-end gap-1">
                  <span className="text-4xl font-bold text-white">${p.price}</span>
                  <span className="text-white/50 mb-1">{p.period}</span>
                </div>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {p.perks.map((pk) => (
                    <li key={pk} className="flex items-start gap-2 text-white/70">
                      <Check className="w-4 h-4 text-[#00E676] mt-0.5" /> {pk}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="block mt-7">
                  <Button className="w-full" variant={i === 2 ? "brand" : "outline"}>Subscribe</Button>
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/pricing" className="text-[#00E676] inline-flex items-center gap-1">See all service pricing <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-[#262626]">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="card p-10 lg:p-14 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#00E676]/15 blur-[100px] rounded-full" />
            <h2 className="relative text-3xl lg:text-5xl font-bold tracking-tight">Start your journey with <span className="gradient-text">Enextrade</span> today</h2>
            <p className="relative text-white/60 mt-4 max-w-xl mx-auto">Create a free account, explore services and unlock only the ones that match your trading goals.</p>
            <div className="relative mt-8 flex flex-wrap gap-3 justify-center">
              <Link to="/register"><Button size="lg">Create Account</Button></Link>
              <Link to="/services"><Button size="lg" variant="outline">Browse Services</Button></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      {eyebrow && <div className="text-xs uppercase tracking-[0.2em] text-[#00E676] mb-3">{eyebrow}</div>}
      <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="text-white/60 mt-3">{subtitle}</p>}
    </div>
  );
}
