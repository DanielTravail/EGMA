import { Link } from "react-router-dom";
import { ArrowUpRight, Bell, Sparkles, TrendingUp, Wallet, ArrowRight } from "lucide-react";
import * as Lucide from "lucide-react";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../lib/auth";
import { SERVICES } from "../../lib/services";
import { db } from "../../lib/store";
import { AreaChart, Area, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, CartesianGrid } from "recharts";

const perfData = Array.from({ length: 14 }, (_, i) => ({
  d: i,
  v: 1000 + i * 22 + Math.sin(i / 2) * 25,
}));

const winData = [
  { d: "Mon", w: 6, l: 2 },
  { d: "Tue", w: 4, l: 1 },
  { d: "Wed", w: 8, l: 3 },
  { d: "Thu", w: 5, l: 2 },
  { d: "Fri", w: 7, l: 1 },
  { d: "Sat", w: 3, l: 0 },
  { d: "Sun", w: 2, l: 1 },
];

export default function DashboardOverview() {
  const { user, hasService } = useAuth();
  const d = db.get();
  const activeSubs = d.subscriptions.filter((s) => s.userId === user!.id && s.status === "active");
  const investments = d.investments.filter((i) => i.userId === user!.id);
  const totalInvested = investments.reduce((s, i) => s + i.amount, 0);
  const totalEarned = investments.reduce((s, i) => s + i.totalEarned, 0);
  const signals = d.signals.slice(0, 4);
  const subscribed = SERVICES.filter((s) => hasService(s.key));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user!.name.split(" ")[0]} 👋</h1>
          <p className="text-white/60 text-sm">Here's a snapshot of your trading ecosystem.</p>
        </div>
        <Link to="/dashboard/subscription"><Button>Manage Subscriptions <ArrowUpRight className="w-4 h-4" /></Button></Link>
      </div>

      {/* KPI Row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi icon={Sparkles} label="Active Services" value={String(activeSubs.length)} delta="+1 this month" tone="brand" />
        <Kpi icon={TrendingUp} label="Signal Win-rate" value="78%" delta="+3.2%" tone="brand" />
        <Kpi icon={Wallet} label="Invested" value={`$${totalInvested.toLocaleString()}`} delta={`+$${totalEarned.toFixed(0)} earned`} tone="brand" />
        <Kpi icon={Bell} label="Notifications" value={String(d.notifications.filter((n) => n.userId === user!.id || n.userId === "all").length)} tone="info" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <CardHeader title="Portfolio performance" subtitle="Combined signals + investments" action={<Badge variant="brand">+12.4%</Badge>} />
          <CardBody>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={perfData}>
                  <defs>
                    <linearGradient id="gPort" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00E676" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#00E676" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1d1d1d" />
                  <Tooltip contentStyle={{ background: "#0A0A0A", border: "1px solid #262626", borderRadius: 10 }} />
                  <Area type="monotone" dataKey="v" stroke="#00E676" strokeWidth={2.5} fill="url(#gPort)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Weekly wins vs losses" />
          <CardBody>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={winData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1d1d1d" />
                  <XAxis dataKey="d" stroke="#666" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#0A0A0A", border: "1px solid #262626", borderRadius: 10 }} />
                  <Bar dataKey="w" fill="#00E676" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="l" fill="#262626" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Services Grid */}
      <Card>
        <CardHeader title="Your services" subtitle="Quick access to active modules" action={<Link to="/pricing" className="text-sm text-[#00E676]">Discover more →</Link>} />
        <CardBody>
          {subscribed.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="w-10 h-10 text-[#00E676] mx-auto" />
              <h3 className="text-lg font-semibold mt-3">No active subscriptions yet</h3>
              <p className="text-white/60 mt-1 text-sm">Pick a service to unlock the matching dashboard module.</p>
              <Link to="/pricing"><Button className="mt-4">View Plans</Button></Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subscribed.map((s) => {
                const Icon = (Lucide as any)[s.icon] || Sparkles;
                return (
                  <Link to={s.path} key={s.key} className="card p-5 hover:border-[#00E676]/40 transition group">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#00E676]/10 border border-[#00E676]/20 text-[#00E676] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-semibold">{s.name}</div>
                        <div className="text-xs text-white/50 mt-0.5">{s.short}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-[#00E676] group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Recent signals */}
      <Card>
        <CardHeader title="Latest signals" action={<Link to="/dashboard/signals" className="text-sm text-[#00E676]">View all →</Link>} />
        <CardBody className="p-0">
          <div className="divide-y divide-[#262626]">
            {signals.map((s) => (
              <div key={s.id} className="px-5 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${s.type === "BUY" ? "bg-[#00E676]/15 text-[#00E676]" : "bg-red-500/15 text-red-400"}`}>{s.type}</div>
                  <div>
                    <div className="text-white font-semibold">{s.pair}</div>
                    <div className="text-xs text-white/50">Entry {s.entry} · TP1 {s.tp1} · SL {s.sl}</div>
                  </div>
                </div>
                <SignalStatusBadge status={s.status} />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, delta, tone = "brand" }: { icon: any; label: string; value: string; delta?: string; tone?: "brand" | "info" }) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-white/50">{label}</div>
            <div className="text-2xl font-bold mt-1">{value}</div>
            {delta && <div className={`text-xs mt-1 ${tone === "brand" ? "text-[#00E676]" : "text-blue-400"}`}>{delta}</div>}
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tone === "brand" ? "bg-[#00E676]/10 text-[#00E676]" : "bg-blue-500/10 text-blue-400"}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function SignalStatusBadge({ status }: { status: string }) {
  const map: Record<string, { v: any; t: string }> = {
    active: { v: "info", t: "Active" },
    tp1: { v: "brand", t: "TP1 Hit" },
    tp2: { v: "brand", t: "TP2 Hit" },
    tp3: { v: "brand", t: "TP3 Hit" },
    sl: { v: "danger", t: "SL Hit" },
    closed: { v: "neutral", t: "Closed" },
    expired: { v: "warning", t: "Expired" },
  };
  const m = map[status] || map.active;
  return <Badge variant={m.v}>{m.t}</Badge>;
}
