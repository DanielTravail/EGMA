import { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../lib/auth";
import { db } from "../../lib/store";
import { Lock, Search, TrendingDown, TrendingUp } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import type { Signal, SignalTier } from "../../lib/types";
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

const tierRank: Record<SignalTier, number> = { basic: 1, standard: 2, vip: 3 };

export default function Signals() {
  const { hasService, servicePlan } = useAuth();
  if (!hasService("signals")) return <Navigate to="/pricing#signals" replace />;

  const userTier = (servicePlan("signals") as SignalTier) || "basic";
  const d = db.get();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const signals = useMemo(() => {
    return d.signals.filter((s) => {
      if (q && !s.pair.toLowerCase().includes(q.toLowerCase())) return false;
      if (filter !== "all" && s.status !== filter) return false;
      return true;
    });
  }, [q, filter, d.signals]);

  const total = d.signals.length;
  const winners = d.signals.filter((s) => ["tp1", "tp2", "tp3"].includes(s.status)).length;
  const losers = d.signals.filter((s) => s.status === "sl").length;
  const winRate = total ? Math.round((winners / (winners + losers || 1)) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Signal Room</h1>
          <p className="text-white/60 text-sm">
            Plan: <Badge variant="brand">{userTier.toUpperCase()}</Badge>{" "}
            {userTier !== "vip" && <Link to="/pricing#signals" className="text-[#00E676] text-xs ml-2">Upgrade →</Link>}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-white/40" />
            <input className="input-base pl-9" placeholder="Search pair..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-base">
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="tp1">TP1 Hit</option>
            <option value="tp2">TP2 Hit</option>
            <option value="tp3">TP3 Hit</option>
            <option value="sl">SL Hit</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card><CardBody><div className="text-xs text-white/50">Total signals</div><div className="text-2xl font-bold mt-1">{total}</div></CardBody></Card>
        <Card><CardBody><div className="text-xs text-white/50">Winners</div><div className="text-2xl font-bold text-[#00E676] mt-1">{winners}</div></CardBody></Card>
        <Card><CardBody><div className="text-xs text-white/50">Losers</div><div className="text-2xl font-bold text-red-400 mt-1">{losers}</div></CardBody></Card>
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-white/50">Win-rate</div>
                <div className="text-2xl font-bold text-[#00E676] mt-1">{winRate}%</div>
              </div>
              <div className="w-16 h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ v: winRate }]} startAngle={90} endAngle={-270}>
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar dataKey="v" fill="#00E676" cornerRadius={8} background={{ fill: "#262626" } as any} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Signals list */}
      <div className="grid lg:grid-cols-2 gap-4">
        {signals.map((s) => {
          const locked = tierRank[s.tier] > tierRank[userTier];
          return <SignalCard key={s.id} signal={s} locked={locked} />;
        })}
        {signals.length === 0 && (
          <Card className="lg:col-span-2"><CardBody>No signals match your filters.</CardBody></Card>
        )}
      </div>
    </div>
  );
}

function SignalCard({ signal, locked }: { signal: Signal; locked: boolean }) {
  return (
    <Card className={`relative overflow-hidden ${locked ? "opacity-90" : ""}`}>
      {locked && (
        <div className="absolute inset-0 z-10 backdrop-blur-md bg-black/40 flex flex-col items-center justify-center gap-3 text-center p-6">
          <Lock className="w-8 h-8 text-[#00E676]" />
          <div className="text-white font-semibold">{signal.tier.toUpperCase()}-only Signal</div>
          <Link to="/pricing#signals"><Button>Upgrade to {signal.tier.toUpperCase()}</Button></Link>
        </div>
      )}
      <CardHeader
        title={signal.pair}
        subtitle={`Posted ${new Date(signal.postedAt).toLocaleString()}`}
        action={
          <div className="flex items-center gap-2">
            <Badge variant={signal.type === "BUY" ? "brand" : "danger"}>
              {signal.type === "BUY" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {signal.type}
            </Badge>
            <StatusBadge status={signal.status} />
          </div>
        }
      />
      <CardBody>
        <div className="grid grid-cols-5 gap-3 text-center">
          {[
            { l: "Entry", v: signal.entry, c: "text-white" },
            { l: "TP1", v: signal.tp1, c: "text-[#00E676]" },
            { l: "TP2", v: signal.tp2, c: "text-[#00E676]" },
            { l: "TP3", v: signal.tp3, c: "text-[#00E676]" },
            { l: "SL", v: signal.sl, c: "text-red-400" },
          ].map((x) => (
            <div key={x.l} className="bg-[#0A0A0A] border border-[#262626] rounded-lg py-2">
              <div className="text-[10px] uppercase tracking-wider text-white/40">{x.l}</div>
              <div className={`font-semibold ${x.c}`}>{x.v}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-white/70 bg-[#0A0A0A] border border-[#262626] rounded-lg p-3">
          <span className="text-[#00E676] font-semibold">📝 Analysis: </span>{signal.analysis}
        </div>
      </CardBody>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { v: any; t: string }> = {
    active: { v: "info", t: "Active" },
    tp1: { v: "brand", t: "TP1 ✓" },
    tp2: { v: "brand", t: "TP2 ✓" },
    tp3: { v: "brand", t: "TP3 ✓" },
    sl: { v: "danger", t: "SL Hit" },
    closed: { v: "neutral", t: "Closed" },
    expired: { v: "warning", t: "Expired" },
  };
  const m = map[status] || map.active;
  return <Badge variant={m.v}>{m.t}</Badge>;
}
